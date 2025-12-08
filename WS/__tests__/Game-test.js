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
			// With 26^4 = 456,976 possibilities, 100 codes should be nearly unique
			// Allow for rare collisions (at least 95 unique)
			expect(codes.size).toBeGreaterThanOrEqual(95)
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

		it('initializes winner as null', () => {
			const game = new Game()
			expect(game.winner).toBeNull()
		})

		it('initializes winningCells as null', () => {
			const game = new Game()
			expect(game.winningCells).toBeNull()
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

		it('detects horizontal win for x', () => {
			game.makeTurn(player1, 'c1') // x
			game.makeTurn(player2, 'c4') // o
			game.makeTurn(player1, 'c2') // x
			game.makeTurn(player2, 'c5') // o
			const result = game.makeTurn(player1, 'c3') // x wins with top row

			expect(result.valid).toBe(true)
			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('x')
			expect(result.winningCells).toEqual(['c1', 'c2', 'c3'])
			expect(result.isDraw).toBe(false)
			expect(game.status).toBe('finished')
			expect(game.winner).toBe('x')
		})

		it('detects vertical win for o', () => {
			game.makeTurn(player1, 'c1') // x
			game.makeTurn(player2, 'c2') // o
			game.makeTurn(player1, 'c4') // x
			game.makeTurn(player2, 'c5') // o
			game.makeTurn(player1, 'c9') // x
			const result = game.makeTurn(player2, 'c8') // o wins with middle column

			expect(result.valid).toBe(true)
			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('o')
			expect(result.winningCells).toEqual(['c2', 'c5', 'c8'])
			expect(result.isDraw).toBe(false)
			expect(game.status).toBe('finished')
		})

		it('detects diagonal win', () => {
			game.makeTurn(player1, 'c1') // x
			game.makeTurn(player2, 'c2') // o
			game.makeTurn(player1, 'c5') // x
			game.makeTurn(player2, 'c3') // o
			const result = game.makeTurn(player1, 'c9') // x wins with diagonal

			expect(result.valid).toBe(true)
			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('x')
			expect(result.winningCells).toEqual(['c1', 'c5', 'c9'])
		})

		it('detects draw when board is full', () => {
			// x | o | x
			// x | o | o
			// o | x | x
			game.makeTurn(player1, 'c1') // x
			game.makeTurn(player2, 'c2') // o
			game.makeTurn(player1, 'c3') // x
			game.makeTurn(player2, 'c5') // o
			game.makeTurn(player1, 'c4') // x
			game.makeTurn(player2, 'c6') // o
			game.makeTurn(player1, 'c8') // x
			game.makeTurn(player2, 'c7') // o
			const result = game.makeTurn(player1, 'c9') // x - draw

			expect(result.valid).toBe(true)
			expect(result.gameOver).toBe(true)
			expect(result.winner).toBeNull()
			expect(result.winningCells).toBeNull()
			expect(result.isDraw).toBe(true)
			expect(game.status).toBe('finished')
		})

		it('does not allow turns after game is over', () => {
			// Win the game
			game.makeTurn(player1, 'c1') // x
			game.makeTurn(player2, 'c4') // o
			game.makeTurn(player1, 'c2') // x
			game.makeTurn(player2, 'c5') // o
			game.makeTurn(player1, 'c3') // x wins

			const result = game.makeTurn(player2, 'c6')
			expect(result.valid).toBe(false)
			expect(result.error).toBe('Game is not active')
		})

		it('returns gameOver: false for non-winning move', () => {
			const result = game.makeTurn(player1, 'c5')
			
			expect(result.valid).toBe(true)
			expect(result.gameOver).toBe(false)
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
				playerCount: 1,
				winner: null,
				winningCells: null
			})
		})

		it('includes winner info when game is finished', () => {
			const game = new Game()
			const player1 = new Player(1, 'Player1', 'looking')
			const player2 = new Player(2, 'Player2', 'looking')
			game.addPlayer(player1)
			game.addPlayer(player2)
			
			// Win with top row
			game.makeTurn(player1, 'c1')
			game.makeTurn(player2, 'c4')
			game.makeTurn(player1, 'c2')
			game.makeTurn(player2, 'c5')
			game.makeTurn(player1, 'c3')

			const json = game.toJSON()

			expect(json.status).toBe('finished')
			expect(json.winner).toBe('x')
			expect(json.winningCells).toEqual(['c1', 'c2', 'c3'])
		})
	})

	describe('checkWinner', () => {
		let game, player1, player2

		beforeEach(() => {
			game = new Game()
			player1 = new Player(1, 'Player1', 'looking')
			player2 = new Player(2, 'Player2', 'looking')
			game.addPlayer(player1)
			game.addPlayer(player2)
		})

		it('returns gameOver: false for empty board', () => {
			const result = game.checkWinner()
			expect(result.gameOver).toBe(false)
		})

		it('returns gameOver: false for partial board without winner', () => {
			game.field.c1 = 'x'
			game.field.c5 = 'o'
			const result = game.checkWinner()
			expect(result.gameOver).toBe(false)
		})

		it('detects all horizontal wins', () => {
			// Top row
			game.field = { c1: 'x', c2: 'x', c3: 'x', c4: null, c5: null, c6: null, c7: null, c8: null, c9: null }
			let result = game.checkWinner()
			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('x')
			expect(result.winningCells).toEqual(['c1', 'c2', 'c3'])

			// Middle row
			game.field = { c1: null, c2: null, c3: null, c4: 'o', c5: 'o', c6: 'o', c7: null, c8: null, c9: null }
			result = game.checkWinner()
			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('o')
			expect(result.winningCells).toEqual(['c4', 'c5', 'c6'])

			// Bottom row
			game.field = { c1: null, c2: null, c3: null, c4: null, c5: null, c6: null, c7: 'x', c8: 'x', c9: 'x' }
			result = game.checkWinner()
			expect(result.gameOver).toBe(true)
			expect(result.winningCells).toEqual(['c7', 'c8', 'c9'])
		})

		it('detects all vertical wins', () => {
			// Left column
			game.field = { c1: 'x', c2: null, c3: null, c4: 'x', c5: null, c6: null, c7: 'x', c8: null, c9: null }
			let result = game.checkWinner()
			expect(result.gameOver).toBe(true)
			expect(result.winningCells).toEqual(['c1', 'c4', 'c7'])

			// Middle column
			game.field = { c1: null, c2: 'o', c3: null, c4: null, c5: 'o', c6: null, c7: null, c8: 'o', c9: null }
			result = game.checkWinner()
			expect(result.gameOver).toBe(true)
			expect(result.winningCells).toEqual(['c2', 'c5', 'c8'])

			// Right column
			game.field = { c1: null, c2: null, c3: 'x', c4: null, c5: null, c6: 'x', c7: null, c8: null, c9: 'x' }
			result = game.checkWinner()
			expect(result.gameOver).toBe(true)
			expect(result.winningCells).toEqual(['c3', 'c6', 'c9'])
		})

		it('detects diagonal wins', () => {
			// Top-left to bottom-right
			game.field = { c1: 'x', c2: null, c3: null, c4: null, c5: 'x', c6: null, c7: null, c8: null, c9: 'x' }
			let result = game.checkWinner()
			expect(result.gameOver).toBe(true)
			expect(result.winningCells).toEqual(['c1', 'c5', 'c9'])

			// Top-right to bottom-left
			game.field = { c1: null, c2: null, c3: 'o', c4: null, c5: 'o', c6: null, c7: 'o', c8: null, c9: null }
			result = game.checkWinner()
			expect(result.gameOver).toBe(true)
			expect(result.winningCells).toEqual(['c3', 'c5', 'c7'])
		})
	})

	describe('WIN_SETS', () => {
		it('has 8 winning combinations', () => {
			expect(Game.WIN_SETS).toHaveLength(8)
		})

		it('each combination has 3 cells', () => {
			Game.WIN_SETS.forEach(set => {
				expect(set).toHaveLength(3)
			})
		})

		it('contains all 3 rows', () => {
			expect(Game.WIN_SETS).toContainEqual(['c1', 'c2', 'c3'])
			expect(Game.WIN_SETS).toContainEqual(['c4', 'c5', 'c6'])
			expect(Game.WIN_SETS).toContainEqual(['c7', 'c8', 'c9'])
		})

		it('contains all 3 columns', () => {
			expect(Game.WIN_SETS).toContainEqual(['c1', 'c4', 'c7'])
			expect(Game.WIN_SETS).toContainEqual(['c2', 'c5', 'c8'])
			expect(Game.WIN_SETS).toContainEqual(['c3', 'c6', 'c9'])
		})

		it('contains both diagonals', () => {
			expect(Game.WIN_SETS).toContainEqual(['c1', 'c5', 'c9'])
			expect(Game.WIN_SETS).toContainEqual(['c3', 'c5', 'c7'])
		})
	})

	describe('complete game scenarios', () => {
		let game, player1, player2

		beforeEach(() => {
			game = new Game()
			player1 = new Player(1, 'Player1', 'looking')
			player2 = new Player(2, 'Player2', 'looking')
			game.addPlayer(player1)
			game.addPlayer(player2)
		})

		it('x wins with top-left to bottom-right diagonal (c1-c5-c9)', () => {
			game.makeTurn(player1, 'c1') // x
			game.makeTurn(player2, 'c2') // o
			game.makeTurn(player1, 'c5') // x
			game.makeTurn(player2, 'c3') // o
			const result = game.makeTurn(player1, 'c9') // x wins

			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('x')
			expect(result.winningCells).toEqual(['c1', 'c5', 'c9'])
		})

		it('x wins with top-right to bottom-left diagonal (c3-c5-c7)', () => {
			game.makeTurn(player1, 'c3') // x
			game.makeTurn(player2, 'c1') // o
			game.makeTurn(player1, 'c5') // x
			game.makeTurn(player2, 'c2') // o
			const result = game.makeTurn(player1, 'c7') // x wins

			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('x')
			expect(result.winningCells).toEqual(['c3', 'c5', 'c7'])
		})

		it('o wins with diagonal (c1-c5-c9)', () => {
			game.makeTurn(player1, 'c2') // x
			game.makeTurn(player2, 'c1') // o
			game.makeTurn(player1, 'c3') // x
			game.makeTurn(player2, 'c5') // o
			game.makeTurn(player1, 'c7') // x
			const result = game.makeTurn(player2, 'c9') // o wins

			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('o')
			expect(result.winningCells).toEqual(['c1', 'c5', 'c9'])
		})

		it('o wins with diagonal (c3-c5-c7)', () => {
			game.makeTurn(player1, 'c1') // x
			game.makeTurn(player2, 'c3') // o
			game.makeTurn(player1, 'c2') // x
			game.makeTurn(player2, 'c5') // o
			game.makeTurn(player1, 'c9') // x
			const result = game.makeTurn(player2, 'c7') // o wins

			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('o')
			expect(result.winningCells).toEqual(['c3', 'c5', 'c7'])
		})

		it('x wins with first row', () => {
			game.makeTurn(player1, 'c1') // x
			game.makeTurn(player2, 'c4') // o
			game.makeTurn(player1, 'c2') // x
			game.makeTurn(player2, 'c5') // o
			const result = game.makeTurn(player1, 'c3') // x wins

			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('x')
			expect(result.winningCells).toEqual(['c1', 'c2', 'c3'])
		})

		it('x wins with middle row', () => {
			game.makeTurn(player1, 'c4') // x
			game.makeTurn(player2, 'c1') // o
			game.makeTurn(player1, 'c5') // x
			game.makeTurn(player2, 'c2') // o
			const result = game.makeTurn(player1, 'c6') // x wins

			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('x')
			expect(result.winningCells).toEqual(['c4', 'c5', 'c6'])
		})

		it('x wins with last row', () => {
			game.makeTurn(player1, 'c7') // x
			game.makeTurn(player2, 'c1') // o
			game.makeTurn(player1, 'c8') // x
			game.makeTurn(player2, 'c2') // o
			const result = game.makeTurn(player1, 'c9') // x wins

			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('x')
			expect(result.winningCells).toEqual(['c7', 'c8', 'c9'])
		})

		it('x wins with first column', () => {
			game.makeTurn(player1, 'c1') // x
			game.makeTurn(player2, 'c2') // o
			game.makeTurn(player1, 'c4') // x
			game.makeTurn(player2, 'c3') // o
			const result = game.makeTurn(player1, 'c7') // x wins

			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('x')
			expect(result.winningCells).toEqual(['c1', 'c4', 'c7'])
		})

		it('x wins with middle column', () => {
			game.makeTurn(player1, 'c2') // x
			game.makeTurn(player2, 'c1') // o
			game.makeTurn(player1, 'c5') // x
			game.makeTurn(player2, 'c3') // o
			const result = game.makeTurn(player1, 'c8') // x wins

			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('x')
			expect(result.winningCells).toEqual(['c2', 'c5', 'c8'])
		})

		it('x wins with last column', () => {
			game.makeTurn(player1, 'c3') // x
			game.makeTurn(player2, 'c1') // o
			game.makeTurn(player1, 'c6') // x
			game.makeTurn(player2, 'c2') // o
			const result = game.makeTurn(player1, 'c9') // x wins

			expect(result.gameOver).toBe(true)
			expect(result.winner).toBe('x')
			expect(result.winningCells).toEqual(['c3', 'c6', 'c9'])
		})

		it('game ends in draw with full board', () => {
			// x | o | x
			// x | o | o
			// o | x | x
			game.makeTurn(player1, 'c1') // x
			game.makeTurn(player2, 'c2') // o
			game.makeTurn(player1, 'c3') // x
			game.makeTurn(player2, 'c5') // o
			game.makeTurn(player1, 'c4') // x
			game.makeTurn(player2, 'c6') // o
			game.makeTurn(player1, 'c8') // x
			game.makeTurn(player2, 'c7') // o
			const result = game.makeTurn(player1, 'c9') // x - draw

			expect(result.gameOver).toBe(true)
			expect(result.isDraw).toBe(true)
			expect(result.winner).toBeNull()
			expect(result.winningCells).toBeNull()
		})

		it('does not switch turns after game over', () => {
			game.makeTurn(player1, 'c1') // x
			game.makeTurn(player2, 'c4') // o
			game.makeTurn(player1, 'c2') // x
			game.makeTurn(player2, 'c5') // o
			game.makeTurn(player1, 'c3') // x wins

			// currentTurn should still be 'x' (the winner's turn)
			expect(game.currentTurn).toBe('x')
		})

		it('rejects any moves after game over', () => {
			game.makeTurn(player1, 'c1')
			game.makeTurn(player2, 'c4')
			game.makeTurn(player1, 'c2')
			game.makeTurn(player2, 'c5')
			game.makeTurn(player1, 'c3') // x wins

			const result = game.makeTurn(player2, 'c6')
			expect(result.valid).toBe(false)
			expect(result.error).toBe('Game is not active')
		})
	})
})
