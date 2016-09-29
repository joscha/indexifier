const path = require('path');

module.exports = function wrapHref(node, cwd) {
    const relativePath = path.relative(cwd, node.path);
    return `<a href="./${relativePath}">${node.name}</a><br/>`;
};
