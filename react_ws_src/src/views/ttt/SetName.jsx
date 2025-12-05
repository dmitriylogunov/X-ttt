import React, {Component} from 'react'

export default class SetName extends Component {

	constructor (props) {
		super(props)

		this.state = {
			name: props.savedName || ''
		}
	}

//	------------------------	------------------------	------------------------

	render () {
		return (
			<div id='SetName'>

				<h1>Enter Your Name</h1>

				<div className='input_holder left'>
					<label>Name </label>
					<input 
						type='text' 
						className='input name' 
						placeholder='Enter your name'
						value={this.state.name}
						onChange={this.handleNameChange.bind(this)}
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
