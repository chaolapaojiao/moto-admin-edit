import request from '@/api/http.js'
const http = request.http
import paramsEncryption from '@/utils/encryption.js'

// 二维码登录
function getLoginQrCode(data) {
	let {
		timestamp,
		signature
	} = paramsEncryption(data, 'post')
	signature = signature.replace(/\+/g, '%2B')
	const jsonStr = JSON.stringify(data)
	return http.post(`/user/createLoginQrCode?timestamp=${timestamp}&signature=${signature}`, jsonStr)
}

function checkQrLogin(data) {
	let {
		timestamp,
		signature
	} = paramsEncryption(data)
	data.timestamp = timestamp
	data.signature = signature
	return http.get('/user/checkQrLogin', {
		params: data
	})
}

// 获取用户作品数据
function getUserPubStatistics() {
	const data = {}
	let {
		timestamp,
		signature
	} = paramsEncryption(data)
	data.timestamp = timestamp
	data.signature = signature
	return http.get('common/getUserPubStatistics', {
		params: data
	})
}

export default {
	getLoginQrCode,
	checkQrLogin,
	getUserPubStatistics
}