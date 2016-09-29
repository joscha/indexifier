const wrapHref = require('./wrapHref');

module.exports = function dirTreeToArchyTree(node, cwd, isHtml) {
    const label = isHtml ? wrapHref(node, cwd) : node.name;
    if (!node.children) {
        return label;
    }
    return {
        label,
        nodes: node.children.map((subTree) => dirTreeToArchyTree(subTree, cwd, isHtml))
    };
};
