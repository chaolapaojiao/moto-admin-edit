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
	setTopBg(state, bg) {
		state.topBg = bg
	},
	logOut() {
		uni.removeStorageSync('moto-pc-token')
		uni.removeStorageSync('userInfo')
		getApp().$Message.warning('退出登录成功')
		uni.navigateTo({
			url: '/pages/login/login'
		})
	}
}
export default createStore({
	state,
	mutations
})