<template>
	<el-dialog style="width: 740rpx;padding-left: 60rpx;padding-bottom: 0;" v-model="dialogVisible" width="500" center>
		<template #header>
			<view class="title">选择创作类型</view>
		</template>
		<view style="height: 40rpx;"></view>
		<view v-for="item in typeList" class="moto-flex-row-left" style="margin-bottom: 60rpx;" @click="oepnArticleEdit(item)">
			<image class="item-icon" src="/static/image/logo.png"></image>
			<view>
				<view class="item-title">{{item.title}}</view>
				<view class="item-desc">{{item.desc}}</view>
			</view>
		</view>
		<view style="height: 20rpx;"></view>
	</el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				dialogVisible: false,
				typeList: [{
						title: '长图文',
						desc: '主要以多图片文字为主,详细分享你的心得',
						linkUrl: '/pages/moto-cms/rich-article-editor?type=CIRCLE_BIG_ARTICLE'
					},
					{
						title: '动态',
						desc: '主要以多图片文字为主,详细分享你的心得',
						linkUrl: '/pages/moto-cms/normal-article-editor'
					},
					{
						title: '资讯',
						desc: '主要以多图片文字为主,详细分享你的心得',
						linkUrl: '/pages/moto-cms/rich-article-editor?type=ARTICLE'
					}
				]
			}
		},
		methods:{
			oepnArticleEdit(item){
				const host = window.location.host
				window.open(`http://${host}${item.linkUrl}`, '_blank')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item-icon{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50rpx;
		margin-right: 20rpx;
	}
	.item-title{
		font-size: 28rpx;
		color: #141E34;
		font-weight: bold;
		margin-bottom: 6rpx;
	}
	.item-desc{
		color: #141E34;
		font-size: 26rpx;
	}
</style>