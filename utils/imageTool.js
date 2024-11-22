import * as imageConversion from 'image-conversion'
import request from '@/api/http.js'
import md5 from 'js-md5'
import CryptoJS from 'crypto-js/crypto-js'
import JSEncrypt from 'jsencrypt'
const http = request.http
const key =
	'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjv2F8DcFyYrkwmqT2KgcnkdzUQWnoaOXArqqvGgCANvTsmJO9j6qFhNAuabgaowGzhTWaiQArJ+uXddsDbqC0TQR3g3qWXutiYUQmzrDlyv5Bl6CvuWhVg1fFhNvA/F1uyEX5X11Fd3ibAS/sdk+DAwuo4xpmBLEANbITWUHZbXFOijymbEME2UP2aWE6Pcl310uk9tV7egR9jJBfP6NUlCY/bWucaOqh8/wmiYsQ4rC0gsj6IwQsl5cAM1rMLAxmSWa4Q7ldabf5owwuCAsOfjo6RfmRv9e+Jdos1ePAMo1yThhOtm4/E/2OPL7DLNvRRJLw/zpiK4EctbEWPul9wIDAQAB'

const supportList = [
	'image/png',
	'image/jpeg',
	'image/webp'
]
const timestamp = Date.parse(new Date()).toString().substr(0, 10)
// 获取图片尺寸
function getImageScale(url) {
	return new Promise((resolve, reject) => {
		uni.getImageInfo({
			src: url,
			success: (res) => {
				if (res.height > 1080) {
					const scale = 1080 / res.height
					resolve({
						height: 1080,
						width: res.width * scale
					})
				} else {
					resolve({
						height: res.height,
						width: res.width
					})
				}
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// 图片压缩
async function imageCompress(url, quality = 0.8) {
	let imgType = (await fetch(url).then(r => r.blob())).type
	if (!supportList.includes(imgType)) {
		imgType = 'image/jpeg'
	}
	return new Promise(async (resolve, reject) => {
		const scaleInfo = await getImageScale(url)
		let img = new Image()
		img.src = url
		let canvas = document.createElement("canvas")
		img.width = canvas.width = scaleInfo.width
		img.height = canvas.height = scaleInfo.height;
		let ctx = canvas.getContext("2d")
		ctx.drawImage(img, 0, 0, img.width, img.height)
		try {
			canvas.toBlob(
				async (blob) => {
						const result = await imageConversion.compress(blob, quality)
						const file = new window.File([result], timestamp + blob.size, {
							type: imgType
						})
						resolve({
							url: URL.createObjectURL(file),
							file: file
						})
					},
					imgType,
					quality
			)
		} catch (e) {
			const response = await fetch(url, {
				mode: 'cors'
			});
			const blob = await response.blob();
			const result = await imageConversion.compress(blob, quality)
			const file = new window.File([result], timestamp + blob.size, {
				type: imgType
			})
			resolve({
				url: URL.createObjectURL(file),
				file: file
			})
		}
	})
}

// 图片加密
function uploadEncryption(url, type) {
	return new Promise(async (resolve, reject) => {
		const compressInfo = await imageCompress(url)
		const reader = new FileReader()
		reader.readAsArrayBuffer(compressInfo.file);
		reader.onload = (e) => {
			const arrayBuffer = e.target.result;
			const md5Value = md5(arrayBuffer)
			const paramsStr = 'timestamp=' + timestamp + '&md5=' + md5Value + '&type=' + type
			const sha256Value = CryptoJS.SHA256(paramsStr).toString(CryptoJS.enc.Hex).toUpperCase();
			let encryptor = new JSEncrypt()
			encryptor.setPublicKey(key)
			let rsaPassWord = encryptor.encrypt(sha256Value)
			rsaPassWord = rsaPassWord.replace(/\+/g, '%2B')
			resolve({
				url: compressInfo.url,
				md5Value: md5Value,
				timestamp: timestamp,
				signature: rsaPassWord
			})
		}
	})

}
// 图片上传
export async function imageUpload(url, type = 'ARTICLE') {
	const result = await uploadEncryption(url, type)
	return new Promise((resolve, reject) => {
		http.upload(
			`common/imageUpload?timestamp=${result.timestamp}&type=${type}&md5=${result.md5Value}&signature=${result.signature}`, {
				name: 'file',
				filePath: result.url
			}).then(res => {
			const result = JSON.parse(res.data)
			if (result.code === 200) {
				resolve(result.data.url)
			} else {
				reject('upload fail')
			}
		}).catch(err => {
			reject(err)
		})
	})
}