const _ = require("lodash");
const spec = require("./cssPropTypes");

/**
 * Return an element's non-inherited computedStyles
 * @param  {Element} el Element of interest
 * @return {Object}     collection of { prop: value } pairs
 */
function getOwnComputedStyles (el) {
    const styles = window.getComputedStyle(el, null);
    const parent = el.parentNode;
    // Catch case where we've selected the root
    const parentStyles = parent ? window.getComputedStyle(parent, null) : null;

    // Exclude prefixed properties, parent properties,
    // and duplicate properties
    const ownStyles = {};
    const prefix = /\-webkit\-/;

    // getComputedStyle returns a CSSStyleDeclaration object,
    // so we need to iterate using old-fashioned for loops
    let i, prop, val, parentVal;
    for (i = 0; i < styles.length; i++) {
        prop = styles[i];
        val = styles.getPropertyValue(prop);
        parentVal = parentStyles.getPropertyValue(prop);

        if (!prefix.test(prop) &&
            parentVal !== val &&
            !_.has(ownStyles, prop)) {
            // Add pair to ownStyles
            ownStyles[prop] = val;
        }
    }

    return ownStyles;
}

/**
 * Classify a CSS property as position, box model, typography, or visual
 * @param  {String} style CSS property
 * @return {String}       the corresponding property type, or "misc"
 */
function classify (prop) {
    const result = _.findKey(spec, list => _.includes(list, prop));
    return result || "misc";
}

/**
 * Partition a set of CSS { property: value } pairs into a new object of { propType: [[val, prop]] } pairs
 * @param  {Object} styles collection of { property: value } pairs
 * @return {Object}        map of propTypes to objects containing sorted { property: value } pairs
 */
function filterCss (styles) {
    // Build a partition object based on keys in spec
    const propTypes = Object.keys(spec);
    let partition = {
        "misc": {}
    };
    _.forIn(propTypes, (propType) => {
        partition[propType] = {};
    });

    // Iterate through passed styles and build partition
    _.forIn(styles, (val, prop) => {
        const propType = classify(prop);
        const pair = _.fromPairs([[prop, val]]);  // Nest twice for lodash
        _.assign(partition[propType], pair);
    });

    return partition;
}

/**
 * Main function to get style data from Element as Handlebars context
 * @param  {Element} el input Element
 * @return {Object} partition of { property: value } pairs, by propType
 */
function el2Partition (el) {
    const elStyles = getOwnComputedStyles(el);
    const partition = filterCss(elStyles);
    return partition;
}


module.exports = el2Partition;
