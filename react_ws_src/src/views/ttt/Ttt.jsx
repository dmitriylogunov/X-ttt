import React, { Component } from 'react'
import app from 'ampersand-app'

import SetName from './SetName.jsx'
import GameMain from './GameMain.jsx'

const STORAGE_KEY = 'ttt_player_name'

export default class Ttt extends Component {

	constructor (props, context) {
		super(props, context)

		// Load saved name from localStorage
		const savedName = localStorage.getItem(STORAGE_KEY)
		if (savedName) {
			app.settings.curr_user = { name: savedName }
		}

		this.state = {
			needsName: false
		}
	}

//	------------------------	------------------------	------------------------

	getCurrentPath () {
		// Get path from context router or window.location
		if (this.context.router && this.context.router.location) {
			return this.context.router.location.pathname
		}
		// Fallback: parse from window.location
		const base = (typeof __BASE__ !== 'undefined' && __BASE__) || ''
		let path = window.location.pathname
		if (base && path.startsWith(base)) {
			path = path.slice(base.length) || '/'
		}
		return path
	}

//	------------------------	------------------------	------------------------

	render () {
		const path = this.getCurrentPath()
		const { needsName } = this.state

		// Route: /single
		if (path === '/single') {
			app.settings.curr_user = { name: localStorage.getItem(STORAGE_KEY) || 'Player' }
			return (
				<section id='TTT_game'>
					<div>
						<h2>Welcome, {app.settings.curr_user.name}</h2>
						<GameMain 
							game_type='comp'
							onEndGame={this.handleGameEnd.bind(this)} 
						/>
					</div>
				</section>
			)
		}

		// Route: /multi
		if (path === '/multi') {
			const savedName = localStorage.getItem(STORAGE_KEY)
			
			if (!savedName && !needsName) {
				// Show name input
				return (
					<section id='TTT_game'>
						<SetName 
							onSetName={this.handleSetName.bind(this)}
							onBack={this.goToMenu.bind(this)}
							savedName=''
						/>
					</section>
				)
			}
			
			if (savedName) {
				app.settings.curr_user = { name: savedName }
			}
			
			return (
				<section id='TTT_game'>
					<div>
						<h2>Welcome, {app.settings.curr_user.name}</h2>
						<GameMain 
							game_type='live'
							onEndGame={this.handleGameEnd.bind(this)} 
						/>
					</div>
				</section>
			)
		}

		// Route: /about
		if (path === '/about') {
			return (
				<section id='TTT_game'>
					{this.renderAbout()}
				</section>
			)
		}

		// Default: main menu
		return (
			<section id='TTT_game'>
				{this.renderMainMenu()}
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
						<button 
							type='button' 
							onClick={() => this.navigate('/single')} 
							className='button long menu-btn'
						>
							<span>Singleplayer <span className='fa fa-user'></span></span>
						</button>

						<button 
							type='button' 
							onClick={() => this.navigate('/multi')} 
							className='button long menu-btn'
						>
							<span>Multiplayer <span className='fa fa-users'></span></span>
						</button>

						<button 
							type='button' 
							onClick={() => this.navigate('/about')} 
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

				<button type='button' onClick={this.goToMenu.bind(this)} className='button'>
					<span><span className='fa fa-caret-left'></span> Back</span>
				</button>
			</div>
		)
	}

//	------------------------	------------------------	------------------------

	navigate (path) {
		if (this.context.router) {
			this.context.router.push(path)
		} else if (app.history) {
			app.history.push(path)
		}
		// Force re-render
		this.forceUpdate()
	}

//	------------------------	------------------------	------------------------

	goToMenu () {
		this.setState({ needsName: false })
		this.navigate('/')
	}

//	------------------------	------------------------	------------------------

	handleSetName (name) {
		// Save to localStorage
		localStorage.setItem(STORAGE_KEY, name)
		app.settings.curr_user = { name }
		this.setState({ needsName: true })
	}

//	------------------------	------------------------	------------------------

	handleGameEnd () {
		this.navigate('/')
	}

}

//	------------------------	------------------------	------------------------

Ttt.propTypes = {
	params: React.PropTypes.any
}

Ttt.contextTypes = {
	router: React.PropTypes.object.isRequired
}
