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
	const {
		timestamp,
		signature
	} = paramsEncryption(data)
	data.timestamp = timestamp
	data.signature = signature
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
	const {
		timestamp,
		signature
	} = paramsEncryption(data)
	data.timestamp = timestamp
	data.signature = signature
	return http.get('/motorCircle/getCircleListV2', {
		params: data
	})
}
// 搜索
function globalSearch(data) {
	let {
		timestamp,
		signature
	} = paramsEncryption({
		data: data
	})
	signature = signature.replace(/\+/g, '%2B')
	return http.post(`search/globalSearchV3?timestamp=${timestamp}&signature=${signature}`, data)
}
// 获取附近位置
function getNearbyPoiList(data) {
	const {
		timestamp,
		signature
	} = paramsEncryption(data)
	data.timestamp = timestamp
	data.signature = signature
	return http.get('location/getNearbyPoiListV2', {
		params: data
	})
}

// 获取话题列表
function getTopicList(data) {
	const {
		timestamp,
		signature
	} = paramsEncryption(data)
	data.timestamp = timestamp
	data.signature = signature
	return http.get('/motorCircle/getTopicTagList', {
		params: data
	})
}

// 获取话题名称列表(区分有奖活动和热门话题)
function getTagListAct(data) {
	data = {}
	const {
		timestamp,
		signature
	} = paramsEncryption(data)
	data.timestamp = timestamp
	data.signature = signature
	return http.get('/motorCircle/getTagListAct', {
		params: data
	})
}

// 创建话题
function createTopic(data) {
	const {
		timestamp,
		signature
	} = paramsEncryption(data)
	data.timestamp = timestamp
	data.signature = signature
	return http.post('/motorCircle/createTopicTag', data)
}
export default {
	getPubArticleList,
	getCircleArticleInfo,
	pushCircleArticle,
	uploadImg,
	getCircleList,
	globalSearch,
	getNearbyPoiList,
	getTopicList,
	getTagListAct,
	createTopic
}