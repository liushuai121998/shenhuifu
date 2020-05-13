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
    //   this.queryFooterAd()
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
    //   原生广告
    this.nativeAd =   ad.createNativeAd({
        adUnitId: ''
    })
    this.nativeAd.load((res) => {
        console.log(res)
    }, (fail) => {
        console.log(fail)
    })
    // 上报广告曝光
    this.nativeAd.reportAdShow({
        adId: ""
    })
    // 上报广告点击
    this.nativeAd.reportAdClick({
        adId: ""
    })
  },
//   插屏广告
  insertAd() {
    this.interstitialAd = ad.createInterstitialAd({
        adUnitId: ''
    })
    this.interstitialAd.onLoad(()=> {
        console.log("插屏广告加载成功");
        this.interstitialAd.show();
    })
  },
  onHide() {
    this.interstitialAd && this.interstitialAd.destroy() 
  },
  closeModal() {
      this.modalShow = false
  }
})