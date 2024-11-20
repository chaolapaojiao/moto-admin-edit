<template>
	<el-dialog style="width: 370px;padding-left: 30px;padding-bottom: 0;" v-model="dialogVisible" width="500" center>
		<template #header>
			<view class="title">选择创作类型</view>
		</template>
		<view style="height: 20px;"></view>
		<view v-for="item in typeList" class="moto-flex-row-left" style="margin-bottom: 30px;" @click="oepnArticleEdit(item)">
			<image class="item-icon" src="/static/image/logo.png"></image>
			<view>
				<view class="item-title">{{item.title}}</view>
				<view class="item-desc">{{item.desc}}</view>
			</view>
		</view>
		<view style="height: 10px;"></view>
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
	.item-icon {
		width: 50px;
		height: 50px;
		border-radius: 25px;
		margin-right: 10px;
	}
	
	.item-title {
		font-size: 14px;
		color: #141E34;
		font-weight: bold;
		margin-bottom: 3px;
	}
	
	.item-desc {
		color: #141E34;
		font-size: 13px;
	}

</style>