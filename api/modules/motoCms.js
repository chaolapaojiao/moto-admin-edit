import request from '@/api/http.js'
const http = request.http
import paramsEncryption from '@/utils/encryption.js'
// 获取用户文章列表
function getPubArticleList(data) {
	const {
		timestamp,
		signature
	} = paramsEncryption(data)
	data.timestamp = timestamp
	data.signature = signature
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
	return http.get('motorCircle/getCircleArticle', {
		params: data
	})
}

// 发布圈子文章
function pubCircleArticle(data) {
	let {
		timestamp,
		signature
	} = paramsEncryption(data, 'post')
	signature = signature.replace(/\+/g, '%2B')
	const jsonStr = JSON.stringify(data)
	return http.post(`motorCircle/pubCircleArticle?timestamp=${timestamp}&signature=${signature}`,
		jsonStr
	)
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
	} = paramsEncryption(data, 'post')
	signature = signature.replace(/\+/g, '%2B')
	const jsonStr = JSON.stringify(data)
	return http.post(`search/globalSearch?timestamp=${timestamp}&signature=${signature}`, jsonStr)
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
	let {
		timestamp,
		signature
	} = paramsEncryption(data, 'post')
	const jsonStr = JSON.stringify(data)
	signature = signature.replace(/\+/g, '%2B')
	return http.post(`/motorCircle/createTopicTag?timestamp=${timestamp}&signature=${signature}`, jsonStr)
}

// 保存草稿
function saveDraft(data) {
	let {
		timestamp,
		signature
	} = paramsEncryption(data, 'post')
	const jsonStr = JSON.stringify(data)
	signature = signature.replace(/\+/g, '%2B')
	return http.post(`common/pubDraft?timestamp=${timestamp}&signature=${signature}`, jsonStr)
}

// 资讯文章发布
function pubNews(data){
	let {
		timestamp,
		signature
	} = paramsEncryption(data, 'post')
	const jsonStr = JSON.stringify(data)
	signature = signature.replace(/\+/g, '%2B')
	return http.post(`/motorArticle/pubArticle?timestamp=${timestamp}&signature=${signature}`,jsonStr)
}
export default {
	getPubArticleList,
	getCircleArticleInfo,
	pubCircleArticle,
	uploadImg,
	getCircleList,
	globalSearch,
	getNearbyPoiList,
	getTopicList,
	getTagListAct,
	createTopic,
	saveDraft,
	pubNews
}