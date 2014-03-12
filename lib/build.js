var getGraph = require('npm-flat-graph')
var modules  = require('../data/modules.json')
var exclude  = require('../data/exclude.json')
var fs       = require('fs')

getGraph(modules, {
  exclude: exclude
}, function(err, index) {
  if (err) throw err

  fs.writeFile(__dirname + '/../generated/modules.json'
    , JSON.stringify(index)
    , function(err) {
      if (err) throw err
    })
})
