/**
 * A plugin to label all ARIA landmark roles
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("landmarks");

class LandmarksPlugin extends Plugin {
    getTitle() {
        return "Components";
    }

    getDescription() {
        return "Labels tutorial components on page";
    }

    run() {
        $("[role]:not(.tota11y-toolbar,.tota11y-plugin)").each(function() {
            annotate.label($(this), $(this).prop("tagName").toLowerCase());
        });
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = LandmarksPlugin;
