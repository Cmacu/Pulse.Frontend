import { Notify } from 'quasar'
import { game, Schotten2Api } from 'src/games/Schotten2/game'
import { startConfetti, stopConfetti } from 'src/utils/confetti'

type DemoFunction = () => void
const demoOver = () => {
  console.error('demo over', game.state.demoIndex)
}

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

interface Message {
  avatar: string
  color: string
  html: boolean
  timeout: number
  position: 'top' | 'bottom' | 'center'
  onDismiss: Function
}

const attackerMessage: Message = {
  avatar: '/symbols/Will.png',
  color: 'accent',
  html: true,
  timeout: 0,
  position: 'bottom',
  onDismiss: () => play(),
}

const defenderMessage: Message = {
  avatar: '/symbols/Cmacu.png',
  color: 'primary',
  html: true,
  timeout: 0,
  position: 'top',
  onDismiss: () => play(),
}

const attack: DemoFunction[] = []
const defense: DemoFunction[] = []
attack.push(() => {
  game.state.api.isAttacker = true
  game.state.api.isCurrentPlayer = false
  game.state.api.enablePreparation = false
  game.state.api.siegeCardsCount = 48
  game.state.api.handCards = [
    { suit: 4, rank: 8, disabled: true }, // Red 8
    { suit: 1, rank: 10, disabled: true }, // Blue 10
    { suit: 4, rank: 0, disabled: true }, // Red 0
    { suit: 2, rank: 9, disabled: true }, // Green 9
    { suit: 0, rank: 2, disabled: true }, // Yellow 2
    { suit: 3, rank: 3, disabled: true }, // Purple 3
  ]
  game.state.api.sections = [
    {
      name: 'LeftPit',
      spaces: 0,
      types: [1],
      isDamaged: false,
      attack: [],
      defense: [],
    },
    {
      name: 'Tower',
      spaces: 0,
      types: [0, 2, 3, 4, 5],
      isDamaged: false,
      attack: [],
      defense: [],
    },
    {
      name: 'Wall',
      spaces: 0,
      types: [0, 2, 3, 4, 5],
      isDamaged: false,
      attack: [],
      defense: [],
    },
    {
      name: 'Door',
      spaces: 0,
      types: [0, 2, 3, 4, 5],
      isDamaged: false,
      attack: [],
      defense: [],
    },
    {
      name: 'Wall',
      spaces: 0,
      types: [0, 2, 3, 4, 5],
      isDamaged: false,
      attack: [],
      defense: [],
    },
    {
      name: 'Tower',
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
  ]
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      General! We are ready to attack the castle!
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      As your Chief Strategist,
      I’ll help you get the battle off to a great start!
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      You are the Attacker, and so have the initiative to take
      the first action by <strong>playing</strong> a card.
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Go ahead and play the <strong>[Blue 10]</strong> on the Gate!
    `,
    }),
  )
})

// ENABLE BLUE 10
attack.push(() => {
  game.state.api.handCards[1].disabled = false
  game.state.api.isCurrentPlayer = true
  game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(1)
  game.state.api.sections[3].spaces = 2
})

attack.push(() => {
  game.state.api.isCurrentPlayer = false
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      We will attempt to <strong>capture</strong> this Wall Segment
      by completing a stronger formation on our side than the Defender is able to.
      This will <strong>damage</strong> the Wall Segment, the first step to victory.
    `,
    }),
  )
})

// DRAW BLUE 11
attack.push(() => {
  game.state.api.siegeCardsCount--
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { suit: 4, rank: 8, disabled: true }, // Red 8
      { suit: 1, rank: 11, disabled: true }, // New Card: Blue 11
      { suit: 4, rank: 0, disabled: true }, // Red 0
      { suit: 2, rank: 9, disabled: true }, // Green 9
      { suit: 0, rank: 2, disabled: true }, // Yellow 2
      { suit: 3, rank: 3, disabled: true }, // Purple 3
    ],
  })
  play()
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Hah!
      We’ve replenished our hand by drawing a card and we see that it is the <strong>[Blue 11]</strong>!`,
      position: 'center',
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Since this wall section only has two slots to <strong>play</strong> a card,
      we’ll only need to <strong>play</strong> one more card to have a complete Formation!
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      At any time, you can see the list of Formations and their ranking
      in the game rules by hitting the highlighted “more options” button
    `,
    }),
  )
  toggleMoreOptions()
})

attack.push(() => {
  toggleMoreOptions()

  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Yawn* Ah General!  Forgive my yawn.
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      I was just sleeping off last night’s feast in the great hall of
      this mighty castle I won’t let you have.
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Ah, this card should do.
    `,
    }),
  )
})

// DEFENDER PLAYS
attack.push(() => {
  game.state.api.siegeCardsCount--
  game.state.api.sections[3].defense.push({ suit: 1, rank: 6 }) // Blue 6
  play()
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      I don’t think that Defender is trembling at the sight of us as expected… but no matter.
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Keep in mind, we could <strong>play</strong> a card on any wall segment.
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      However, there are only two slots to <strong>play</strong> cards on the Gate segment.
      So we only need to play one more card on the Gate in order to have a complete Formation.
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Now play the <strong>[Blue 11]</strong> on the Gate.
    `,
    }),
  )
})

// ENABLE BLUE 11
attack.push(() => {
  game.state.api.handCards[1].disabled = false
  game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(1)
  game.state.api.isCurrentPlayer = true
})

attack.push(() => {
  game.state.api.isCurrentPlayer = false
  game.state.api.siegeCardsCount--
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { suit: 4, rank: 8, disabled: true }, // Red 8
      { suit: 2, rank: 1, disabled: true }, // New Card: Green 1
      { suit: 4, rank: 0, disabled: true }, // Red 0
      { suit: 2, rank: 9, disabled: true }, // Green 9
      { suit: 0, rank: 2, disabled: true }, // Yellow 2
      { suit: 3, rank: 3, disabled: true }, // Purple 3
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
        { suit: 1, rank: 10 }, // Blue 10
        { suit: 1, rank: 11 }, // Blue 11
        { suit: 1, rank: 6 }, // Blue 6
      ],
    })
    play()
  }, eventDelay)
})

attack.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      What have you done! I just had those gates cleaned yesterday!.
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      This gave us a complete <strong>Color-Run</strong> Formation.
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      As the Defender is unable to play a stronger formation,
      or remove any of our cards, the wall is damaged.
      This removed all cards on either side of that segment
      and presents the new Section limitation.
    `,
    }),
  )
})

attack.push(() => {
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

attack.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Hey, I heard that! Well, all I have to do is
      keep you from succeeding until the cards run out!
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      Time is on my side!
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      You may have noticed some of the Wall Segments have slots with icons.
      In the case of the damaged Gate, the formation
      requirement is 4 cards and only the smallest sum is evaluated.
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      No other formation type may be considered!
    `,
    }),
  )
})

attack.push(() => {
  toggleMoreOptions()
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
        At any time, see a list of “Wall Section Limitations”
        and their the game rules by hitting the highlighted “more options” button
    `,
    }),
  )
})

attack.push(() => {
  game.state.api.sections[0].defense.push({ suit: 2, rank: 10 }) // Green 10
  play()
})

attack.push(() => {
  toggleMoreOptions()
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      If a formation is tied the winner is the one who completed their formation first.
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Let’s play the <strong>[Green 9]</strong> next
    `,
    }),
  )
})

attack.push(() => {
  game.state.api.handCards[3].disabled = false
  game.state.api.sections[0].spaces = 1
  game.state.api.isCurrentPlayer = true
  game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(3)
})

attack.push(() => {
  game.state.api.isCurrentPlayer = false
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { suit: 4, rank: 8, disabled: true }, // Red 8
      { suit: 2, rank: 1, disabled: true }, // Green 1
      { suit: 4, rank: 0, disabled: true }, // Red 0
      { suit: 1, rank: 1, disabled: true }, // Blue 1
      { suit: 0, rank: 2, disabled: true }, // Yellow 2
      { suit: 3, rank: 3, disabled: true }, // Purple 3
    ],
  })
  game.state.api.siegeCardsCount--
  setTimeout(() => {
    game.state.api.sections[0].defense.push({ suit: 3, rank: 10 }) // Purple 10
    game.state.api.siegeCardsCount--
    play()
  }, eventDelay)
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      I have bad news...
      even predetermined tutorials make mistakes sometimes.
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      That last card was a blunder! But no matter,
      we can use our optional action as the Attacker to <strong>Retreat</strong>.
    `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
        This removes any cards action to discard any number of your cards from any number of your segments.
        Do this by hitting the <strong>retreat</strong> action.
      `,
    }),
  )
})

attack.push(() => {
  game.state.api.isCurrentPlayer = true
  game.state.api.enablePreparation = true
})

attack.push(() => {
  game.state.api.enablePreparation = false
  game.state.api = Object.assign({}, game.state.api, {
    discardCards: [
      { suit: 1, rank: 10 }, // Blue 10
      { suit: 1, rank: 11 }, // Blue 11
      { suit: 1, rank: 6 }, // Blue 6
      { suit: 3, rank: 9 }, // Green 9
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

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
      Don’t worry about him, General. Now the field is clear for our next approach.
      `,
    }),
  )
})

attack.push(() => {
  Notify.create(
    Object.assign({}, attackerMessage, {
      message: `
        Since we’ve drawn the cards we need,
        all we need is to play the 0 - 3 cards in our hand on the gate to win the battle!
      `,
    }),
  )
})

attack.push(() => {
  game.state.enableRetreat = false
  game.state.api.sections[0].spaces = 0
  game.state.api.sections[3].spaces = 4
  game.state.api.handCards[3].disabled = false
  game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(3)
})

attack.push(() => {
  game.state.api.isCurrentPlayer = false
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { suit: 4, rank: 8, disabled: true }, // Red 8
      { suit: 2, rank: 1, disabled: true }, // Green 1
      { suit: 4, rank: 0, disabled: true }, // Red 0
      { suit: 4, rank: 7, disabled: true }, // Red 7
      { suit: 0, rank: 2, disabled: true }, // Yellow 2
      { suit: 3, rank: 3, disabled: true }, // Purple 3
    ],
  })
  game.state.api.siegeCardsCount--
  setTimeout(() => {
    game.state.api.sections[3].defense.push({ suit: 0, rank: 6 }) // Yellow 6
    game.state.api.siegeCardsCount--
    setTimeout(() => {
      game.state.api.isCurrentPlayer = true
      game.state.api.handCards[4].disabled = false // Yellow 2
      game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(4)
    }, eventDelay)
  }, eventDelay)
})

attack.push(() => {
  game.state.api.isCurrentPlayer = false
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { suit: 4, rank: 8, disabled: true }, // Red 8
      { suit: 2, rank: 1, disabled: true }, // Green 1
      { suit: 4, rank: 0, disabled: true }, // Red 0
      { suit: 4, rank: 7, disabled: true }, // Red 7
      { suit: 1, rank: 9, disabled: true }, // Blue 9
      { suit: 3, rank: 3, disabled: true }, // Purple 3
    ],
  })
  game.state.api.siegeCardsCount--
  setTimeout(() => {
    game.state.api.sections[4].defense.push({ suit: 1, rank: 8 }) // Blue 8
    game.state.api.siegeCardsCount--
    setTimeout(() => {
      game.state.api.isCurrentPlayer = true
      game.state.api.handCards[5].disabled = false // Purple 3
      game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(5)
    }, eventDelay)
  }, eventDelay)
})

attack.push(() => {
  game.state.api.isCurrentPlayer = false
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { suit: 4, rank: 8, disabled: true }, // Red 8
      { suit: 2, rank: 1, disabled: true }, // Green 1
      { suit: 4, rank: 0, disabled: true }, // Red 0
      { suit: 4, rank: 7, disabled: true }, // Red 7
      { suit: 1, rank: 9, disabled: true }, // Blue 9
      { suit: 0, rank: 11, disabled: true }, // Yellow 11
    ],
  })
  game.state.api.siegeCardsCount--
  setTimeout(() => {
    game.state.api.sections[3].defense.push({ suit: 3, rank: 3 }) // Green 3
    game.state.api.siegeCardsCount--
    setTimeout(() => {
      game.state.api.isCurrentPlayer = true
      game.state.api.handCards[2].disabled = false // Red 0
      game.state.handOrderSelectedIndex = game.state.handOrder.indexOf(2)
    }, eventDelay)
  }, eventDelay)
})

attack.push(() => {
  game.state.api.isCurrentPlayer = false
  game.state.api = Object.assign({}, game.state.api, {
    handCards: [
      { suit: 4, rank: 8, disabled: true }, // Red 8
      { suit: 2, rank: 1, disabled: true }, // Green 1
      { suit: 0, rank: 2, disabled: true }, // Yellow 2
      { suit: 4, rank: 7, disabled: true }, // Red 7
      { suit: 1, rank: 9, disabled: true }, // Blue 9
      { suit: 0, rank: 11, disabled: true }, // Yellow 11
    ],
  })
  game.state.api.siegeCardsCount--
  setTimeout(() => {
    const gate = game.state.api.sections[3]
    gate.name = 'GameOver'
    gate.attack = []
    gate.defense = []
    game.state.api = Object.assign({}, game.state.api, {
      discardCards: [
        { suit: 1, rank: 10 }, // Blue 10
        { suit: 1, rank: 11 }, // Blue 11
        { suit: 1, rank: 6 }, // Blue 6
        { suit: 3, rank: 9 }, // Green 9
        { suit: 4, rank: 3 }, // Purple 3
        { suit: 0, rank: 6 }, // Yellow 6
        { suit: 4, rank: 0 }, // Red 0
        { suit: 1, rank: 1 }, // Blue 1
        { suit: 0, rank: 2 }, // Yellow 2
        { suit: 4, rank: 3 }, // Purple 3
      ],
    })
    startConfetti()
    Notify.create(
      Object.assign({}, attackerMessage, {
        message: `
          Victory General! Well done!!
        `,
      }),
    )
  }, eventDelay)
})

attack.push(() => {
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
        Alright… I admit defeat, and you may drink from the cup of victory..
      `,
    }),
  )
})

attack.push(() => {
  stopConfetti()
  Notify.create(
    Object.assign({}, defenderMessage, {
      message: `
      But I’ll be back and better than ever in the next tutorial!
      Who could have seen that twist coming!
      `,
    }),
  )
})

const play = () => {
  const index = game.state.demoIndex
  console.error('play demo', index)
  game.state.demoIndex = index + 1
  const playFunction = functions.length > index ? functions[index] : demoOver
  playFunction()
}

let functions: DemoFunction[]

export const demo: Schotten2Api = {
  connect: (match) => {
    if (match == 'demoAttack') functions = attack
    if (match == 'demoDefense') functions = defense
    play()
    return Promise.resolve()
  },
  retreat: () => {
    play()
  },
  useOil: () => {
    play()
  },
  playCard: () => {
    play()
  },
  resign: () => {
    location.href = '/'
    return Promise.resolve()
  },
  disconnect: () => Promise.resolve(),
}
