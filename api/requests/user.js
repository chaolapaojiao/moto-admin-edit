import request from '@/api/http.js'
const http = request.http
import paramsEncryption from '@/utils/encryption.js'

// 获取用户接口
function getLoginQrCode(deviceId) {
	const {
		timestamp,
		signature
	} = paramsEncryption({
		data: {
			deviceId: deviceId
		}
	})
	return http.post(`/user/createLoginQrCode?timestamp=${timestamp}&signature=${signature}`,{
		deviceId: deviceId
	})
}
export default {
	getLoginQrCode
}