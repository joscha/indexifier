/**
 * Remove all tree nodes below a given depth.
 * Note: This feature can be inefficient due to this filtering taking place on a complete directory tree,
 * compared to filtering while building the dirTree in the first place.
 * To fix we would need to add this feature to directory-tree instead.
 * @param {dirTree} tree A directory tree
 * @param {number} maxDepth Maximum depth of files/directories to include in tree
 */
function filterToMaxDepth(tree, maxDepth) {
  if (tree.children && tree.children.length > 0) {
      if (maxDepth <= 0) {
          tree.children = []
      } else {
          tree.children.forEach(child => {
              if (child.type === 'directory') {
                  filterToMaxDepth(child, maxDepth - 1);
              }
          })
      }
  }
}

/**
* Remove files and directories from tree that don't match regexp.
* Note: This feature can be inefficient due to this filtering taking place on a complete directory tree,
* compared to filtering while building the dirTree in the first place.
* To fix we would need to add this feature to directory-tree instead.
* @param {dirTree} tree A directory tree
* @param {Regexp} regexp Regexp to match nodes against
*/
function filterIncluded(tree, regexp) {
  if (!tree || !regexp.test(tree.name)) {
      return false;
  }
  if (tree.children && tree.children.length > 0) {
      tree.children = tree.children.filter(child => filterIncluded(child, regexp));
  }
  return true;
}

/**
 * Remove empty directories from the given tree
 * @param {dirTree} tree A directory tree
 */
function filterEmptyDirectories(tree) {
  if (tree.children && tree.children.length > 0) {
      tree.children.forEach(child => {
          if (child.type === 'directory') {
              child.children = filterEmptyDirectories(child);
          }
      });
  }
  return tree.children = tree.children.filter(child => child.type === 'file' || child.children.length > 0);
}

module.exports = {
  filterToMaxDepth,
  filterIncluded,
  filterEmptyDirectories,
}
