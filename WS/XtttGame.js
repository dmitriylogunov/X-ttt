const Player = require('./Player')
const Game = require('./Game')

// Maximum number of concurrent games
const MAX_CONCURRENT_GAMES = 2

let nextUid = 1

const generateUid = () => nextUid++

const removePlayerFrom = (collection, player) => {
	const idx = collection.indexOf(player)
	if (idx >= 0) {
		collection.splice(idx, 1)
	}
}

const createGameManager = (io) => {
	const players = []
	const games = [] // Active games

	/**
	 * Find a game that's waiting for a second player, or create a new one
	 * @returns {Game|null} - Returns a game or null if server is full
	 */
	const findOrCreateGame = () => {
		// First, try to find a game waiting for a second player
		const waitingGame = games.find(g => !g.isFull() && g.status === 'waiting')
		if (waitingGame) {
			return waitingGame
		}

		// Check if we can create a new game
		if (games.length >= MAX_CONCURRENT_GAMES) {
			// Check if any game is actually empty and can be reused
			const emptyGame = games.find(g => g.isEmpty())
			if (emptyGame) {
				removeGameFromList(emptyGame)
			} else {
				return null // Server is full
			}
		}

		// Create a new game
		const newGame = new Game()
		games.push(newGame)
		console.log(`New game created: ${newGame.code}`)
		return newGame
	}

	const removeGameFromList = (game) => {
		const idx = games.indexOf(game)
		if (idx >= 0) {
			games.splice(idx, 1)
			console.log(`Game removed: ${game.code}`)
		}
	}

	/**
	 * Start the game when both players are ready
	 */
	const startGameIfReady = (game) => {
		if (!game.isFull()) {
			return
		}

		const [p1, p2] = game.players
		p1.status = 'paired'
		p2.status = 'paired'
		p1.opp = p2
		p2.opp = p1

		io.to(p1.sockid).emit('pair_players', { 
			opp: { name: p2.name, uid: p2.uid }, 
			mode: p1.mode,
			symbol: p1.symbol,
			gameCode: game.code
		})
		io.to(p2.sockid).emit('pair_players', { 
			opp: { name: p1.name, uid: p1.uid }, 
			mode: p2.mode,
			symbol: p2.symbol,
			gameCode: game.code
		})

		console.log(`Game ${game.code} started - ${p1.name} (${p1.symbol}) vs ${p2.name} (${p2.symbol})`)
	}

	const onNewPlayer = (socket, data = {}) => {
		const playerName = data.name || 'Guest'
		const newPlayer = new Player(generateUid(), playerName, 'looking')
		newPlayer.sockid = socket.id
		socket.player = newPlayer

		// Try to find or create a game
		const game = findOrCreateGame()
		
		if (!game) {
			// Server is full
			io.to(socket.id).emit('server_full', { message: 'Server Full' })
			console.log(`Server full - player ${playerName} rejected`)
			return
		}

		players.push(newPlayer)
		game.addPlayer(newPlayer)

		console.log(`New player has joined: ${playerName} (game: ${game.code})`)
		
		startGameIfReady(game)
	}

	const onTurn = (socket, data = {}) => {
		const player = socket.player
		if (!player || !player.game || !player.opp) {
			console.log('Turn rejected - missing player, game, or opponent')
			return
		}

		const game = player.game
		console.log(`Processing turn: ${player.name} (${player.symbol}) plays ${data.cell_id}`)
		console.log(`Game field before turn:`, JSON.stringify(game.field))
		
		const result = game.makeTurn(player, data.cell_id)
		console.log(`Turn result:`, JSON.stringify(result))

		if (!result.valid) {
			// Send error back to the player
			io.to(socket.id).emit('turn_error', { error: result.error })
			console.log(`Invalid turn by ${player.name}: ${result.error}`)
			return
		}

		// Send the turn to the opponent
		io.to(player.opp.sockid).emit('opp_turn', { cell_id: data.cell_id })
		console.log(`turn  --  game:${game.code}  --  ${player.name} (${player.symbol})  --  cell_id:${data.cell_id}`)

		// Check if game is over
		if (result.gameOver) {
			console.log(`Game over detected! Winner: ${result.winner}, Cells: ${result.winningCells}`)
			const opponent = player.opp
			
			if (result.isDraw) {
				// It's a draw
				const drawData = {
					result: 'draw',
					message: 'Draw',
					winningCells: null
				}
				io.to(socket.id).emit('game_over', drawData)
				io.to(opponent.sockid).emit('game_over', drawData)
				console.log(`game_over  --  game:${game.code}  --  DRAW`)
			} else {
				// We have a winner - the player who just made the turn
				console.log(`Sending game_over to winner (${socket.id}) and loser (${opponent.sockid})`)
				io.to(socket.id).emit('game_over', {
					result: 'win',
					message: "You're the winner",
					winningCells: result.winningCells
				})
				io.to(opponent.sockid).emit('game_over', {
					result: 'lose',
					message: 'You have lost, try again',
					winningCells: result.winningCells
				})
				console.log(`game_over  --  game:${game.code}  --  WINNER: ${player.name} (${player.symbol})`)
			}

			// Clean up the game
			removeGameFromList(game)
		}
	}

	const onClientDisconnect = (socket) => {
		const player = socket.player
		if (!player) {
			return
		}

		const game = player.game

		// Notify opponent about disconnect
		if (player.opp) {
			io.to(player.opp.sockid).emit('opponent_disconnected', { 
				message: 'Opponent disconnected' 
			})
			
			// Clean up opponent's state
			player.opp.status = 'looking'
			player.opp.opp = null
		}

		// Remove player from game
		if (game) {
			game.removePlayer(player)
			
			// If game is empty, remove it
			if (game.isEmpty()) {
				removeGameFromList(game)
			}
		}

		// Remove player from global list
		removePlayerFrom(players, player)

		console.log(`Player has disconnected: ${player.name} (${socket.id})`)
	}

	return (socket) => {
		console.log(`New game player has connected: ${socket.id}`)

		socket.on('new player', (data) => onNewPlayer(socket, data))
		socket.on('ply_turn', (data) => onTurn(socket, data))
		socket.on('disconnect', () => onClientDisconnect(socket))
	}
}

// Export for testing
module.exports = (io) => {
	const registerHandlers = createGameManager(io)
	io.on('connection', registerHandlers)
}

module.exports.MAX_CONCURRENT_GAMES = MAX_CONCURRENT_GAMES
