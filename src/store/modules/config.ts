import { defineModule } from 'direct-vuex'
import { Screen } from 'quasar'
import api from 'src/utils/api'
import objectAssignDeep from 'object-assign-deep'
import { version, name, productName } from '../../../package.json'

export interface TabItem {
  to: string
  label: string
  icon: string
  alert?: boolean | string
}

export enum MATCH_STATES {
  AVAILABLE = 'AVAILABLE',
  SEARCHING = 'SEARCHING',
  MATCHED = 'MATCHED',
  PLAYING = 'PLAYING',
}

interface SettingsButton {
  icon: string
  label?: string
  color?: string
  tooltip?: string
  to?: string
  href?: string
}
export interface MatchState {
  icon: string
  label: string
  color: string
  instructions: string
  showSearching: boolean
  disable: boolean
  notify?: string
}

export interface DivisionInterface {
  name?: string
  title?: string
  rank?: string
  color?: string
  badge?: string
}

export interface Notification {
  message: string
  color: string
  icon: string
}

export enum NOTIFICATIONS {
  SOCKET_ERROR,
  ERROR,
  IN_PROGRESS,
  WIN,
  LOSS,
  PROMOTED,
  DEMOTED,
}

export interface BadgeDetails {
  name: string
  tooltip: string
  image: string
  notify?: string
  label?: string
}

export interface ListConfig {
  pageSize: number
  currentPage: number
}

interface Stats extends SettingsButton {
  info: string
}

export interface LeaderboardPlayer {
  playerId: number
  username: string
  avatar: string
  country: string
  leaderboardRating: number
  totalDecay: number
  rank: number
  previousRank?: number
}

export interface ConfigInterface {
  version: string
  name: string
  nameShort: string
  productName: string
  game: string
  icon: string
  matchesPerDayLimit: number
  leaderboardConfig: ListConfig
  historyConfig: ListConfig
  seasonStart: Date
  buttons: { [key: string]: SettingsButton }
  matchModes: { [key: string]: SettingsButton }
  stats: Stats[]
  avatars: { [key: string]: string }
  showMenu: boolean
  showProfile: boolean
  mainTabs: TabItem[]
  extraButtons: SettingsButton[]
  matchStates: { [key in MATCH_STATES]: MatchState }
  divisions: string[]
  levels: string[]
  divisionColors: string[]
  notifications: { [key in NOTIFICATIONS]: Notification }
  badges: { [key: string]: BadgeDetails }
}

export const defaultMatchState: MatchState = {
  icon: 'o_gamepad',
  color: 'positive',
  label: 'Find New Match',
  instructions: 'Click the button below to find an opponent',
  showSearching: false,
  disable: false,
}

const defaultState: ConfigInterface = {
  version,
  name,
  nameShort: 'Pulse',
  productName,
  game: 'Schotten Totten 2',
  icon: '/icon.png',
  matchesPerDayLimit: 25,
  leaderboardConfig: {
    pageSize: 10,
    currentPage: 1,
  },
  historyConfig: {
    pageSize: 10,
    currentPage: 1,
  },
  seasonStart: new Date(2020, 6, 18),
  matchModes: {
    RandomMix: {
      icon: 'o_casino',
      label: 'Random Mix',
      tooltip: 'A mix of leaders and wonders from the base game and expansion.',
    },
    Digital: {
      icon: 'o_phone_iphone',
      label: 'Digital',
      tooltip: `The game has optimized rules for digital play. Colonization auctions are resolved
      in a single round.`,
    },
    SuperBlitz: {
      icon: 'o_speed',
      label: 'Super Blitz',
      tooltip:
        'You have 60 to 120 seconds for each turn, and 5 minutes of reserve for each age.',
    },
  },
  buttons: {
    menu: { icon: 'menu', label: 'Menu' },
    link: { icon: 'o_launch', label: 'Open' },
    profile: { icon: 'perm_identity', label: 'Profile', to: '/profile' },
    settings: { icon: 'o_settings', label: 'Settings', to: '/settings' },
    settingsHelp: {
      icon: 'help_outline',
      tooltip: `
        <div class="text-h6 text-center text-accent">Settings</div>
        These settings are stored your current browser or device.
        <a href="https://pulsegames.io/faq.html#about-the-settings" target="_blank">
          Learn More
        </a>
      `,
    },
    matchmaker: { icon: 'o_gamepad', label: 'Matchmaker' },
    matchmakerHelp: {
      icon: 'help_outline',
      tooltip: `
        <div class="text-h6 text-center text-accent">Pulse Matchmaker</div>
        The Pulse matchmaker is a custom algorithm that matches players
        based on their skill, wait time and recent matches.
        You will be notified when a match is found.
        The game starts automatically, so you should be ready
        to play after clicking on the Find Match button.
        <a href="https://pulsegames.io/faq.html#about-the-matchmaker" target="_blank">
          Learn more
        </a>
      `,
    },
    queue: { icon: 'show_chart', label: 'Activity Log' },
    queueHelp: {
      icon: 'help_outline',
      tooltip: `
        <div class="text-h6 text-center text-accent">Activity Log</div>
        The Activity Log shows the recent matches (the orange chart line)
        and the average over the past few weeks (the brown background area).
        Use this information to plan the best times to find your opponents.
      `,
    },
    leaderboard: { icon: 'img:divisions/badge-3-3.png', label: 'Leaderboard' },
    leaderboardHelp: {
      icon: 'help_outline',
      tooltip: `
        <div class="text-h6 text-center text-accent">Pulse Leaderboard</div>
        The <strong class="text-primary">Pulse Leaderboard</strong> shows the top
        players in the league. Reach the Master Division to be ranked according to your rating.
        <a href="https://pulsegames.io/faq.html#about-leaderboard" target="_blank" >Learn more</a>
      `,
    },
    leaderboardChart: { icon: 'show_chart', label: 'Leaderboard History' },
    leaderboardChartHelp: {
      icon: 'help_outline',
      tooltip: `
        <div class="text-h6 text-center text-accent">Leaderboard History</div>
        The <strong class="text-primary">Leaderboard History</strong> shows the
        position of top competitors over time. It combines rating with activity decay.
        <a href="https://ttapulse.com/the-rating-system.html" target="_blank" >Learn more</a>
      `,
    },
    history: {
      icon: 'o_history',
      label: 'History (Hardcoded)',
      to: '/profile#history',
    },
    profileChord: {
      icon: 'o_public',
      label: 'Leaders and Wonders Stats',
      tooltip: `
        Information about selected leaders and wonders in matches played on the Pulse Games platform.
        Each connection indicates leaders and wonders used in the same game. (Note: Sample data only)
      `,
    },
  },
  stats: [
    {
      icon: 'o_block',
      label: 'Timeouts',
      tooltip: `
        Total Abandoned or Expired Pulse Matches
      `,
      info: 'totalTimeouts',
    },
    {
      icon: 'o_flag',
      label: 'Resigns',
      tooltip: `
        Total Resigned Pulse Matches
      `,
      info: 'totalResigns',
    },
    {
      icon: 'o_gamepad',
      label: 'Games',
      tooltip: 'Total Completed Pulse Matches',
      info: 'totalGames',
    },
    {
      icon: 'o_emoji_events',
      label: 'Wins',
      tooltip: 'Total Wins from Pulse Matches',
      info: 'totalWins',
    },
    {
      icon: 'o_star',
      label: 'Culture',
      tooltip: `
        Total Culture from Pulse Matches
      `,
      info: 'totalCulture',
    },
    // statsHistory: { icon: 'o_history', label: 'Last' },
  ],
  avatars: {
    Cmacu: 'symbols/Cmacu.png',
    WHIZ: 'symbols/WHIZ.png',
    pajada: 'symbols/pajada.jpeg',
    Vlaada: 'symbols/Vlaada.png',
    DJParson: 'symbols/DJParson.png',
    Japhet: 'symbols/Japhet.png',
    Opponent: 'symbols/Opponent.png',
    Default: 'symbols/Default.png',
  },
  showMenu: Screen.gt.sm,
  showProfile: true,
  mainTabs: [
    {
      icon: 'star_outline',
      label: 'Ranking',
      to: '/leaderboard',
    },
    { icon: 'o_gamepad', label: 'Match', to: '/' },
    {
      icon: 'perm_identity',
      label: 'Profile',
      to: '/profile',
    },
  ],
  extraButtons: [
    {
      icon: 'o_people',
      label: 'About',
      href: 'https://pulsegames.io/index.html',
    },
    {
      icon: 'archive',
      label: 'Extra',
      href: 'https://pulsegames.io/blog.html',
    },
    // {
    //   icon: 'o_emoji_events',
    //   label: 'Events',
    //   href: 'https://pulsegames.io/events.html',
    // },
    {
      icon: 'help_outline',
      label: 'Support',
      href: 'https://pulsegames.io/faq.html',
    },
  ],
  matchStates: {
    [MATCH_STATES.AVAILABLE]: defaultMatchState,
    [MATCH_STATES.SEARCHING]: {
      icon: 'o_alarm_off',
      color: 'negative',
      label: 'Cancel',
      instructions: '',
      showSearching: true,
      disable: false,
    },
    [MATCH_STATES.MATCHED]: {
      icon: 'o_link',
      color: 'primary',
      label: 'MatchFound',
      instructions: 'Match found. Creating game',
      showSearching: true,
      disable: true,
      // notify: 'Get Ready! We found an opponent for you. Game is starting soon',
    },
    [MATCH_STATES.PLAYING]: {
      icon: 'check',
      color: 'accent',
      label: 'Complete Match',
      instructions: 'Game in progress. Click below to complete',
      showSearching: false,
      disable: false,
      notify: 'Open the official app. Your match is in progress. Good luck!',
    },
  },
  divisions: ['Bronze', 'Silver', 'Gold', 'Master'],
  levels: ['A', 'I', 'II', 'III'],
  divisionColors: ['primary', 'grey-4', 'secondary', 'info'],
  notifications: {
    [NOTIFICATIONS.SOCKET_ERROR]: {
      message:
        'Something unexpected happened: Unable to establish socket connection',
      color: 'negative',
      icon: 'o_close',
    },
    [NOTIFICATIONS.ERROR]: {
      message: 'Error: Game not found.',
      color: 'negative',
      icon: 'o_close',
    },
    [NOTIFICATIONS.IN_PROGRESS]: {
      message: 'Your match is still in progress.',
      color: 'accent',
      icon: 'o_gamepad',
    },
    [NOTIFICATIONS.WIN]: {
      message: 'Congratulations. You are victorious!',
      color: 'positive',
      icon: 'o_emoji_events',
    },
    [NOTIFICATIONS.LOSS]: {
      message: 'You have been defeated. Better luck next time!',
      color: 'negative',
      icon: 'new_releases',
    },
    [NOTIFICATIONS.PROMOTED]: {
      message: 'Congratulations! Your rank increased! Your new rank is ',
      color: 'positive',
      icon: 'o_emoji_events',
    },
    [NOTIFICATIONS.DEMOTED]: {
      message: 'Your rank decreased! Your new rank is ',
      color: 'negative',
      icon: 'new_releases',
    },
  },
  badges: {
    Default: {
      name: 'Default badge',
      image: 'symbols/Default.png',
      notify: 'Congratulations',
      tooltip: 'Badge for playing on the Pulse Games platform',
    },
    SeasonMaster: {
      name: 'Season Master',
      image: 'img:/divisions/badge-3-3.png',
      notify: `
        Congratulations!
        You earned a Season Master badge for reaching the <strong>Master Division</strong>.<br/>
        Learn more how to reach higher position in this
        <a href="https://pulsegames.io/the-rating-system.html">blog article</a>.
      `,
      tooltip: `
        This badge was earned by reaching <strong>Master Division</strong> in the current season.<br>
        Learn more in this
        <a href="https://pulsegames.io/the-leaderboard-system.html">blog post</a>.
        Current leaderboard position is
      `,
    },
    ColosseumBronze: {
      name: 'Bronze Colosseum',
      image: '/symbols/ColosseumBronze.png',
      notify: `
        Congratulations!
        You earned a Bronze Colosseum badge for participating in the <strong>Launch Party</strong>.<br/>
        Learn more in the
        <a href="https://pulsegames.io/launch-party-announcement.html">blog post</a> about the event.
      `,
      tooltip: `
        This badge was earned by participating in a <strong>Colosseum event</strong>.<br>
        Learn more in the
        <a href="https://pulsegames.io/launch-party-announcement.html">blog post</a> about the event.
      `,
    },
    ColosseumSilver: {
      name: 'Silver Colosseum',
      image: '/symbols/ColosseumSilver.png',
      notify: `
        Congratulations!
        You earned a Silver Colosseum badge for winning a match during the <strong>Launch Party</strong>.<br/>
        Learn more in the
        <a href="https://pulsegames.io/launch-party-announcement.html">blog post</a> about the event.
      `,
      tooltip: `
        This badge was earned during a <strong>Colosseum event</strong>.<br>
        During the event, the player won a match.<br>
        Learn more in the
        <a href="https://pulsegames.io/launch-party-announcement.html">blog post</a> about the event.
      `,
    },
    ColosseumGold: {
      name: 'Gold Colosseum',
      image: '/symbols/ColosseumGold.png',
      notify: `
        Congratulations!
        You've earned a Gold Colosseum badge for winning 2 matches during the <strong>Launch Party</strong>.<br/>
        Learn more in the
        <a href="https://pulsegames.io/launch-party-announcement.html">blog post</a> about the event.
      `,
      tooltip: `
        This badge was earned during a <strong>Colosseum event</strong>.<br>
        During the event, the player won two matches.<br>
        Learn more in the
        <a href="https://pulsegames.io/launch-party-announcement.html">blog post</a> about the event.
      `,
    },
    ColosseumMaster: {
      name: 'Master Colosseum',
      image: '/symbols/ColosseumMaster.png',
      notify: `
        Congratulations!
        You've earned a Master Colosseum badge for participating in the <strong>Launch Party</strong>.<br/>
        You did the impossible and won 3 matches during the event.
        Learn more in the
        <a href="https://pulsegames.io/launch-party-announcement.html">blog post</a> about the event.
      `,
      tooltip: `
        This badge was earned during a <strong>Colosseum event</strong>.<br>
        This player did the impossible and won 3 matches during the event.
        Learn more in the
        <a href="https://pulsegames.io/launch-party-announcement.html">blog post</a> about the event.
      `,
    },
  },
}

const handleNewMajorVersion = (prev: string, next: string): void => {
  const re = new RegExp(/^\d+/)
  const prevVersion = re.exec(prev)?.[0] ?? 0
  const nextVersion = re.exec(next)?.[0] ?? 0
  if (nextVersion > prevVersion) {
    console.error('hard reload')
    location.href = location.origin
  }
}

const mutations = {
  TOGGLE_MENU(state: ConfigInterface) {
    state.showMenu = !state.showMenu
  },
  TOGGLE_PROFILE(state: ConfigInterface) {
    state.showProfile = !state.showProfile
  },
  UPDATE_STATE(
    state: ConfigInterface,
    payload: ConfigInterface = defaultState,
  ) {
    const currentVersion = state.version
    const newVersion = payload.version
    state = objectAssignDeep(state, payload)
    handleNewMajorVersion(currentVersion, newVersion)
  },
  UPDATE_LEADERBOARD_PAGE(state: ConfigInterface, payload: number) {
    state.leaderboardConfig.currentPage = payload
  },
  UPDATE_VERSION(state: ConfigInterface, version: string) {
    state.version = version
  },
} as const

const compareVersions = (a: string, b: string): number => {
  const regExStrip0 = /(\.0+)+$/
  const segmentsA = a.replace(regExStrip0, '').split('.')
  const segmentsB = b.replace(regExStrip0, '').split('.')
  const l = Math.min(segmentsA.length, segmentsB.length)

  for (let i = 0; i < l; i++) {
    const diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10)
    if (diff) {
      return diff
    }
  }
  return segmentsA.length - segmentsB.length
}

const configModule = defineModule({
  namespaced: true,
  state: (): ConfigInterface => Object.assign({}, defaultState),
  getters: {
    getAvatar: (state: ConfigInterface) => (
      username: string,
      avatar: string,
      alt = 'Default',
    ) => {
      const avatars = state.avatars
      return Object.prototype.hasOwnProperty.call(avatars, username)
        ? avatars[username]
        : avatar || avatars[alt]
    },
    getDivision: (state: ConfigInterface) => (
      division?: number | string,
      level?: number | string,
    ): DivisionInterface => {
      if (!Number.isInteger(division) || division == undefined) return {}
      if (!Number.isInteger(level) || level == undefined) return {}
      const name = state.divisions[+division]
      let rank = state.levels[+level]
      const color = state.divisionColors[+division]
      let title = 'Age'
      if (division == 3) {
        title = ''
        rank = level.toString()
        level = 3 // Set option 4 for Master
      }
      const badge = `divisions/badge-${division}-${level}.png`
      return { name, title, rank, badge, color }
    },
    getDivisionLabel: (state: ConfigInterface) => (
      division?: number,
    ): string => {
      if (division != undefined) {
        return state.divisions[division]
      }
      return ''
    },
    getLevelLabel: (state: ConfigInterface) => (level?: number): string => {
      if (level != undefined && level < state.levels.length) {
        return state.levels[level]
      }
      return ''
    },
    getBadgeDetails: (state: ConfigInterface) => (
      badge: string,
    ): BadgeDetails | undefined => {
      if (Object.prototype.hasOwnProperty.call(state.badges, badge)) {
        return state.badges[badge]
      }
    },
  },
  mutations,
  actions: {
    resetSettings(context) {
      if (compareVersions(defaultState.version, context.state.version) > 0) {
        context.commit(mutations.UPDATE_STATE.name)
      }
    },
    async update(context, serverVersion: string) {
      if (compareVersions(serverVersion, context.state.version) > 0) {
        context.commit(mutations.UPDATE_VERSION.name, serverVersion)
        const response = await api.getResources()
        context.commit(mutations.UPDATE_STATE.name, response.data)
      }
    },
    toggleMenu(context) {
      context.commit(mutations.TOGGLE_MENU.name)
    },
    toggleProfile(context) {
      context.commit(mutations.TOGGLE_PROFILE.name)
    },
    updateLeaderboardPage(context, payload: number) {
      context.commit(mutations.UPDATE_LEADERBOARD_PAGE.name, payload)
    },
  },
})

export default configModule
