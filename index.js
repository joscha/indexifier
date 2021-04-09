const fs = require('fs');

const dirTree = require('directory-tree');
const archy = require('archy');

const { filterToMaxDepth, filterIncluded, filterEmptyDirectories } = require('./dirTreeFilters')
const { DirectoryInvalidError } = require('./exceptions');
const wrapHref = require('./wrapHref');
const wrapHtml = require('./wrapHtml');

const defaultOpts = {
    fileTypes: null,
    isHtml: false,
    linkFolders: true,
    include: undefined,
    exclude: undefined,
    emptyDirectories: true,
    maxDepth: Infinity,
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

function normaliseOpts(dir, opts) {
    const nOpts = Object.assign({}, defaultOpts, opts);
    nOpts.printer = (nOpts.isHtml) ? new HtmlPrinter(dir, nOpts.linkFolders) : new MarkdownPrinter();
    return nOpts;
}

class AbstractPrinter {
    constructor() {
        if (this.constructor === AbstractPrinter) {
            throw new Error('AbstractPrinter is abstract and cannot be constructed directly');
        }
    }

    _dirTreeToArchyTree(node) {
        if (!node.children) {
            return this.printNode(node);
        }
        return {
            label: this.printNode(node),
            nodes: node.children.map(childNode => this._dirTreeToArchyTree(childNode)),
        };
    }

    print(node) {
        return archy(this._dirTreeToArchyTree(node))
    }

    printNode(_node) {
        throw new Error('Printer::printNode is not implemented');
    }
}

class MarkdownPrinter extends AbstractPrinter {
    printNode(node) {
        return node.name;
    }
}

class HtmlPrinter extends AbstractPrinter {
    constructor(cwd, linkFolders) {
        super();
        this.cwd = cwd;
        this.linkFolders = linkFolders;
    }

    print(node) {
        const outTree = super.print(node);
        return wrapHtml(outTree, node.name);
    }

    printNode(node) {
        if (node.children) {
            // any node that has children is a "folder"
            return this.linkFolders ? wrapHref(node, this.cwd) : node.name;
        }
        return wrapHref(node, this.cwd);
    }
}
