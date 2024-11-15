<template>
	<view style="width: 100%;">
		<view class="moto-flex-row-left">
			<view class="card-shadow moto-flex-column-center article-count-card">
				<view class="moto-flex-row-left" style="margin-bottom: 50rpx;">
					<view class="article-card-title">总发布帖数</view>
					<view class="article-card-count">123</view>
				</view>
				<view class="moto-flex-row-left">
					<view class="article-card-title">总发浏览数</view>
					<view class="article-card-count">123</view>
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
			<view class="moto-flex-row-between" style="margin-bottom: 100rpx;">
				<view style="font-size: 32rpx;">近期发布</view>
				<view class="all-record-btn">全部记录</view>
			</view>
			<view v-for="item in 3" class="moto-flex-row-left" style="margin-bottom: 100rpx;">
				<view class="pub-time">刚刚</view>
				<image mode="aspectFill" class="article-image" src="/static/image/logo.png"></image>
				<view style="margin-left: 64rpx;">
					<view class="moto-flex-row-left">
						<view class="article-title">宝马小小鸟发布, f450gs你会喜欢吗？</view>
					</view>
					<view class="moto-flex-row-left">
						<view class="moto-flex-row-left" style="margin-right: 40rpx;">
							<view class="iconv2 data-icon">&#xe775;</view>
							<view class="data-count">11k</view>
						</view>
						<view class="moto-flex-row-left" style="margin-right: 40rpx;">
							<view class="iconv2 data-icon">&#xe644;</view>
							<view class="data-count">11k</view>
						</view>
						<view class="moto-flex-row-left">
							<view class="iconv2 data-icon">&#xe6e7;</view>
							<view class="data-count">11k</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageInfo: {
					page: 1,
					size: 10,
					type: 'CIRCLE'
				},
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
				tabelData: []
			}
		},
		onLoad() {
			this.getPubList()
		},
		methods: {
			getPubList() {
				getApp().$openApi.motoCms.getPubArticleList(this.pageInfo).then(res => {
					if (res.data.code === 200) {
						this.tabelData = res.data.data.releaseList
					}
				})
			},
			openEdit(id) {
				const host = window.location.host
				console.log(host)
				if (id) {
					uni.navigateTo({
						url: '/pages/moto-cms/article-editor?id=' + id
					})
				} else {

					window.open(`http://${host}/pages/moto-cms/article-editor`, '_blank')
				}
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

	.pub-time {
		color: #666666;
		font-size: 32rpx;
		width: 250rpx;
	}

	.article-image {
		width: 200rpx;
		height: 150rpx;
		border-radius: 8rpx;
	}

	.article-title {
		color: #666666;
		font-size: 32rpx;
		margin-bottom: 20rpx;
	}

	.data-icon {
		color: #666666;
		font-size: 30rpx;
		margin-right: 8rpx;
	}

	.data-count {
		color: #666666;
		font-size: 28rpx;
	}
</style>