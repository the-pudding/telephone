const fs = require('fs');
const d3 = require('d3');
const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');

const FINAL_DATA_PATH = './src/assets/data/';
const OUT_PATH = './src/assets/data/output';
const IN_PATH = './src/assets/data/output';
const IN_JSON = './src/assets/data/output/billboardCharts.json'
const allYears = ['2017', '2018'];
const allAlbums = [];
const artistList = [];
const giphyUrls = [];
const giphyCounts = [];
const giphyData = [];

function getData() {
	//HELPER FUNCTIONS
	async function getBillboardHTML(year) {
		const url = `https://www.billboard.com/charts/year-end/${year}/top-billboard-200-albums`

		return new Promise((resolve, reject) => {
			request(url, (err, response, body) => {
				fs.writeFileSync(`${OUT_PATH}/albumsPage${year}.html`, body);
			})
		})
	}

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

	function getGiphyCount(filename) {
		const splitz = filename.split('.txt')
		const name = splitz[0].replace(/-/g, ' ');

		const file = fs.readFileSync(`${IN_PATH}/giphy/${filename}`, 'utf-8');
		const before = 'total: '
		const after = ','
		const match = file.match(new RegExp(before + '(.*)' + after))
		const count = match[1]

		const countData = {name, count}

		giphyCounts.push(countData)

	}

	function findUniqArtists(data) {
		const uniqArtists = _.uniqBy(data, 'artist')
		artistList.push(uniqArtists.map(function(obj) { return obj.artist; }).sort())
		//console.log(artistList.length)
		fs.writeFileSync(`${OUT_PATH}/artists.csv`, artistList);
	}

	function formatGiphyUrls(data) {
		const searchTerms = data[0]
			.filter(d => (!d.includes('&') && !d.includes('Broadway')))
			.map(function(artist) {
				const term = artist.trim().replace(/\s+/g, '-').replace('.', '').replace('!', '').replace('Pnk', 'Pink')
				const url = `https://giphy.com/search/${term}`
				return {artist, url};
			})

		giphyUrls.push(searchTerms)
	}

	async function pullGiphyHTML(data) {
		const url = data.url
		const splitz = url.split('search/')
		const name = splitz[1];

		return new Promise((resolve, reject) => {
			request(url, (err, response, body) => {
				fs.writeFileSync(`${OUT_PATH}/giphy/${name}.txt`, body);
			})
		})
	}

	//STEPS
	//STEP 1: Pulls down the HTML for the Billbiard Top 200 albums from 2017 & 2018
	allYears.map(getBillboardHTML)

	//STEP 2: Gets the album data from each album in the Top 200 for both years
	const files = fs.readdirSync(IN_PATH).filter(d => d.includes('.html'));
	files.map(getChartData);

	//STEP 2B: Limits to the Top 50 albums instead of the Top 200
	const tops = allAlbums.filter(d => d.rank <= 50)
	const flat = [].concat(...tops);
	const json = JSON.stringify(flat);
	fs.writeFileSync(`${OUT_PATH}/billboardCharts.json`, json);

	//STEP 3: Removes artists who appear more than once in the top albums
	findUniqArtists(flat)

	//STEP 4: Format the GIPHY search urls for each artist
	formatGiphyUrls(artistList)

	//STEP 5: Pull the HTML for each artist's GIPHY search page
	const flatGiphy = [].concat(...giphyUrls);
	flatGiphy.map(pullGiphyHTML)

	//STEP 6: Get the total number of gifs for each artist
	const giphyFiles = fs.readdirSync(`${IN_PATH}/giphy`).filter(d => d.includes('.txt'));
	giphyFiles.map(getGiphyCount);

	//STEP 7: Save final data out to a csv
	const sortedCounts = giphyCounts.sort(function(a, b){return b.count - a.count});
	const csv = d3.csvFormat(sortedCounts);
	fs.writeFileSync(`${FINAL_DATA_PATH}/giphyCounts.csv`, csv);
}

function init() {
	//All the stuff to pull the data
	getData()

}

init();
