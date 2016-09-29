const fs = require('fs');

const dirTree = require('directory-tree');
const archy = require('archy');

const dirTreeToArchyTree = require('./dirTreeToArchyTree');
const wrapHtml = require('./wrapHtml');
const { DirectoryInvalidError } = require('./exceptions');

/**
* Generates a directory tree from the given directory and all sub-directories
*
* @param {!String} dir The directory to use as the start (this will be the root node of the tree)
* @param {Array.<String>} [fileTypes] The file types to print. Defaults to all file types.
* @param {Boolean} [isHtml] Whether to produce HTML output. Defaults to false.
* @return {String} A unicode string containing a directory tree
*/
module.exports = (dir, fileTypes = null, isHtml = false) => {
    let stats;
    try {
        stats = fs.statSync(dir);
    } catch(e) {
        throw new DirectoryInvalidError(`Given directory "${dir}" does not exist`);
    }
    if (!stats.isDirectory()) {
        throw new DirectoryInvalidError(`Given directory "${dir}" is not valid`);
    }

    const tree = dirTree(dir, fileTypes);

    const archyTree = dirTreeToArchyTree(tree, dir, isHtml);
    const outTree = archy(archyTree);
    return isHtml ? wrapHtml(outTree) : outTree;
}
