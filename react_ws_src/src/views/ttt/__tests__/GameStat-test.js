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

// Logic for showing retry button
const shouldShowRetryButton = (gameStat) => {
	return gameStat === 'Waiting timed out' || 
		gameStat === 'Error' || 
		gameStat === 'Opponent disconnected' ||
		gameStat === 'Server Full'
}

// Logic for showing back button (inactivity disconnect)
const shouldShowBackButton = (gameStat) => {
	return gameStat === 'Game disconnected due to inactivity'
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

		it('shows "Waiting for the opponent" after connection established', () => {
			expect(getDisplayMessage(gameType, 'Waiting for the opponent', false, true)).toBe('Waiting for the opponent')
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

	describe('Retry button visibility', () => {
		it('shows retry button when waiting timed out', () => {
			expect(shouldShowRetryButton('Waiting timed out')).toBe(true)
		})

		it('shows retry button on error', () => {
			expect(shouldShowRetryButton('Error')).toBe(true)
		})

		it('shows retry button when opponent disconnected', () => {
			expect(shouldShowRetryButton('Opponent disconnected')).toBe(true)
		})

		it('shows retry button when server is full', () => {
			expect(shouldShowRetryButton('Server Full')).toBe(true)
		})

		it('does not show retry button when waiting for opponent', () => {
			expect(shouldShowRetryButton('Waiting for the opponent')).toBe(false)
		})

		it('does not show retry button when connecting', () => {
			expect(shouldShowRetryButton('Connecting')).toBe(false)
		})

		it('does not show retry button when playing', () => {
			expect(shouldShowRetryButton('Playing with John')).toBe(false)
		})

		it('does not show retry button on win/loss', () => {
			expect(shouldShowRetryButton('You win')).toBe(false)
			expect(shouldShowRetryButton('Opponent win')).toBe(false)
		})

		it('does not show retry button on inactivity disconnect (shows back instead)', () => {
			expect(shouldShowRetryButton('Game disconnected due to inactivity')).toBe(false)
		})
	})

	describe('Back button visibility (inactivity disconnect)', () => {
		it('shows back button when game disconnected due to inactivity', () => {
			expect(shouldShowBackButton('Game disconnected due to inactivity')).toBe(true)
		})

		it('does not show back button for other states', () => {
			expect(shouldShowBackButton('Waiting timed out')).toBe(false)
			expect(shouldShowBackButton('Error')).toBe(false)
			expect(shouldShowBackButton('Opponent disconnected')).toBe(false)
			expect(shouldShowBackButton('Playing with John')).toBe(false)
		})
	})
})
