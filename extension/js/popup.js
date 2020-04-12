let api = {};
let serverApi = {};
// chrome bookmark api wrapper
(function (api) {
  /**
   * 获得整个书签树
   */
  const getTree = () => {
    return new Promise((resolve) => {
      chrome.bookmarks.getTree(resolve);
    });
  };
  const getTreeAsync = async () => {
    return await getTree();
  };

  /**
   * 获得特定父书签组下的所有子书签和子书签组，
   * 返回的书签数组中是不包含children字段的，即不包含子节点以下的节点
   * @param {String} id 父书签组id
   */
  const getChildren = (id) => {
    return new Promise((resolve) => {
      chrome.bookmarks.getChildren(id, resolve);
    });
  };
  const getChildrenAsync = async (id) => {
    return await getChildren(id);
  };

  /**
   * 获得特定书签组下的所有书签，
   * 返回的书签数组中包含children字段，即包含子节点以下的节点
   * @param {String} id 父书签组id
   */
  const getSubTree = (id) => {
    return new Promise((resolve) => {
      chrome.bookmarks.getSubTree(id, resolve);
    });
  };
  const getSubTreeAsync = async (id) => {
    return await getSubTree(id);
  };

  /**
   * 删除指定id的书签
   * @param {String} id 需要删除的书签的id
   */
  const remove = (id) => {
    return new Promise((resolve) => {
      chrome.bookmarks.remove(id, resolve);
    });
  };
  const removeAsync = async (id) => {
    return await remove(id);
  };

  /**
   * 删除指定id的空书签组，如果书签组下有子书签或子书签组，删除将失败
   * @param {String} id 需要删除的书签文件夹id
   */
  const removeTree = (id) => {
    return new Promise((resolve) => {
      chrome.bookmarks.removeTree(id, resolve);
    });
  };
  const removeTreeAsync = async (id) => {
    await removeTree(id);
  };

  /**
   * 创建一个书签
   * @param {Object} bookmark
   * string	(optional) parentId	父书签组，如果不填，则默认在**其他书签**一栏中
   * integer (optional) index
   * string	(optional) title
   * string	(optional) url 如果为NULL或者不填，则代表一个书签组文件夹
   */
  const create = (bookmark) => {
    return new Promise((resolve) => {
      chrome.bookmarks.create(bookmark, resolve);
    });
  };
  const createAsync = async (bookmark) => {
    return await create(bookmark);
  };

  api.getTreeAsync = getTreeAsync;
  api.getSubTreeAsync = getSubTreeAsync;
  api.getChildrenAsync = getChildrenAsync;
  api.removeAsync = removeAsync;
  api.removeTreeAsync = removeTreeAsync;
  api.createAsync = createAsync;
})(api);

// backend server api wrapper
(function (api) {
  const API_VERSION = "v1";
  let serverAddress = "";

  const setServerAddress = (address) => {
    serverAddress = address;
  };

  const getServerAddress = () => {
    return serverAddress;
  };

  const getVersion = () => {
    return new Promise((resolve, reject) => {
      $.getJSON(`${serverAddress}/${API_VERSION}/version`, (response) => {
        const { code, message, data } = response;
        if (code === 20000) {
          resolve(data);
        } else {
          reject(new Error(message));
        }
      });
    });
  };

  const uploadBookmarks = data => {
    return new Promise((resolve, reject) => {
      $.post(`${serverAddress}/${API_VERSION}/bookmark`, data, (response) => {
        const { code, message, data } = response;
        if (code === 20000) {
          resolve(data);
        } else {
          reject(new Error(message));
        }
      }, 'json');
    });
  };

  const downloadBookmarks = () => {
    return new Promise((resolve, reject) => {
      $.getJSON(`${serverAddress}/${API_VERSION}/bookmark`, (response) => {
        const { code, message, data } = response;
        if (code === 20000) {
          resolve(data);
        } else {
          reject(new Error(message));
        }
      });
    });
  };

  api.setServerAddress = setServerAddress;
  api.getServerAddress = getServerAddress;
  api.getVersion = getVersion;
  api.uploadBookmarks = uploadBookmarks;
  api.downloadBookmarks = downloadBookmarks;
})(serverApi);

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
  this.dateAdded = undefined;
  /**
   * 书签文件夹内容的最后更新时间戳，书签节点没有此属性
   */
  this.dateGroupModified = undefined;
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

  /**
   * 子节点数组
   */
  this.children = undefined;
}

let BookmarkTreeNodeList = [];
const BOOKMARK = 0;
const BOOKEMARK_FOLDER = 1;
const PROTO = "http";
const SERVER_ADDRESS = "192.168.31.161";
const SERVER_PORT = "3000";
const SERVER_URL = `${PROTO}://${SERVER_ADDRESS}:${SERVER_PORT}`;

/**
 * 获得浏览器书签的map表
 * 表的key值表示书签深度，根目录深度为0
 */
async function getBookmarkMap() {
  let localTree = await api.getTreeAsync();
  let localMap = {};

  async function addToMap(localTree, depth) {
    for (let i = 0; i < localTree.length; i++) {
      let node = localTree[i];

      let bookmarkNode = new Node();
      bookmarkNode.id = node.id;
      bookmarkNode.parentId = node.parentId;
      bookmarkNode.index = node.index;
      bookmarkNode.title = node.title;
      bookmarkNode.url = node.url;
      bookmarkNode.type =
        typeof node.dateGroupModified === "undefined"
          ? BOOKMARK
          : BOOKEMARK_FOLDER;
      bookmarkNode.root = typeof node.parentId === "undefined";
      // 根节点没有 dateGroupModified 属性，但是应该是个书签组类型
      if (bookmarkNode.root) {
        bookmarkNode.type = BOOKEMARK_FOLDER;
      }

      if (!Array.isArray(localMap[depth])) {
        localMap[depth] = [];
      }
      localMap[depth].push(bookmarkNode);

      if (
        bookmarkNode.type === BOOKEMARK_FOLDER &&
        Array.isArray(node.children) &&
        node.children.length > 0
      ) {
        for (let j = 0; j < node.children.length; j++) {
          let childNode = node.children[j];
          let childTree = await api.getSubTreeAsync(childNode.id);
          await addToMap(childTree, depth + 1);
        }
      }
    }
  }

  await addToMap(localTree, 0);
  return localMap;
}

function tree2List(tree) {
  let cacheMap = {};
  function add2Map(tree) {
    for (let item of tree) {
      // 给书签文件创建group属性
      if (item.id === "0" || item.id === "1" || item.id === "2" || typeof item.dateGroupModified === 'number') {
        item.group = true
      }
      cacheMap[item.id] = item;
      if (Array.isArray(item.children)) {
        add2Map(item.children);
      }
    }
  }
  add2Map(tree);

  for (let key in cacheMap) {
    let item = cacheMap[key];
    if (typeof item.parentId === "string") {
      if (!Array.isArray(cacheMap[item.parentId].nodes)) {
        cacheMap[item.parentId].nodes = [];
      }
      cacheMap[item.parentId].nodes.push(item.id);
    }
  }

  let list = [];
  for (let key in cacheMap) {
    const item = cacheMap[key];
    list.push({
      id: item.id,
      parentId: item.parentId,
      title: item.title,
      url: item.url,
      index: item.index,
      group: item.group,
      nodes: item.nodes,
    });
  }

  return list;
}
/**
 * 获得浏览器书签的数组
 */
async function getBookmarkList() {
  let localTree = await api.getTreeAsync();
  return tree2List(localTree);
}

/**
 * 数组转map表
 * @param {Object} bookmarkList
 */
function listToMap(bookmarkList) {
  let map = {};
  for (let i = 0; i < bookmarkList.length; i++) {
    let bookmark = bookmarkList[i];
    map[bookmark.id] = bookmark;
  }

  function getDepth(bookmark, depth) {
    if (parseInt(bookmark.id) === 0) {
      return depth;
    } else {
      return getDepth(map[bookmark.parentId], depth + 1);
    }
  }
  let finalMap = {};
  for (let i = 0; i < bookmarkList.length; i++) {
    let bookmark = bookmarkList[i];
    let finalDepth = getDepth(bookmark, 0);
    if (!Array.isArray(finalMap[finalDepth])) {
      finalMap[finalDepth] = [];
    }
    finalMap[finalDepth].push(bookmark);
  }
  return finalMap;
}

async function removeAllBookmarks() {
  let localTree = await api.getTreeAsync();
}

async function restore(remoteBookmarkArray) {
  function getNewbookmarkId(array, parentId) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === parentId) {
        return array[i].newId;
      }
    }
  }

  let array = listToMap(remoteBookmarkArray);
  for (let depth in array) {
    const bookmarks = array[depth];
    for (let i = 0; i < bookmarks.length; i++) {
      const bookmark = bookmarks[i];
      if (
        bookmark.root ||
        bookmark.id === "0" ||
        bookmark.id === "1" ||
        bookmark.id === "2"
      ) {
        bookmark.newId = bookmark.id;
        continue;
      }
      try {
        const newBookmark = await api.createAsync({
          parentId: getNewbookmarkId(array[depth - 1], bookmark.parentId),
          index: bookmark.index,
          title: bookmark.title,
          url: bookmark.url,
        });
        bookmark.newId = newBookmark.id;
        console.log(
          `restroe ${bookmark.title}:${bookmark.id} to ${newBookmark.title}:${newBookmark.id}`
        );
      } catch (error) {
        console.error(error);
      }
    }
  }
}

$("#upload").on("click", async () => {
  let bookmarkArray = await getBookmarkList();
  console.log(bookmarkArray)
  serverApi.uploadBookmarks({
    bookmarks: bookmarkArray
  });
});

$("#download").on("click", async () => {
  const bookmarkArray = await serverApi.downloadBookmarks();
  console.log(bookmarkArray);
});

$("#test").on("click", async () => {
  let array = await getBookmarkList();
  console.log(array);
});

$("#connect").on("click", async () => {
  const serverAddress = $("#server").val() || SERVER_URL;
  serverApi.setServerAddress(serverAddress);
  const version = await serverApi.getVersion();
  $("#version").html(version);
});