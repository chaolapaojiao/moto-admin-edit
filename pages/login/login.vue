<template>
	<view class="moto-flex-row-center login-container">
		<el-card style="width: 480px" shadow="always" class="moto-flex-row-center">
			<view class="title">登录</view>
		</el-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync()
			}
		},
		onLoad() {
			this.getLoginQrCode()
		},
		methods: {
			getLoginQrCode() {
				getApp().$openApi.user.getLoginQrCode(this.systemInfo.deviceId).then(res => {
					console.log(res)
				})
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		width: 100%;
		height: 100%;
	}

	.title {
		font-size: 20px;
		font-weight: 400;
	}

	.el-card__body {
		padding: 10px 0;
	}
</style>