const fs = require('fs');

const dirTree = require('directory-tree');
const archy = require('archy');

const dirTreeToArchyTree = require('./dirTreeToArchyTree');
const wrapHtml = require('./wrapHtml');
const { DirectoryInvalidError } = require('./exceptions');

const defaultOpts = {
    fileTypes: null,
    isHtml: false,
    linkFolders: true,
    exclude: undefined,
};

/**
* Generates a directory tree from the given directory and all sub-directories
*
* @param {!String} dir The directory to use as the start (this will be the root node of the tree)
* @param {Object} [opts] An object which supports the following options:
*                        {Array.<String>} fileTypes The file types to print. Defaults to all file types.
*                        {RegExp|undefined} exclude A regular expression matching files/directories to exclude.
*                        {Boolean} isHtml Whether to produce HTML output. Defaults to false.
* @return {String} A unicode string containing a directory tree
*/
module.exports = (dir, opts) => {
    let stats;
    try {
        stats = fs.statSync(dir);
    } catch(e) {
        throw new DirectoryInvalidError(`Given directory "${dir}" does not exist`);
    }
    if (!stats.isDirectory()) {
        throw new DirectoryInvalidError(`Given directory "${dir}" is not valid`);
    }
    const { exclude, fileTypes, isHtml, linkFolders } = Object.assign({}, defaultOpts, opts);

    const tree = dirTree(dir, {
        exclude,
        extensions: fileTypes && fileTypes.length
            ? new RegExp(`(?:${fileTypes.join('|').replace('.', '\\.')})$`)
            : undefined,
    });

    const archyTree = dirTreeToArchyTree(tree, dir, isHtml, linkFolders);
    const outTree = archy(archyTree);
    return isHtml ? wrapHtml(outTree, tree.name) : outTree;
}
