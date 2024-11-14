import CryptoJS from 'crypto-js/crypto-js'
import JSEncrypt from 'jsencrypt'
import {
	isArray
} from '../utils/luch-request/utils'
const key =
	'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjv2F8DcFyYrkwmqT2KgcnkdzUQWnoaOXArqqvGgCANvTsmJO9j6qFhNAuabgaowGzhTWaiQArJ+uXddsDbqC0TQR3g3qWXutiYUQmzrDlyv5Bl6CvuWhVg1fFhNvA/F1uyEX5X11Fd3ibAS/sdk+DAwuo4xpmBLEANbITWUHZbXFOijymbEME2UP2aWE6Pcl310uk9tV7egR9jJBfP6NUlCY/bWucaOqh8/wmiYsQ4rC0gsj6IwQsl5cAM1rMLAxmSWa4Q7ldabf5owwuCAsOfjo6RfmRv9e+Jdos1ePAMo1yThhOtm4/E/2OPL7DLNvRRJLw/zpiK4EctbEWPul9wIDAQAB'

function paramsEncryption(data) {
	const sortData = order(data)
	let objectStr = ''
	let dataStr = ''
	for (let key in sortData) {
		if (typeof sortData[key] === 'object' && !isArray(sortData[key])) {
			const objectData = order(sortData[key])
			objectStr = 'body' + '=' + JSON.stringify(objectData) + '&'
		} else if (typeof sortData[key] === 'object' && isArray(sortData[key])) {
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
	var paramsStr = 'timestamp=' + tmp
	if (dataStr) {
		paramsStr += '&' + dataStr.substr(0, dataStr.length - 1)
	}
	var shaText = CryptoJS.SHA256(paramsStr).toString(CryptoJS.enc.Hex).toUpperCase();
	let encryptor = new JSEncrypt()
	encryptor.setPublicKey(key)
	let rsaPassWord = encryptor.encrypt(shaText)
	return {
		timestamp: tmp,
		signature: rsaPassWord
	}
}

function order(obj) {
	const data = {}
	for (let key in obj) {
		if (isArray(obj[key]) && !obj[key].length) {
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
