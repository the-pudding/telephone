/* global d3 */

const $section = d3.select('section.social');
const $figure = $section.select('figure');
const $svg = $figure.select('svg');
const $g = $figure.select('g');
const $vis = $figure.select('.g-vis');
const $axis = $figure.select('.g-axis');

const platforms = ['instagram', 'twitter', 'facebook', 'youtube'];
const PERSON_H = 28;
const RADIUS = 4;
const MARGIN = { top: 36, bottom: 12, left: 12, right: 12 };
const OFFSET_X1 = 120 + RADIUS;
const OFFSET_X2 = 40 + RADIUS * 3;

let scale = null;

function jitter({ platform, value }) {
	const start = platforms.indexOf(platform) + 1;
	if (start >= platforms.length) return false;

	const after = platforms.slice(start, platforms.length);

	const currentCircle = d3.select(this);
	const currentX = scale(value);
	const parent = currentCircle.parent();

	// console.log('----');
	// console.log(platform);
	// console.log('----');

	parent.selectAll('circle').each(d => {
		if (after.includes(d.platform)) {
			const otherX = scale(d.value);
			const delta = currentX - otherX;

			if (Math.abs(delta) < RADIUS * 2) {
				const dir = delta < 0 ? 1 : -1;
				currentCircle.translate([currentX - RADIUS * 2 * dir, 0]);
			}
		}
	});
}

function resize() {
	const $person = $g.selectAll('.person');
	const data = $person.data();

	const width = $figure.node().offsetWidth - (MARGIN.left + MARGIN.right);
	const height = PERSON_H * data.length;

	const max = d3.max(data, d => Math.max(...platforms.map(p => d[p])));

	scale = d3
		.scaleLinear()
		.domain([0, max])
		.range([OFFSET_X1, width - OFFSET_X2]);

	$svg
		.at('width', width + (MARGIN.left + MARGIN.right))
		.at('height', height + (MARGIN.top + MARGIN.bottom));

	$g.translate([MARGIN.left, MARGIN.top]);

	const axis = d3
		.axisTop(scale)
		.tickFormat(d3.format('.2s'))
		.ticks(width < 480 ? 3 : 6)
		.tickSize(-height);

	$axis.call(axis).translate([0, -MARGIN.top / 3]);

	$person.translate((d, i) => [0, i * PERSON_H]);
	$person.select('.total').translate([width, 0]);
	$person.selectAll('circle').translate(d => [scale(d.value), 0]);
	$person.select('line').at({
		x1: scale.range()[0],
		x2: scale.range()[1],
		y1: 0,
		y2: 0
	});

	$vis.select('.label').translate([width, -MARGIN.top / 2.35]);

	// const circleData = $person.selectAll('circle').data();

	$person.selectAll('circle').each(jitter);

	// const simulation = d3
	// 	.forceSimulation(circleData)
	// 	.force('x', d3.forceX(d => scale(d.value)).strength(1))
	// 	.force('y', d3.forceX(d => d.index * PERSON_H).strength(1))
	// 	.force('collide', d3.forceCollide(RADIUS))
	// 	.stop();

	// // for (let i = 0; i < 120; ++i) simulation.tick();
	// // 	$person.selectAll('circle').translate(d => [d.x, 0]);
	// // }
	// setInterval(() => {
	// 	simulation.tick();
	// 	$person.selectAll('circle').translate(d => [d.x, 0]);
	// }, 500);
}

function setupChart(data) {
	const formatter = d3.format('.3s');

	$vis
		.append('text.label')
		.text('Total')
		.at('text-anchor', 'end');
	// .at('alignment-baseline', 'middle');

	const $person = $vis
		.selectAll('.person')
		.data(data)
		.enter()
		.append('g.person');

	$person
		.append('text.name')
		.text(d => d.id)
		.at('alignment-baseline', 'middle');
	$person
		.append('text.total')
		.text(d => formatter(d.total))
		.at('text-anchor', 'end')
		.at('alignment-baseline', 'middle');

	$person.append('line');

	$person
		.append('g.dots')
		.selectAll('circle')
		.data((d, i) => [
			{ platform: 'instagram', value: d.instagram, index: i },
			{ platform: 'twitter', value: d.twitter, index: i },
			{ platform: 'facebook', value: d.facebook, index: i },
			{ platform: 'youtube', value: d.youtube, index: i }
		])
		.enter()
		.append('circle')
		.at('class', d => `platform--${d.platform}`)
		.at('cx', 0)
		.at('cy', 0)
		.at('r', RADIUS);
}

function init() {
	d3.loadData('assets/data/social.csv', (err, response) => {
		const clean = response[0].map(d => ({
			...d,
			instagram: +d.instagram,
			twitter: +d.twitter,
			facebook: +d.facebook,
			youtube: +d.youtube,
			total: +d.total
		}));
		setupChart(clean);
		resize();
	});
}

export default { init, resize };
