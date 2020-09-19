import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import { Notify } from 'quasar'
import router from '../router'
import auth from 'src/utils/auth'
import store from 'src/store'

export const getErrorMessage = (error: AxiosError) => {
  return error.response
    ? `${error.response.status}(${error.response.statusText}): ${error.response?.data}`
    : error.message
}

/** Default config for axios instance */
const axiosConfig: AxiosRequestConfig = {
  baseURL: process.env.API,
}
/** Creating the instance for axios */
const axiosInstance = axios.create(axiosConfig)

/** Auth token interceptor */
const authInterceptor = async (
  config: AxiosRequestConfig,
): Promise<AxiosRequestConfig> => {
  if (config.url?.includes('/auth')) {
    return config
  }
  const token = await auth.getToken()
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}

/** Adding the request interceptors */
axiosInstance.interceptors.request.use(authInterceptor)

const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  // any response interceptors
  if (response.data.data) {
    response.data = response.data.data
  }
  if (response.headers['appsettingsversion']) {
    store.dispatch.config.update(response.headers['appsettingsversion'])
  }
  return response
}

const handleLogout = async (message: string): Promise<void> => {
  if (!router.currentRoute.fullPath.includes('/auth/')) {
    auth.logout(window.location.href)
    await router.push(`/auth/login?message=${message}`)
  }
  return
}

const handleError = (message: string): void => {
  Notify.create({
    html: true,
    message: `Something unexpected happened ${message}.<br/>
    If the error persists please contact <a class="text-white underline" href="mailto:admin@pulsegames.io">admin@pulsegames.io</a>`,
  })
}

const refreshInterceptor = async (error: AxiosError) => {
  if (!error.response || error.response.status !== 401) {
    handleError(getErrorMessage(error))
    return error.response
  }
  if (!error?.config?.url || error.config.url.includes('/auth/')) {
    return error.response
  }

  const response = await auth.refresh()
  if (!response.success) {
    await handleLogout(response.message || '')
    return response
  }
  const config = await authInterceptor(error.config)

  return await axiosInstance.request(config)
}

/** Adding the response interceptors */
axiosInstance.interceptors.response.use(responseInterceptor, refreshInterceptor)

export { AxiosResponse, axiosInstance }
