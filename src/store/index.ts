// import { store } from 'quasar/wrappers';
// import Vuex from 'vuex';
// import match, { MatchmakerInterface } from './modules/match';

// /*
//  * If not building with SSR mode, you can
//  * directly export the Store instantiation
//  */

// export interface StoreInterface {
//   // Define your own store structure, using sub modules if needed
//   // example: ExampleStateInterface;
//   // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
//   match: MatchmakerInterface;
// }

// export default store(function({ Vue }) {
//   Vue.use(Vuex);

//   const Store = new Vuex.Store<StoreInterface>({
//     modules: {
//       match,
//     },

//     // enable strict mode (adds overhead!)
//     // for dev mode only
//     strict: !!process.env.DEV,
//   });

//   return Store;
// });

import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import { createDirectStore } from 'direct-vuex'
import matchmaker, { MatchmakerInterface } from './modules/matchmaker'
import match, { MatchInterface } from './modules/match'
import player, { PlayerInterface } from './modules/player'
import stats, { StatsInterface } from './modules/stats'
import config, { ConfigInterface } from './modules/config'
import settings, { SettingsInterface } from './modules/settings'
import timer, { TimerInterface } from './modules/timer'

export interface StoreInterface {
  // Define your own store structure, using modules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  matchmaker: MatchmakerInterface
  match: MatchInterface
  player: PlayerInterface
  stats: StatsInterface
  config: ConfigInterface
  settings: SettingsInterface
  timer: TimerInterface
}

Vue.use(Vuex)

const vuexLocal = new VuexPersistence<StoreInterface>({
  storage: localStorage,
  // modules: ['match', 'player', 'recent'], //
})

export const {
  store,
  rootActionContext,
  moduleActionContext,
} = createDirectStore({
  modules: {
    matchmaker,
    match,
    player,
    stats,
    config,
    settings,
    timer,
  },
  strict: process.env.DEV ? true : false,
  plugins: [vuexLocal.plugin],
})

export default store
