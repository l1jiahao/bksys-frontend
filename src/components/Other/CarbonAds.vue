<script>
const googleAdsUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
export default {
  props: {
    isMobile: Boolean
  },
  // watch: {
  //   $route (e, t) {
  //     const adId = '#adsbygoogle'
  //     // if(isGitee) {
  //     //   adId = '#cf';
  //     // }
  //     if (e.path !== t.path && this.$el.querySelector(adId)) {
  //       this.$el.innerHTML = ''
  //       this.load()
  //     }
  //     this.adInterval && clearInterval(this.adInterval)
  //     this.adInterval = setInterval(() => {
  //       if (!this.$el.querySelector(adId)) {
  //         this.$el.innerHTML = ''
  //         this.load()
  //       }
  //     }, 20000)
  //   }
  // },
  mounted () {
    // this.load()
  },
  methods: {
    load () {
      if (googleAdsUrl) {
        /* eslint-disable */
        let adsbygoogle = []
        const e = document.createElement('script')
        e.id = '_adsbygoogle_js'
        e.src = googleAdsUrl
        this.$el.appendChild(e)
        setTimeout(() => {
          (adsbygoogle = window.adsbygoogle || []).push({})
        }, 2000)
      }
    }
  },
  render () {
    // return <ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-4801326429087140" data-ad-slot="6929057621" />
    return <div class="business-pro-ad"><a href="https://github.com/l1jiahao/bksys-frontend" target="_blank">软件过程管理第六组项目地址</a></div>;
  }
}
</script>

<style lang="less" scoped>
.business-pro-ad {
  position: fixed;
  background: rgba(255,255,255,0.25);
  left: 0;
  bottom: 0;
  padding: 0 12px;
  height: 48px;
  width: 258px;
  z-index: 99;
}
</style>
