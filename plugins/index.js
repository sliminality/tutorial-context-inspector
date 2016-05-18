/**
 * An index of plugins.
 *
 * Exposes an array of plugin instances.
 */

// let AltTextPlugin = require("./alt-text");
// let ContrastPlugin = require("./contrast");
// let HeadingsPlugin = require("./headings");
let LabelsPlugin = require("./labels");
let LandmarksPlugin = require("./landmarks");
let Crowdsourcer = require("./crowdsourcer");
// let LinkTextPlugin = require("./link-text");
let A11yTextWand = require("./a11y-text-wand");

module.exports = {
    default: [
        // new HeadingsPlugin(),
        // new ContrastPlugin(),
        // new LinkTextPlugin(),
        // new AltTextPlugin(),
        // new LandmarksPlugin(),
    ],

    experimental: [
        new A11yTextWand(),
        new Crowdsourcer(),
        // new LabelsPlugin(),
        new LandmarksPlugin(),
    ],
};
