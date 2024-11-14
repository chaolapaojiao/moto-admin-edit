<template>
	<view class="login-container">
		<view class="logo-container">
			<view class="moto-flex-row-left">
				<image class="logo-image" src="/static/image/logo.png"></image>
				<view class="logo-title">机车圈 | 创作者平台</view>
			</view>
		</view>
		<el-card shadow="always">
			<view class="moto-flex-column-center" style="width: 100%">
				<view class="card-title">扫码登录</view>
				<view style="width: 190px;height: 180px;">
					<img v-if="qrCodeImg" :src="qrCodeImg" class="qr-code" />
				</view>
				<view v-if="codeExpire" class="moto-flex-row-left" style="margin-left: 20px;" @click="getLoginQrCode">
					<view class="login-hint">二维码已过期，请</view>
					<view class="login-hint" style="color: blue;margin-right: 20px;">刷新</view>
				</view>
				<text class="login-hint">请使用机车圈app扫一扫登录</text>
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
							getApp().$message.success('登录成功')
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/moto-cms/article-list'
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

<style lang="scss" scoped>
	.login-container {
		width: 100%;
		height: 100%;
		overflow: hidden;
		align-items: flex-start;
		background-image: url('/static/image/login-bg.jpg');
		background-size: 100% 100%;
	}

	.logo-container {
		margin: 25px;
	}

	.logo-image {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		margin-right: 7px;
	}

	.logo-title {
		font-size: 14px;
		font-weight: 500;
		color: #ff6100;
	}

	.logo-sub-title {
		margin-top: 8px;
		margin-left: 10px;
		font-size: 12px;
		font-weight: 400;
		color: #141E34;
	}

	.card-title {
		font-size: 14px;
		font-weight: 400;
	}

	.el-card__body {
		padding: 10px 0;
	}

	.el-card {
		position: absolute;
		top: 210px;
		right: 150px;
		width: 220px;
	}

	.qr-code {
		width: 190px;
		height: 180px;
		margin-bottom: -10px;
	}

	.login-hint {
		font-size: 12px;
	}
</style>