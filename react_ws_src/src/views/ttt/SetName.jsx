import React, {Component} from 'react'

export default class SetName extends Component {

	constructor (props) {
		super(props)

		this.state = {}
	}

//	------------------------	------------------------	------------------------

	render () {
		return (
			<div id='SetName'>

				<h1>Enter Your Name</h1>

				<div ref='nameHolder' className='input_holder left'>
					<label>Name </label>
					<input ref='name' type='text' className='input name' placeholder='Enter your name' />
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

	saveName (e) {
		const name = this.refs.name.value.trim()
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
