<template>
	<view style="height: 100%;overflow: hidden;">
		<view class="article-card">
			<view class="moto-flex-row-left">
				<image class="user-avatar" :src="articleData.authorInfo.avatarUrl"></image>
				<view class="user-name">{{articleData.authorInfo.nickName}}</view>
			</view>
			<view class="title">{{articleData.title}}</view>
			<view class="content moto-lines-3">{{articleData.content}}</view>
			<view class="moto-flex-row-between" v-if="articleData.images.length >= 3">
				<view v-for="image in articleData.images">
					<image mode="aspectFill" class="image-item" :src="image"></image>
				</view>
			</view>
			<view v-if="articleData.images.length <= 2">
				<image mode="widthFix" class="image-item-single" :src="articleData.images[0]"></image>
			</view>
			<view class="vote-container" v-if="vote.voteItemList.length">
				<view class="moto-flex-row-left" style="margin-bottom: 5px;">
					<image class="vote-icon" src="/static/image/font_icon_vote.png"></image>
					<view class="vote-title">{{vote.voteTitle}}</view>
				</view>
				<view class="vote-opiton-item" v-for="item in vote.voteItemList">{{item.itemText}}</view>
				<view class="moto-flex-row-between" style="width: 260px;margin-top: 8px;">
					<view style="font-size: 10px;color: #848B9E;">99人参与</view>
					<view style="font-size: 10px;color: #848B9E;">单选</view>
				</view>
			</view>
			<view class="moto-flex-row-between">
				<view class="moto-flex-row-left">
					<view class="time">{{time}}</view>
					<template v-if="circle">
						<view class="circle-name">{{circle.circleName}}</view>
						<view class="iconv2" style="color: #9FA5B4;">&#xe6fa;</view>
					</template>
				</view>
				<view class="moto-flex-row-left">
					<view class="moto-flex-row-left" style="margin-right: 20px;">
						<view class="iconv2 card-icon">&#xe638;</view>
						<view style="font-size: 12px;color: #141E34;">22</view>
					</view>
					<view class="moto-flex-row-left">
						<view class="iconv2 card-icon">&#xe644;</view>
						<view style="font-size: 12px;color: #141E34;">22</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import {
		mapState
	} from 'vuex'
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			images: {
				type: Array,
				default: () => []
			},
			content: {
				type: String,
				default: ''
			},
			circle: {
				type: Object,
				default: () => ({})
			},
			vote: {
				type: Object,
				default: null
			}
		},
		data() {
			return {
				time: moment().format('MM月DD日'),
				articleData: {
					authorInfo: {
						avatarUrl: '/static/image/logo.png',
						nickName: '机车圈小助手'
					},
					title: '你的文章标题',
					content: '你的文章内容',
					images: ['/static/image/logo.png', '/static/image/logo.png', '/static/image/logo.png', ],
				}
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		mounted() {
			this.articleData.authorInfo = {
				avatarUrl: this.userInfo.avatarUrl,
				nickName: this.userInfo.nickName
			}

		},
		watch: {
			title: {
				handler() {
					if (this.title) {
						this.articleData.title = this.title ? this.title : '你的文章标题'
						this.$forceUpdate()
					}
				},
				immediate: true
			},
			images: {
				handler() {
					this.articleData.images = this.images.length ? this.images : ['/static/image/logo.png',
						'/static/image/logo.png', '/static/image/logo.png'
					]
				},
				immediate: true,
				deep: true
			},

			content: {
				handler() {
					this.articleData.content = this.content.length > 1 ? (this.content.length >= 51 ? this.content.slice(0,
						50) + '...' : this.content) : '你的文章内容'
				},
				immediate: true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.article-card {
		width: 560rpx;
		padding: 32rpx;
		margin: 150rpx 50rpx 0 120rpx;
		background-color: #FFFFFF;
		border-radius: 8rpx;
		box-shadow: 4rpx 8rpx 10rpx 0 rgba(0, 0, 0, 0.08);
	}

	.title {
		font-size: 28rpx;
		font-weight: bold;
		color: #141E34;
		margin: 8rpx 0;
	}

	.user-avatar {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		border: 2rpx solid #f8f8f8;
		margin-right: 12rpx
	}

	.user-name {
		font-size: 24rpx;
		font-weight: 500;
		color: #141E34;
	}

	.content {
		font-size: 28rpx;
		color: #141E34;
		line-height: 48rpx;
		margin-bottom: 8rpx;
		white-space: normal;
	}

	.image-item {
		width: 184rpx;
		height: 144rpx;
		border: 2rpx solid #eee;
		background-color: #ddd;
		border-radius: 8rpx;
		margin-bottom: 8rpx;
	}

	.card-icon {
		font-size: 30rpx;
		margin-right: 4rpx;
	}

	.time {
		font-size: 22rpx;
		color: #9FA5B4;
	}

	.circle-name {
		font-size: 22rpx;
		color: #9FA5B4;
		margin-left: 12rpx;
	}

	.line {
		width: 100%;
		height: 2rpx;
		background-color: #eee;
		margin: 24rpx 0;
	}

	.image-item-single {
		width: 240rpx;
		border: 2px solid #eee;
		background-color: #ddd;
		border-radius: 8rpx;
		margin-bottom: 8rpx;
	}

	.vote-container {
		padding: 20rpx 24rpx 20rpx 24rpx;
		background: #F7F8FB;
		border-radius: 16rrpx;
		width: 520rpx;
		margin-bottom: 16rpx;
	}

	.vote-icon {
		width: 60rpx;
		height: 32rpx;
	}

	.vote-title {
		font-size: 30rpx;
		color: #141E34;
		font-weight: 500;
		margin-left: 12rpx;
	}

	.vote-opiton-item {
		width: 500rpx;
		height: 56rpx;
		background: #FFFFFF;
		border-radius: 4rpx;
		margin-top: 16rpx;
		line-height: 56rpx;
		padding-left: 24rpx;
		font-size: 24rpx;
		color: #141E34;
		border: 2rpx solid #EBECEF
	}
</style>