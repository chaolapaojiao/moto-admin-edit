import CryptoJS from 'crypto-js/crypto-js'
import JSEncrypt from 'jsencrypt'
import {
	isArray
} from '../utils/luch-request/utils'
const key =
	'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjv2F8DcFyYrkwmqT2KgcnkdzUQWnoaOXArqqvGgCANvTsmJO9j6qFhNAuabgaowGzhTWaiQArJ+uXddsDbqC0TQR3g3qWXutiYUQmzrDlyv5Bl6CvuWhVg1fFhNvA/F1uyEX5X11Fd3ibAS/sdk+DAwuo4xpmBLEANbITWUHZbXFOijymbEME2UP2aWE6Pcl310uk9tV7egR9jJBfP6NUlCY/bWucaOqh8/wmiYsQ4rC0gsj6IwQsl5cAM1rMLAxmSWa4Q7ldabf5owwuCAsOfjo6RfmRv9e+Jdos1ePAMo1yThhOtm4/E/2OPL7DLNvRRJLw/zpiK4EctbEWPul9wIDAQAB'

function paramsEncryption(data, type = 'get') {
	let objectStr = ''
	let dataStr = ''
	if (type === 'post') {
		const jsonStr = JSON.stringify(data)
		objectStr = 'body' + '=' + jsonStr + '&'
	} else {
		const sortData = cleanAndSort(data)

		for (let key in sortData) {
			if (typeof sortData[key] === 'object' && isArray(sortData[key])) {
				dataStr += key + '=' + JSON.stringify(sortData[key]) + '&'
			} else {
				if (sortData[key]) {
					dataStr += key + '=' + sortData[key] + '&'
				}
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

function cleanAndSort(obj) {
	// 处理数组
	if (Array.isArray(obj)) {
		const filteredArray = obj
			.map(cleanAndSort)
			.filter(item => item !== null && item !== undefined && !(typeof item === 'object' && Object.keys(item)
				.length === 0))
		return filteredArray.length > 0 ? filteredArray : null;
	}

	// 处理对象
	if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
		const cleanedObj = Object.keys(obj)
			.sort()
			.reduce((acc, key) => {
				const value = cleanAndSort(obj[key]);
				if (value !== null && value !== undefined && !(typeof value === 'object' && Object.keys(value)
						.length === 0)) {
					acc[key] = value;
				}
				return acc;
			}, {});
		return Object.keys(cleanedObj).length > 0 ? cleanedObj : null;
	}
	return obj !== '' && obj !== null && obj !== undefined ? obj : null;
}

export default paramsEncryption