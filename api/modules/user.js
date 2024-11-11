import request from '@/api/http.js'
const http = request.http
import paramsEncryption from '@/utils/encryption.js'

// 获取用户接口
function getLoginQrCode(deviceId) {
	let {
		timestamp,
		signature
	} = paramsEncryption({
		deviceId: deviceId
	})
	signature = signature.replace(/\+/g, '%2B')
	return http.post(`/user/createLoginQrCode?timestamp=${timestamp}&signature=${signature}`, deviceId)
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
export default {
	getLoginQrCode,
	checkQrLogin
}