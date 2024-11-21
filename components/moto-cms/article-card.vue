<template>
	<view class="moto-flex-row-between" style="margin-bottom: 40px;">
		<view class="moto-flex-row-left">
			<view class="pub-time">{{item.time}}</view>
			<image mode="aspectFill" class="article-image" :src="item.imageUrl"></image>
			<view style="margin-left: 32px;">
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
					<view class="moto-flex-row-left" style="margin-right: 20px;">
						<view class="iconv2 data-icon">&#xe775;</view>
						<view class="data-count">{{getCountNumber(item.browseCount)}}</view>
					</view>
					<view class="moto-flex-row-left" style="margin-right: 20px;">
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
				if(item.type !== 'CIRCLE' && item.platform === 1){
					getApp().$Message.warning('该文章不支持在pc端修改')
					return
				}
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
									getApp().$Message.success('删除成功')
									this.$emit('deleteSuccess', item.id)
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
		font-size: 16px;
		width: 125px;
	}
	
	.article-image {
		width: 100px;
		height: 75px;
		border-radius: 4px;
	}
	
	.article-title {
		color: #666666;
		font-size: 16px;
	}
	
	.data-icon {
		color: #666666;
		font-size: 15px;
		margin-right: 4px;
	}
	
	.data-count {
		color: #666666;
		font-size: 14px;
	}
	
	.edit-btn {
		width: 60px;
		height: 30px;
		border: 0.5px solid #bebebe;
		border-radius: 4px;
		color: #141E34;
		text-align: center;
		line-height: 30px;
		font-size: 14px;
		margin-right: 15px;
	}
	
	.article-status {
		font-size: 13px;
		font-weight: bold;
		color: #9FA5B4;
		margin-left: 10px;
	}
	
	.article-type {
		font-size: 10px;
		background-color: RGBA(255, 97, 0, 0.5);
		width: 40px;
		height: 16px;
		line-height: 16px;
		text-align: center;
		border-radius: 2px;
		color: #FFFFFF;
		margin-top: 5px;
	}
	
	.delete-btn {
		width: 60px;
		height: 30px;
		background-color: #ff6100;
		border: 0.5px solid #bebebe;
		border-radius: 4px;
		color: #FFFFFF;
		text-align: center;
		line-height: 30px;
		font-size: 13px;
	}

</style>