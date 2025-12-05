import React, { Component} from 'react'
import { Link } from 'react-router'
import app from 'ampersand-app'

import SetName from './SetName.jsx'
import GameMain from './GameMain.jsx'

export default class Ttt extends Component {

	constructor (props) {
		super(props)

		this.state = {
			game_step: 'main_menu',
			game_type: null
		}
	}

//	------------------------	------------------------	------------------------

	render () {

		const {game_step} = this.state

		console.log(game_step)

		return (
			<section id='TTT_game'>
				{game_step == 'main_menu' && this.renderMainMenu()}

				{game_step == 'set_name' && <SetName 
													onSetName={this.saveUserName.bind(this)}
													onBack={this.backToMenu.bind(this)}
											/>}

				{game_step == 'about' && this.renderAbout()}

				{game_step == 'start_game' && 
					<div>
						{app.settings.curr_user && app.settings.curr_user.name && 
							<h2>Welcome, {app.settings.curr_user.name}</h2>
						}
						<GameMain 
							game_type={this.state.game_type}
							onEndGame={this.gameEnd.bind(this)} 
						/>
					</div>
				}
			</section>
		)
	}

//	------------------------	------------------------	------------------------

	renderMainMenu () {
		return (
			<div id='MainMenu'>
				<div className='menu-center'>
					<h1 className='game-title'>Tic Tac Toe</h1>

					<div className='menu-options'>
						<button type='button' onClick={this.startSingleplayer.bind(this)} className='button long menu-btn'>
							<span>Singleplayer <span className='fa fa-user'></span></span>
						</button>

						<button type='button' onClick={this.startMultiplayer.bind(this)} className='button long menu-btn'>
							<span>Multiplayer <span className='fa fa-users'></span></span>
						</button>

						<button type='button' onClick={this.showAbout.bind(this)} className='button long menu-btn'>
							<span>About <span className='fa fa-info-circle'></span></span>
						</button>
					</div>
				</div>

				<p className='game-subtitle'>A simple Tic Tac Toe game demo built with React.js and Node.js</p>
			</div>
		)
	}

//	------------------------	------------------------	------------------------

	renderAbout () {
		return (
			<div id='AboutPage'>
				<h1>About</h1>
				
				<div className='about-content'>
					<h2>License</h2>
					<p>This project is licensed under <strong>Creative Commons</strong>.</p>
					
					<h2>Original Author</h2>
					<p>Originally created by <strong>Maxim Shklyar</strong> (<a href="https://github.com/xims/X-ttt" target="_blank" rel="noopener noreferrer">xims</a>)</p>
					<p>kisla interactive — <a href="http://www.kisla.com" target="_blank" rel="noopener noreferrer">kisla.com</a></p>
				
					<p>All rights reserved.</p>
					<p>This is a demonstration project for educational purposes only.</p>
				</div>

				<button type='button' onClick={this.backToMenu.bind(this)} className='button'>
					<span><span className='fa fa-caret-left'></span> Back</span>
				</button>
			</div>
		)
	}

//	------------------------	------------------------	------------------------

	startSingleplayer () {
		app.settings.curr_user = { name: 'Player' }
		this.setState({
			game_type: 'comp',
			game_step: 'start_game'
		})
	}

//	------------------------	------------------------	------------------------

	startMultiplayer () {
		this.setState({
			game_type: 'live',
			game_step: 'set_name'
		})
	}

//	------------------------	------------------------	------------------------

	showAbout () {
		this.setState({
			game_step: 'about'
		})
	}

//	------------------------	------------------------	------------------------

	backToMenu () {
		this.setState({
			game_step: 'main_menu',
			game_type: null
		})
	}

//	------------------------	------------------------	------------------------

	saveUserName (n) {
		app.settings.curr_user = {}
		app.settings.curr_user.name = n

		this.setState({
			game_step: 'start_game'
		})
	}

//	------------------------	------------------------	------------------------

	gameEnd (t) {
		this.setState({
			game_type: null,
			game_step: 'main_menu'
		})
		app.settings.curr_user = null
	}

}

//	------------------------	------------------------	------------------------

Ttt.propTypes = {
	params: React.PropTypes.any
}

Ttt.contextTypes = {
  router: React.PropTypes.object.isRequired
}