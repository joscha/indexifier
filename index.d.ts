declare module 'indexifier' {
    export interface Node {
        name: string;
        children: Node[];
    }
  
    export interface Printer {
        print(node: Node): string;
        printNode(node: Node): string;
    }
  
    export type IndexifierOpts = {
        fileTypes?: string[];
        isHtml?: boolean;
        linkFolders?: boolean;
        include?: RegExp;
        exclude?: RegExp;
        emptyDirectories?: boolean;
        maxDepth?: number;
        printer?: Printer;
    };
  
    declare function indexifier(dir: string, opts?: IndexifierOpts): string;
  
    declare class AbstractPrinter {
        print(node: Node): string;
        abstract printNode(node: Node): string;
    }
  
    interface Indexifier {
      (dir: string, opts?: IndexifierOpts): string;
      AbstractPrinter: typeof AbstractPrinter;
    }
  
    declare const exports: Indexifier;
  
    export = exports;
  }
  