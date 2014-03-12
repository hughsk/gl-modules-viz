# gl-modules-viz

Just experimenting with making a force-directed graph of the core modules
available in the [modules.gl](http://modules.gl) ecosystem, potentially to
include on the home page.

[demo](http://hughsk.io/gl-modules-viz)

[![gl-modules-viz](http://i.imgur.com/10vvjj5.png)](http://hughsk.io/gl-modules-viz)

## Usage

The visualisation as a module too, so it's easy to include anywhere with
[browserify](http://browserify) and [npm](http://npmjs.org/).

### `svg = viz(opts)`

Creates and returns an `svg` element containing the visualisation. Takes
the following options:

* `opts.colors.bg`: background color for the SVG.
* `opts.colors.fg`: foreground color, i.e. the links, text and nodes.
* `opts.colors.hightlight`: the color to use when highlighting a node.
