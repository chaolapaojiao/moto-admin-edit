import {
	createStore
} from 'vuex'
const state = {
	userInfo: uni.getStorageSync('userInfo')
}

const mutations = {
	setUserInfo(state, userInfo) {
		state.userInfo = userInfo
		uni.setStorageSync('userInfo', userInfo)
		uni.setStorageSync('moto-pc-token', userInfo.token)
	}
}
export default createStore({
	state,
	mutations
})