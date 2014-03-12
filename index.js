var list      = require('./generated/modules.json')
var getLayout = require('./lib/get-layout')
var debounce  = require('debounce')
var pluck     = require('pluck')
var d3        = require('d3')
var keys      = Object.keys
var ns        = 'http://www.w3.org/2000/svg'

var defaultColors = {
    bg: '#22d790'
  , fg: '#fff'
  , highlight: '#FFEDA3'
}

module.exports = createGraph

function createGraph(opts) {
  var data = getLayout(list)
  var colors = {}

  opts = opts || {}
  opts.colors = opts.colors || {}

  colors.bg = opts.colors.bg || defaultColors.bg
  colors.fg = opts.colors.fg || defaultColors.fg
  colors.highlight = opts.colors.highlight || defaultColors.highlight

  var svgEl = document.createElementNS(ns, 'svg')
  var svg = d3.select(svgEl)
    .style('background-color', colors.bg)
    .style('position', 'relative')

  var group  = svg.append('g')
  var maxdep = d3.max(keys(list), function(d) {
    return list[d].length
  })

  var rscale = d3.scale.pow()
    .exponent(0.25)
    .domain([1, maxdep])
    .range([5, 12])
    .clamp(true)

  var label = svg.append('text')
    .text(null)
    .style('font-size', '1.5em')
    .style('alignment-baseline', 'hanging')
    .style('fill', colors.fg)
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight', 200)
    .attr('x', 25)
    .attr('y', 25)

  var links = group.selectAll('.link')
    .data(data.links)

  var nodes = group.selectAll('.node')
    .data(data.nodes, pluck('name'))

  var force = d3.layout.force()
    .size([300, 300])
    .charge(-80)
    .linkDistance(30)
    .nodes(data.nodes)
    .links(data.links)
    .on('tick', tick)
    .start()

  links.enter()
    .insert('line', '.node')
    .classed('link', true)
    .style('stroke', colors.fg)
    .style('stroke-width', '1px')
    .style('opacity', 00)
    .transition()
    .style('opacity', 0.45)
    .delay(function(d) {
      var s = d.source.index
      var t = d.target.index
      return delay(s > t ? s : t)
    })

  nodes.enter()
    .append('circle')
    .classed('node', true)
    .attr('r', 0)
    .style('fill', colors.fg)
    .style('stroke', colors.bg)
    .style('stroke-width', '0px')
    .style('cursor', 'pointer')
    .on('click', function(d) {
      window.open('http://ghub.io/' + d.name)
    })
    .on('mouseover', function(d) {
      d3.select(this).style('fill', colors.highlight)
      label.text(d.name)
    })
    .on('mouseout', function() {
      d3.select(this).style('fill', colors.fg)
      label.text('')
    })
    .transition()
    .attr('r', radius)
    .duration(1000)
    .ease('elastic', 1.5)
    .delay(function(d, i) {
      return delay(d.index)
    })

  setTimeout(resize, 1)
  window.addEventListener('resize'
    , debounce(resize)
    , false
  )

  return svg[0][0]

  function tick() {
    links
      .attr('x1', function(d) { return d.source.x })
      .attr('y1', function(d) { return d.source.y })
      .attr('x2', function(d) { return d.target.x })
      .attr('y2', function(d) { return d.target.y })

    nodes
      .attr('cx', function(d) { return d.x })
      .attr('cy', function(d) { return d.y })
  }

  function resize() {
    var parent = svg[0][0].parentNode || svg[0][0]
    if (!parent) return
    var width = parent.clientWidth || parent.innerWidth
    if (!width) return
    var height = parent.clientHeight || parent.innerHeight
    if (!height) return

    force
      .size([width, height])
      .start()
  }

  function radius(datum) {
    return rscale(datum.children.length)
  }

  function delay(i) {
    return i * 50 + 550
  }
}
