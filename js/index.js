// new VConsole();
const user = {
  template: `<textarea id="text" v-model="text"></textarea>`,
  data () {
    return {
      text: '',
      timer: null,
      pathname: '',
      timer: null,
      timer2: null,
      timer3: null,
      timer4: null,
      first: true
    }
  },
  created () {
    let pathname = window.location.pathname.match(/[^\/text\/]+/)[0];
    this.pathname = pathname;
    axios.get(`https://www.chiens.cn/getText/${pathname}`)
    .then((res) => {
      console.log(res)
      this.text = res.data.data;
    })
    .catch((err) => {
      console.log(err)
    })
  },
  mounted() {
    this.timer2 = setInterval(() => {
      console.log('sss')
      axios.get(`https://www.chiens.cn/getText/${this.pathname}`)
      .then((res) => {
        console.log(res)
        this.text = res.data.data;
      })
      .catch((err) => {
        console.log(err)
      })
    }, 2000);
    this.timer3 = setTimeout(() => {
      this.timer4 = setInterval(() => {
        clearInterval(this.timer)
      }, 500);
      setTimeout(() => {
        clearInterval(this.timer4)
      }, 5000)
      clearTimeout(this.timer3)
    }, 300000)
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
              url: `https://www.chiens.cn/getText/write?id=${this.pathname}`,
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
    if (window.location.pathname == '/text/') {
      axios.get('https://www.chiens.cn/getText')
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