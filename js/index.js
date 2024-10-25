// new VConsole();
const isLocal = location.host.indexOf('localhost') !== -1
const BASE_URL = isLocal ? 'http://localhost' : ''
const user = {
  template: `
    <div :class="[isDark ? 'dark' : '', 'sync-text-container']">
      <textarea id="text" v-model="text"></textarea>
      <div 
        :data-clipboard-text="text"
        data-clipboard-action="copy"
        class="copy-btn"
      ></div>
    </div>
  `,
  data () {
    return {
      text: '',
      timer: null,
      pathname: '',
      timer: null,
      first: true,
      isDark: false
    }
  },
  created () {
    console.log('0d0s0d', this.$route);
    this.isDark = this.$route.query.theme === 'dark'
    let pathname = window.location.pathname.match(/[^\/text\/]+/)[0];
    this.pathname = pathname;

    var clipboard = new ClipboardJS(".copy-btn");
    clipboard.on("success", function (e) {
      console.log("已复制成功" + e.text);
      Qmsg.success("复制成功", { autoClose: true, onClose: () => {} });
    });
    clipboard.on("error", function (e) {
      console.log("您的浏览器可能不支持，请手动复制~");
      Qmsg.error("复制失败，您的浏览器可能不支持，请手动复制~", {
        autoClose: true,
        onClose: () => {},
      });
    });

    axios.get(`${BASE_URL}/getText/${pathname}`)
    .then((res) => {
      console.log(res)
      this.text = res.data.data;
    })
    .catch((err) => {
      console.log(err)
    })
  },
  methods: {
  },
  watch: {
    'text': {
      handler (now, old) {
        if (!this.first) {
          clearTimeout(this.timer);
          this.timer = null;
          this.timer = setTimeout(() => {
            console.log('更新', now);
            let param = new URLSearchParams();
            param.append('data', now)
            axios({
              url: `${BASE_URL}/getText/write?id=${this.pathname}`,
              method: 'post',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: param
            })
            .then((res) => {
              console.log(res)
            })
            .catch((err) => {
              console.log(err)
            })
            clearTimeout(this.timer);
            this.timer = null;
          }, 1000);
        } else {
          this.first = false
        }
      },
      deep: true
    }
  }
}

let routes = [
  {
    path: '/text/:name',
    name: 'user',
    component: user
  }
];



let router = new VueRouter({
  mode: 'history',
  routes
})
let vm = new Vue({
  el: '#app',
  router,
  created () {
    if (window.location.pathname === '/text/') {
      axios.get(`${BASE_URL}/getText/create`)
      .then((res) => {
        console.log(res)
        let href = window.location.href;
        window.location = `${href}${res.data.data}`
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }
});
