<template>
	<view class="moto-flex-row-between" style="margin-bottom: 80rpx;">
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
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: () => ({})
			}
		},
		methods: {
			getCountNumber(number) {
				return number >= 1000 ? ((number / 1000).toFixed(1) + 'k') : number
			},
			openEdit(item) {
				const host = window.location.host
				if (item.type === 'CIRCLE_BIG_ARTICLE') {
					window.open(`http://${host}/pages/moto-cms/rich-article-editor?id=${item.id}&type=CIRCLE_BIG_ARTICLE`,
						'_blank')
				} else if (item.type === 'ARTICLE') {
					window.open(`http://${host}/pages/moto-cms/rich-article-editor?id=${item.id}&type=ARTICLE`, '_blank')
				} else if (item.type === 'CIRCLE') {
					window.open(`http://${host}/pages/moto-cms/normal-article-editor?id=${item.id}`, '_blank')
				}
			},
			deleteArtice(item) {
				uni.showModal({
					title: '删除',
					content: '确定要删除吗？',
					success: (res) => {
						if (res.confirm) {
							if (item.type === 'ARTICLE') {
								this.$emit('deleteSuccess', item.id)
								getApp().$openApi.motoCms.deleteNews(item.id).then(res => {
									if(res.data.code === 200){
										getApp().$Message.success('删除成功')
										this.$emit('deleteSuccess', item.id)
									}
								})
							} else {
								getApp().$openApi.motoCms.delCirclelArticle({
									articleId: item.id
								}).then(res => {
									console.log(res)
								})
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
		font-size: 24rpx;
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
		font-size: 24rpx;
	}
</style>