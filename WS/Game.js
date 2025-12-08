/**************************************************
** GAME CLASS - Server-side game state
**************************************************/

const generateGameCode = () => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	let code = ''
	for (let i = 0; i < 4; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return code
}

class Game {
	constructor() {
		this.code = generateGameCode()
		this.field = {
			c1: null, c2: null, c3: null,
			c4: null, c5: null, c6: null,
			c7: null, c8: null, c9: null
		}
		this.players = [] // [player1, player2] - player1 is 'x', player2 is 'o'
		this.currentTurn = 'x' // 'x' always starts
		this.status = 'waiting' // 'waiting', 'playing', 'finished'
		this.winner = null // null, 'x', 'o', or 'draw'
		this.winningCells = null // Array of winning cell IDs or null
	}

	// Winning combinations
	static WIN_SETS = [
		['c1', 'c2', 'c3'],
		['c4', 'c5', 'c6'],
		['c7', 'c8', 'c9'],
		['c1', 'c4', 'c7'],
		['c2', 'c5', 'c8'],
		['c3', 'c6', 'c9'],
		['c1', 'c5', 'c9'],
		['c3', 'c5', 'c7']
	]

	addPlayer(player) {
		if (this.players.length >= 2) {
			return false
		}
		this.players.push(player)
		player.game = this
		
		// First player is 'x' (master), second is 'o' (slave)
		player.symbol = this.players.length === 1 ? 'x' : 'o'
		player.mode = this.players.length === 1 ? 'm' : 's'
		
		if (this.players.length === 2) {
			this.status = 'playing'
		}
		return true
	}

	removePlayer(player) {
		const idx = this.players.indexOf(player)
		if (idx >= 0) {
			this.players.splice(idx, 1)
			player.game = null
			player.symbol = null
		}
	}

	isFull() {
		return this.players.length >= 2
	}

	isEmpty() {
		return this.players.length === 0
	}

	getOpponent(player) {
		return this.players.find(p => p !== player) || null
	}

	/**
	 * Validate and apply a turn
	 * @param {Player} player - The player making the turn
	 * @param {string} cellId - The cell ID (c1-c9)
	 * @returns {{ valid: boolean, error?: string, gameOver?: boolean, winner?: string|null, winningCells?: string[]|null, isDraw?: boolean }}
	 */
	makeTurn(player, cellId) {
		// Check if game is active
		if (this.status !== 'playing') {
			return { valid: false, error: 'Game is not active' }
		}

		// Check if it's this player's turn
		if (player.symbol !== this.currentTurn) {
			return { valid: false, error: 'Not your turn' }
		}

		// Validate cell ID format
		if (!cellId || !this.field.hasOwnProperty(cellId)) {
			return { valid: false, error: 'Invalid cell' }
		}

		// Check if cell is free
		if (this.field[cellId] !== null) {
			return { valid: false, error: 'Invalid turn' }
		}

		// Apply the turn
		this.field[cellId] = player.symbol
		
		// Check for winner
		const winResult = this.checkWinner()
		if (winResult.gameOver) {
			this.status = 'finished'
			this.winner = winResult.winner
			this.winningCells = winResult.winningCells
			return { 
				valid: true, 
				gameOver: true, 
				winner: winResult.winner, 
				winningCells: winResult.winningCells,
				isDraw: winResult.isDraw
			}
		}

		// Switch turn
		this.currentTurn = this.currentTurn === 'x' ? 'o' : 'x'

		return { valid: true, gameOver: false }
	}

	/**
	 * Check if there's a winner or draw
	 * @returns {{ gameOver: boolean, winner?: string|null, winningCells?: string[]|null, isDraw?: boolean }}
	 */
	checkWinner() {
		// Check all winning combinations
		for (const set of Game.WIN_SETS) {
			const [c1, c2, c3] = set
			if (this.field[c1] && 
				this.field[c1] === this.field[c2] && 
				this.field[c1] === this.field[c3]) {
				return { 
					gameOver: true, 
					winner: this.field[c1], 
					winningCells: set,
					isDraw: false
				}
			}
		}

		// Check for draw (all cells filled, no winner)
		const allFilled = Object.values(this.field).every(cell => cell !== null)
		if (allFilled) {
			return { gameOver: true, winner: null, winningCells: null, isDraw: true }
		}

		return { gameOver: false }
	}

	/**
	 * Get game state for serialization
	 */
	toJSON() {
		return {
			code: this.code,
			field: this.field,
			currentTurn: this.currentTurn,
			status: this.status,
			playerCount: this.players.length,
			winner: this.winner,
			winningCells: this.winningCells
		}
	}
}

module.exports = Game
module.exports.generateGameCode = generateGameCode
