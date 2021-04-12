const fs = require('fs');

const dirTree = require('directory-tree');

const { filterToMaxDepth, filterIncluded, filterEmptyDirectories } = require('./dirTreeFilters')
const { DirectoryInvalidError } = require('./exceptions');
const { AbstractPrinter, HtmlPrinter, PlainTextPrinter } = require('./printers');

const defaultOpts = {
    fileTypes: null,
    isHtml: false,
    linkFolders: true,
    include: undefined,
    exclude: undefined,
    emptyDirectories: true,
    maxDepth: Infinity,
    printer: null,
};

/**
* Generates a directory tree from the given directory and all sub-directories
* @param {!String} dir The directory to use as the start (this will be the root node of the tree)
* @param {Object} [opts] An object which supports the following options:
*                        {Array.<String>} fileTypes The file types to print. Defaults to all file types.
*                        {RegExp|undefined} include A regular expression matching files/directories to include.
*                        {RegExp|undefined} exclude A regular expression matching files/directories to exclude.
*                        {Boolean} isHtml Whether to produce HTML output. Defaults to false.
*                        {Boolean} linkFolders Link folders when in HTML output mode. Defaults to true.
*                        {Boolean} emptyDirectories Include empty directories. Defaults to true.
*                        {Number} maxDepth Limit results to a maximum sub-directory depth. Defaults to no limit.
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
    const { include, exclude, fileTypes, printer, emptyDirectories, maxDepth } = normaliseOpts(dir, opts);

    let tree = dirTree(dir, {
        exclude: exclude
            ? new RegExp(exclude)
            : undefined,
        extensions: fileTypes && fileTypes.length
            ? new RegExp(`(?:${fileTypes.join('|').replace('.', '\\.')})$`)
            : undefined,
    });

    if (maxDepth !== Infinity) {
        filterToMaxDepth(tree, maxDepth);
    }
    if (include) {
        // Don't filter out the top level (cwd)
        tree.children = tree.children.filter(child => filterIncluded(child, new RegExp(include)));
    }
    if (!emptyDirectories) {
        filterEmptyDirectories(tree);
    }

    return printer.print(tree);
}

function normaliseOpts(dir, userOpts) {
    checkOpts(userOpts);

    const opts = Object.assign({}, defaultOpts, userOpts);
    opts.printer = opts.printer != null ? opts.printer : getPrinter(dir, opts);

    return opts;
}

function checkOpts(opts) {
    if (opts && opts.printer && opts.isHtml) {
        throw new Error('cannot specify both the printer and isHtml options at the same time');
    }
    if (opts && opts.printer && opts.linkFolders) {
        throw new Error('cannot specify both the printer and linkFolders options at the same time');
    }
}

function getPrinter(dir, opts) {
    return opts.isHtml ? new HtmlPrinter(dir, opts.linkFolders) : new PlainTextPrinter();
}

module.exports.AbstractPrinter = AbstractPrinter;
