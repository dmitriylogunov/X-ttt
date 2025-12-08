import React, { Component } from 'react'

export default class MainMenu extends Component {

	render () {
		const { onNavigate } = this.props

		return (
			<div id='MainMenu'>
				<div className='menu-center'>
					<h1 className='game-title'>Tic Tac Toe</h1>

					<div className='menu-options'>
						<button 
							type='button' 
							onClick={() => onNavigate('/single')} 
							className='button long menu-btn'
						>
							<span>Singleplayer <span className='fa fa-user'></span></span>
						</button>

						<button 
							type='button' 
							onClick={() => onNavigate('/multi')} 
							className='button long menu-btn'
						>
							<span>Multiplayer <span className='fa fa-users'></span></span>
						</button>

						<button 
							type='button' 
							onClick={() => onNavigate('/about')} 
							className='button long menu-btn'
						>
							<span>About <span className='fa fa-info-circle'></span></span>
						</button>
					</div>
				</div>

				<p className='game-subtitle'>A simple Tic Tac Toe game demo built with React.js and Node.js</p>
			</div>
		)
	}

}

MainMenu.propTypes = {
	onNavigate: React.PropTypes.func.isRequired
}
