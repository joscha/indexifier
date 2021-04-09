const archy = require('archy');

const wrapHref = require('./wrapHref');
const wrapHtml = require('./wrapHtml');

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

module.exports = { AbstractPrinter, MarkdownPrinter, HtmlPrinter };