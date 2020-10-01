import demoAttack from 'src/games/Schotten2/demoAttack'
import demoDefense from 'src/games/Schotten2/demoDefense'
import { game, Schotten2Api } from 'src/games/Schotten2/game'

export type DemoFunction = () => void
const demoOver = () => {
  console.error('demo over', game.state.demoIndex)
}

export interface DemoMessage {
  avatar: string
  color: string
  html: boolean
  timeout: number
  position: 'top' | 'bottom' | 'center'
  onDismiss: Function
}

export const playDemo = () => {
  const index = game.state.demoIndex
  console.error('play demo', index)
  game.state.demoIndex = index + 1
  const playFunction = functions.length > index ? functions[index] : demoOver
  playFunction()
}

let functions: DemoFunction[]

export const demo: Schotten2Api = {
  connect: (match) => {
    if (match == 'demoAttack') functions = demoAttack
    if (match == 'demoDefense') functions = demoDefense
    playDemo()
    return Promise.resolve()
  },
  retreat: () => {
    playDemo()
  },
  useOil: () => {
    playDemo()
  },
  playCard: () => {
    playDemo()
  },
  resign: () => {
    location.href = '/'
    return Promise.resolve()
  },
  disconnect: () => Promise.resolve(),
}
