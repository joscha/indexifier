const wrapHref = require('./wrapHref');

module.exports = function dirTreeToArchyTree(node, cwd, isHtml, linkFolders) {
    if (!node.children) {
        return isHtml ? wrapHref(node, cwd) : node.name;
    }
    return {
        label: (isHtml && linkFolders) ? wrapHref(node, cwd) : node.name,
        nodes: node.children.map((subTree) => dirTreeToArchyTree(subTree, cwd, isHtml, linkFolders))
    };
};
