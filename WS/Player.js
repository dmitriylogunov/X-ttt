/**************************************************
** GAME PLAYER CLASS
**************************************************/

class Player {
	constructor(uid, name, status) {
		this.uid = uid
		this.status = status
		this.sockid = null
		this.socket = null
		this.mode = null
		this.name = name
		this.opp = null
	}
}

module.exports = Player