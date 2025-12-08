const Game = require('../Game')
const { generateGameCode } = require('../Game')
const Player = require('../Player')

describe('Game', () => {
	describe('generateGameCode', () => {
		it('generates a 4-character code', () => {
			const code = generateGameCode()
			expect(code).toHaveLength(4)
		})

		it('generates uppercase letters only', () => {
			const code = generateGameCode()
			expect(code).toMatch(/^[A-Z]{4}$/)
		})

		it('generates unique codes (statistically)', () => {
			const codes = new Set()
			for (let i = 0; i < 100; i++) {
				codes.add(generateGameCode())
			}
			// With 26^4 = 456,976 possibilities, 100 codes should be unique
			expect(codes.size).toBe(100)
		})
	})

	describe('constructor', () => {
		it('creates a game with a unique code', () => {
			const game = new Game()
			expect(game.code).toMatch(/^[A-Z]{4}$/)
		})

		it('initializes empty field', () => {
			const game = new Game()
			expect(game.field).toEqual({
				c1: null, c2: null, c3: null,
				c4: null, c5: null, c6: null,
				c7: null, c8: null, c9: null
			})
		})

		it('initializes with x as first turn', () => {
			const game = new Game()
			expect(game.currentTurn).toBe('x')
		})

		it('starts with waiting status', () => {
			const game = new Game()
			expect(game.status).toBe('waiting')
		})

		it('starts with empty players array', () => {
			const game = new Game()
			expect(game.players).toEqual([])
		})
	})

	describe('addPlayer', () => {
		it('adds first player as x (master)', () => {
			const game = new Game()
			const player = new Player(1, 'Player1', 'looking')

			const result = game.addPlayer(player)

			expect(result).toBe(true)
			expect(game.players).toContain(player)
			expect(player.symbol).toBe('x')
			expect(player.mode).toBe('m')
			expect(player.game).toBe(game)
		})

		it('adds second player as o (slave)', () => {
			const game = new Game()
			const player1 = new Player(1, 'Player1', 'looking')
			const player2 = new Player(2, 'Player2', 'looking')

			game.addPlayer(player1)
			const result = game.addPlayer(player2)

			expect(result).toBe(true)
			expect(player2.symbol).toBe('o')
			expect(player2.mode).toBe('s')
		})

		it('changes status to playing when game is full', () => {
			const game = new Game()
			const player1 = new Player(1, 'Player1', 'looking')
			const player2 = new Player(2, 'Player2', 'looking')

			game.addPlayer(player1)
			expect(game.status).toBe('waiting')

			game.addPlayer(player2)
			expect(game.status).toBe('playing')
		})

		it('rejects third player', () => {
			const game = new Game()
			const player1 = new Player(1, 'Player1', 'looking')
			const player2 = new Player(2, 'Player2', 'looking')
			const player3 = new Player(3, 'Player3', 'looking')

			game.addPlayer(player1)
			game.addPlayer(player2)
			const result = game.addPlayer(player3)

			expect(result).toBe(false)
			expect(game.players).not.toContain(player3)
		})
	})

	describe('removePlayer', () => {
		it('removes a player from the game', () => {
			const game = new Game()
			const player = new Player(1, 'Player1', 'looking')

			game.addPlayer(player)
			game.removePlayer(player)

			expect(game.players).not.toContain(player)
			expect(player.game).toBeNull()
			expect(player.symbol).toBeNull()
		})

		it('handles removing non-existent player gracefully', () => {
			const game = new Game()
			const player = new Player(1, 'Player1', 'looking')

			// Should not throw
			expect(() => game.removePlayer(player)).not.toThrow()
		})
	})

	describe('isFull', () => {
		it('returns false when empty', () => {
			const game = new Game()
			expect(game.isFull()).toBe(false)
		})

		it('returns false with one player', () => {
			const game = new Game()
			game.addPlayer(new Player(1, 'Player1', 'looking'))
			expect(game.isFull()).toBe(false)
		})

		it('returns true with two players', () => {
			const game = new Game()
			game.addPlayer(new Player(1, 'Player1', 'looking'))
			game.addPlayer(new Player(2, 'Player2', 'looking'))
			expect(game.isFull()).toBe(true)
		})
	})

	describe('isEmpty', () => {
		it('returns true when no players', () => {
			const game = new Game()
			expect(game.isEmpty()).toBe(true)
		})

		it('returns false with one player', () => {
			const game = new Game()
			game.addPlayer(new Player(1, 'Player1', 'looking'))
			expect(game.isEmpty()).toBe(false)
		})
	})

	describe('getOpponent', () => {
		it('returns null when player has no opponent', () => {
			const game = new Game()
			const player = new Player(1, 'Player1', 'looking')
			game.addPlayer(player)

			expect(game.getOpponent(player)).toBeNull()
		})

		it('returns the other player as opponent', () => {
			const game = new Game()
			const player1 = new Player(1, 'Player1', 'looking')
			const player2 = new Player(2, 'Player2', 'looking')

			game.addPlayer(player1)
			game.addPlayer(player2)

			expect(game.getOpponent(player1)).toBe(player2)
			expect(game.getOpponent(player2)).toBe(player1)
		})
	})

	describe('makeTurn', () => {
		let game, player1, player2

		beforeEach(() => {
			game = new Game()
			player1 = new Player(1, 'Player1', 'looking')
			player2 = new Player(2, 'Player2', 'looking')
			game.addPlayer(player1)
			game.addPlayer(player2)
		})

		it('rejects turn when game is not playing', () => {
			const waitingGame = new Game()
			const player = new Player(1, 'Test', 'looking')
			waitingGame.addPlayer(player)

			const result = waitingGame.makeTurn(player, 'c1')

			expect(result.valid).toBe(false)
			expect(result.error).toBe('Game is not active')
		})

		it('rejects turn from wrong player', () => {
			// player1 (x) should go first, try with player2
			const result = game.makeTurn(player2, 'c1')

			expect(result.valid).toBe(false)
			expect(result.error).toBe('Not your turn')
		})

		it('rejects invalid cell ID', () => {
			const result = game.makeTurn(player1, 'invalid')

			expect(result.valid).toBe(false)
			expect(result.error).toBe('Invalid cell')
		})

		it('rejects null cell ID', () => {
			const result = game.makeTurn(player1, null)

			expect(result.valid).toBe(false)
			expect(result.error).toBe('Invalid cell')
		})

		it('rejects turn on occupied cell', () => {
			game.makeTurn(player1, 'c1') // x plays c1
			game.makeTurn(player2, 'c2') // o plays c2

			const result = game.makeTurn(player1, 'c1') // x tries c1 again

			expect(result.valid).toBe(false)
			expect(result.error).toBe('Invalid turn')
		})

		it('accepts valid turn and updates field', () => {
			const result = game.makeTurn(player1, 'c5')

			expect(result.valid).toBe(true)
			expect(game.field.c5).toBe('x')
		})

		it('switches turn after valid move', () => {
			expect(game.currentTurn).toBe('x')

			game.makeTurn(player1, 'c1')
			expect(game.currentTurn).toBe('o')

			game.makeTurn(player2, 'c2')
			expect(game.currentTurn).toBe('x')
		})

		it('allows full game sequence', () => {
			// x plays
			expect(game.makeTurn(player1, 'c1').valid).toBe(true)
			// o plays
			expect(game.makeTurn(player2, 'c2').valid).toBe(true)
			// x plays
			expect(game.makeTurn(player1, 'c3').valid).toBe(true)
			// o plays
			expect(game.makeTurn(player2, 'c4').valid).toBe(true)

			expect(game.field).toEqual({
				c1: 'x', c2: 'o', c3: 'x',
				c4: 'o', c5: null, c6: null,
				c7: null, c8: null, c9: null
			})
		})
	})

	describe('toJSON', () => {
		it('returns serializable game state', () => {
			const game = new Game()
			const player1 = new Player(1, 'Player1', 'looking')
			game.addPlayer(player1)
			game.field.c1 = 'x'

			const json = game.toJSON()

			expect(json).toEqual({
				code: game.code,
				field: game.field,
				currentTurn: 'x',
				status: 'waiting',
				playerCount: 1
			})
		})
	})
})
