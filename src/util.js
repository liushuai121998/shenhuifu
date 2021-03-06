import storage from '@system.storage';
/**
 * 显示菜单
 */
function showMenu () {
  const prompt = require('@system.prompt')
  const router = require('@system.router')
  const appInfo = require('@system.app').getInfo()
  prompt.showContextMenu({
    itemList: ['保存桌面', '关于', '取消'],
    success: function (ret) {
      switch (ret.index) {
      case 0:
        // 保存桌面
        createShortcut()
        break
      case 1:
        // 关于
        router.push({
          uri: '/About',
          params: {
            name: appInfo.name,
            icon: appInfo.icon
          }
        })
        break
      case 2:
        // 取消
        break
      default:
        prompt.showToast({
          message: 'error'
        })
      }
    }
  })
}

/**
 * 创建桌面图标
 * 注意：使用加载器测试`创建桌面快捷方式`功能时，请先在`系统设置`中打开`应用加载器`的`桌面快捷方式`权限
 */
function createShortcut () {
  const prompt = require('@system.prompt')
  const shortcut = require('@system.shortcut')
  return new Promise((resolve, reject) => {
    shortcut.hasInstalled({
      success: function (ret) {
        if (ret) {
          prompt.showToast({
            message: '已创建桌面图标'
          })
        } else {
          shortcut.install({
            success: function () {
              resolve()
              prompt.showToast({
                message: '成功创建桌面图标'
              })
            },
            fail: function (errmsg, errcode) {
              reject()
              prompt.showToast({
                message: `创建桌面图标失败`
              })
            }
          })
        }
      }
    })
  })
}
let storageHandle = {
  get(key) {
    return new Promise((resolve, reject) => {
      storage.get({
        key: key,
        success (data) {
            resolve(data)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  set(key, value) {
    if(typeof value === 'object'){
      value = JSON.stringify(value)
    }
    return new Promise((resolve, reject) => {
      storage.set({
        key,
        value,
        success (data) {
          resolve(data)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  clear() {
    // 清空
    storage.clear()
  },
  delete(key) {
    // 删除
    return new Promise((resolve, reject) => {
      storage.delete({
        key,
        success() {
          resolve()
        },
        fail() {
          reject()
        }
      })
    })
  }
}
export default {
  showMenu,
  createShortcut,
  storageHandle
}
