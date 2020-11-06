import { Notify } from 'quasar'
import { DemoMessage, DemoFunction, playDemo } from 'src/games/Schotten2/demo'
import { game } from 'src/games/Schotten2/game'
import router from 'src/router'
import { startConfetti, stopConfetti } from 'src/utils/confetti'

const eventDelay = 2 * 1000

export const attackerMessage: DemoMessage = {
  avatar: '/symbols/Opponent.png',
  color: 'accent',
  html: true,
  timeout: 0,
  position: 'center',
  classes: 'notify-pulse',
  onDismiss: () => playDemo(),
}
// { rank: 9, suit: 0}, // [9 Yellow] - Aife hand
// { rank: 7, suit: 1}, // [7 Blue] - Aife hand
// { rank: 9, suit: 1}, // [9 Blue] - Aife Hand
// { rank: 6, suit: 3}, // [6 Purple] - Aife Hand
// { rank: 1, suit: 2}, // [1 Green] - Aife Hand
// { rank: 3, suit: 0}, // [3 Yellow] - Aife Hand

export const defenderMessage: DemoMessage = {
  avatar: '/symbols/Will.png',
  color: 'primary',
  html: true,
  timeout: 0,
  position: 'bottom',
  classes: 'notify-pulse',
  onDismiss: () => playDemo(),
}

let siegeCardsEnabled = false

export const toggleSiegeCards = () => {
  const siegeCards = document.getElementById('siegeCards')
  if (siegeCards)
    siegeCards.style.border = siegeCardsEnabled ? 'none' : '2px solid red'
  siegeCardsEnabled = !siegeCardsEnabled
}

let logEnabled = false

export const toggleLog = () => {
  const siegeCards = document.getElementById('schotten2-log')
  if (siegeCards)
    siegeCards.style.borderBottom = logEnabled ? 'none' : '2px solid red'
  logEnabled = !logEnabled
}

const demoDefense: DemoFunction[] = []
demoDefense.push(() => {
  game.state.api.isAttacker = false
  game.state.api.isCurrentPlayer = false
  game.state.api.enablePreparation = false
  game.state.api.siegeCardsCount = 2
  game.state.api.oilCount = 1
  game.state.api.discardCards = [
    { rank: 0, suit: 0 }, // [0 Yellow] - Discard (Eliminated)
    { rank: 11, suit: 0 }, // [1 Yellow1] - Discard (Eliminated)
    { rank: 11, suit: 1 }, // [1 Blue1] - Discard (Gate)
    { rank: 11, suit: 4 }, // [1 Red1] - Discard (Gate)
    { rank: 8, suit: 0 }, // [8 Yellow] - Discard (Tower)
    { rank: 4, suit: 1 }, // [4 Blue] - Discard (Tower)
    { rank: 5, suit: 1 }, // [5 Blue] - Discard (Tower)
    { rank: 3, suit: 2 }, // [3 Green] - Discard (Tower)
    { rank: 5, suit: 3 }, // [5 Purple] - Discard (Tower)
    { rank: 8, suit: 3 }, // [8 Purple] - Discard (Tower)
    { rank: 9, suit: 3 }, // [9 Purple] - Discard (Tower)
    { rank: 5, suit: 4 }, // [5 Red] - Discard (Aife)
    { rank: 6, suit: 4 }, // [6 Red] - Discard (Aife)
    { rank: 2, suit: 3 }, // [2 Purple] - Discard (Aife)
    { rank: 3, suit: 3 }, // [3 Purple] - Discard (Aife)
  ]
  game.state.api.handCards = [
    { rank: 8, suit: 3, protected: true }, // [8 Green]
    { rank: 11, suit: 2, protected: true }, // [1 Green1]
    { rank: 2, suit: 0, protected: true }, // [2 Yellow]
    { rank: 6, suit: 1, protected: true }, // [6 Blue]
    { rank: 4, suit: 4, protected: true }, // [4 Red]
    { rank: 7, suit: 3, protected: true }, // [7 Purple]
  ]
  game.state.api = Object.assign({}, game.state.api, {
    sections: [
      {
        name: 'LeftPit',
        spaces: 0,
        types: [0],
        isDamaged: false,
        attack: [
          { rank: 4, suit: 3 }, // [4 Purple]
          { rank: 4, suit: 2 }, // [4 Green]
        ],
        defense: [
          { rank: 11, suit: 4 }, // [1 Red1]
          { rank: 10, suit: 3 }, // [1 Purple0]
          { rank: 11, suit: 3 }, // [1 Purple1]
        ],
      },
      {
        name: 'LeftTower',
        spaces: 0,
        types: [5, 4, 3, 2, 0],
        isDamaged: false,
        attack: [
          { rank: 10, suit: 0 }, // [1 Yellow0]
          { rank: 7, suit: 2 }, // [7 Green]
        ],
        defense: [
          { rank: 8, suit: 4 }, // [8 Red]
          { rank: 9, suit: 4 }, // [9 Red]
          { rank: 7, suit: 0 }, // [7 Yellow]
        ],
      },
      {
        name: 'LeftWall',
        spaces: 0,
        types: [5, 4, 3, 2, 0],
        isDamaged: false,
        attack: [
          { rank: 3, suit: 4 }, // [3 Red]
        ],
        defense: [
          { rank: 4, suit: 0 }, // [4 Yellow]
          { rank: 5, suit: 0 }, // [5 Yellow]
          { rank: 6, suit: 0 }, // [6 Yellow]
        ],
      },
      {
        name: 'Gate',
        spaces: 0,
        types: [1],
        isDamaged: true,
        attack: [
          { rank: 1, suit: 1 }, // [1 Yellow]
          { rank: 0, suit: 2 }, // [0 Green]
          { rank: 0, suit: 4 }, // [0 Red]
        ],
        defense: [
          { rank: 1, suit: 1 }, // [1 Blue]
          { rank: 1, suit: 3 }, // [1 Purple]
          { rank: 2, suit: 1 }, // [2 Blue]
        ],
      },
      {
        name: 'RightWall',
        spaces: 0,
        types: [5, 4, 3, 2, 0],
        isDamaged: false,
        attack: [
          { rank: 2, suit: 2 }, // [2 Green]
          { rank: 5, suit: 2 }, // [5 Green]
          { rank: 6, suit: 2 }, // [6 Green]
        ],
        defense: [
          { rank: 10, suit: 4 }, // [1 Red0]
          { rank: 10, suit: 2 }, // [1 Green0]
          { rank: 10, suit: 1 }, // [1 Blue0]
        ],
      },
      {
        name: 'RightTower',
        spaces: 0,
        types: [4, 0],
        isDamaged: true,
        attack: [],
        defense: [
          { rank: 8, suit: 1 }, // [8 Blue]
          { rank: 9, suit: 2 }, // [9 Green]
        ],
      },
      {
        name: 'RightPit',
        spaces: 0,
        types: [1],
        isDamaged: false,
        attack: [
          { rank: 0, suit: 1 }, // [0 Blue]
          { rank: 3, suit: 1 }, // [3 Blue]
        ],
        defense: [
          { rank: 0, suit: 3 }, // [0 Purple]
          { rank: 1, suit: 4 }, // [1 Red]
          { rank: 2, suit: 4 }, // [2 Red]
        ],
      },
    ],
  })
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Milord, You can see our nemesis is back and has been throwing
      his paltry forces at us in an attempt to retake the castle.
    `,
    }),
  )
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Form up for the final push! We’ll get our banquet hall back this time!
    `,
    }),
  )
})

demoDefense.push(() => {
  toggleSiegeCards()
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      The Aife doesn’t have much time left to win though. The Siege Cards deck has almost run out!
    `,
    }),
  )
})

demoDefense.push(() => {
  toggleSiegeCards()
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      He has managed to damage two wall sections and remember if he controls one of those he will win!
    `,
    }),
  )
})

demoDefense.push(() => {
  game.state.api.sections[5].attack.push({ rank: 7, suit: 4 })
  game.state.api.lastEvent = 'PlayCard'
  game.state.api.lastSection = 3
  game.state.log.push({
    role: '0',
    player: 'Aife',
    event: 'PlayCard',
    description: 'played a card at the',
    section: 'RightTower',
    cards: [
      { rank: 7, suit: 4 }, // Red 7
    ],
  })
  game.state.api.siegeCardsCount--
  game.state.api.isCurrentPlayer = true
  setTimeout(playDemo, eventDelay)
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      The draw deck has one last card, so we only have to prevent the Aife
      from winning on his next turn in order to be victorious.
    `,
    }),
  )
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      One turn is all I need!
    `,
    }),
  )
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Let's see.
      We know what's remaining based on the discard cards.
      Click on <strong>Discard Cards</strong> to see the details.
    `,
    }),
  )
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      The attacker can play the remaining [1 Green] at the door.
      This will make for a stronger formation than ours and destroy it.
      The game will be lost.
    `,
    }),
  )
})

demoDefense.push(() => {
  // Highlight the tower
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      And if the attacker plays the remaining [7 Blue] on the tower
      it will be destroyed...
    `,
    }),
  )
})

demoDefense.push(() => {
  // Highlight the tower
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Two threats. One turn left!
      I can see the sunrise. Where are you Gandalf?
    `,
    }),
  )
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Now is a good time to use those new defences we had installed:
    `,
    }),
  )
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      As the Defender, you have the optional action
      to use one of three oil tokens to throw oil,
      discarding one of the Attackers cards!
    `,
    }),
  )
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      This can only be completed once per turn and you are limited to three uses.
    `,
    }),
  )
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Lets remove that <strong>[7 Red]</strong>
      This will take care of the first thread
    `,
    }),
  )
})

demoDefense.push(() => {
  game.state.api.enablePreparation = true
  game.state.enableOil = true
  game.state.api.sections.forEach((section, index) => {
    if (index == 5) return
    if (!section.attack.length) return
    section.attack[0].protected = true
  })
})

demoDefense.push(() => {
  game.state.api.oilCount--
  game.state.api.enablePreparation = false
  game.state.enableOil = false
  game.state.api.lastEvent = 'UseOil'
  game.state.api.lastSection = 5
  game.state.log.push({
    role: '1',
    player: 'Milord',
    event: 'UseOil',
    description: 'used oil at the',
    section: 'RightTower',
    cards: [
      { rank: 7, suit: 4 }, // Red 7
    ],
  })
  playDemo()
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      I always thought those pots were there for decoration!?
    `,
    }),
  )
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      As <strong>throw Oil</strong>, is an optional action, you still have your whole turn to play.
    `,
    }),
  )
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Time for the final trick under our sleeves.
      Let’s play the <strong>[11 Green]</strong> on the gate.
    `,
    }),
  )
})

demoDefense.push(() => {
  game.state.api.handCards[1].protected = false
  game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(1)
  game.state.api.sections[3].spaces = 4
})

// TODO: [Green 0] is eliminated from the game
demoDefense.push(() => {
  game.state.api.isCurrentPlayer = false
  game.state.handOrderSelectedIndex = -1
  game.state.api.lastEvent = 'PlayCard'
  game.state.api.lastSection = 3
  game.state.log.push({
    role: '1',
    player: 'Milord',
    event: 'PlayCard',
    description: 'played a card at the',
    section: 'Gate',
    cards: [
      { rank: 11, suit: 2 }, // 11 Green
    ],
  })
  setTimeout(() => {
    game.state.api.discardCards.push(
      game.state.api.sections[3].attack.splice(1, 1)[0],
    )
    game.state.api.discardCards.push(
      game.state.api.sections[3].defense.splice(3, 1)[0],
    )
    game.state.api = Object.assign({}, game.state.api, {
      handCards: [
        { rank: 8, suit: 3, protected: true }, // [8 Purple]
        { rank: 8, suit: 2, protected: true }, // [8 Green]
        { rank: 2, suit: 0, protected: true }, // [2 Yellow]
        { rank: 6, suit: 1, protected: true }, // [6 Blue]
        { rank: 4, suit: 4, protected: true }, // [4 Red]
        { rank: 7, suit: 3, protected: true }, // [7 Purple]
      ],
    })
    game.state.api.siegeCardsCount--
    game.state.api.lastEvent = 'Eliminate'
    game.state.api.lastSection = 3
    game.state.log.push({
      role: '1',
      player: 'Milord',
      event: 'Eliminate',
      description: 'eliminated opposites at the',
      section: 'Gate',
      cards: [
        { rank: 11, suit: 2 }, // 11 Green
        { rank: -1, suit: -1, protected: true }, // vs
        { rank: 0, suit: 2 }, // 0 Green
      ],
    })
    playDemo()
  }, eventDelay)
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      As per the rules our <strong>[11 Green]</strong> eliminated the opposite <strong>[0 Green]</strong>.
    `,
    }),
  )
})

demoDefense.push(() => {
  toggleLog()
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      For more details about what happened during each turn check the highlighted <strong>Log</strong>
    `,
    }),
  )
})

demoDefense.push(() => {
  toggleLog()
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      This should take care of the last thread.
      Let's see what he can do
    `,
    }),
  )
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      I’m out of options so I guess I’ll just play this....
      `,
    }),
  )
})

demoDefense.push(() => {
  game.state.api.sections[5].attack.push({ rank: 7, suit: 1 })
  game.state.api.lastEvent = 'PlayCard'
  game.state.api.lastSection = 5
  game.state.log.push({
    role: '0',
    player: 'Aife',
    event: 'PlayCard',
    description: 'played a card at the',
    section: 'RightTower',
    cards: [
      { rank: 7, suit: 1 }, // 11 Green
    ],
  })
  setTimeout(() => {
    game.state.api.sections.forEach((section) => {
      section.attack = []
    })
    game.state.api.lastEvent = 'Defend'
    game.state.api.lastSection = -1
    game.state.log.push({
      role: '1',
      player: 'Milord',
      event: 'Defend',
      description: 'won by successfully defending the wall',
      section: '',
    })
    startConfetti()
    playDemo()
  }, eventDelay)
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
        The Aife has failed to win and so you are victorious Milord!
        Well done. You now know how to play Schotten Totten 2!
      `,
      closeBtn: 'Free to Play',
      onDismiss: () => {
        stopConfetti()
        router.push('/')
      },
    }),
  )
})

demoDefense.push(() => {
  stopConfetti()
})

export default demoDefense
