import { Notify } from 'quasar'
import {
  DemoMessage,
  DemoFunction,
  playDemo,
  demo,
} from 'src/games/Schotten2/demo'
import { game } from 'src/games/Schotten2/game'
import { startConfetti, stopConfetti } from 'src/utils/confetti'

const eventDelay = 2 * 1000

export const attackerMessage: DemoMessage = {
  avatar: '/symbols/Cmacu.png',
  color: 'accent',
  html: true,
  timeout: 0,
  position: 'top',
  onDismiss: () => playDemo(),
}
// {suit: 0, rank: 9}, // [Yellow 9] - Attacker hand
// {suit: 1, rank: 7}, // [Blue 7] - Attacker hand
// {suit: 1, rank: 9}, // [Blue 9] - Attacker Hand
// {suit: 3, rank: 6}, // [Purple 6] - Attacker Hand
// {suit: 2, rank: 1}, // [Green 1] - Attacker Hand
// {suit: 0, rank: 3}, // [Yellow 3] - Attacker Hand

export const defenderMessage: DemoMessage = {
  avatar: '/symbols/Will.png',
  color: 'primary',
  html: true,
  timeout: 0,
  position: 'bottom',
  onDismiss: () => playDemo(),
}

let siegeCardsEnabled = false

export const toggleSiegeCards = () => {
  const siegeCards = document.getElementById('siegeCards')
  if (siegeCards)
    siegeCards.style.border = siegeCardsEnabled ? 'none' : '2px solid red'
  siegeCardsEnabled = !siegeCardsEnabled
}

const demoDefense: DemoFunction[] = []
demoDefense.push(() => {
  game.state.api.isAttacker = false
  game.state.api.isCurrentPlayer = false
  game.state.api.enablePreparation = false
  game.state.api.siegeCardsCount = 2
  game.state.api.oilCount = 1
  game.state.api.discardCards = [
    { suit: 0, rank: 0 }, // [Yellow 0] - Discard (Eliminated)
    { suit: 0, rank: 11 }, // [Yellow 11] - Discard (Eliminated)
    { suit: 1, rank: 11 }, // [Blue 11] - Discard (Gate)
    { suit: 4, rank: 11 }, // [Red 11] - Discard (Gate)
    { suit: 0, rank: 8 }, // [Yellow 8] - Discard (Tower)
    { suit: 1, rank: 4 }, // [Blue 4] - Discard (Tower)
    { suit: 1, rank: 5 }, // [Blue 5] - Discard (Tower)
    { suit: 2, rank: 3 }, // [Green 3] - Discard (Tower)
    { suit: 3, rank: 5 }, // [Purple 5] - Discard (Tower)
    { suit: 3, rank: 8 }, // [Purple 8] - Discard (Tower)
    { suit: 3, rank: 9 }, // [Purple 9] - Discard (Tower)
    { suit: 4, rank: 5 }, // [Red 5] - Discard (Attacker)
    { suit: 4, rank: 6 }, // [Red 6] - Discard (Attacker)
    { suit: 3, rank: 2 }, // [Purple 2] - Discard (Attacker)
    { suit: 3, rank: 3 }, // [Purple 3] - Discard (Attacker)
  ]
  game.state.api.handCards = [
    { suit: 3, rank: 8, protected: true }, // [Green 8]
    { suit: 2, rank: 11, protected: true }, // [Green 11]
    { suit: 0, rank: 2, protected: true }, // [Yellow 2]
    { suit: 1, rank: 6, protected: true }, // [Blue 6]
    { suit: 4, rank: 4, protected: true }, // [Red 4]
    { suit: 3, rank: 7, protected: true }, // [Purple 7]
  ]
  game.state.api = Object.assign({}, game.state.api, {
    sections: [
      {
        name: 'LeftPit',
        spaces: 0,
        types: [1],
        isDamaged: false,
        attack: [
          { suit: 3, rank: 4 }, // [Purple 4]
          { suit: 2, rank: 4 }, // [Green 4]
        ],
        defense: [
          { suit: 4, rank: 11 }, // [Red 11]
          { suit: 3, rank: 10 }, // [Purple 10]
          { suit: 3, rank: 11 }, // [Purple 11]
        ],
      },
      {
        name: 'Tower',
        spaces: 0,
        types: [0, 2, 3, 4, 5],
        isDamaged: false,
        attack: [
          { suit: 0, rank: 10 }, // [Yellow 10]
          { suit: 2, rank: 7 }, // [Green 7]
        ],
        defense: [
          { suit: 4, rank: 8 }, // [Red 8]
          { suit: 4, rank: 9 }, // [Red 9]
          { suit: 0, rank: 7 }, // [Yellow 7]
        ],
      },
      {
        name: 'Wall',
        spaces: 0,
        types: [0, 2, 3, 4, 5],
        isDamaged: false,
        attack: [
          { suit: 4, rank: 3 }, // [Red 3]
        ],
        defense: [
          { suit: 0, rank: 4 }, // [Yellow 4]
          { suit: 0, rank: 5 }, // [Yellow 5]
          { suit: 0, rank: 6 }, // [Yellow 6]
        ],
      },
      {
        name: 'Door',
        spaces: 0,
        types: [1],
        isDamaged: true,
        attack: [
          { suit: 1, rank: 1 }, // [Yellow 1]
          { suit: 2, rank: 0 }, // [Green 0]
          { suit: 4, rank: 0 }, // [Red 0]
        ],
        defense: [
          { suit: 1, rank: 1 }, // [Blue 1]
          { suit: 3, rank: 1 }, // [Purple 1]
          { suit: 1, rank: 2 }, // [Blue 2]
        ],
      },
      {
        name: 'Wall',
        spaces: 0,
        types: [0, 2, 3, 4, 5],
        isDamaged: false,
        attack: [
          { suit: 2, rank: 2 }, // [Green 2]
          { suit: 2, rank: 5 }, // [Green 5]
          { suit: 2, rank: 6 }, // [Green 6]
        ],
        defense: [
          { suit: 4, rank: 10 }, // [Red 10]
          { suit: 2, rank: 10 }, // [Green 10]
          { suit: 1, rank: 10 }, // [Blue 10]
        ],
      },
      {
        name: 'Tower',
        spaces: 0,
        types: [0, 4],
        isDamaged: true,
        attack: [],
        defense: [
          { suit: 1, rank: 8 }, // [Blue 8]
          { suit: 2, rank: 9 }, // [Green 9]
        ],
      },
      {
        name: 'RightPit',
        spaces: 0,
        types: [1],
        isDamaged: false,
        attack: [
          { suit: 1, rank: 0 }, // [Blue 0]
          { suit: 1, rank: 3 }, // [Blue 3]
        ],
        defense: [
          { suit: 3, rank: 0 }, // [Purple 0]
          { suit: 4, rank: 1 }, // [Red 1]
          { suit: 4, rank: 2 }, // [Red 2]
        ],
      },
    ],
  })
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      General, You can see our nemesis is back and has been throwing
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
      The Attacker doesn’t have much time left to win though. The deck has almost run out!
    `,
    }),
  )
})

demoDefense.push(() => {
  toggleSiegeCards()
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      He has managed to damage two wall segments and remember if he controls one of those he will win!
    `,
    }),
  )
})

demoDefense.push(() => {
  game.state.api.sections[5].attack.push({ suit: 4, rank: 7 })
  game.state.api.siegeCardsCount--
  game.state.api.isCurrentPlayer = true
  setTimeout(playDemo, eventDelay)
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      The draw deck has one last card, so we only have to prevent the Attacker
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
  // Highlight the gate
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Let's see.
      The attacker can play the remaining [Green 1] at the door.
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
      And if the attacker plays the remaining [Blue 7] on the tower
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
      Lets remove that <strong>[Red 7]</strong>
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
  game.state.api.sections.forEach((section) => {
    if (!section.attack.length) return
    section.attack[0].protected = false
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
      Let’s play the <strong>[Green 11]</strong> on the gate.
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
  setTimeout(() => {
    game.state.api.discardCards.push(
      game.state.api.sections[3].attack.splice(1, 1)[0],
    )
    game.state.api.discardCards.push(
      game.state.api.sections[3].defense.splice(3, 1)[0],
    )
    game.state.api = Object.assign({}, game.state.api, {
      handCards: [
        { suit: 3, rank: 8, protected: true }, // [Purple 8]
        { suit: 2, rank: 8, protected: true }, // [Green 8]
        { suit: 0, rank: 2, protected: true }, // [Yellow 2]
        { suit: 1, rank: 6, protected: true }, // [Blue 6]
        { suit: 4, rank: 4, protected: true }, // [Red 4]
        { suit: 3, rank: 7, protected: true }, // [Purple 7]
      ],
    })
    game.state.api.siegeCardsCount--
    playDemo()
  }, eventDelay)
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      As per the rules our <strong>[Green 11]</strong> eliminated the opposite <strong>[Green 0]</strong>.
    `,
    }),
  )
})

demoDefense.push(() => {
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
  game.state.api.sections[5].attack.push({ suit: 1, rank: 7 })
  setTimeout(() => {
    game.state.api.sections.forEach((section) => {
      section.attack = []
    })
    startConfetti()
    playDemo()
  }, eventDelay)
})

demoDefense.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
        The Attacker has failed to win and so you are victorious General!
        Well done. You know know how to play Schotten Totten 2!
      `,
    }),
  )
})

demoDefense.push(() => {
  stopConfetti()
})

export default demoDefense
