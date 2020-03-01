chrome.runtime.onInstalled.addListener(function() {
  // 扩展第一次安装时触发
  // alert('安装完成')
});

chrome.bookmarks.onCreated.addListener(function() {
  // alert('新增书签')
})
// chrome.browserAction.setBadgeText({text: '↑'})
// chrome.browserAction.setBadgeText({text: '↓'})
