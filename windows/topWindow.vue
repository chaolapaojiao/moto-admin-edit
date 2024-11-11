<template>
	<view>
		<view class="nav-container moto-flex-row-between">
			<view class="moto-flex-row-left">
				<image class="logo-img" src="/static/image/logo.png"></image>
				<view class="title">机车圈</view>
			</view>
			<view class="moto-flex-row-left">
				<image class="user-avatar" :src="userInfo.avatarUrl"></image>
				<view class="nick-name">{{userInfo.nickName}}</view>
				<view class="iconv2">&#xe652;</view>
			</view>
		</view>
		<view class="line"></view>
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
		padding: 0 20px;
		height: 60px;
		width: 100%;
		background-color: #FFFFFF;
		box-sizing: border-box;
	}

	.line {
		width: 100%;
		height: 2px;
		background-color: #ebebeb;
	}

	.logo-img {
		width: 36px;
		height: 36px;
	}

	.title {
		margin-left: 10px;
		font-size: 16px;
		font-weight: 500;
	}
	.user-avatar{
		width: 30px;
		height: 30px;
		border-radius: 15px;
	}
	
	.nick-name{
		font-size: 14px;
		margin-left: 6px;
	}
</style>