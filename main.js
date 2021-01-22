import Vue from 'vue'
import App from './App'
import request from './js/request.js' //请求JS
import message from './js/message.js'
import wPicker from './components/w-picker/w-picker.vue'
import Footer from 'pages/footer/footer.vue'
import store from './store'//vuex

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$reqHttp = request.http //挂载全局http请求方法
Vue.prototype.$message = message.message
Vue.prototype.$token = uni.getStorageSync("userToken")
Vue.prototype.$img = "https://xmxiangshang.com/"	//图片上传请求地址
Vue.prototype.$store = store //把vuex定义成全局组件

Vue.component('Footer', Footer)
Vue.component('w-picker', wPicker)


const debug = true //false : 测试服务器  true : 正式服务器
if (!debug) {
	Vue.prototype.$url = "https://xm.lingshushebei.com/api"
} else {
	Vue.prototype.$url = "https://xmxiangshang.com/api"
}

const app = new Vue({
    ...App,
	store
})
app.$mount()
