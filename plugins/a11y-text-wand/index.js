/**
 * Allows users to see what screen readers would see.
 */

let $ = require("jquery");
let Plugin = require("../base");

require("./style.less");

class A11yTextWand extends Plugin {
    getTitle() {
        return "Highlight Elements";
    }

    getDescription() {
        return "Hover over elements to view their CSS";
    }

    run() {
        // HACK(jordan): We provide a fake summary to force the info panel to
        //     render.
        this.summary(" ");
        this.panel.render();

        $(document).on("mousemove.wand", function(e) {
            let currentEl = document.elementFromPoint(e.clientX, e.clientY);

            // Don't outline something if it's part of the app
            if (currentEl.className.indexOf("tota11y") === -1) {
                $(".tota11y-outlined").removeClass("tota11y-outlined");
                $(currentEl).addClass("tota11y-outlined");

                $(document).on("click.wand", function(e) {
                    const parentEl = currentEl.parentNode;
                    const parentElProperties = window.getComputedStyle(parentEl, null);
                    const currentElProperties = window.getComputedStyle(currentEl, null);
                    const prefix = /\-webkit\-/;
                    let allCSSProperties = {};

                    for (let s = 0; s < currentElProperties.length; s++) {
                      const property = currentElProperties[s];
                      const propVal = currentElProperties.getPropertyValue(property);

                      if (prefix.test(property)) {
                        // Ignore prefixed properties
                        continue;
                      }

                      // Filter out inherited computed styles
                      const parVal = parentElProperties.getPropertyValue(property);
                      if (propVal !== parVal) {
                        if (!(property in allCSSProperties)) {
                          // Make sure not to duplicate
                          allCSSProperties[property] = propVal;
                        }
                      }
                    }

                    let styleStrings = "";
                    for (let prop in allCSSProperties) {
                        if (allCSSProperties.hasOwnProperty(prop)) {
                            const liString = `<li class="tota11y"><strong class="tota11y style-list-property">${prop}:</strong> ${allCSSProperties[prop]}</li>`;
                            styleStrings += liString;
                            console.log(liString);
                        }
                    }
                    console.log(styleStrings);

                    const htmlString = `<ul class="style-list tota11y">${styleStrings}</ul>`;

                    let textAlternative = htmlString;

                    if (!textAlternative) {
                        $(".tota11y-info-section.active").html(
                            <i className="tota11y-nothingness">
                                Nothing available
                            </i>
                        );
                    } else {
                        $(".tota11y-info-section.active").html(
                            textAlternative
                        );
                    }
                });
            }
        });
    }

    cleanup() {
        $(".tota11y-outlined").removeClass("tota11y-outlined");
        $(document).off("mousemove.wand");
    }
}

module.exports = A11yTextWand;
