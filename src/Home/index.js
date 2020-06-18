import router from '@system.router'
import clipboard from '@system.clipboard'
import prompt from '@system.prompt'
import ad from '@service.ad'
export default Custom_page({
  // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖
  private: {
    newsList: [],
    footerAdShow: false,
    modalShow: false,
    collectIcon: '/Common/collect.png',
  },
  onInit() {
      this.getData()
      this.insertAd()
      this.queryFooterAd()
  },
  async getData() {
    const $appDef = this.$app.$def
    const {data} = await $appDef.$http.get(`/index?key=${$appDef.key}`)
    if(data.code === 200) {
      this.newsList = data.newslist
      $appDef.storageHandle.get('list').then(d => {
        if(d) {
          try{
            let res = JSON.parse(d)
            if(this.newsList[0] && res.indexOf(`${this.newsList[0].title}&&${this.newsList[0].content}`) >= 0) {
              this.collectIcon = '/Common/collect-active.png'
            } else {
              this.collectIcon = '/Common/collect.png'
            }
          }catch(err) {
            this.collectIcon = '/Common/collect.png'
          }
        } else {
          this.collectIcon = '/Common/collect.png'
        }
      })
    }
  },
  onShow() {
    
  },
  longPress(item, e) {
    clipboard.set({
      text: `${item.title}\n${item.content}`,
      success () {
        prompt.showToast({
          message: '复制成功'
        })
      }
    })
  },
  hideFooterAd() {
      this.footerAdShow = false
      this.nativeAd && this.nativeAd.destroy()
  },
  queryFooterAd() {
    if(!ad.createNativeAd) {
      return 
    }
    //   原生广告
    this.nativeAd = ad.createNativeAd({
        adUnitId: '4ddd52c4badf48ed9a7f085479fb9d08'
    })
    this.nativeAd.load()
    this.nativeAd.onLoad((res) => {
      this.footerAd = res.adList[0]
      this.footerAdShow = true
    })
  },
  reportAdClick() {
    this.nativeAd && this.nativeAd.reportAdClick({
        adId: this.footerAd.adId
    })
  },
  reportAdShow() {
    this.nativeAd && this.nativeAd.reportAdShow({
        adId: this.footerAd.adId
    })
  },
//   插屏广告
  insertAd() {
    if(ad.createInterstitialAd) {
      this.interstitialAd = ad.createInterstitialAd({
          adUnitId: '1eaa38c466084d0f8fe92f481d3b9caa'
      })
      this.interstitialAd.onLoad(()=> {
        this.interstitialAd.show()
      })
    }
  },
  onHide() {
    this.interstitialAd && this.interstitialAd.destroy() 
  },
  closeModal() {
      this.modalShow = false
  },
  toCollect() {
    router.replace({
      uri: '/Collect'
    })
  },
  collect(item) {
    const $appDef = this.$app.$def
    $appDef.storageHandle.get('list').then(d => {
      if(d) {
        try{
          let data = JSON.parse(d)
          const str = `${item.title}&&${item.content}`
          if(data.indexOf(str) < 0) {
            data.push(str)
            $appDef.storageHandle.set('list', JSON.stringify(data)).then(res => {
              this.collectList = [...data]
              prompt.showToast({
                message: '收藏成功'
              })
            })
          }
        } catch(err) {
          console.log(err)
        }
      } else {
        const str = `${item.title}&&${item.content}`
        $appDef.storageHandle.set('list', JSON.stringify([str])).then(res => {
          this.collectList = [str]
          prompt.showToast({
            message: '收藏成功'
          })
        })
      }
    })
    this.collectIcon = '/Common/collect-active.png'
  }
})