<template>
	<view style="height: 100%" :style="{backgroundColor: topBg}">
		<view class="nav-container moto-flex-row-between">
			<view class="moto-flex-row-left">
				<image class="logo-img" src="/static/image/logo.png"></image>
				<view class="title">机车圈APP | 创作者中心</view>
			</view>
			<view class="moto-flex-row-left" style="margin-right: 16px;">
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
			...mapState(['userInfo', 'topBg'])
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
		box-sizing: border-box;
	}
	
	.logo-img {
		width: 32px;
		height: 32px;
		border-radius: 6px;
	}
	
	.title {
		margin-left: 10px;
		font-size: 13px;
		font-weight: 500;
	}
	
	.user-avatar {
		width: 30px;
		height: 30px;
		border-radius: 15px;
	}
	
	.nick-name {
		font-size: 12px;
		margin-left: 5px;
		color: #141E34;
	}

</style>