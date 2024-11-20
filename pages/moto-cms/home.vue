<template>
	<view style="width: 100%;">
		<view class="moto-flex-row-left">
			<view class="card-shadow moto-flex-column-center article-count-card">
				<view class="moto-flex-row-left" style="margin-bottom: 50rpx;">
					<view class="article-card-title">总发布帖数</view>
					<view class="article-card-count">{{circleArticleCount}}</view>
				</view>
				<view class="moto-flex-row-left">
					<view class="article-card-title">总发浏览数</view>
					<view class="article-card-count">{{browseCount}}</view>
				</view>
			</view>
			<view class="acount-count-card card-shadow moto-flex-row-between">
				<view v-for="item in accoutData" class="moto-flex-column-center">
					<view class="account-card-title">{{item.title}}</view>
					<view class="account-card-count">{{item.count}}</view>
				</view>
			</view>
		</view>
		<view class="article-list-card card-shadow">
			<view class="moto-flex-row-between" style="margin-bottom: 50rpx;">
				<view style="font-size: 32rpx;">近期发布</view>
				<view class="all-record-btn" @click="openArticleRecord">全部记录</view>
			</view>
			<view v-for="item in articleList">
				<article-card :item="item"></article-card>
			</view>
		</view>
	</view>
</template>

<script>
	import articleCard from '@/components/moto-cms/article-card.vue'
	export default {
		components: {
			articleCard
		},
		data() {
			return {
				accoutData: [{
						title: '粉丝',
						count: 333
					},
					{
						title: '获赞',
						count: 333
					},
					{
						title: '获评论',
						count: 333
					}
				],
				circleArticleCount: 0,
				browseCount: 0,
				articleList: []
			}
		},
		onLoad() {
			this.getUserPubStatistics()
			this.getPubArticleList()
		},
		methods: {
			openArticleRecord() {
				uni.navigateTo({
					url: '/pages/moto-cms/article-list'
				})
			},
			getUserPubStatistics() {
				getApp().$openApi.user.getUserPubStatistics().then(res => {
					if (res.data.code === 200) {
						const data = res.data.data
						this.browseCount = data.browseCountStr
						this.circleArticleCount = data.circleArticleCountStr
						this.accoutData[0].count = data.fansCountStr
						this.accoutData[1].count = data.likeCountStr
						this.accoutData[2].count = data.commentCountStr
					}
				})
			},
			getPubArticleList() {
				const pageInfo = {
					page: 1,
					size: 4,
					type: 'CIRCLE'
				}
				getApp().$openApi.motoCms.getPubArticleList(pageInfo).then(res => {
					if (res.data.code === 200) {
						this.articleList = res.data.data.releaseList
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.article-count-card {
		width: 650rpx;
		height: 300rpx;
		background-color: #FFFFFF;
		margin-right: 50rpx;
		border-radius: 8rpx;
		align-items: flex-start;
		padding-left: 100rpx;
		box-sizing: border-box;
	}

	.acount-count-card {
		width: 1550rpx;
		height: 300rpx;
		background-color: #FFFFFF;
		margin-right: 100rpx;
		border-radius: 8rpx;
		padding: 0 200rpx;
		box-sizing: border-box;
	}

	.article-list-card {
		height: 1100rpx;
		width: 2250rpx;
		margin-top: 50rpx;
		border-radius: 8rpx;
		background-color: #FFFFFF;
		padding: 54rpx;
		box-sizing: border-box;
	}

	.article-card-title {
		font-size: 28rpx;
		color: #666666;
		margin-right: 100rpx;
	}

	.article-card-count {
		font-size: 34rpx;
		font-weight: bold;
		color: #141E34;
	}

	.account-card-title {
		font-size: 30rpx;
		color: #666666;
		margin-bottom: 20rpx;
	}

	.account-card-count {
		font-size: 36rpx;
		font-weight: bold;
		color: #141E34;
	}

	.all-record-btn {
		width: 200rpx;
		height: 70rpx;
		border: 2rpx solid #bebebe;
		border-radius: 4rpx;
		color: #666666;
		text-align: center;
		line-height: 70rpx;
		font-size: 28rpx;
	}
</style>