<template>
	<view style="height: 100%;background-color: #f8f8f8;">
		<view class="nav-container moto-flex-row-between">
			<view class="moto-flex-row-left">
				<image class="logo-img" src="/static/image/logo.png"></image>
				<view class="title">机车圈APP | 创作者中心</view>
			</view>
			<view class="moto-flex-row-left" style="margin-right: 32rpx;">
				<image class="user-avatar" :src="userInfo.avatarUrl"></image>
				<view class="nick-name">{{userInfo.nickName}}</view>
				<view class="iconv2">&#xe652;</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.nav-container {
		padding: 0 40rpx;
		height: 120rpx;
		width: 100%;
		box-sizing: border-box;
	}
	.logo-img {
		width: 64rpx;
		height: 64rpx;
		border-radius: 12rpx;
	}

	.title {
		margin-left: 20rpx;
		font-size: 26rpx;
		font-weight: 500;
	}
	.user-avatar{
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
	}
	
	.nick-name{
		font-size: 24rpx;
		margin-left: 10rpx;
		color: #141E34;
	}
</style>