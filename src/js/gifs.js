const fs = require('fs');
const d3 = require('d3');
const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');

const OUT_PATH = './src/assets/data/output';
const IN_PATH = './src/assets/data/output';
const IN_JSON = './src/assets/data/output/billboardCharts.json'
const allAlbums = [];

//Pulls down html of billboard top 200 albums
async function getBillboardHTML(year) {
	const url = `https://www.billboard.com/charts/year-end/${year}/top-billboard-200-albums`

	return new Promise((resolve, reject) => {
		request(url, (err, response, body) => {
			fs.writeFileSync(`${OUT_PATH}/albumsPage${year}.html`, body);
		})
	})
}

//Pulls relevant data from each album in the top 200
function getChartData(filename) {
	const file = fs.readFileSync(`${IN_PATH}/${filename}`, 'utf-8');
	const $ = cheerio.load(file);

	const $chartContainer = $('.chart-details')

	$chartContainer.find('.chart-details__left-rail').each((i, el) => {
		const $list = $(el).find('.chart-details__item-list')

		$list.each((i, el) => {
			const $article = $(el).find('.ye-chart-item')
			const $album = $article.find('.ye-chart-item__primary-row')
			const year = $album.attr('data-date')

			$album.each((i, el) => {
				const rank = $(el).find('.ye-chart-item__rank').text().trim()
				const $text = $(el).find('.ye-chart-item__text')
				const title = $text.find('.ye-chart-item__title').text().trim()
				const artist = $text.find('.ye-chart-item__artist').text().trim()

				const singleAlbum = { year, rank, title, artist };
				allAlbums.push(singleAlbum)
			});
		});
	})
}

function findUniqArtists(data) {
	//console.log(data)
	const uniqArtists = _.uniqBy(data, 'artist')
	const artistList = uniqArtists.map(function(obj) { return obj.artist; }).sort()
	const json = JSON.stringify(artistList);

	fs.writeFileSync(`${OUT_PATH}/artists.json`, json);
}

function init() {
	getBillboardHTML(2017)
	getBillboardHTML(2018)

	const files = fs.readdirSync(IN_PATH).filter(d => d.includes('.html'));
	files.map(getChartData);

	const flat = [].concat(...allAlbums);
  const json = JSON.stringify(flat);

	fs.writeFileSync(`${OUT_PATH}/billboardCharts.json`, json);

	findUniqArtists(flat)
}

init();
