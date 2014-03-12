module.exports = getLayout

function getLayout(list) {
  var modules = Object.keys(list)

  var index = modules.reduce(function(index, name, i) {
    index[name] = {
        index: i
      , name: name
      , parents: []
      , children: list[name]
    }

    return index
  }, {})

  modules.forEach(function(name) {
    index[name].children.forEach(function(child) {
      index[child].parents.push(index[name])
    })
  })

  modules.forEach(function(name) {
    index[name].children = index[name].children.map(function(child) {
      return index[child]
    })
  })

  var links = modules.reduce(function(links, name, i) {
    var module = index[name]

    module.parents.forEach(function(parent) {
      if (typeof parent.index === 'undefined') return

      links.push({
          source: parent.index
        , target: module.index
      })
    })

    return links
  }, [])

  var nodes = modules.map(function(name) {
    return index[name]
  })

  return {
      nodes: nodes
    , links: links
    , index: index
  }
}
