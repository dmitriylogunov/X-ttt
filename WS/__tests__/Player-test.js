const Player = require('../Player')

describe('Player', () => {
	describe('constructor', () => {
		it('creates a player with the provided uid, name, and status', () => {
			const player = new Player(1, 'TestPlayer', 'looking')
			
			expect(player.uid).toBe(1)
			expect(player.name).toBe('TestPlayer')
			expect(player.status).toBe('looking')
		});

		it('initializes sockid as null', () => {
			const player = new Player(1, 'TestPlayer', 'looking')
			expect(player.sockid).toBeNull()
		});

		it('initializes socket as null', () => {
			const player = new Player(1, 'TestPlayer', 'looking')
			expect(player.socket).toBeNull()
		});

		it('initializes mode as null', () => {
			const player = new Player(1, 'TestPlayer', 'looking')
			expect(player.mode).toBeNull()
		});

		it('initializes opp as null', () => {
			const player = new Player(1, 'TestPlayer', 'looking')
			expect(player.opp).toBeNull()
		});
	});

	describe('property assignment', () => {
		it('allows setting sockid', () => {
			const player = new Player(1, 'TestPlayer', 'looking')
			player.sockid = 'socket-123'
			expect(player.sockid).toBe('socket-123')
		});

		it('allows setting mode', () => {
			const player = new Player(1, 'TestPlayer', 'looking')
			player.mode = 'm'
			expect(player.mode).toBe('m')
		});

		it('allows setting opp to another player', () => {
			const player1 = new Player(1, 'Player1', 'looking')
			const player2 = new Player(2, 'Player2', 'looking')
			player1.opp = player2
			expect(player1.opp).toBe(player2)
		});

		it('allows updating status', () => {
			const player = new Player(1, 'TestPlayer', 'looking')
			player.status = 'paired'
			expect(player.status).toBe('paired')
		});
	});
});
