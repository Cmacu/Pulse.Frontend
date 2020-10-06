import { Notify } from 'quasar'
import { DemoMessage, DemoFunction, playDemo } from 'src/games/Schotten2/demo'
import { game } from 'src/games/Schotten2/game'
import router from 'src/router'
import { startConfetti, stopConfetti } from 'src/utils/confetti'

let moreOptionsEnabled = false
const toggleMoreOptions = () => {
  const moreOptions = document.getElementById('more_options')
  if (moreOptions)
    moreOptions.style.borderBottom = moreOptionsEnabled
      ? 'none'
      : '3px solid red'
  moreOptionsEnabled = !moreOptionsEnabled
}

const eventDelay = 2 * 1000

export const attackerMessage: DemoMessage = {
  avatar: '/symbols/Will.png',
  color: 'accent',
  html: true,
  timeout: 0,
  position: 'bottom',
  onDismiss: () => playDemo(),
}

export const defenderMessage: DemoMessage = {
  avatar: '/symbols/Cmacu.png',
  color: 'primary',
  html: true,
  timeout: 0,
  position: 'center',
  onDismiss: () => playDemo(),
}

const demoAttack: DemoFunction[] = []
demoAttack.push(() => {
  const state = {
    isAttacker: true,
    isCurrentPlayer: false,
    enablePreparation: false,
    siegeCardsCount: 48,
    oilCount: 3,
    handCards: [
      { rank: 8, suit: 4, protected: true }, // Red 8
      { rank: 10, suit: 1, protected: true }, // Blue 10
      { rank: 0, suit: 4, protected: true }, // Red 0
      { rank: 9, suit: 2, protected: true }, // Green 9
      { rank: 2, suit: 0, protected: true }, // Yellow 2
      { rank: 3, suit: 3, protected: true }, // Purple 3
    ],
    sections: [
      {
        name: 'LeftPit',
        spaces: 0,
        types: [1],
        isDamaged: false,
        attack: [],
        defense: [],
      },
      {
        name: 'LeftTower',
        spaces: 0,
        types: [0, 2, 3, 4, 5],
        isDamaged: false,
        attack: [],
        defense: [],
      },
      {
        name: 'LeftWall',
        spaces: 0,
        types: [0, 2, 3, 4, 5],
        isDamaged: false,
        attack: [],
        defense: [],
      },
      {
        name: 'Gate',
        spaces: 0,
        types: [0, 2, 3, 4, 5],
        isDamaged: false,
        attack: [],
        defense: [],
      },
      {
        name: 'RightWall',
        spaces: 0,
        types: [0, 2, 3, 4, 5],
        isDamaged: false,
        attack: [],
        defense: [],
      },
      {
        name: 'RightTower',
        spaces: 0,
        types: [0, 2, 3, 4, 5],
        isDamaged: false,
        attack: [],
        defense: [],
      },
      {
        name: 'RightPit',
        spaces: 0,
        types: [1],
        isDamaged: false,
        attack: [],
        defense: [],
      },
    ],
  }
  game.state.api = Object.assign({}, game.state.api, state)
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Milord! We are ready to attack the castle!
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      As your Chief Strategist,
      I’ll help you get the battle off to a great start!
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      You are the Attacker, and so have the initiative to take
      the first action by <strong>playing</strong> a card.
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Go ahead and play the <strong>[10 Blue]</strong>
      on the middle Wall Section which is called the <strong>Gate</strong>!
    `,
    }),
  )
})

// ENABLE BLUE 10
demoAttack.push(() => {
  game.state.api.handCards[1].protected = false
  game.state.api.isCurrentPlayer = true
  game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(1)
  game.state.api.sections[3].spaces = 2
})

demoAttack.push(() => {
  game.state.api.lastSection = 3
  game.state.api.lastEvent = 'PlayCard'
  game.state.log.push({
    role: '0',
    player: 'Milord',
    event: 'PlayCard',
    description: 'played card at the',
    section: 'Gate',
    cards: [{ rank: 10, suit: 1 }],
  })
  game.state.api.isCurrentPlayer = false
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      We will attempt to <strong>damage</strong> this Wall Segment
      by completing a stronger formation on our side than the Chulainn is able to.
      This will <strong>damage</strong> the Wall Segment, the first step to victory.
    `,
    }),
  )
})

// DRAW BLUE 11
demoAttack.push(() => {
  game.state.api.siegeCardsCount--
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { rank: 8, suit: 4, protected: true }, // Red 8
      { rank: 11, suit: 1, protected: true }, // New Card: Blue 11
      { rank: 0, suit: 4, protected: true }, // Red 0
      { rank: 9, suit: 2, protected: true }, // Green 9
      { rank: 2, suit: 0, protected: true }, // Yellow 2
      { rank: 3, suit: 3, protected: true }, // Purple 3
    ],
  })
  playDemo()
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Hah!
      We’ve replenished our hand by drawing a card and we see that it is the <strong>[11 Blue]</strong>!`,
      position: 'center',
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Since this wall section only has  two Banners which
      indicate the slots to <strong>play</strong> a card,
      we’ll only need to <strong>play</strong> one more card to have a complete Formation!
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      At any time, you can see the list of Formations and their ranking
      in the game rules by hitting the highlighted dropdown button
    `,
    }),
  )
  toggleMoreOptions()
})

demoAttack.push(() => {
  toggleMoreOptions()
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Yawn* Ah Milord!  Forgive my yawn.
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      I was just sleeping off last night’s feast in the great hall of
      this mighty castle I won’t let you have.
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Ah, this card should do.
    `,
    }),
  )
})

// DEFENDER PLAYS
demoAttack.push(() => {
  game.state.api.siegeCardsCount--
  game.state.api.sections[3].defense.push({ rank: 6, suit: 1 }) // Blue 6
  game.state.api.lastSection = 3
  game.state.api.lastEvent = 'PlayCard'
  game.state.log.push({
    role: '1',
    player: 'Chulainn',
    event: 'PlayCard',
    description: 'played card at the',
    section: 'Gate',
    cards: [{ rank: 6, suit: 1 }],
  })
  playDemo()
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      I don’t think that Chulainn is trembling at the sight of us as expected… but no matter.
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Keep in mind, we could <strong>play</strong> a card on any wall segment.
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      However, there are only only two Banners and thus two slots to <strong>play</strong> cards on the Gate segment.
      So we only need to play one more card on the Gate in order to have a complete Formation.
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Now play the <strong>[11 Blue]</strong> on the Gate.
    `,
    }),
  )
})

// ENABLE BLUE 11
demoAttack.push(() => {
  game.state.api.handCards[1].protected = false
  game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(1)
  game.state.api.isCurrentPlayer = true
})

demoAttack.push(() => {
  game.state.api.isCurrentPlayer = false
  game.state.api.siegeCardsCount--
  game.state.api.lastSection = 3
  game.state.api.lastEvent = 'PlayCard'
  game.state.log.push({
    role: '0',
    player: 'Milord',
    event: 'PlayCard',
    description: 'played card at the',
    section: 'Gate',
    cards: [{ rank: 11, suit: 1 }],
  })
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { rank: 8, suit: 4, protected: true }, // Red 8
      { rank: 1, suit: 2, protected: true }, // New Card: Green 1
      { rank: 0, suit: 4, protected: true }, // Red 0
      { rank: 9, suit: 2, protected: true }, // Green 9
      { rank: 2, suit: 0, protected: true }, // Yellow 2
      { rank: 3, suit: 3, protected: true }, // Purple 3
    ],
  })
  setTimeout(() => {
    const gate = game.state.api.sections[3]
    gate.isDamaged = true
    gate.types = [1]
    gate.spaces = 0
    gate.attack = []
    gate.defense = []
    game.state.api = Object.assign({}, game.state.api, {
      discardCards: [
        { rank: 10, suit: 1 }, // Blue 10
        { rank: 11, suit: 1 }, // Blue 11
        { rank: 6, suit: 1 }, // Blue 6
      ],
    })
    game.state.api.lastSection = 3
    game.state.api.lastEvent = 'Damage'
    game.state.log.push({
      role: '0',
      player: 'Milord',
      event: 'Damage',
      description: 'damaged the',
      section: 'Gate',
      cards: [
        { rank: 10, suit: 1 },
        { rank: 11, suit: 1 },
        { rank: -1, suit: -1, protected: true }, // vs
        { rank: 6, suit: 1 },
      ],
    })
    playDemo()
  }, eventDelay)
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      What have you done! I just had those gates cleaned yesterday!.
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      This gave us a complete <strong>Color-Run</strong> Formation.
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      As the Chulainn is unable to play a stronger formation,
      or remove any of our cards, the wall is damaged.
      This removed all cards on either side of that segment
      and presents the new Section limitation.
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      If we succeed in <strong>capturing</strong> four different Segments
      or in <strong>capturing</strong> a Segment that was
      already <strong>damaged</strong> we will be victorious!
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Hey, I heard that! Well, all I have to do is
      keep you from succeeding until the cards run out!
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Time is on my side!
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      You may have noticed some of the Wall Segments  have Banners with icons.
      In the case of the damaged Gate, the new formation requirement is 4 cards
      and only Sum Formations are evaluated and, in this case, the lowest(-) sum wins
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      No other formation type may be considered!
      To read more about a particular Wall Section click on it.
    `,
    }),
  )
})

demoAttack.push(() => {
  toggleMoreOptions()
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
        At any time, see a list of “Wall Section Limitations”
        in the game rules by hitting the highlighted dropdown button
    `,
    }),
  )
})

// DEFENDER Plays [10 Green]
demoAttack.push(() => {
  const card = { rank: 10, suit: 2 }
  const section = 0
  game.state.api.sections[section].defense.push(card) // Green 10
  game.state.api.lastEvent = 'PlayCard'
  game.state.api.lastSection = section
  game.state.log.push({
    role: '1',
    player: 'Chulainn',
    event: 'PlayCard',
    description: 'played card at the',
    section: 'LeftPit',
    cards: [card],
  })
  playDemo()
})

demoAttack.push(() => {
  toggleMoreOptions()
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      If a formation is tied, the winner is the player who completed their formation first.
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Let’s play the <strong>[9 Green]</strong> next
    `,
    }),
  )
})

// Play [9 Green]
demoAttack.push(() => {
  game.state.api.handCards[3].protected = false
  game.state.api.sections[0].spaces = 1
  game.state.api.isCurrentPlayer = true
  game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(3)
})

demoAttack.push(() => {
  game.state.api.isCurrentPlayer = false
  game.state.api.lastSection = 0
  game.state.api.lastEvent = 'PlayCard'
  game.state.log.push({
    role: '0',
    player: 'Milord',
    event: 'PlayCard',
    description: 'played card at the',
    section: 'LeftPit',
    cards: [{ rank: 9, suit: 2 }],
  })
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { rank: 8, suit: 4, protected: true }, // Red 8
      { rank: 1, suit: 2, protected: true }, // Green 1
      { rank: 0, suit: 4, protected: true }, // Red 0
      { rank: 1, suit: 1, protected: true }, // Blue 1
      { rank: 2, suit: 0, protected: true }, // Yellow 2
      { rank: 3, suit: 3, protected: true }, // Purple 3
    ],
  })
  game.state.api.siegeCardsCount--
  setTimeout(() => {
    game.state.api.sections[0].defense.push({ rank: 10, suit: 3 }) // Purple 10
    game.state.api.lastSection = 0
    game.state.api.lastEvent = 'PlayCard'
    game.state.log.push({
      role: '0',
      player: 'Milord',
      event: 'PlayCard',
      description: 'played card at the',
      section: 'LeftPit',
      cards: [{ rank: 10, suit: 3 }],
    })
    game.state.api.siegeCardsCount--
    playDemo()
  }, eventDelay)
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      I have bad news...
      even predetermined tutorials make mistakes sometimes.
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      That last card was a blunder! But no matter,
      we can use our optional action as the Attacker to <strong>Retreat</strong>.
    `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
        This removes any cards action to discard any number of your cards from any number of your segments.
        Do this by hitting the <strong>retreat</strong> action.
      `,
    }),
  )
})

demoAttack.push(() => {
  game.state.api.isCurrentPlayer = true
  game.state.handOrderSelectedIndex = -1
  game.state.api.enablePreparation = true
})

demoAttack.push(() => {
  game.state.api.enablePreparation = false
  game.state.api.lastSection = 0
  game.state.api.lastEvent = 'Retreat'
  game.state.log.push({
    role: '0',
    player: 'Milord',
    event: 'Retreat',
    description: 'retreated at the',
    section: 'LeftPit',
    cards: [{ rank: 9, suit: 2 }],
  })
  game.state.api = Object.assign({}, game.state.api, {
    discardCards: [
      { rank: 10, suit: 1 }, // Blue 10
      { rank: 11, suit: 1 }, // Blue 11
      { rank: 6, suit: 1 }, // Blue 6
      { rank: 9, suit: 3 }, // Green 9
    ],
  })
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
        Leaving so soon?
      `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Don’t worry about him, Milord. Now the field is clear for our next approach.
      `,
    }),
  )
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
        Since we’ve drawn the cards we need,
        all we need is to play the 0 - 3 cards in our hand on the gate to win the battle!
      `,
    }),
  )
})

demoAttack.push(() => {
  game.state.enableRetreat = false
  game.state.api.sections[0].spaces = 0
  game.state.api.sections[3].spaces = 4
  game.state.api.handCards[3].protected = false
  game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(3)
})

demoAttack.push(() => {
  game.state.api.isCurrentPlayer = false
  game.state.api.lastSection = 3
  game.state.api.lastEvent = 'PlayCard'
  game.state.log.push({
    role: '0',
    player: 'Milord',
    event: 'PlayCard',
    description: 'played card at the',
    section: 'Gate',
    cards: [{ rank: 1, suit: 1 }],
  })
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { rank: 8, suit: 4, protected: true }, // Red 8
      { rank: 1, suit: 2, protected: true }, // Green 1
      { rank: 0, suit: 4, protected: true }, // Red 0
      { rank: 7, suit: 4, protected: true }, // Red 7
      { rank: 2, suit: 0, protected: true }, // Yellow 2
      { rank: 3, suit: 3, protected: true }, // Purple 3
    ],
  })
  game.state.api.siegeCardsCount--
  setTimeout(() => {
    game.state.api.sections[3].defense.push({ rank: 6, suit: 0 }) // Yellow 6
    game.state.api.lastEvent = 'PlayCard'
    game.state.api.lastSection = 3
    game.state.log.push({
      role: '1',
      player: 'Chulainn',
      event: 'PlayCard',
      description: 'played card at the',
      section: 'Gate',
      cards: [{ rank: 6, suit: 0 }],
    })
    game.state.api.siegeCardsCount--
    setTimeout(() => {
      game.state.api.isCurrentPlayer = true
      game.state.api.handCards[4].protected = false // Yellow 2
      game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(4)
    }, eventDelay)
  }, eventDelay)
})

demoAttack.push(() => {
  game.state.api.isCurrentPlayer = false
  game.state.api.lastEvent = 'PlayCard'
  game.state.api.lastSection = 3
  game.state.log.push({
    role: '0',
    player: 'Milord',
    event: 'PlayCard',
    description: 'played card at the',
    section: 'Gate',
    cards: [{ rank: 2, suit: 0 }],
  })
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { rank: 8, suit: 4, protected: true }, // Red 8
      { rank: 1, suit: 2, protected: true }, // Green 1
      { rank: 0, suit: 4, protected: true }, // Red 0
      { rank: 7, suit: 4, protected: true }, // Red 7
      { rank: 9, suit: 1, protected: true }, // Blue 9
      { rank: 3, suit: 3, protected: true }, // Purple 3
    ],
  })
  game.state.api.siegeCardsCount--
  setTimeout(() => {
    game.state.api.sections[4].defense.push({ rank: 8, suit: 1 }) // Blue 8
    game.state.api.lastEvent = 'PlayCard'
    game.state.api.lastSection = 4
    game.state.log.push({
      role: '1',
      player: 'Chulainn',
      event: 'PlayCard',
      description: 'played card at the',
      section: 'RightWall',
      cards: [{ rank: 8, suit: 1 }],
    })
    game.state.api.siegeCardsCount--
    setTimeout(() => {
      game.state.api.isCurrentPlayer = true
      game.state.api.handCards[5].protected = false // Purple 3
      game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(5)
    }, eventDelay)
  }, eventDelay)
})

demoAttack.push(() => {
  game.state.api.isCurrentPlayer = false
  game.state.api.lastEvent = 'PlayCard'
  game.state.api.lastSection = 3
  game.state.log.push({
    role: '0',
    player: 'Milord',
    event: 'PlayCard',
    description: 'played card at the',
    section: 'Gate',
    cards: [{ rank: 3, suit: 3 }],
  })
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { rank: 8, suit: 4, protected: true }, // Red 8
      { rank: 1, suit: 2, protected: true }, // Green 1
      { rank: 0, suit: 4, protected: true }, // Red 0
      { rank: 7, suit: 4, protected: true }, // Red 7
      { rank: 9, suit: 1, protected: true }, // Blue 9
      { rank: 11, suit: 0, protected: true }, // Yellow 11
    ],
  })
  game.state.api.siegeCardsCount--
  setTimeout(() => {
    game.state.api.sections[3].defense.push({ rank: 3, suit: 2 }) // Green 3
    game.state.api.lastEvent = 'PlayCard'
    game.state.api.lastSection = 3
    game.state.log.push({
      role: '1',
      player: 'Chulainn',
      event: 'PlayCard',
      description: 'played card at the',
      section: 'Gate',
      cards: [{ rank: 3, suit: 2 }],
    })
    game.state.api.siegeCardsCount--
    setTimeout(() => {
      game.state.api.isCurrentPlayer = true
      game.state.api.handCards[2].protected = false // Red 0
      game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(2)
    }, eventDelay)
  }, eventDelay)
})

demoAttack.push(() => {
  game.state.api.isCurrentPlayer = false
  game.state.api.lastEvent = 'PlayCard'
  game.state.api.lastSection = 3
  game.state.log.push({
    role: '0',
    player: 'Milord',
    event: 'PlayCard',
    description: 'played card at the',
    section: 'Gate',
    cards: [{ rank: 0, suit: 4 }],
  })
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { rank: 8, suit: 4, protected: true }, // Red 8
      { rank: 1, suit: 2, protected: true }, // Green 1
      { rank: 2, suit: 0, protected: true }, // Yellow 2
      { rank: 7, suit: 4, protected: true }, // Red 7
      { rank: 9, suit: 1, protected: true }, // Blue 9
      { rank: 11, suit: 0, protected: true }, // Yellow 11
    ],
  })
  game.state.api.siegeCardsCount--
  setTimeout(() => {
    const gate = game.state.api.sections[3]
    gate.name = 'Destroy'
    gate.attack = []
    gate.defense = []
    game.state.api = Object.assign({}, game.state.api, {
      discardCards: [
        { rank: 10, suit: 1 }, // Blue 10
        { rank: 11, suit: 1 }, // Blue 11
        { rank: 6, suit: 1 }, // Blue 6
        { rank: 9, suit: 3 }, // Green 9
        { rank: 3, suit: 2 }, // Yellow 3
        { rank: 6, suit: 0 }, // Yellow 6
        { rank: 0, suit: 4 }, // Red 0
        { rank: 1, suit: 1 }, // Blue 1
        { rank: 2, suit: 0 }, // Yellow 2
        { rank: 3, suit: 3 }, // Purple 3
      ],
    })
    game.state.api.lastEvent = 'Destroy'
    game.state.api.lastSection = 3
    game.state.log.push({
      role: '0',
      player: 'Milord',
      event: 'Destroy',
      description: 'won by successfully destroying the',
      section: 'Gate',
      cards: [
        { rank: 1, suit: 1 }, // Blue 1
        { rank: 2, suit: 0 }, // Yellow 2
        { rank: 3, suit: 3 }, // Purple 3
        { rank: 0, suit: 4 }, // Red 0
        { rank: -1, suit: -1, protected: true }, // vs
        { rank: 6, suit: 0 }, // Yellow 6
        { rank: 3, suit: 2 }, // Yellow 3
      ],
    })
    startConfetti()
    Notify.create(
      Object.assign({}, attackerMessage, {
        message: `
          Victory Milord! Well done!!
        `,
      }),
    )
  }, eventDelay)
})

demoAttack.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
        Alright… I admit defeat, and you may drink from the cup of victory..
      `,
    }),
  )
})

demoAttack.push(() => {
  stopConfetti()
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      But I’ll be back and better than ever in the next tutorial!
      Who could have seen that twist coming!
      `,
      closeBtn: false,
      actions: [
        {
          label: 'Open Pulse Games',
          color: 'white',
          size: '0.5rem',
          handler: () => {
            stopConfetti()
            router.push('/')
          },
        },
        {
          label: 'Defender Demo',
          color: 'dark',
          size: '0.5rem',
          handler: () => {
            stopConfetti()
            location.href = '/games/schotten2?matchId=demoDefense'
          },
        },
      ],
    }),
  )
})

export default demoAttack
