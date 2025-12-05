import React, { Component} from 'react'
import MainContent from './layouts/MainContent.jsx'

export default class Main extends Component {

	render () {
		const { popup, mainContent } = this.props
			
		return (
			<div style={fullHeight}>
				<MainContent>
					{ mainContent }
				</MainContent>
				{ popup }
			</div>
		)
	}
}

// property validation
Main.propTypes = {
	mainContent: React.PropTypes.object,
	bottom: React.PropTypes.object,
	popup: React.PropTypes.object
}

// full height
const fullHeight = {
	height: '100%'
}
