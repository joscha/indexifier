const archy = require('archy');

const wrapHref = require('./wrapHref');
const wrapHtml = require('./wrapHtml');

/**
 * Base printer class. Cannot be implemented directly.
 */
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

/**
 * Prints the tree as simply as possible
 * 
 * Example:
 * ```
 *   ├─┬ A
 *   │ └── c.html
 *   ├── a.html
 *   ├── a.txt
 *   └── b.html
 * ```
 */
class PlainTextPrinter extends AbstractPrinter {
    printNode(node) {
        return node.name;
    }
}

/**
 * Prints the tree as an HTML document, with the tree printed
 * inside a <pre> element.
 * 
 * Example (simplified):
 * ```
 *   <!doctype html>
 *   <html>
 *       <body>
 *           <pre>
 *   <a href=\\"./\\">1</a>
 *   ├─┬ <a href=\\"./A\\">A</a>
 *   │ └── <a href=\\"./A/c.html\\">c.html</a>
 *   ├── <a href=\\"./a.html\\">a.html</a>
 *   ├── <a href=\\"./a.txt\\">a.txt</a>
 *   └── <a href=\\"./b.html\\">b.html</a>
 *           </pre>
 *       </body>
 *   </html>
 * ```
 */
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

module.exports = { AbstractPrinter, PlainTextPrinter, HtmlPrinter };
