import md5 from 'js-md5'
import JSEncrypt from 'jsencrypt'
const pubKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbRIs0unclDk/t/q9apZRpamtdnxJn8npFcIu44Sc6pI+Upcu6zI8xx3hgqj33d17JzE1zYb1X+hvR/1IboxdcBiVUE758tlhN/gvIS7v6mYhoHk0+8cJb8oauVkHlhi/qt4hhYEkHy4Fb48diVdLuElFabGuigFC3loiZcHGd4wIDAQAB' 
function paramsEncryption(data) {
	const sortData = order(data)
	let objectStr = ''
	let dataStr = ''
	for (let key in sortData) {
		if (typeof sortData[key] === 'object' && !Array.isArray(sortData[key])) {
			const objectData = order(sortData[key])
			objectStr = 'body' + '=' + JSON.stringify(objectData) + '&'
		} else if (typeof sortData[key] === 'object' && Array.isArray(sortData[key])) {
			dataStr += key + '=' + JSON.stringify(sortData[key]) + '&'
		} else {
			if (sortData[key]) {
				dataStr += key + '=' + sortData[key] + '&'
			}
		}
	}
	if (objectStr) {
		dataStr += objectStr
	}
	let tmp = Date.parse(new Date()).toString();
	tmp = tmp.substr(0, 10);
	const paramsStr = 'timestamp=' + tmp + '&' + dataStr.substr(0, dataStr.length - 1)
	var md5Text = md5(paramsStr)
	let encryptor = new JSEncrypt()
	encryptor.setPublicKey(pubKey)
	let rsaPassWord = encryptor.encrypt(md5Text)
	return {
		timestamp: tmp,
		signature: rsaPassWord
	}
}

function order(obj) {
	const data = {}
	for (let key in obj) {
		if (Array.isArray(obj[key]) && !obj[key].length) {
			continue
		}
		if ((obj[key] || obj[key] == 0) && obj[key] !== '') {
			data[key] = obj[key]
		}
	}
	var newKey = Object.keys(data).sort();
	var newObj = {};
	for (var i = 0; i < newKey.length; i++) {
		newObj[newKey[i]] = data[newKey[i]]
	}
	return newObj
}

export default paramsEncryption
