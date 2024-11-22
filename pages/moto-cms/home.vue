<template>
	<view style="width: 100%;height: 100%">
		<view class="moto-flex-row-left" style="height: 20%;width: 90%">
			<view class="card-shadow moto-flex-column-center article-count-card">
				<view class="moto-flex-row-left" style="margin-bottom: 25px;">
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
			<view class="moto-flex-row-between" style="margin-bottom: 25px;">
				<view style="font-size: 16px;">近期发布</view>
				<view class="all-record-btn" @click="openArticleRecord">全部记录</view>
			</view>
			<view v-for="item in articleList" style="height: 25%">
				<article-card :item="item"></article-card>
			</view>
			<el-empty v-if="!articleList.length" :image-size="150" />
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
		width: 40%;
		height: 100%;
		background-color: #FFFFFF;
		margin-right: 25px;
		border-radius: 4px;
		align-items: flex-start;
		padding-left: 50px;
		box-sizing: border-box;
	}
	
	.acount-count-card {
		width: 60%;
		height: 100%;
		background-color: #FFFFFF;
		border-radius: 4px;
		padding: 0 100px;
		box-sizing: border-box;
	}
	
	.article-list-card {
		height: 75%;
		overflow: hidden;
		width: 90%;
		margin-top: 25px;
		border-radius: 4px;
		background-color: #FFFFFF;
		padding: 27px;
		box-sizing: border-box;
	}
	
	.article-card-title {
		font-size: 14px;
		color: #666666;
		margin-right: 50px;
	}
	
	.article-card-count {
		font-size: 17px;
		font-weight: bold;
		color: #141E34;
	}
	
	.account-card-title {
		font-size: 15px;
		color: #666666;
		margin-bottom: 10px;
	}
	
	.account-card-count {
		font-size: 18px;
		font-weight: bold;
		color: #141E34;
	}
	
	.all-record-btn {
		width: 100px;
		height: 35px;
		border: 1px solid #bebebe;
		border-radius: 2px;
		color: #666666;
		text-align: center;
		line-height: 35px;
		font-size: 14px;
	}

</style>