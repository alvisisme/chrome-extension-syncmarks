// ==================================
// dom action helper
const domHelper = {
  loadScript (url) {
    var script = document.createElement('script')
    script.type = 'text/javacript'
    script.src = url
    document.body.appendChild(script)
  },
  loadStyle (url) {
    var sytle = document.createElement('link')
    sytle.rel = 'stylesheet'
    sytle.type = 'text/css'
    sytle.href = url
    sytle.media = 'screen'
    var headobj = document.getElementsByTagName('head')[0]
    headobj.appendChild(sytle)
  }
}
// ==================================
// chrome bookmark api wrapper
const api = {
  /**
   * 获得整个书签树
   */
  getTreeAsync () {
    return new Promise(resolve => {
      chrome.bookmarks.getTree(resolve)
    })
  },
  /**
   * 获得特定父书签组下的所有子书签和子书签组，
   * 返回的书签数组中是不包含children字段的，即不包含子节点以下的节点
   * @param {String} id 父书签组id
   */
  getChildrenAsync (id) {
    return new Promise(resolve => {
      chrome.bookmarks.getChildren(id, resolve)
    })
  },
  /**
   * 获得特定书签组下的所有书签，
   * 返回的书签数组中包含children字段，即包含子节点以下的节点
   * @param {String} id 父书签组id
   */
  getSubTreeAsync (id) {
    return new Promise(resolve => {
      chrome.bookmarks.getSubTree(id, resolve)
    })
  },
  /**
   * 删除指定id的书签
   * @param {String} id 需要删除的书签的id
   */
  removeAsync (id) {
    return new Promise(resolve => {
      chrome.bookmarks.remove(id, resolve)
    })
  },
  /**
   * 删除指定id的空书签组，如果书签组下有子书签或子书签组，删除将失败
   * @param {String} id 需要删除的书签文件夹id
   */
  removeTreeAsync (id) {
    return new Promise(resolve => {
      chrome.bookmarks.removeTree(id, resolve)
    })
  },
  /**
   * 创建一个书签
   * @param {Object} bookmark
   * @param {String} (optional) bookmark.parentId 父书签组，如果不填，则默认在**其他书签**一栏中
   * @param {Number} (optional) bookmark.index
   * @param {String} bookmark.title
   * @param {String} (optional) bookmark.url 如果为NULL或者不填，则代表一个书签组文件夹
   */
  createAsync (bookmark) {
    return new Promise(resolve => {
      chrome.bookmarks.create(bookmark, resolve)
    })
  },
  /**
   * 获得浏览器书签的数组
   */
  async getBookmarkList () {
    function tree2List (tree) {
      const cacheMap = {}
      function add2Map (tree) {
        for (const item of tree) {
          // 给书签文件创建group属性
          if (
            parseInt(item.id) < 3 ||
            typeof item.dateGroupModified === 'number'
          ) {
            item.group = true
          }
          cacheMap[item.id] = item
          if (Array.isArray(item.children)) {
            add2Map(item.children)
          }
        }
      }
      add2Map(tree)
      for (const key in cacheMap) {
        const item = cacheMap[key]
        if (typeof item.parentId === 'string') {
          if (!Array.isArray(cacheMap[item.parentId].nodes)) {
            cacheMap[item.parentId].nodes = []
          }
          cacheMap[item.parentId].nodes.push(item.id)
        }
      }
      const list = []
      for (const key in cacheMap) {
        const item = cacheMap[key]
        list.push({
          id: item.id,
          parentId: item.parentId,
          title: item.title,
          url: item.url,
          index: item.index,
          group: item.group,
          nodes: item.nodes
        })
      }
      return list
    }
    const localTree = await api.getTreeAsync()
    return tree2List(localTree)
  }
}
// ==================================
// backend server api wrapper
const serverApi = (function () {
  const API_VERSION = 'v1'
  let serverAddress = ''

  const setServerAddress = (address) => {
    serverAddress = address
  }

  const getServerAddress = () => {
    return serverAddress
  }

  const getVersion = () => {
    return new Promise((resolve, reject) => {
      const xhttp = new XMLHttpRequest()
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          const result = JSON.parse(this.responseText)
          resolve(result.data)
        }
      }
      xhttp.open('GET', `${serverAddress}/${API_VERSION}/version`, true)
      xhttp.send()
    })
  }

  const uploadBookmarks = (data) => {
    return new Promise((resolve, reject) => {
      const xhttp = new XMLHttpRequest()
      xhttp.open('POST', `${serverAddress}/${API_VERSION}/bookmark`, true)
      xhttp.setRequestHeader('content-type', 'application/json')
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          const result = JSON.parse(this.responseText)
          resolve(result.data)
        }
      }
      // 将用户输入值序列化成字符串
      xhttp.send(JSON.stringify(data))
    })
  }

  const downloadBookmarks = () => {
    return new Promise((resolve, reject) => {
      const xhttp = new XMLHttpRequest()
      xhttp.open('GET', `${serverAddress}/${API_VERSION}/bookmark`, true)
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          const result = JSON.parse(this.responseText)
          resolve(result.data)
        }
      }
      xhttp.send()
    })
  }

  return {
    setServerAddress,
    getServerAddress,
    getVersion,
    uploadBookmarks,
    downloadBookmarks
  }
})()

// ==================================
// starter
const PROTO = 'http'
const SERVER_ADDRESS = '192.168.31.238'
const SERVER_PORT = '3000'
const SERVER_URL = `${PROTO}://${SERVER_ADDRESS}:${SERVER_PORT}`

/**
 * 数组转map表
 * @param {Object} bookmarkList
 */
function listToMap (bookmarkList) {
  const map = {}
  for (let i = 0; i < bookmarkList.length; i++) {
    const bookmark = bookmarkList[i]
    map[bookmark.id] = bookmark
  }

  function getDepth (bookmark, depth) {
    if (parseInt(bookmark.id) === 0) {
      return depth
    } else {
      return getDepth(map[bookmark.parentId], depth + 1)
    }
  }
  const finalMap = {}
  for (let i = 0; i < bookmarkList.length; i++) {
    const bookmark = bookmarkList[i]
    const finalDepth = getDepth(bookmark, 0)
    if (!Array.isArray(finalMap[finalDepth])) {
      finalMap[finalDepth] = []
    }
    finalMap[finalDepth].push(bookmark)
  }
  return finalMap
}

async function removeAllBookmarks () {
  async function removeBookmark (item) {
    // 不可删除节点
    if (parseInt(item.id) <= 2) {
      return
    }
    try {
      if (Array.isArray(item.children)) {
        await api.removeTreeAsync(item.id)
      } else {
        await api.removeAsync(item.id)
      }
      // console.log(`remove bookmark "${item.title}" success`)
    } catch (err) {
      console.error(`remove bookmark "${item.title}" error`)
      console.error(err)
    }
  }
  async function dfsRemove (tree) {
    if (!Array.isArray(tree)) {
      throw new Error('tree should be an array')
    }
    for (const item of tree) {
      if (Array.isArray(item.children) && item.children.length > 0) {
        // 根节点
        await dfsRemove(item.children)
      }
      await removeBookmark(item)
    }
  }
  const localTree = await api.getTreeAsync()
  await dfsRemove(localTree)
}

/**
 * 覆盖同步
 */
async function restoreByOverwrite () {
  await removeAllBookmarks()
  const remoteBookmarkArray = await serverApi.downloadBookmarks()
  function getNewbookmarkId (array, parentId) {
    for (const item of array) {
      if (item.id === parentId) {
        return item.newId
      }
    }
  }
  const map = listToMap(remoteBookmarkArray)
  const maxDepth = Object.keys(map).length
  for (let depth = 0; depth < maxDepth; depth++) {
    const bookmarks = map[depth]
    for (const bookmark of bookmarks) {
      // 第0层应该自动过滤
      if (parseInt(bookmark.id) < 3) {
        bookmark.newId = bookmark.id
        continue
      }
      try {
        const newParentId = getNewbookmarkId(map[depth - 1], bookmark.parentId)
        const newBookmark = await api.createAsync({
          parentId: newParentId,
          index: bookmark.index,
          title: bookmark.title,
          url: bookmark.url
        })
        bookmark.newId = newBookmark.id
      } catch (error) {
        console.error(`create bookmark ${bookmark.titel} error`)
        console.error(error)
      }
    }
  }
}

/**
 * 合并同步
 */
async function restoreByMerge () {
  let maxId = 0
  const localBookmarks = await api.getBookmarkList()
  localBookmarks.forEach(bookmark => {
    if (parseInt(bookmark.id) > maxId) {
      maxId = parseInt(bookmark.id)
    }
  })
  // 确保远程书签和本地书签的id不一致
  let remoteBookmarks = await serverApi.downloadBookmarks()
  remoteBookmarks = remoteBookmarks.filter(bookmark => {
    if (parseInt(bookmark.id) > 2) {
      bookmark.id = maxId + parseInt(bookmark.id) + ''
      if (parseInt(bookmark.parentId) > 2) {
        bookmark.parentId = maxId + parseInt(bookmark.parentId) + ''
      }
      return true
    }
    return false
  })

  const mergedBookmarks = [].concat(remoteBookmarks, localBookmarks)
  await removeAllBookmarks()
  // 按照树的层次结构合并同一层级的书签
  // eslint-disable-next-line no-unused-vars
  function getNewbookmarkId (array, parentId) {
    for (const item of array) {
      if (item.id === parentId) {
        return item.newId
      }
    }
  }
  function getSameBookmark (bookmark, bookmarks) {
    for (const item of bookmarks) {
      if (item === undefined) {
        continue
      }
      if (item.deleted) {
        continue
      }
      // 同类型，同标题，同url判断为同一个书签
      if (
        item.id !== bookmark.id &&
        item.title === bookmark.title &&
        item.url === bookmark.url) {
        return item
      }
    }
  }
  const map = listToMap(mergedBookmarks)
  const maxDepth = Object.keys(map).length

  for (let depth = 0; depth < maxDepth; depth++) {
    const bookmarks = map[depth]
    for (const index in bookmarks) {
      const bookmark = bookmarks[index]
      // 第0层应该自动过滤
      if (parseInt(bookmark.id) < 3) {
        bookmark.newId = bookmark.id
        continue
      }
      const sameBookmark = getSameBookmark(bookmark, bookmarks)
      if (sameBookmark) {
        // 书签组
        if (bookmark.url === undefined) {
          if (depth + 1 < maxDepth) {
            // 叶子节点中所有节点挂在同类书签上
            for (const item of map[depth + 1]) {
              if (item.parentId === bookmark.id) {
                item.parentId = sameBookmark.id
              }
            }
          }
        }
        // 标记为删除
        bookmark.deleted = true
      } else {
        bookmark.deleted = false
      }
      map[depth] = map[depth].filter(bookmark => {
        return !bookmark.deleted
      })
    }
  }

  for (let depth = 0; depth < maxDepth; depth++) {
    const bookmarks = map[depth]
    for (const index in bookmarks) {
      const bookmark = bookmarks[index]
      if (parseInt(bookmark.id) < 3) {
        bookmark.newId = bookmark.id
        continue
      }
      // 重新计算index
      bookmark.index = parseInt(index)
      try {
        const newParentId = getNewbookmarkId(map[depth - 1], bookmark.parentId)
        const newBookmark = await api.createAsync({
          parentId: newParentId,
          index: bookmark.index,
          title: bookmark.title,
          url: bookmark.url
        })
        bookmark.newId = newBookmark.id
      } catch (error) {
        console.error(`create bookmark ${bookmark.title} error`)
        console.error(error)
      }
    }
  }
}

const connectButton = document.getElementById('connect')
if (connectButton) {
  connectButton.addEventListener('click', async () => {
    const serverAddress = document.getElementById('server').value || SERVER_URL
    serverApi.setServerAddress(serverAddress)
    const version = await serverApi.getVersion()
    document.getElementById('version').innerHTML = version
  })
}

const uploadButton = document.getElementById('upload')
if (uploadButton) {
  uploadButton.addEventListener('click', async () => {
    const bookmarks = await api.getBookmarkList()
    serverApi.uploadBookmarks({ bookmarks })
  })
}

const overwriteSyncButton = document.getElementById('overwriteSync')
if (overwriteSyncButton) {
  overwriteSyncButton.addEventListener('click', async () => {
    return restoreByOverwrite()
  })
}

const mergeSyncButton = document.getElementById('mergeSync')
if (mergeSyncButton) {
  mergeSyncButton.addEventListener('click', async () => {
    return restoreByMerge()
  })
}

const removeButton = document.getElementById('removeAll')
if (removeButton) {
  removeButton.addEventListener('click', async () => {
    await removeAllBookmarks()
    const bookmarkArray = await api.getBookmarkList()
    if (Array.isArray(bookmarkArray) && bookmarkArray.length === 3) {
      console.log('clear bookmarks success')
    } else {
      console.error('clear bookmarks error')
    }
  })
}

domHelper.loadScript('./js/test.js')
domHelper.loadStyle('./css/normalize.css')
domHelper.loadStyle('./css/style.css')
