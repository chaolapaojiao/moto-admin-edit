<template>
	<view class="moto-flex-row-center login-container">
		<el-card style="width: 480px" shadow="always">
			<view class="moto-flex-column-center">
				<view class="title">登录</view>
				<view class="qr-code-box">
					<img v-if="qrCodeImg" :src="qrCodeImg" class="qr-code" />
				</view>
				<view v-if="codeExpire" class="moto-flex-row-left" style="margin-left: 20px;" @click="getLoginQrCode">
					<view>二维码已过期，请</view>
					<view style="color: blue;">刷新</view>
				</view>
				<text>请使用机车圈app扫码登录</text>
			</view>
		</el-card>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				qrCodeImg: '',
				timer: null,
				loginInterval: null,
				codeExpire: false
			}
		},
		onLoad() {
			this.getLoginQrCode()
		},
		methods: {
			...mapMutations(['setUserInfo']),
			getLoginQrCode() {
				getApp().$openApi.user.getLoginQrCode({
					deviceId: this.systemInfo.deviceId
				}).then(res => {
					if (res.data.code === 200) {
						this.codeExpire = false
						clearTimeout(this.timer)
						const expireTime = res.data.data.expireTime
						this.qrCodeImg = res.data.data.qrCode
						this.timer = setTimeout(() => {
							this.codeExpire = true
							clearInterval(this.loginInterval)
						}, expireTime * 1000)
						this.loginInterval = setInterval(() => {
							this.checkQrLogin(res.data.data.qrId)
						}, 1000)
						this.checkQrLogin(res.data.data.qrId)
					}
				})
			},
			checkQrLogin(id) {
				getApp().$openApi.user.checkQrLogin({
					qrId: id
				}).then(res => {
					if (res.data.code === 200) {
						const data = res.data.data
						if (data.status === 2) {
							clearInterval(this.loginInterval)
							this.setUserInfo(res.data.data.userInfo)
							uni.showToast({
								title: '登录成功',
								icon: 'none'
							})
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/index'
								})
							}, 500)
						} else if (data.status === 3) {
							clearInterval(this.loginInterval)
							this.codeExpire = true
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		width: 100%;
		height: 100%;
		align-items: flex-start;
		padding-top: 200px;
	}

	.title {
		font-size: 22px;
		font-weight: 400;
	}

	.el-card__body {
		padding: 20px 0;
	}

	.qr-code-box {
		width: 200px;
		height: 200px;
	}

	.qr-code {
		width: 200px;
		height: 200px;
	}
</style>