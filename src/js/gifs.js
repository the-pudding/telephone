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
  $gifDiv = $containerGifs.append('div.gifs')

  const $gifGroup = $gifDiv.selectAll('dif__group')
    .data(giphyCounts)
    .enter()
    .append('div.gif__group')

  const $gifText = $gifGroup
      .append('div.gif__text')

  const rankText = $gifText
    .append('p.gif__rank-text')
    .text(function(d, i) {
      return i+1
    })

  const nameText = $gifText
    .append('p.gif__name-text')
    .text(d => d.name)

  const countText = $gifText
    .append('p.gif__count-text')
    .text(d => formatComma(d.count) + ' gifs')

  const gif = $gifGroup
    .append('div.gif__gif')
    .html(function(d){
      const filename = (d.name).replace(/\s+/g, '-')
      return '<img src="assets/images/' + filename + '.gif">'
    })

}
//
// function update(){
//   $right.selectAll('.bar__bar')
//     .st('width', d => scaleX(d.capacities))
// }

// function resize(){
//   // defaults to grabbing dimensions from container element
//   width = $containerBars.node().offsetWidth - margin.left - margin.right;
//   height = (barHeight * data.length) + (paddingHeight * (data.length - 1))
//
//   //console.log({width})
//
//   const max = d3.max(data, d => d.capacities)
//
//   //console.log({max})
//
//   scaleX
//     .domain([0, max])
//     .range([0, width - margin.right - margin.left])
//
//   const test = scaleX(max)
//   //console.log({test})
//
//   update()
// }

function init() {
  return new Promise((resolve) => {
		d3.loadData('assets/data/giphyCounts.csv', (err, response) => {
      //Limit to top 10
			giphyCounts = response[0].slice(0,10)
      setup()
			resolve()
		})
	})
}

export default { init };
