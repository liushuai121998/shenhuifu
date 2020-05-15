import router from '@system.router'
import clipboard from '@system.clipboard'
import prompt from '@system.prompt'
import ad from '@service.ad'
export default Custom_page({
  // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖
  private: {
    newsList: [],
    footerAdShow: false,
    modalShow: false
  },
  onInit() {
      this.getData()
      // this.videoAd()
      this.insertAd()
      this.queryFooterAd()
  },
  async getData() {
    const $appDef = this.$app.$def
    const {data} = await $appDef.$http.get(`/index?key=${$appDef.key}`)
    if(data.code === 200) {
      this.newsList = data.newslist
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
        // prompt.showToast({
        //   message: 'insert load'
        // })
        this.interstitialAd.show()
      })
    }
  },
  onHide() {
    this.interstitialAd && this.interstitialAd.destroy() 
    this.videoAd && this.videoAd.destroy() 
  },
  closeModal() {
      this.modalShow = false
  },
  videoAd() {
    if(ad.createRewardedVideoAd) {
      this.videoAd = ad.createRewardedVideoAd({ adUnitId: 'ef9cf71aa5424bcb92b08f1dae8ec773' })
      this.videoAd.onLoad(()=> { 
        // prompt.showToast({
        //   message: 'load'
        // })
        this.videoAd.show()
      })
      this.videoAd.onClose(() => {
        // prompt.showToast({
        //   message: '关闭'
        // })
        this.insertAd()
      })
    }
  }
})