<template>
	<view class="moto-flex-row-center" style="width: 90%;height: 100%;">
		<view class="card card-shadow">
			<view style="padding: 20px;">
				<view class="moto-flex-row-between">
					<view class="option-title">头像</view>
					<view class="moto-flex-row-left">
						<image class="user-avatar" :src="userInfo.avatarUrl"></image>
						<image class="arrow" src="/static/image/arrow.png"></image>
					</view>
				</view>
				<view class="line"></view>
				<view class="moto-flex-row-between">
					<view class="option-title">用户名</view>
					<view class="moto-flex-row-left">
						<view class="option-value">{{userInfo.nickName}}</view>
						<image class="arrow" src="/static/image/arrow.png"></image>
					</view>
				</view>
				<view class="line"></view>
				<view class="moto-flex-row-between">
					<view class="option-title">生日</view>
					<view class="moto-flex-row-left">
						<view class="option-value">{{userInfo.birthdayStr ? userInfo.birthdayStr : '未填写'}}</view>
						<image class="arrow" src="/static/image/arrow.png"></image>
					</view>
				</view>
				<view class="line"></view>
				<view class="moto-flex-row-between">
					<view class="option-title">性别</view>
					<view class="moto-flex-row-left">
						<view class="option-value">{{userInfo.gender ? genderMap(userInfo.gender) : '未填写'}}</view>
						<image class="arrow" src="/static/image/arrow.png"></image>
					</view>
				</view>
				<view class="line"></view>
				<view class="moto-flex-row-between">
					<view class="option-title">介绍</view>
					<view class="moto-flex-row-left">
						<view class="option-value">{{userInfo.remark ? userInfo.remark : '未填写'}}</view>
						<image class="arrow" src="/static/image/arrow.png"></image>
					</view>
				</view>
				<view class="line"></view>
				<view class="moto-flex-row-between">
					<view class="option-title">更换背景图</view>
					<view class="moto-flex-row-left">
						<image mode="aspectFill" class="image-bg" :src="userInfo.bgImageUrl ? userInfo.bgImageUrl : '/static/image/center_bg.png'"></image>
						<image class="arrow" src="/static/image/arrow.png"></image>
					</view>
				</view>
			</view>
			<view style="height: 8px;width: 100%;background-color: #f7f8f9;"></view>
			<view class="moto-flex-row-between" style="padding: 20px;">
				<view class="option-title">账号注销</view>
				<image class="arrow" src="/static/image/arrow.png"></image>
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
				genderMap: {
					1: '男',
					2: '女'
				}
			}
		},
		computed: {
			...mapState(['userInfo']),
		},
		mounted() {
			console.log(this.userInfo)
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.card {
		width: 600px;
		height: 100%;
		background-color: #FFFFFF;
		box-sizing: border-box;
		border-radius: 8px;
	}

	.option-title {
		font-size: 17px;
		color: #333333;
	}

	.user-avatar {
		width: 48px;
		height: 48px;
		border-radius: 24px;
	}

	.line {
		width: 100%;
		background-color: #eee;
		margin: 20px 0 30px 0;
		height: 1px;
	}

	.arrow {
		width: 14px;
		height: 14px;
		margin-left: 10px;
	}

	.option-value {
		font-size: 15px;
		color: #666666;
	}

	.image-bg {
		width: 100px;
		height: 40px;
		border-radius: 8px;
	}
</style>