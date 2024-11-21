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
				<view style="width: 190px;height: 180px;position: relative;">
					<img v-if="qrCodeImg" :src="qrCodeImg" class="qr-code" />
					<view class="expire-mask" @click="refreshCode" v-if="codeExpire">
						<view class="iconv2 refresh-icon" :class="{'refresh-animate': loading}">&#xe694;</view>
					</view>
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
				codeExpire: false,
				loading: false
			}
		},
		onLoad() {
			this.getLoginQrCode()
		},
		methods: {
			refreshCode() {
				this.loading = true
				setTimeout(() => {
					this.getLoginQrCode()
				}, 500)
			},
			...mapMutations(['setUserInfo']),
			getLoginQrCode() {
				getApp().$openApi.user.getLoginQrCode({
					deviceId: this.systemInfo.deviceId
				}).then(res => {
					this.loading = false
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
							getApp().$Message.success('登录成功')
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/moto-cms/home'
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

	.expire-mask {
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(255, 255, 255, .7);
		width: 190px;
		height: 180px;
		text-align: center;
		line-height: 180px;
		border-radius: 8px;
		margin-right: 7px;

	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.refresh-icon {
		font-size: 25px;
	}

	.refresh-animate {
		animation: spin 2s linear infinite;
	}
</style>