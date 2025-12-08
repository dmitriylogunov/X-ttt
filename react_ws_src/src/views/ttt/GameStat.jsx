import React from 'react'

const GameStat = ({ gameType, gameStat, gamePlay, nextTurnPly }) => {
	const getDisplayMessage = () => {
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

	return (
		<div id="game_stat">
			<div id="game_stat_msg">{getDisplayMessage()}</div>
		</div>
	)
}

export default GameStat
