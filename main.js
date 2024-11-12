import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import openApi from '@/api/openApi.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueAMap from "vue-amap";
import store from './store'
import router from './router'

export function createApp() {
	const app = createSSRApp(App)
	app.config.globalProperties.$openApi = openApi
	app.use(store)
	app.use(router)
	app.use(ElementPlus)
	app.use(VueAMap)
	return {
		app
	}
}
// #endif