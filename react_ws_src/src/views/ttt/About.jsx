import React, { Component } from 'react'

export default class About extends Component {

	render () {
		const { onBack } = this.props

		return (
			<div id='AboutPage'>
				<h1>About</h1>
				
				<div className='about-content'>
					<h2>License</h2>
					<p>This project is licensed under <strong>Creative Commons</strong>.</p>
					<p>Created by <a href="https://dmitriylogunov.info">Dmitriy Logunov</a>.</p>
					
					<h2>Original Author</h2>
					<p>Originally created by <strong>Maxim Shklyar</strong> (<a href="https://github.com/xims/X-ttt" target="_blank" rel="noopener noreferrer">xims</a>)</p>
					<p>kisla interactive — <a href="http://www.kisla.com" target="_blank" rel="noopener noreferrer">kisla.com</a></p>
				
					<p>All rights reserved.</p>
					<p>This is a demonstration project for educational purposes only.</p>
				</div>

				<button type='button' onClick={onBack} className='button'>
					<span><span className='fa fa-caret-left'></span> Back</span>
				</button>
			</div>
		)
	}

}

About.propTypes = {
	onBack: React.PropTypes.func.isRequired
}
