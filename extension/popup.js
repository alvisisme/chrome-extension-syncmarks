function Node() {
  /**
   * id ( string )
   * 节点的唯一标识, id 在当前配置文件中是唯一的，浏览器重启后依然有效。
   */
  this.id = "0";
  /**
   * 父节点的ID，根节点没有此属性
   */
  this.parentId = undefined;
  /**
   * 书签节点创建时的时间戳
   */
  this.dateAdded = 0;
  /**
   * 书签文件夹内容的最后更新时间戳，书签节点没有此属性
   */
  this.dateGroupModified = 0;
  /**
   * 书签在父节点中的索引，根节点没有此属性
   */
  this.index = 0;
  /**
   * 书签标题
   */
  this.title = "";
  /**
   * 书签的url，书签文件夹没有此属性
   */
  this.url = undefined;
  /**
   * 节点类型
   * 0 为书签
   * 1 为书签文件夹
   */
  this.type = 0;
  /**
   * 是否为根节点
   */
  this.root = false;
}

let BookmarkTreeNodeList = [];
const BOOKMARK = 0;
const BOOKEMAR_FOLDER = 1;

function addToList(node) {
  let bookmarkNode = new Node();
  bookmarkNode.id = node.id;
  bookmarkNode.parentId = node.parentId;
  bookmarkNode.dateAdded = node.dateAdded;
  bookmarkNode.dateGroupModified = node.dateGroupModified;
  bookmarkNode.index = node.index;
  bookmarkNode.title = node.title;
  bookmarkNode.url = node.url;
  bookmarkNode.type =
    typeof node.dateGroupNodified === "undefined" ? BOOKMARK : BOOKEMAR_FOLDER;
  bookmarkNode.root = typeof node.parentId === "undefined";
  BookmarkTreeNodeList.push(bookmarkNode);

  if (Array.isArray(node.children)) {
    for (let j = 0; j < node.children.length; j++) {
      addToList(node.children[j]);
    }
  }
}

function getBookmarkList(callback) {
  chrome.bookmarks.getTree(function(tree) {
    for (let i = 0; i < tree.length; i++) {
      let node = tree[i];
      addToList(node);
    }
    callback(null, BookmarkTreeNodeList);
  });
}

$("#upload").on("click", function() {
  getBookmarkList(function(error, list) {
    for (let i = 0; i < list.length; i++) {
      $.ajax({
        type: "POST",
        url: "http://localhost:3000/bookmarks",
        data: list[i],
        success: function(data) {
          callback(data);
        }
      });
    }
  });
});

$("#download").on("click", function() {
  alert("下载");
});
