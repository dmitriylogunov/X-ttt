import React, {Component} from 'react'

export default class SetName extends Component {

	constructor (props) {
		super(props)

		this.state = {
			name: props.savedName || ''
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
			this.goBack(e)
		}
	}

//	------------------------	------------------------	------------------------

	handleInputKeyDown (e) {
		if (e.key === 'Enter') {
			this.saveName(e)
		}
	}

//	------------------------	------------------------	------------------------

	render () {
		return (
			<div id='SetName'>

				<h1>Enter Your Name</h1>

				<div className='input_holder'>
					<input 
						type='text' 
						className='input name' 
						placeholder='Your name'
						value={this.state.name}
						onChange={this.handleNameChange.bind(this)}
						onKeyDown={this.handleInputKeyDown.bind(this)}
						autoFocus
					/>
				</div>

				<div className='button-row'>
					<button type='button' onClick={this.goBack.bind(this)} className='button back-btn'>
						<span><span className='fa fa-caret-left'></span> Back</span>
					</button>

					<button type='submit' onClick={this.saveName.bind(this)} className='button'>
						<span>Start Game <span className='fa fa-caret-right'></span></span>
					</button>
				</div>

			</div>
		)
	}

//	------------------------	------------------------	------------------------

	handleNameChange (e) {
		this.setState({ name: e.target.value })
	}

//	------------------------	------------------------	------------------------

	saveName (e) {
		const name = this.state.name.trim()
		if (name) {
			this.props.onSetName(name)
		}
	}

//	------------------------	------------------------	------------------------

	goBack (e) {
		if (this.props.onBack) {
			this.props.onBack()
		}
	}

}
