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
		this.game = null    // Reference to the Game instance
		this.symbol = null  // 'x' or 'o'
	}
}

module.exports = Player