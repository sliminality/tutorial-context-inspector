/**
 * Display information about relevant CSS attributes to users
 */

let $ = require("jquery");
let Plugin = require("../base");
let el2Partition = require("./filterCss");
let _ = require("lodash");

require("./style.less");

class A11yTextWand extends Plugin {
    getTitle() {
        return "Highlight Elements";
    }

    getDescription() {
        return "Hover over elements to view their CSS";
    }

    run() {
        // Provide a fake summary to force the info panel to render
        this.summary(" ");
        this.panel.render();

        // When CONTAINERS_ONLY is active,
        // highlighting and clicking will only work on:
        // div, section, article, aside, nav, header,
        // footer, and menu elements
        let CONTAINERS_ONLY = true;
        const CONTAINERS = [
            "div",
            "section",
            "article",
            "aside",
            "nav",
            "header",
            "footer",
            "menu"
        ];

        // Mousemove handler controls highlighting behavior
        $(document).on("mousemove.wand", function(e) {
            const currentEl = document.elementFromPoint(e.clientX, e.clientY);
            const tag = _.toLower(currentEl.tagName);

            // Don't outline something if it's part of the app,
            // or not a container element when CONTAINERS_ONLY is true
            const invalidTarget = _.some([
                CONTAINERS_ONLY && !_.includes(CONTAINERS, tag),
                _.includes(currentEl.className, "tota11y")
            ]);

            if (!invalidTarget) {
                $(".tota11y-outlined").removeClass("tota11y-outlined");
                $(currentEl).addClass("tota11y-outlined");
            }
        });

        // Click handler gets and displays CSS information
        $(document).click(function(e) {
            const clickedEl = e.target;

            // Stop propagation if we clicked an app element
            if (clickedEl.className.indexOf("tota11y") !== -1 &&
                clickedEl.className.indexOf("tota11y-outlined") === -1) {
                console.log("clicked on app");
                e.stopPropagation();
            }

            const partition = el2Partition(clickedEl);
            const propTypeOrder = ["position", "box_model", "typography", "visual", "misc"];

            console.log(partition);

            // Iterate through partition, getting rid of empty lists
            let styleStrings = "";
            propTypeOrder.forEach((propType) => {
                const props = partition[propType];
                if (_.size(props)) {
                    const liStrings = _.reduce(props, (acc, val, prop) => {
                        const addition = `<li class="tota11y">
                            <strong class="tota11y style-list-property">${prop}:</strong>
                             ${val}</li>`;
                        return acc.concat(addition);
                    }, "");
                    styleStrings += `
                        <h4 class="tota11y style-list-heading">${propType}</h4>
                        <ul class="style-list tota11y">
                            ${liStrings}
                        </ul>`;
                }
            });

            // Populate the info panel
            if (!styleStrings) {
                $(".tota11y-info-section.active").html(
                    <i className="tota11y-nothingness">
                        Nothing available
                    </i>
                );
            } else {
                $(".tota11y-info-section.active").html(
                    styleStrings
                );
            }
        });
    }

    cleanup() {
        $(".tota11y-outlined").removeClass("tota11y-outlined");
        $(document).off("mousemove.wand");
        $(document).off("click.wand");
    }
}

module.exports = A11yTextWand;
