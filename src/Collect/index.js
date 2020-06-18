import prompt from '@system.prompt';
import ad from '@service.ad';
import router from '@system.router';
export default Custom_page({
    data: {
        list: [],
        currentIndex: 1,
        visible: false
    },
    onInit() {
        this.createBanner()
        this.queryList()
    },
    queryList() {
        const $appDef = this.$app.$def
        $appDef.storageHandle.get('list').then(d => {
            if(d) {
              try{
                let res = JSON.parse(d)
                this.list = res.map(item => {
                    const arr = item ? item.split('&&') : []
                    return {
                        title: arr[0],
                        content: arr[1]
                    }
                })
              }catch(err) {
                  console.log(err)
              }
            }
          })
    },
    longpress(index) {
        prompt.showDialog({
            title: '提示',
            message: '确定取消收藏嘛？',
            buttons: [
                {
                    text: '确定',
                    color: '#33dd44'
                },
                {
                    text: '取消',
                    color: '#333'
                }
            ],
            success: (data) => {
                if(data.index === 0) {
                    this.list.splice(index, 1)
                    this.$app.$def.storageHandle.set('list', JSON.stringify(this.list.map(item => `${item.title}&&${item.content}`))).then(res => {
                        prompt.showToast({
                            message: '取消收藏成功'
                        })
                    })
                }
            },
            cancel: function() {
                console.log('handling cancel')
            },
            fail: function(data, code) {
                console.log(`handling fail, code = ${code}`)
            }
        })
    },
    createBanner() {
        this.bannerAd =  ad.createBannerAd({
            adUnitId: 'ae29eca5823043249b07468abe98cef6',
            style:{
                left:0,
                top: 1250,
                width: 750,
                height: 400
            }
        })
        this.bannerAd && this.bannerAd.show()
    },
    toHome() {
        router.replace({
            uri: '/Home'
        })
    },
    onHide() {
        this.bannerAd && this.bannerAd.hide()
    }
})