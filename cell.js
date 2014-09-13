function Cell(x, y, dead) {
	this.x = x;
	this.y = y;
	this.key = (x + '-' + y);
	this.dead = (dead || false);
	this.next_action = null;
}
