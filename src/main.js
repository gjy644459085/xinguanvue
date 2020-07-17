import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css' // 这个nprogress样式必须引入
import './plugins/element.js'
import './assets/css/global.css'
import { hasPermission } from './utils/permissionDirect'

Vue.config.productionTip = false

NProgress.configure({ ease: 'ease', speed: 500 })
NProgress.configure({ minimum: 0.3 })
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://www.localhost:8082/'

// eslint-disable-next-line no-undef
const Plugins = [hasPermission]
Plugins.map((plugin) => {
  Vue.use(plugin)
})
/**
 *  axios请求拦截器
 */
axios.interceptors.request.use(config => {
  NProgress.start() // 设置加载进度条(开始..)
  config.headers.Authorization = window.sessionStorage.getItem('JWT_TOKEN')
  return config
}
, error => {
  return Promise.reject(error)
})

/**
 * axios响应拦截器
 */
axios.interceptors.response.use(
  function (response) {
    NProgress.done() // 设置加载进度条(结束..)
    if (response.data.code === 4002) { // 如果返回的code==4001说明token错误或者token过期
      window.sessionStorage.clear()
      // var vm=new Vue();
      // vm.$message.error("您的登入状态已失效,请您重新登入~")
      return router.push('/login')
    } else {
      return response
    }
  },
  function (error) {
    return Promise.reject(error)
  }
)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
