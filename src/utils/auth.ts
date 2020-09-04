import { AxiosResponse, axiosInstance } from 'boot/axios'
import { LocalStorage, date } from 'quasar'
import store from 'src/store'

export const AUTH_API = {
  login: '/v1/auth',
  refresh: '/v1/auth/refresh',
}

const ERRORS = {
  invalidToken: 'Invalid token',
  invalidRefreshToken: 'Invalid token (r)',
  tokenExpired: 'Token expired!',
  invalidResponse: 'Invalid server response',
}

interface AuthResponse {
  success: boolean
  message?: string
}

interface AuthAxiosResponse extends AxiosResponse {
  success?: boolean
  message?: boolean
}

interface AuthSession {
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
  expiresAt?: Date
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

  private getAccessToken(): string {
    return this.session?.accessToken || ''
  }

  private getRefreshToken(): string {
    return this.session?.refreshToken || ''
  }

  public async login(
    cgeToken: string,
    cgeRefreshToken: string,
  ): Promise<AuthResponse> {
    if (!cgeToken) {
      return { success: false, message: ERRORS.invalidToken }
    }
    if (!cgeRefreshToken) {
      return { success: false, message: ERRORS.invalidRefreshToken }
    }
    const response = await axiosInstance.get(
      `${AUTH_API.login}?token=${cgeToken}&refresh_token=${cgeRefreshToken}`,
    )
    return this.handleResponse(response)
  }

  public async refresh(): Promise<{ success: boolean; message?: string }> {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()
    if (!accessToken || !refreshToken) {
      return {
        success: false,
        message: ERRORS.invalidToken,
      }
    }
    const response = await axiosInstance.post(
      `${AUTH_API.refresh}?jwt=${accessToken}&jwtRefresh=${refreshToken}`,
      {
        jwt: accessToken,
        refreshToken,
      },
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

  private handleResponse(response: AuthAxiosResponse): AuthResponse {
    if (!response.success && response.message) {
      return {
        success: false,
        message: response.message.toString(),
      }
    }
    if (response.status !== 200) {
      return {
        success: false,
        message: response.data ? response.data.error : response.statusText,
      }
    }
    // TODO: SAVE TO LOCAL STORAGE AND REDIRECT
    this.setSession(response.data)
    return { success: true }
  }
}

const auth = Auth.Instance
export default auth
