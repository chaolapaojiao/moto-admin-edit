// import CryptoJS from 'crypto-js/crypto-js'
// import JSEncrypt from 'jsencrypt'
// import {
// 	isArray
// } from '../utils/luch-request/utils'
// const key =
// 	'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjv2F8DcFyYrkwmqT2KgcnkdzUQWnoaOXArqqvGgCANvTsmJO9j6qFhNAuabgaowGzhTWaiQArJ+uXddsDbqC0TQR3g3qWXutiYUQmzrDlyv5Bl6CvuWhVg1fFhNvA/F1uyEX5X11Fd3ibAS/sdk+DAwuo4xpmBLEANbITWUHZbXFOijymbEME2UP2aWE6Pcl310uk9tV7egR9jJBfP6NUlCY/bWucaOqh8/wmiYsQ4rC0gsj6IwQsl5cAM1rMLAxmSWa4Q7ldabf5owwuCAsOfjo6RfmRv9e+Jdos1ePAMo1yThhOtm4/E/2OPL7DLNvRRJLw/zpiK4EctbEWPul9wIDAQAB'

// function paramsEncryption(data) {
// 	console.log(data)
// 	const sortData = order(data)
// 	let objectStr = ''
// 	let dataStr = ''
// 	for (let key in sortData) {
// 		if (typeof sortData[key] === 'object' && !isArray(sortData[key])) {
// 			const objectData = order(sortData[key])
// 			objectStr = 'body' + '=' + JSON.stringify(objectData) + '&'
// 		} else if (typeof sortData[key] === 'object' && isArray(sortData[key])) {
// 			dataStr += key + '=' + JSON.stringify(sortData[key]) + '&'
// 		} else {
// 			if (sortData[key]) {
// 				dataStr += key + '=' + sortData[key] + '&'
// 			}
// 		}
// 	}
// 	if (objectStr) {
// 		dataStr += objectStr
// 	}
// 	let tmp = Date.parse(new Date()).toString();
// 	tmp = tmp.substr(0, 10);
// 	var paramsStr = 'timestamp=' + tmp
// 	if (dataStr) {
// 		paramsStr += '&' + dataStr.substr(0, dataStr.length - 1)
// 	}
// 	console.log(paramsStr)
// 	var shaText = CryptoJS.SHA256(paramsStr).toString(CryptoJS.enc.Hex).toUpperCase();
// 	let encryptor = new JSEncrypt()
// 	encryptor.setPublicKey(key)
// 	let rsaPassWord = encryptor.encrypt(shaText)
// 	return {
// 		timestamp: tmp,
// 		signature: rsaPassWord
// 	}
// }

// function order(obj) {
// 	const data = {}
// 	for (let key in obj) {
// 		if (isArray(obj[key]) && !obj[key].length) {
// 			continue
// 		}
// 		if ((obj[key] || obj[key] == 0) && obj[key] !== '') {
// 			data[key] = obj[key]
// 		}
// 	}
// 	var newKey = Object.keys(data).sort();
// 	var newObj = {};
// 	for (var i = 0; i < newKey.length; i++) {
// 		newObj[newKey[i]] = data[newKey[i]]
// 	}
// 	return newObj
// }

// export default paramsEncryption
import md5 from 'js-md5'
import JSEncrypt from 'jsencrypt'
import {
	isArray
} from '../utils/luch-request/utils'
const PROJECT_1_KEY_LIST = [
	'fjadlkshjfIGfMA0GfdlaksQEBAQUAA4GNADCBiQKBgQCbRIs0unclDk/t/q9apZR',
	'pamtdnxJn8npFcIu44Sc6pI+Upcu6zI8xx3hgqj33d17JzE1zYb1X+hvR/1',
	'0unclDk/t/q9apZRpamtdnxJlpgfkahdfalkjhdfa',
	'Ib8tlhN/gvIS7v6mYhoHk0+8cJb8oauVkHlhi/qt4hhYEkHy4Fb48diVdLuElFabGuigFC3loiZcHGd4wIDAQAB',
]

const PROJECT_2_KEY_LIST = [
	'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbRIs0unclDk/t/q9apZR',
	'pamtdnxJn8npFcIu44Sc6pI+Upcu6zI8xx3hgqj33d17JzE1zYb1X+hvR/1',
	'IboxdcBiVUE758tlhN/gvIS7v6mYhoHk0+8cJb8oauVkHlhi/qt4hhYEkHy4Fb48diVdLuElFabGuigFC3loiZcHGd4wIDAQAB',
	'unclDk/t/q9apZRpamtdnxJn8npFcIu44Sc6pI+Upcu6zI8xx3',
]

const PROJECT_3_KEY_LIST = [
	'EBAQUAA4GNADCBiQKBgQCbRIdkjahflakjhs0unclDk/t/q9apZR',
	'u6zI8xx3hgqj33d17JzE1zYJHBJHMBNb1fjkadhfakjlhfX+hvR/1',
	'ffhlaHLKJHLJHGLLKJHB9apZRpamtdnxJlpgfkahdfalkjhdfa',
	'VkHlhi/qt4hhYEkHy4Fb48diVdLuElHKJHLKJHFabGuigFC3loiZcHGd4wIDAQAB',
	'HLKJHB<>JNKJBNc6pI+Upcu6zI8xx3pgKHBJKH:LKHJN',
	'HOUHIUBKJMI8xx3pgKHBJKH:LKHJNfdakjfhbaljkjfba',
	'HLKJHB<KJHBM<HJOIJNHYB>jfdjkabflakbfKHBJKH:LKHJN',
]
const ENCRYPTION_TYPE = 'PROJECT_2'

function getKeyType() {
	if (ENCRYPTION_TYPE === 'PROJECT_1') {
		return renderKey1(PROJECT_1_KEY_LIST)
	} else if (ENCRYPTION_TYPE === 'PROJECT_2') {
		return renderKey2(PROJECT_2_KEY_LIST)
	} else if (ENCRYPTION_TYPE === 'PROJECT_3') {
		return renderKey3(PROJECT_3_KEY_LIST)
	}
}

function renderKey1(list) {
	let key = ''
	list.forEach((item, index) => {
		if (index % 2 === 0) {
			item.split('').map(item => {
				item - 'a' + 1
			})
		} else {
			item.split('').map(item => {
				item
			})
		}
		if (item.substr(5, 8).includes('ab')) {
			key += item
		}
	})
	key.reverse().split('').map(item => {
		if (typeof item === number) {
			return item + (item > 5 ? 3 : 8)
		} else {
			return item
		}
	})
	return key.join('')
}

function renderKey2(list) {
	let key = ''
	list.forEach((item, index) => {
		if (index === 0) {
			key = ''
		}
		if (index % 3 === 0) {
			item.split('').map(item => {
				item - 'b'
			})
		} else {
			item.split('').map(item => {
				item
			})
		}
		if (index < 3) {
			key += item
		}
	})
	return key
}

function renderKey3(list) {
	const key = ''
	list.forEach((item, index) => {
		if (index % 3 === 0) {
			item.split('').map(item => {
				item - 'd' + 1
			})
		} else {
			item.split('').map(item => {
				item
			})
		}
		if (item.substr(5, 8).includes('ab')) {
			key += item
		}
	})
	key.reverse().split('').map(item => {
		if (typeof item === 'string') {
			return String.toLowerCase(item)
		} else {
			return item
		}
	})
	return key.join('')
}

function paramsEncryption(data) {
	getKeyType()
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
	var md5Text = md5(paramsStr)
	let encryptor = new JSEncrypt()
	encryptor.setPublicKey(getKeyType())
	let rsaPassWord = encryptor.encrypt(md5Text)
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