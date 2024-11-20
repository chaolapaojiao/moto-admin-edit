<template>
	<view style="height: 100%;overflow: hidden;">
		<view class="card-title">预览卡片</view>
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
		width: 280px;
		padding: 16px;
		margin: 0 25px 0 50px;
		background-color: #FFFFFF;
		border-radius: 4px;
		box-shadow: 2px 4px 5px 0 rgba(0, 0, 0, 0.08);
	}
	
	.title {
		font-size: 14px;
		font-weight: bold;
		color: #141E34;
		margin: 4px 0;
	}
	
	.user-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1px solid #f8f8f8;
		margin-right: 6px;
	}
	
	.user-name {
		font-size: 12px;
		font-weight: 500;
		color: #141E34;
	}
	
	.content {
		font-size: 14px;
		color: #141E34;
		line-height: 24px;
		margin-bottom: 4px;
		white-space: normal;
	}
	
	.image-item {
		width: 92px;
		height: 72px;
		border: 1px solid #eee;
		background-color: #ddd;
		border-radius: 4px;
		margin-bottom: 4px;
	}
	
	.card-icon {
		font-size: 15px;
		margin-right: 2px;
	}
	
	.time {
		font-size: 11px;
		color: #9FA5B4;
	}
	
	.circle-name {
		font-size: 11px;
		color: #9FA5B4;
		margin-left: 6px;
	}
	
	.line {
		width: 100%;
		height: 1px;
		background-color: #eee;
		margin: 12px 0;
	}
	
	.image-item-single {
		width: 120px;
		border: 1px solid #eee;
		background-color: #ddd;
		border-radius: 4px;
		margin-bottom: 4px;
	}
	
	.vote-container {
		padding: 10px 12px 10px 12px;
		background: #F7F8FB;
		border-radius: 8px;
		width: 260px;
		margin-bottom: 8px;
	}
	
	.vote-icon {
		width: 30px;
		height: 16px;
	}
	
	.vote-title {
		font-size: 15px;
		color: #141E34;
		font-weight: 500;
		margin-left: 6px;
	}
	
	.vote-opiton-item {
		width: 250px;
		height: 28px;
		background: #FFFFFF;
		border-radius: 2px;
		margin-top: 8px;
		line-height: 28px;
		padding-left: 12px;
		font-size: 12px;
		color: #141E34;
		border: 1px solid #EBECEF;
	}
	
	.card-title {
		margin: 50px 0 25px 50px;
		font-size: 14px;
	}

</style>