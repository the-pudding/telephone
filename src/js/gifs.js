let giphyCounts = [];
const giphyGIFS = [];
let $gifDiv = null;

const $containerGifs = d3.select('.chart-gifs');
const scaleX = d3.scaleLinear();
const formatComma = d3.format(',');
const width = 0;
const height = 0;

const margin = {
	top: 30,
	bottom: 0,
	left: 0,
	right: 0
};

function setup() {
	$gifDiv = $containerGifs.append('div.giphyStats');

	const $gifGroup = $gifDiv
		.selectAll('dif__group')
		.data(giphyCounts)
		.enter()
		.append('div.gif__group');

	const $gifImgContainer = $gifGroup.append('div.gif__gifContainer');

	const rankText = $gifImgContainer
		.append('p.gif__rank-text')
		.text((d, i) => i + 1);

	const gif = $gifImgContainer.append('div.gif__gif').html((d) => {
		const filename = d.name.replace(/\s+/g, '-');
		return `<img src="assets/images/${  filename  }.gif">`;
	});

	const $gifTextContainer = $gifGroup.append('div.gif__textContainer');

	const nameText = $gifTextContainer
		.append('p.gif__name-text')
		.html((d) => {
			const filename = d.name.replace(/\s+/g, '-');
			return `<a href='https://giphy.com/search/${filename}'>${d.name}</a>`;
		});

	const countText = $gifTextContainer
		.append('p.gif__count-text')
		.text(d => `${formatComma(d.count)  } gifs`);
}

function init() {
	return new Promise(resolve => {
		d3.loadData('assets/data/giphyCounts.csv', (err, response) => {
			// Limit to top 10
			giphyCounts = response[0].filter(d => d.name !== 'Pink').slice(0, 10);
			setup();
			resolve();
		});
	});
}

export default { init };
