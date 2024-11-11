import request from '@/api/http.js'
const http = request.http
import paramsEncryption from '@/utils/encryption.js'
// 获取用户文章列表
function getPubArticleList(data) {
	return http.get('common/getReleaseListV2', {
		params: data
	})
}

// 获取圈子动态/文章详情
function getCircleArticleInfo(data) {
	const {
		timestamp,
		signature
	} = paramsEncryption(data)
	data.timestamp = timestamp
	data.signature = signature
	return http.get('motorCircle/getCircleArticleV2', {
		params: data
	})
}

// 发布圈子文章
function pushCircleArticle(data) {
	return http.post('motorCircle/pubArticleV3', data)
}

// 上传图片
function uploadImg(data) {
	return http.upload('common/imageUpload', {
		name: 'file',
		filePath: data
	})
}

// 获取圈子列表
function getCircleList(data) {
	return http.get('/motorCircle/getCircleListV2', {
		params: data
	})
}

export default {
	getPubArticleList,
	getCircleArticleInfo,
	pushCircleArticle,
	uploadImg,
	getCircleList
}