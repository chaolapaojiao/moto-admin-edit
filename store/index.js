import {
	createStore
} from 'vuex'
const state = {
	userInfo: uni.getStorageSync('userInfo'),
	topBg: '#f8f8f8'
}

const mutations = {
	setUserInfo(state, userInfo) {
		state.userInfo = userInfo
		uni.setStorageSync('userInfo', userInfo)
		uni.setStorageSync('moto-pc-token', userInfo.token)
	},
	setTopBg(state, bg){
		state.topBg = bg
	}
}
export default createStore({
	state,
	mutations
})