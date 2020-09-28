import LogRocket from 'logrocket'
if (process.env.NODE_ENV !== 'development') {
  LogRocket.init('nedwwk/pulsegames')
}

export const updateLogRocket = (playerId: string, name: string) => {
  if (process.env.NODE_ENV !== 'development') {
    LogRocket.identify(playerId, { name })
  }
}
