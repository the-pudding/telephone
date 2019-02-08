let giphyCounts = []
const giphyGIFS = []
let $gifDiv = null

let $containerGifs = d3.select('.chart-gifs')
const scaleX = d3.scaleLinear()
const formatComma = d3.format(',')
let width = 0
let height = 0

let margin = {
  top: 30,
  bottom: 0,
  left: 0,
  right: 0
}

function setup(){
  $gifDiv = $containerGifs.append('div.giphyStats')

  const $gifGroup = $gifDiv.selectAll('dif__group')
    .data(giphyCounts)
    .enter()
    .append('div.gif__group')

  const $gifImgContainer = $gifGroup
    .append('div.gif__gifContainer')

  const rankText = $gifImgContainer
    .append('p.gif__rank-text')
    .text(function(d, i) {
      return i+1
    })

  const gif = $gifImgContainer
    .append('div.gif__gif')
    .html(function(d){
      const filename = (d.name).replace(/\s+/g, '-')
      return '<img src="assets/images/' + filename + '.gif">'
    })

  const $gifTextContainer = $gifGroup
      .append('div.gif__textContainer')

  const nameText = $gifTextContainer
    .append('p.gif__name-text')
    .html(function(d){
      const filename = (d.name).replace(/\s+/g, '-')
      return `<a href='https://giphy.com/search/${filename}'>${d.name}</a>`
    })

  const countText = $gifTextContainer
    .append('p.gif__count-text')
    .text(d => formatComma(d.count) + ' gifs')

}

function init() {
  return new Promise((resolve) => {
		d3.loadData('assets/data/giphyCounts.csv', (err, response) => {
      //Limit to top 10
			giphyCounts = response[0].filter(d => d.name !== 'Pink').slice(0,10)
      console.log(giphyCounts)
      setup()
			resolve()
		})
	})
}

export default { init };
