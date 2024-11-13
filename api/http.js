import Request from '@/utils/luch-request/index.js'
import store from '../store';
const http = new Request();
const host = "/devHost"
let requestConfig = {
	baseURL: host,
	header: {
		// token: uni.getStorageSync('token') !== undefined ? uni.getStorageSync('token') : ''
	},
	method: 'GET',
	dataType: 'json',
	// #ifndef MP-ALIPAY || APP-PLUS
	responseType: 'text',
	// #endif
	// 注：如果局部custom与全局custom有同名属性，则后面的属性会覆盖前面的属性，相当于Object.assign(全局，局部)
	custom: {}, // 全局自定义参数默认值
	// #ifdef H5 || APP-PLUS || MP-ALIPAY || MP-WEIXIN
	timeout: 60000,
	// #endif
	// #ifdef APP-PLUS
	sslVerify: true,
	// #endif
	// #ifdef H5
	// 跨域请求时是否携带凭证（cookies）仅H5支持（HBuilderX 2.6.15+）
	withCredentials: false,
	// #endif
	// #ifdef APP-PLUS
	firstIpv4: false, // DNS解析时优先使用ipv4 仅 App-Android 支持 (HBuilderX 2.8.0+)
	// #endif
	// 局部优先级高于全局，返回当前请求的task,options。请勿在此处修改options。非必填
	// getTask: (task, options) => {
	// 相当于设置了请求超时时间500ms
	//   setTimeout(() => {
	//     task.abort()
	//   }, 500)
	// },
	// 全局自定义验证器。参数为statusCode 且必存在，不用判断空情况。
	// validateStatus: (statusCode) => { // statusCode 必存在。此处示例为全局默认配置
	//     return statusCode >= 200 && statusCode < 300
	// }
}
http.config = requestConfig


// http.config.header.token = store.state.userInfo?.token
http.config.header.token = 'ZSYd47ddXcuY/rCY2YT0cg=='


http.interceptors.response.use((response) => {
	/* 对响应成功做点什么 可使用async await 做异步操作*/
	//  if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
	//    return Promise.reject(response) // return Promise.reject 可使promise状态进入catch
	// if (response.config.custom.verification) { // 演示自定义参数的作用
	//   return response.data
	// }
	if (response.data.code === 402) {
		uni.showToast({
			title: response.data.message,
			icon: 'none'
		})
	} else if (response.data.code === 406) {
		// 未登录
		// console.log('接口返回没有登录或没有token', response);
		// getApp().$openApi.logout()
		// getApp().$openApi.startLogin()


	} else if (response.data.code === 407) {
		uni.showToast({
			title: '该账号已注销，暂时无法登录',
			icon: 'none'
		})
	} else if (response.data.code === 408) {
		console.log('用户被封');
		getApp().$openApi.logout()
		uni.showModal({
			title: '提示',
			content: '由于违反用户协议，您已被封禁，如有疑问请联系客服',
			showCancel: false,
			success: (res) => {
				if (res.confirm) {
					// uni.navigateBack()
				}
			}
		})
	} else if (response.data.code !== 200 && process.env.NODE_ENV !== 'production') {
		// uni.showToast({
		// 	title: response.data.code + response.data.message,
		// 	icon: 'none'
		// })
	}

	return response
}, (response) => {
	/*  对响应错误做点什么 （statusCode !== 200）*/
	console.log(response)
	return Promise.reject(response)
})


export default {
	http,
}
