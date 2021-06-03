function setUpdatetime (time) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({
      updateTime: time
    }, resolve)
  })
}

function getUpdatetime () {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['updateTime'], function (result) {
      resolve(result.updateTime)
    })
  })
}

export default {
  setUpdatetime,
  getUpdatetime
}
