import { AxiosResponse, axiosInstance } from 'boot/axios'
import { LocalStorage, date } from 'quasar'
import store from 'src/store'

export const AUTH_API = {
  request: '/auth/request',
  register: '/auth/register',
  login: '/auth/login',
  refresh: '/auth/refresh',
}

const ERRORS = {
  invalidEmail: 'Invalid email',
  invalidToken: 'Invalid token',
  invalidAccessCode: 'Invalid access token. Check your email.',
  invalidUsername: 'Invalid username. Enter new value.',
  invalidColor: 'Invalid color. Select value.',
  tokenExpired: 'Token expired!',
  invalidResponse: 'Invalid server response',
}

interface AuthSession {
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
  expiresAt?: Date
}

interface AuthResponse {
  success: boolean
  message?: string
}

class Auth {
  public static get Instance() {
    return this.INSTANCE || (this.INSTANCE = new this())
  }
  private static INSTANCE: Auth
  private storage = LocalStorage
  private sessionStorage = 'auth'
  private redirectUrl = '/'
  private session: AuthSession | null

  private constructor() {
    this.session = this.storage.getItem(this.sessionStorage)
    return this
  }

  public async isLoggedIn(): Promise<boolean> {
    const token = this.getAccessToken()
    if (!token.length) {
      return false
    }
    if (this.isValid()) {
      return true
    }
    const response = await this.refresh()

    return response.success
  }

  public async getToken(): Promise<string> {
    const isLoggedIn = await this.isLoggedIn()
    return isLoggedIn ? this.getAccessToken() : ''
  }

  public async request(email: string): Promise<AuthResponse> {
    if (!email) return { success: false, message: ERRORS.invalidEmail }
    const response = await axiosInstance.get(
      `${AUTH_API.request}?email=${email}`,
    )
    return { success: true, message: response.data ? 'register' : 'login' }
  }

  public async register(email: string, accessCode: string, username: string) {
    if (!email) return { success: false, message: ERRORS.invalidEmail }
    if (!accessCode)
      return { success: false, message: ERRORS.invalidAccessCode }
    if (!username) return { success: false, message: ERRORS.invalidUsername }
    if (username.length < 3)
      return { success: false, message: ERRORS.invalidUsername }

    const response = await axiosInstance.get(AUTH_API.register, {
      params: { email, accessCode, username },
    })
    return this.handleResponse(response)
  }

  public async login(email: string, accessCode: string): Promise<AuthResponse> {
    if (!email) {
      return { success: false, message: ERRORS.invalidEmail }
    }
    if (!accessCode) {
      return { success: false, message: ERRORS.invalidAccessCode }
    }
    const response = await axiosInstance.get(AUTH_API.login, {
      params: { email, accessCode },
    })
    return this.handleResponse(response)
  }

  public async refresh(): Promise<AuthResponse> {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()
    if (!accessToken || !refreshToken) {
      return {
        success: false,
        message: ERRORS.invalidAccessCode,
      }
    }
    const response = await axiosInstance.get(
      `${AUTH_API.refresh}?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    )
    return this.handleResponse(response)
  }

  public logout(url: string): void {
    this.setRedirectUrl(url)
    this.storage.remove(this.sessionStorage)
    store.dispatch.player.logout()
    store.dispatch.stats.logout()
    this.session = this.storage.getItem(this.sessionStorage)
  }

  public getRedirectUrl(): string {
    return this.redirectUrl || '/'
  }

  public setRedirectUrl(url: string): void {
    if (url.includes('auth')) return
    if (url.includes('error')) return
    this.redirectUrl = url.replace(window.location.origin, '')
  }

  private getAccessToken(): string {
    return this.session?.accessToken || ''
  }

  private getRefreshToken(): string {
    return this.session?.refreshToken || ''
  }

  private isValid(): boolean {
    return new Date() < this.getExpiration()
  }

  private getExpiration(): Date {
    const expiresAt = this.session?.expiresAt || 0
    return new Date(expiresAt)
  }

  private setSession(session: AuthSession) {
    const expiresIn: number = session.expiresIn ?? 300
    const thisSession: AuthSession = session
    thisSession.expiresAt = date.addToDate(new Date(), {
      seconds: expiresIn,
    })
    this.storage.set(this.sessionStorage, thisSession)
    this.session = thisSession
  }

  private handleResponse(response: AxiosResponse): AuthResponse {
    if (response.status !== 200) {
      return {
        success: false,
        message: response?.data || response.statusText,
      }
    }
    this.setSession(response.data)
    return { success: true }
  }
}

const auth = Auth.Instance
export default auth
