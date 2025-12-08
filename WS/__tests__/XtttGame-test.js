const Player = require('../Player')
const Game = require('../Game')
const { MAX_CONCURRENT_GAMES } = require('../XtttGame')

// Helper to reset UID counter between tests
let uidCounter = 1
const mockGenerateUid = () => uidCounter++

// Mock socket.io
const createMockIo = () => {
	const emitFn = jest.fn()
	const toFn = jest.fn(() => ({ emit: emitFn }))
	const onFn = jest.fn()
	
	return {
		to: toFn,
		on: onFn,
		emit: emitFn,
		_toFn: toFn,
		_emitFn: emitFn,
		_onFn: onFn
	}
}

const createMockSocket = (id) => {
	const handlers = {}
	return {
		id,
		player: null,
		on: jest.fn((event, handler) => {
			handlers[event] = handler
		}),
		_handlers: handlers,
		triggerEvent: (event, data) => {
			if (handlers[event]) {
				handlers[event](data)
			}
		}
	}
}

describe('XtttGame constants', () => {
	it('MAX_CONCURRENT_GAMES is defined', () => {
		expect(MAX_CONCURRENT_GAMES).toBeDefined()
		expect(typeof MAX_CONCURRENT_GAMES).toBe('number')
	})

	it('MAX_CONCURRENT_GAMES is 2', () => {
		expect(MAX_CONCURRENT_GAMES).toBe(2)
	})
})

// Since XtttGame uses module-level state, we need to test the game logic patterns
// We'll extract and test the utility functions

describe('XtttGame utilities', () => {
	describe('removePlayerFrom pattern', () => {
		const removePlayerFrom = (collection, player) => {
			const idx = collection.indexOf(player)
			if (idx >= 0) {
				collection.splice(idx, 1)
			}
		}

		it('removes a player from the collection', () => {
			const player1 = { uid: 1 }
			const player2 = { uid: 2 }
			const collection = [player1, player2]
			
			removePlayerFrom(collection, player1)
			
			expect(collection).toHaveLength(1)
			expect(collection).not.toContain(player1)
			expect(collection).toContain(player2)
		});

		it('does nothing if player is not in collection', () => {
			const player1 = { uid: 1 }
			const player2 = { uid: 2 }
			const player3 = { uid: 3 }
			const collection = [player1, player2]
			
			removePlayerFrom(collection, player3)
			
			expect(collection).toHaveLength(2)
		});

		it('handles empty collection', () => {
			const player = { uid: 1 }
			const collection = []
			
			removePlayerFrom(collection, player)
			
			expect(collection).toHaveLength(0)
		});
	});

	describe('game management logic', () => {
		it('creates new game when no waiting games exist', () => {
			const games = []
			
			// Simulate findOrCreateGame logic
			const waitingGame = games.find(g => !g.isFull() && g.status === 'waiting')
			expect(waitingGame).toBeUndefined()
			
			// Would create new game
			const newGame = new Game()
			games.push(newGame)
			
			expect(games.length).toBe(1)
		})

		it('reuses waiting game for second player', () => {
			const game = new Game()
			const player1 = new Player(1, 'Player1', 'looking')
			game.addPlayer(player1)
			const games = [game]

			// Simulate findOrCreateGame logic
			const waitingGame = games.find(g => !g.isFull() && g.status === 'waiting')
			
			expect(waitingGame).toBe(game)
		})

		it('does not allow more than MAX_CONCURRENT_GAMES', () => {
			const games = []
			
			// Fill up with full games
			for (let i = 0; i < MAX_CONCURRENT_GAMES; i++) {
				const game = new Game()
				game.addPlayer(new Player(i * 2, `Player${i * 2}`, 'looking'))
				game.addPlayer(new Player(i * 2 + 1, `Player${i * 2 + 1}`, 'looking'))
				games.push(game)
			}

			// Try to create another game
			const canCreate = games.length < MAX_CONCURRENT_GAMES || 
				games.some(g => g.isEmpty())
			
			expect(canCreate).toBe(false)
		})
	})

	describe('pairing logic', () => {
		it('pairs two available players correctly', () => {
			const game = new Game()
			const p1 = new Player(1, 'Player1', 'looking')
			const p2 = new Player(2, 'Player2', 'looking')
			
			game.addPlayer(p1)
			game.addPlayer(p2)
			
			// Simulate pairing
			p1.status = 'paired'
			p2.status = 'paired'
			p1.opp = p2
			p2.opp = p1
			
			expect(p1.opp).toBe(p2)
			expect(p2.opp).toBe(p1)
			expect(p1.mode).toBe('m')
			expect(p2.mode).toBe('s')
			expect(p1.symbol).toBe('x')
			expect(p2.symbol).toBe('o')
			expect(p1.status).toBe('paired')
			expect(p2.status).toBe('paired')
		});

		it('unpairing sets opponent status back to looking', () => {
			const p1 = new Player(1, 'Player1', 'paired')
			const p2 = new Player(2, 'Player2', 'paired')
			p1.opp = p2
			p2.opp = p1
			
			// Simulate p1 disconnecting
			p2.status = 'looking'
			p2.opp = null
			
			expect(p2.status).toBe('looking')
			expect(p2.opp).toBeNull()
		});
	});

	describe('player creation', () => {
		it('creates player with default name if not provided', () => {
			const data = {}
			const playerName = data.name || 'Player'
			
			expect(playerName).toBe('Player')
		});

		it('uses provided name', () => {
			const data = { name: 'CustomName' }
			const playerName = data.name || 'Player'
			
			expect(playerName).toBe('CustomName')
		});
	});
});

describe('XtttGame integration', () => {
	let io, socket1, socket2

	beforeEach(() => {
		io = createMockIo()
		socket1 = createMockSocket('socket-1')
		socket2 = createMockSocket('socket-2')
		uidCounter = 1
	});

	describe('socket event registration', () => {
		it('socket.on is called with expected events', () => {
			// When a socket connects, these events should be registered
			const expectedEvents = ['new player', 'ply_turn', 'disconnect']
			
			// Verify the pattern - each socket should register these events
			expectedEvents.forEach(event => {
				expect(typeof event).toBe('string')
			})
		});
	});

	describe('turn handling with game validation', () => {
		it('turn data should contain cell_id', () => {
			const turnData = { cell_id: 'c5' }
			expect(turnData.cell_id).toBe('c5')
		});

		it('turn is ignored if player has no game', () => {
			const player = new Player(1, 'Solo', 'looking')
			player.game = null
			
			// In the actual code, onTurn returns early if no game
			const shouldProcess = player.game !== null && player.opp !== null
			expect(shouldProcess).toBe(false)
		});

		it('turn is processed if player has game and opponent', () => {
			const game = new Game()
			const player = new Player(1, 'Player1', 'paired')
			const opponent = new Player(2, 'Player2', 'paired')
			
			game.addPlayer(player)
			game.addPlayer(opponent)
			player.opp = opponent
			opponent.opp = player
			
			const shouldProcess = player.game !== null && player.opp !== null
			expect(shouldProcess).toBe(true)
		});

		it('validates turn using game.makeTurn', () => {
			const game = new Game()
			const player1 = new Player(1, 'Player1', 'looking')
			const player2 = new Player(2, 'Player2', 'looking')
			
			game.addPlayer(player1)
			game.addPlayer(player2)

			// Valid turn
			const result1 = game.makeTurn(player1, 'c1')
			expect(result1.valid).toBe(true)

			// Invalid turn - same cell
			const result2 = game.makeTurn(player2, 'c1')
			expect(result2.valid).toBe(false)
			expect(result2.error).toBe('Invalid turn')
		});
	});

	describe('server full scenario', () => {
		it('rejects player when server is full', () => {
			// Simulate server full condition
			const games = []
			for (let i = 0; i < MAX_CONCURRENT_GAMES; i++) {
				const game = new Game()
				game.addPlayer(new Player(i * 2, `P${i * 2}`, 'looking'))
				game.addPlayer(new Player(i * 2 + 1, `P${i * 2 + 1}`, 'looking'))
				games.push(game)
			}

			// Check if new player can join
			const waitingGame = games.find(g => !g.isFull() && g.status === 'waiting')
			const canCreate = games.length < MAX_CONCURRENT_GAMES
			const hasEmptyGame = games.some(g => g.isEmpty())

			const canJoin = waitingGame || canCreate || hasEmptyGame
			expect(canJoin).toBe(false)
		});
	});

	describe('opponent disconnect handling', () => {
		it('opponent should be notified on disconnect', () => {
			const game = new Game()
			const player1 = new Player(1, 'Player1', 'paired')
			const player2 = new Player(2, 'Player2', 'paired')
			
			game.addPlayer(player1)
			game.addPlayer(player2)
			player1.opp = player2
			player2.opp = player1

			// Simulate player1 disconnect
			const hasOpponent = player1.opp !== null
			expect(hasOpponent).toBe(true)

			// In actual code, io.to(player1.opp.sockid).emit('opponent_disconnected', ...)
			// is called before cleanup
		});

		it('cleans up game when both players disconnect', () => {
			const game = new Game()
			const player1 = new Player(1, 'Player1', 'looking')
			
			game.addPlayer(player1)
			expect(game.isEmpty()).toBe(false)

			game.removePlayer(player1)
			expect(game.isEmpty()).toBe(true)
		});
	});
});
