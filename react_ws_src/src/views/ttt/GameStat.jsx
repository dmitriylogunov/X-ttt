import React from 'react'

const GameStat = ({ gameType, gameStat, gamePlay, nextTurnPly, onRetry, onEndGame }) => {
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

	const showRetryButton = gameStat === 'Waiting timed out' || 
		gameStat === 'Error' || 
		gameStat === 'Opponent disconnected' ||
		gameStat === 'Server Full'

	const showBackButton = gameStat === 'Game disconnected due to inactivity'

	return (
		<div id="game_stat">
			<div id="game_stat_msg">{getDisplayMessage()}</div>
			{showRetryButton && onRetry && (
				<button type="button" onClick={onRetry} className="button retry-button">
					<span>Try Again</span>
				</button>
			)}
			{showBackButton && onEndGame && (
				<button type="button" onClick={onEndGame} className="button retry-button">
					<span><span className='fa fa-caret-left'></span> Back</span>
				</button>
			)}
		</div>
	)
}

export default GameStat
