import React from 'react'

// Mock the GameStat logic for testing without React rendering
const getDisplayMessage = (gameType, gameStat, gamePlay, nextTurnPly) => {
	const turnMsg = nextTurnPly ? 'Your turn' : 'Opponent turn'
	
	if (gameType !== 'live') {
		// Singleplayer: show turn_msg when stat is "Start game" or "Play"
		if (gameStat === 'Start game' || gameStat === 'Play') {
			return gamePlay ? turnMsg : gameStat
		}
		return gameStat
	} else {
		// Multiplayer: show turn_msg when stat starts with "Playing with"
		if (gameStat.startsWith('Playing with')) {
			return turnMsg
		}
		return gameStat
	}
}

describe('GameStat logic', () => {
	describe('Singleplayer mode', () => {
		const gameType = 'computer'

		it('shows "Start game" when game not started and stat is "Start game"', () => {
			expect(getDisplayMessage(gameType, 'Start game', false, true)).toBe('Start game')
		})

		it('shows "Your turn" when game is playing and stat is "Start game"', () => {
			expect(getDisplayMessage(gameType, 'Start game', true, true)).toBe('Your turn')
		})

		it('shows "Opponent turn" when game is playing, stat is "Play", and not player turn', () => {
			expect(getDisplayMessage(gameType, 'Play', true, false)).toBe('Opponent turn')
		})

		it('shows "Your turn" when game is playing and stat is "Play"', () => {
			expect(getDisplayMessage(gameType, 'Play', true, true)).toBe('Your turn')
		})

		it('shows "You win" when player wins', () => {
			expect(getDisplayMessage(gameType, 'You win', false, true)).toBe('You win')
		})

		it('shows "Opponent win" when opponent wins', () => {
			expect(getDisplayMessage(gameType, 'Opponent win', false, false)).toBe('Opponent win')
		})

		it('shows "Draw" when game is a draw', () => {
			expect(getDisplayMessage(gameType, 'Draw', false, true)).toBe('Draw')
		})
	})

	describe('Multiplayer mode', () => {
		const gameType = 'live'

		it('shows "Connecting" when connecting', () => {
			expect(getDisplayMessage(gameType, 'Connecting', false, true)).toBe('Connecting')
		})

		it('shows "Waiting for opponent" after connection established', () => {
			expect(getDisplayMessage(gameType, 'Waiting for opponent', false, true)).toBe('Waiting for opponent')
		})

		it('shows "Error" when connection fails', () => {
			expect(getDisplayMessage(gameType, 'Error', false, true)).toBe('Error')
		})

		it('shows "Your turn" when playing with opponent and it is player turn', () => {
			expect(getDisplayMessage(gameType, 'Playing with John', true, true)).toBe('Your turn')
		})

		it('shows "Opponent turn" when playing with opponent and it is opponent turn', () => {
			expect(getDisplayMessage(gameType, 'Playing with John', true, false)).toBe('Opponent turn')
		})

		it('shows "You win" when player wins', () => {
			expect(getDisplayMessage(gameType, 'You win', false, true)).toBe('You win')
		})

		it('shows "Opponent win" when opponent wins', () => {
			expect(getDisplayMessage(gameType, 'Opponent win', false, false)).toBe('Opponent win')
		})

		it('shows "Draw" when game is a draw', () => {
			expect(getDisplayMessage(gameType, 'Draw', false, true)).toBe('Draw')
		})
	})
})
