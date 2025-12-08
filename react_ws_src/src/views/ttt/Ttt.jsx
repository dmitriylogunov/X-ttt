import React, { Component } from 'react'
import app from 'ampersand-app'

import SetName from './SetName.jsx'
import GameMain from './GameMain.jsx'
import MainMenu from './MainMenu.jsx'
import About from './About.jsx'

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

		this.handleKeyDown = this.handleKeyDown.bind(this)
	}

//	------------------------	------------------------	------------------------

	componentDidMount () {
		document.addEventListener('keydown', this.handleKeyDown)
	}

//	------------------------	------------------------	------------------------

	componentWillUnmount () {
		document.removeEventListener('keydown', this.handleKeyDown)
	}

//	------------------------	------------------------	------------------------

	handleKeyDown (e) {
		if (e.key === 'Escape') {
			const path = this.getCurrentPath()
			if (path !== '/') {
				this.goToMenu()
			}
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
			
			if (!needsName) {
				// Show name input (pre-filled with saved name if exists)
				return (
					<section id='TTT_game'>
						<SetName 
							onSetName={this.handleSetName.bind(this)}
							onBack={this.goToMenu.bind(this)}
							savedName={savedName || ''}
						/>
					</section>
				)
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
					<About onBack={this.goToMenu.bind(this)} />
				</section>
			)
		}

		// Default: main menu
		return (
			<section id='TTT_game'>
				<MainMenu onNavigate={this.navigate.bind(this)} />
			</section>
		)
	}

//	------------------------	------------------------	------------------------

	navigate (path) {
		// Reset needsName when navigating to /multi so name input is always shown
		if (path === '/multi') {
			this.setState({ needsName: false })
		}
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
