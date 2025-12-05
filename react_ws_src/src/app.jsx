import React from 'react'
import app from 'ampersand-app'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router'
import { createHistory } from 'history'
import ga from 'react-ga'

import './sass/main.scss'

import Main from './views/Main.jsx'

import Ttt from './views/ttt/Ttt.jsx'

import Txt_page from './views/pages/Txt_page.jsx'
import PopUp_page from './views/pages/PopUp_page.jsx'

import Contact from './views/pages/Contact.jsx'
import ErrorPage from './views/pages/ErrorPage.jsx'

import prep_env from './models/prep_env'

let historyRef = null

const createAppHistory = () => {
	const baseDir = (import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/'
	const normalizedBase = baseDir === '/' ? '/' : baseDir.replace(/\/$/, '') || '/'
	return useRouterHistory(createHistory)({
		basename: normalizedBase
	})
}

const renderSite = (historyInstance) => {
	return render((
		<Router history={historyInstance}>
			<Route path='/' component={Main}>

				<IndexRoute components={{mainContent: Ttt}} />

				<Route path='/pg/(:page)' components={{mainContent: Txt_page}} />

				<Route path='/ttt' components={{mainContent: Ttt}} />

				<Route path='/pupg/(:pu_page)' components={{popup: PopUp_page}} />

				<Route path='/contact-us' components={{popup: Contact}} />

				<Route path='/error/404' components={{mainContent: ErrorPage}} />
				<Route path="*" components={{mainContent: ErrorPage}} />
			</Route>
		</Router>
	), document.getElementById('root'))
}

// ----------------------------------------------------------------------
// This section is used to configure the global app
// ----------------------------------------------------------------------

window.app = app

app.extend({

	settings: {
		is_mobile: false,
		mobile_type: null,
		can_app: false,

		ws_conf: null,

		curr_user: null,

		user_ready: false,
		user_types: [],
		basket_type: null,
		basket_total: 0,

	},


	init () {
 
		prep_env(this.start.bind(this))

	},

	start_ga () {
		const gaAcc = app.settings.ws_conf && app.settings.ws_conf.conf && app.settings.ws_conf.conf.ga_acc && app.settings.ws_conf.conf.ga_acc.an
		if (!gaAcc) {
			return
		}

		ga.initialize(gaAcc, { debug: import.meta.env && import.meta.env.DEV })
		const history = this.history || historyRef
		history && history.listen((location) => {
			ga.pageview(location.pathname)
		})
	},

	start () {
		this.history = createAppHistory()
		historyRef = this.history

		this.start_ga()

		renderSite(this.history)
	},

	show_page (u) {
		const history = this.history || historyRef
		if (!history) return
		switch(u) {
			case 'home':
				history.push('/')
				break

			default:
				console.log('show_page event with:', u) 
				history.push(u)
				break
		}
	},

	events: {
		show_message: 'show_message',
		show_page: 'show_page'
	},
})

app.init()

app.on(app.events.show_page, app.show_page)
