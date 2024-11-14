import {
	createRouter,
} from '@gowiny/uni-router'
import PAGE_DATA from '@/pages.json';

const router = createRouter({
	pageData: PAGE_DATA
})
const needLogin = [
	'/pages/moto-cms/article-list',
	'/pages/moto-cms/article-editor'
]
router.beforeEach((to, from) => {
	if (needLogin.includes(to.path)) {
		const token = uni.getStorageSync('moto-pc-token')
		if (!token) {
			getApp().$message.warning('需要登录后才能执行相应操作')
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve({
						to: {
							path: '/pages/login/login'
						},
						navType: 'push'
					})
				}, 500)
			})
		}
	}
})


export default router