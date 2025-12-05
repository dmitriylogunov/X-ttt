const path = require('path')
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const registerGameHandlers = require('./XtttGame')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: '*'
	}
})

const port = process.env.PORT || 3001

app.use(express.static(path.join(__dirname, 'public')))

// Catch-all: serve index.html for client-side routing
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

registerGameHandlers(io)

server.listen(port, () => {
	console.log('Server listening at port %d', port)
})
