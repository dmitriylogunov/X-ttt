const util = require('util')
const Player = require('./Player')

let nextUid = 1

const generateUid = () => nextUid++

const removePlayerFrom = (collection, player) => {
	const idx = collection.indexOf(player)
	if (idx >= 0) {
		collection.splice(idx, 1)
	}
}

const createGame = (io) => {
	const players = []
	const availablePlayers = []

	const pairAvailablePlayers = () => {
		if (availablePlayers.length < 2) {
			return
		}

		const p1 = availablePlayers.shift()
		const p2 = availablePlayers.shift()

		p1.mode = 'm'
		p2.mode = 's'
		p1.status = 'paired'
		p2.status = 'paired'
		p1.opp = p2
		p2.opp = p1

		io.to(p1.sockid).emit('pair_players', { opp: { name: p2.name, uid: p2.uid }, mode: 'm' })
		io.to(p2.sockid).emit('pair_players', { opp: { name: p1.name, uid: p1.uid }, mode: 's' })

		util.log(`connect_new_players - uidM:${p1.uid} (${p1.name})  ++  uidS: ${p2.uid} (${p2.name})`)
	}

	const onNewPlayer = (socket, data = {}) => {
		const playerName = data.name || 'Player'
		const newPlayer = new Player(generateUid(), playerName, 'looking')
		newPlayer.sockid = socket.id
		socket.player = newPlayer

		players.push(newPlayer)
		availablePlayers.push(newPlayer)

		util.log(`New player has joined: ${playerName}`)
		pairAvailablePlayers()
	}

	const onTurn = (socket, data = {}) => {
		if (!socket.player || !socket.player.opp) {
			return
		}

		io.to(socket.player.opp.sockid).emit('opp_turn', { cell_id: data.cell_id })
		util.log(`turn  --  usr:${socket.player.mode} - :${socket.player.name}  --  cell_id:${data.cell_id}`)
	}

	const onClientDisconnect = (socket) => {
		const player = socket.player
		if (!player) {
			return
		}

		removePlayerFrom(players, player)
		removePlayerFrom(availablePlayers, player)

		if (player.opp) {
			player.opp.status = 'looking'
			player.opp.opp = null
			if (!availablePlayers.includes(player.opp)) {
				availablePlayers.push(player.opp)
			}
		}

		util.log(`Player has disconnected: ${socket.id}`)
		pairAvailablePlayers()
	}

	return (socket) => {
		util.log(`New game player has connected: ${socket.id}`)

		socket.on('new player', (data) => onNewPlayer(socket, data))
		socket.on('ply_turn', (data) => onTurn(socket, data))
		socket.on('disconnect', () => onClientDisconnect(socket))
	}
}

module.exports = (io) => {
	const registerHandlers = createGame(io)
	io.on('connection', registerHandlers)
}
