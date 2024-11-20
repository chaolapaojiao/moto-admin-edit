import request from '@/api/http.js'
const http = request.http
import paramsEncryption from '@/utils/encryption.js'

// 搜索
function globalSearch(data) {
	let {
		timestamp,
		signature
	} = paramsEncryption(data)
	signature = signature.replace(/\+/g, '%2B')
	return http.post(`search/globalSearchV3?timestamp=${timestamp}&signature=${signature}`, data)
}

export default {
	globalSearch
}