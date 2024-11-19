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
			<view class="moto-flex-row-between" style="margin-bottom: 100rpx;">
				<view style="font-size: 32rpx;">近期发布</view>
				<view class="all-record-btn">全部记录</view>
			</view>
			<view v-for="item in articleList" class="moto-flex-row-between" style="margin-bottom: 100rpx;">
				<view class="moto-flex-row-left">
					<view class="pub-time">{{item.time}}</view>
					<image mode="aspectFill" class="article-image" :src="item.imageUrl"></image>
					<view style="margin-left: 64rpx;">
						<view style="margin-bottom: 20px;">
							<view class="moto-flex-row-left">
								<view class="article-title">{{item.title}}</view>
								<view class="article-status">{{item.prompt}}</view>
							</view>
							<view class="article-type" v-if="item.type === 'CIRCLE_BIG_ARTICLE'">长图文</view>
							<view class="article-type" v-else-if="item.type === 'ARTICLE'">资讯</view>
							<view class="article-type" v-else>动态</view>
						</view>
						<view class="moto-flex-row-left">
							<view class="moto-flex-row-left" style="margin-right: 40rpx;">
								<view class="iconv2 data-icon">&#xe775;</view>
								<view class="data-count">{{getCountNumber(item.browseCount)}}</view>
							</view>
							<view class="moto-flex-row-left" style="margin-right: 40rpx;">
								<view class="iconv2 data-icon">&#xe644;</view>
								<view class="data-count">{{getCountNumber(item.likeCount)}}</view>
							</view>
							<view class="moto-flex-row-left">
								<view class="iconv2 data-icon">&#xe6e7;</view>
								<view class="data-count">{{getCountNumber(item.commentCount)}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="moto-flex-row-left">
					<view class="edit-btn" @click="openEdit(item)">编辑</view>
					<view class="delete-btn" @click="deleteArtice(item)">删除</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
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
					size: 3,
					type: 'CIRCLE'
				}
				getApp().$openApi.motoCms.getPubArticleList(pageInfo).then(res => {
					if (res.data.code === 200) {
						this.articleList = res.data.data.releaseList
					}
				})
			},
			getCountNumber(number) {
				return number >= 1000 ? ((number / 1000).toFixed(1) + 'k') : number
			},
			openEdit(item) {
				const host = window.location.host
				if (item.type === 'CIRCLE_BIG_ARTICLE') {
					window.open(`http://${host}/pages/moto-cms/rich-article-editor?id=${item.id}&type=1`, '_blank')
				} else if (item.type === 'ARTICLE') {
					window.open(`http://${host}/pages/moto-cms/rich-article-editor?id=${item.id}&type=2`, '_blank')
				} else if (item.type === 'CIRCLE') {
					window.open(`http://${host}/pages/moto-cms/normal-article-editor?id=${item.id}`, '_blank')
				}
			},
			deleteArtice() {
				uni.showModal({
					title: '删除',
					content: '确定要删除吗？',
					success: (res) => {
						if (res.confirm) {
							
						}
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

	.edit-btn {
		width: 100rpx;
		height: 50rpx;
		border: 1rpx solid #bebebe;
		border-radius: 4rpx;
		color: #141E34;
		text-align: center;
		line-height: 50rpx;
		font-size: 26rpx;
		margin-right: 30rpx;
	}

	.article-status {
		font-size: 28rpx;
		font-weight: bold;
		color: #9FA5B4;
		margin-left: 20px;
	}

	.article-type {
		font-size: 20rpx;
		background-color: RGBA(255, 97, 0, 0.5);
		width: 80rpx;
		height: 32rpx;
		line-height: 32rpx;
		text-align: center;
		border-radius: 4rpx;
		color: #FFFFFF;
	}

	.delete-btn {
		width: 100rpx;
		height: 50rpx;
		background-color: #ff6100;
		border: 1rpx solid #bebebe;
		border-radius: 4rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 50rpx;
		font-size: 26rpx;
	}
</style>