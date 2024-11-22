<template>
	<view style="height: 100%;min-width: 1000px;" :style="{backgroundColor: topBg}">
		<view class="nav-container moto-flex-row-between">
			<view class="moto-flex-row-left" @click="openHome">
				<image class="logo-img" src="/static/image/logo.png"></image>
				<view class="title">机车圈APP | 创作者中心</view>
			</view>
			<el-dropdown>
				<view class="moto-flex-row-left" style="margin-right: 16px;position: relative">
					<image class="user-avatar" :src="userInfo.avatarUrl"></image>
					<view class="nick-name">{{userInfo.nickName}}</view>
					<view class="iconv2">&#xe652;</view>
					<view class="user-option-container"></view>
				</view>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="openUserCenter">个人中心</el-dropdown-item>
						<el-dropdown-item @click="openUserFeedback">用户反馈</el-dropdown-item>
						<el-dropdown-item divided @click="logOut">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
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
			...mapMutations(['logOut']),
			openHome() {
				uni.navigateTo({
					url: '/pages/moto-cms/home'
				})
			},
			openUserCenter(){
				uni.navigateTo({
					url: '/pages/user/user-center'
				})
			},
			openUserFeedback(){
				uni.navigateTo({
					url: '/pages/user/user-feedback'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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

	::v-deep .el-tooltip__trigger:focus-visible {
		outline: unset;
	}
</style>