import {
	createRouter,
} from '@gowiny/uni-router'
import PAGE_DATA from '@/pages.json';

const router = createRouter({
	pageData: PAGE_DATA
})
const needLogin = [
	'pages/moto-cms/article-list',
	'pages/moto-cms/rich-article-editor',
	'pages/moto-cms/home',
	'pages/moto-cms/article-draft',
	'pages/moto-cms/normal-article-editor'
]

router.beforeEach((to, from) => {
	if (needLogin.includes(to.path)) {
		const token = uni.getStorageSync('moto-pc-token')
		if (!token) {
			getApp().$Message.warning('需要登录后才能执行相应操作')
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