document.addEventListener('DOMContentLoaded',function() {
	var world = new World;
	var previousRender = null;

	world.init(100, 57);
	var start = new Date();
	var render = world.getRender();
	previousRender = render;
	var end = new Date();

	var timeRender = ((end - start) / 1000).toFixed(3);

	var output = '#' + world.tick;
		output += ' - Render time : ' + timeRender;
		output += '<br/>' + render;

	document.body.innerHTML = output;

	var e = setInterval(function() {
		var start = new Date();
		world.nextTick();
		var end = new Date();

		var timeTick = ((end - start) / 1000).toFixed(3);

		var start = new Date();
		var render = world.getRender();
		var end = new Date();

		var timeRender = ((end - start) / 1000).toFixed(3);

		var output = '<div id="info">';
			output += '<b>#' + world.tick + '</b>';
			output += ' - Tick time : <i>' + timeTick + 's</i>';
			output += ' - Render time : <i>' + timeRender + 's</i>';
			output += '</div>';
			output += render;

		document.body.innerHTML = output;

		if (previousRender == render) {
			clearInterval(e);
		} else {
			previousRender = render;
		}
	}, 0);
});
