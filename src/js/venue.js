let data = []

let $containerBars = d3.select('.chart-venue')
let $right = null

const scaleX = d3.scaleLinear()
const scaleY = d3.scaleBand()
let width = 0
let height = 0

let margin = {
  top: 30,
  bottom: 0,
  left: 0,
  right: 0
}

// constants
let barHeight = 20
let paddingHeight = 8
const textPaddingSide = 6
const textPaddingTop = 3
const fontSize = 12
let labelWidth = 80

let roundingConstant = 5000

let formatNumber = d3.format('.2s')

function cleanData(arr){
	return arr.map((d, i) => {
		return {
			...d,
      capacities: +d.capacities,
		}
	})
}

function setup(){
  $right = $containerBars.append('div.right')

  const barGroups = $right.selectAll('bar__group')
    .data(data)
    .enter()
    .append('div.bar__group')

  const bar = barGroups
    .append('div.bar__bar')

  bar
    .append('p.bar__label-text')
    .text(d => d.artist)
  bar
    .append('p.bar__bar-text')
    .text(d => `${formatNumber(d.capacities)}`)



  resize()
}

function update(){
  $right.selectAll('.bar__bar')
    .st('width', d => scaleX(d.capacities))
}

function resize(){
  // defaults to grabbing dimensions from container element
  width = $containerBars.node().offsetWidth - margin.left - margin.right;
  height = (barHeight * data.length) + (paddingHeight * (data.length - 1))

  console.log({width})

  const max = d3.max(data, d => d.capacities)

  console.log({max})

  scaleX
    .domain([0, max])
    .range([0, width - margin.right - margin.left])

  const test = scaleX(max)
  console.log({test})

  update()
}

function init() {
  return new Promise((resolve) => {
		d3.loadData('assets/data/venues.csv', (err, response) => {
			data = cleanData(response[0])
      setup()
			resolve()
		})
	})
}

export default { init, resize };
