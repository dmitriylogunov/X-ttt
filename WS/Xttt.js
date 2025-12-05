const path = require('path')
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const registerGameHandlers = require('./XtttGame')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	},
	// Allow both transports for better compatibility with platforms like Render
	transports: ['websocket', 'polling'],
	// Be explicit about path
	path: '/socket.io/'
})

const port = process.env.PORT || 3001

// Health check endpoint for Render
app.get('/health', (req, res) => {
	res.status(200).send('OK')
})

app.use(express.static(path.join(__dirname, 'public')))

// Catch-all: serve index.html for client-side routing
// Note: Socket.IO attaches to the http server, not Express, so it handles /socket.io before this
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

registerGameHandlers(io)

server.listen(port, '0.0.0.0', () => {
	console.log('Server listening at port %d', port)
})
