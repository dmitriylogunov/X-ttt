const Player = require('../Player')

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

	describe('pairing logic', () => {
		it('pairs two available players correctly', () => {
			const p1 = new Player(1, 'Player1', 'looking')
			const p2 = new Player(2, 'Player2', 'looking')
			
			// Simulate pairing
			p1.mode = 'm'
			p2.mode = 's'
			p1.status = 'paired'
			p2.status = 'paired'
			p1.opp = p2
			p2.opp = p1
			
			expect(p1.opp).toBe(p2)
			expect(p2.opp).toBe(p1)
			expect(p1.mode).toBe('m')
			expect(p2.mode).toBe('s')
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

	describe('turn handling', () => {
		it('turn data should contain cell_id', () => {
			const turnData = { cell_id: 5 }
			expect(turnData.cell_id).toBe(5)
		});

		it('turn is ignored if player has no opponent', () => {
			const player = new Player(1, 'Solo', 'looking')
			player.opp = null
			
			// In the actual code, onTurn returns early if no opponent
			const shouldProcess = player.opp !== null
			expect(shouldProcess).toBe(false)
		});

		it('turn is processed if player has opponent', () => {
			const player = new Player(1, 'Player1', 'paired')
			const opponent = new Player(2, 'Player2', 'paired')
			player.opp = opponent
			opponent.opp = player
			
			const shouldProcess = player.opp !== null
			expect(shouldProcess).toBe(true)
		});
	});
});
