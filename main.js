import App from './App'

import {
	createSSRApp
} from 'vue'
import openApi from '@/api/openApi.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from './store'
import router from './router'
import message from '@/utils/message.js'
export function createApp() {
	const app = createSSRApp(App)
	app.config.globalProperties.$openApi = openApi
	app.config.globalProperties.$Message = message
	app.use(store)
	app.use(router)
	app.use(ElementPlus)
	return {
		app
	}
}