let data = [];
const textCloud = d3.select('#reddit-text-cloud');

// let containerReddit = d3.select('.reddit-word-cloud')

const format = d3.format('.2s');
let range = [0, 480000];

const size = d3.scaleLinear();
const smallSize = d3.scaleLinear();
const padding = d3.scaleLinear();
const opacity = d3.scaleLinear().range([0.5, 1]);
const weight = d3.scaleLinear().range([300, 800]);

let topPadding = 8;

function cleanData(arr) {
	return arr.map((d, i) => ({
		artist: d.artist,
		count: +d.count
	}));
}

function setup() {
	const topTwenty = data.slice(0, 29);

	textCloud.selectAll('.reddit-artist-container').remove();

	topTwenty.forEach((d, i) => {
		const thisArtist = textCloud
			.append('div')
			.attr('class', 'reddit-artist-container');

		const artistBlock = thisArtist
			.append('div')
			.attr('class', 'reddit-artist-inner')
			// .style('opacity', opacity(d.count))
			.style('padding', `${topPadding}px ${padding(d.count)}px`)
			// .style('background', () => {
			// 	if (i === 0) return '#000';
			// 	return '#fff';
			// })
			;

		artistBlock
			.append('p')
			.attr('class', 'reddit-artist-name')
			.style('font-size', `${size(d.count)}px`)
			.text(d.artist)
			.style('text-transform', 'uppercase')
			.style('border-radius', '4px')
			.style('margin', 0)
			.style('line-height', 1);

		artistBlock
			.append('p')
			.attr('class', 'reddit-artist-count')
			.text(() => {
				if (i === 0) return `${format(d.count)} comments`;
				return format(d.count);
			})
			.style('font-size', `${smallSize(d.count)}px`)
			.style('margin', 0)
			.style('border-color', () => {
				if (i === 0) return '#d65454';
				return '#34a29e';
			})
			;
	});

	// resize()
}

function resize() {
	if (window.innerWidth < 650) {
		size.range([10, 42]), smallSize.range([10, 14]), padding.range([4, 20]);

		topPadding = 4;
	} else {
		size.range([10, 54]), smallSize.range([10, 16]), padding.range([4, 20]);

		topPadding = 8;
	}

	range = [0, d3.max(data, d => d.count)];

	size.domain(range),
	smallSize.domain(range),
	padding.domain(range),
	opacity.domain(range),
	weight.domain(range);

	setup();
}

function init() {
	return new Promise(resolve => {
		d3.loadData('assets/data/reddit.csv', (err, response) => {
			data = cleanData(response[0]);
			resize();
			resolve();
		});
	});
}

export default { init, resize };
