function World() {
	this.reset();
}

World.locationOccupied = function() {
	console.log('Location occupied ...');
};

World.prototype.reset = function(x, y) {
	this.tick = 0;
	this.cells = {};
	this.boundaries = null;
	this.directions = [
		[-1, 1], [0, 1], [1, 1],
		[-1, 0], [1, 0],
		[-1, -1], [0, -1], [1, -1]
	];
}

World.prototype.init = function(xmax, ymax) {
	for (var x = 0; x <= xmax; x++) {
		for (var y = 0; y <= ymax; y++) {
			this.addCell(x, y, (Math.random() > 0.2));
		}
	}
}

World.prototype.getRender = function() {
	var render = '<table>';
	var map = this.getBoundaries();
	
	for (var y = map['y']['min']; y <= map['y']['max']; y++) {
		render += '<tr>';

		for (var x = map['x']['min']; x <= map['x']['max']; x++) {
			var cell = this.getCell(x, y);
			render += '<td class="' + (cell.dead ? 'dead' : 'live') + '"></td>';
		}

		render += '</tr>';
	}

	render += '</table>';
	
	return render;
}

World.prototype.addCell = function(x, y, dead) {
	dead = (dead || false);

	if (this.getCell(x, y)) {
		throw new World.locationOccupied;
	}

	this.cells[x + '-' + y] = new Cell(x, y, dead);
	return this.cells[x + '-' + y];
}

World.prototype.getCell = function(x, y) {
	return this.cells[x + '-' + y];
}

World.prototype.getBoundaries = function() {
	if (!this.boundaries) {
		var x_vals = new Array;
		var y_vals = new Array;

		for (var key in this.cells){
			var cell = this.cells[key];

			x_vals.push(cell.x);
			y_vals.push(cell.y);
		}

		this.boundaries = {
			x: {
				min: Math.min.apply(null, y_vals),
				max: Math.max.apply(null, x_vals)
			},
			y: {
				min: Math.min.apply(null, y_vals),
				max: Math.max.apply(null, y_vals)
			}
		};
	}

	return this.boundaries;
}

World.prototype.nextTick = function() {
	for (var key in this.cells){
		var cell = this.cells[key];
		var alive_neighbours = this.getAliveNeighboursAround(cell);

		if (cell.dead && alive_neighbours == 3) {
			cell.next_action = 'live';
		} else if (!cell.dead && (alive_neighbours == 2 || alive_neighbours == 3)) {
			cell.next_action = 'live';
		} else {
			cell.next_action = 'kill';
		}
	}

	for (var key in this.cells){
		var cell = this.cells[key];

		if (cell.next_action == 'live') {
			cell.dead = false;
		} else if (cell.next_action == 'kill') {
			cell.dead = true;
		}
	}

	this.tick += 1;
}

World.prototype.getNeighboursAround = function(cell) {
	var neighbours = new Array;

	for (var key in this.directions){
		var direction = this.directions[key];
		var n = this.getCell((cell.x + direction[0]), (cell.y + direction[1]));

		if (n) {
			neighbours.push(n);
		}
	}

	return neighbours;
}

World.prototype.getAliveNeighboursAround = function(cell) {
	var neighbours = this.getNeighboursAround(cell);
	var result = 0;

	for (var key in neighbours){
		var neighbour = neighbours[key];

		if (!neighbour.dead) {
			result++;
		}
	}

	return result;
}
