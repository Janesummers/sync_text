// new VConsole();
const isLocal = location.host.indexOf('localhost') !== -1
const BASE_URL = isLocal ? 'http://localhost:8080' : 'https://www.chiens.cn'
const user = {
  template: `
    <textarea id="text" v-model="text"></textarea>
  `,
  data () {
    return {
      text: '',
      timer: null,
      pathname: '',
      timer: null,
      first: true
    }
  },
  created () {
    console.log('0d0s0d');
    let pathname = window.location.pathname.match(/[^\/text\/]+/)[0];
    this.pathname = pathname;
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
    toClipboard() {
      // return navigator.clipboard.readText().then(res => {
      //   console.log('剪贴板内容', res);
      //   Qmsg.success("粘贴成功", { autoClose: true, onClose: () => {} });
      //   return res
      // })
    }
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
      axios.get(`${BASE_URL}/getText`)
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