<template>
	<el-dialog style="padding-bottom: 0" v-model="dialogVisible" title="关联话题" width="500" align-center>
		<view class="moto-flex-row-left" style="margin: 10px 0;">
			<el-input @input="onSearchChange" v-model="searchInfo.searchKeyword" style="width: 400px;"
				placeholder="搜索想添加的话题" />
			<view class="search-btn" @click="confirmSearch">搜索</view>
		</view>
		<scroll-view :show-scrollbar="false" scroll-y class="scroll-container" v-if="showSearch">
			<view v-for="item in searchInfo.data" style="margin-bottom: 8px;" class="moto-flex-row-between"
				@click="selectTopic(item)">
				<view class="moto-flex-row-left">
					<view class="iconv2" style="font-size: 16px;color: #FF6100">&#xe71c;</view>
					<view class="topic-name">{{item.topicTagName}}</view>
					<view class="tag" style="background: linear-gradient( 223deg, #FEA732 0%, #FF6100 100%);"
						v-if="item.topicType === 3">热门</view>
					<view class="tag" style="background: linear-gradient( 226deg, #FFBEB7 0%, #FF4250 100%);"
						v-if="item.topicType === 2">有奖</view>
				</view>
				<view style="color: #848B9E;font-size: 24rpx;">{{item.hotCount}}&nbsp;热度</view>
			</view>
			<view v-if="searchInfo.empty" class="moto-flex-row-between" @click="createTopic">
				<view class="moto-flex-row-left">
					<view class="iconv2" style="font-size: 16px;color: #FF6100">&#xe71c;</view>
					<view class="topic-name">{{this.searchInfo.searchKeyword}}</view>
				</view>
				<view style="font-size: 12px;color: #141E34;">创建话题</view>
			</view>
		</scroll-view>
		<scroll-view v-else :show-scrollbar="false" scroll-y class="scroll-container" @scrolltolower="onListLoadMore">
			<view style="white-space: nowrap;">
				<view class="class-title" v-if="awardTopicList.length">有奖活动</view>
				<view v-for="item in awardTopicList" style="margin-bottom: 8px;" class="moto-flex-row-between"
					@click="selectTopic(item)">
					<view class="moto-flex-row-left">
						<view class="iconv2" style="font-size: 16px;color: #FF6100">&#xe71c;</view>
						<view class="topic-name">{{item.topicTagName}}</view>
						<view class="tag" style="background: linear-gradient( 223deg, #FEA732 0%, #FF6100 100%);"
							v-if="item.topicType === 3">热门</view>
						<view class="tag" style="background: linear-gradient( 226deg, #FFBEB7 0%, #FF4250 100%);"
							v-if="item.topicType === 2">有奖</view>
					</view>
					<view style="color: #848B9E;font-size: 24rpx;">{{item.hotCount}}&nbsp;热度</view>
				</view>
				<view class="class-title" v-if="hotTopicList.length">热门话题</view>
				<view v-for="item in hotTopicList" style="margin-bottom: 8px;" class="moto-flex-row-between"
					@click="selectTopic(item)">
					<view class="moto-flex-row-left">
						<view class="iconv2" style="font-size: 16px;color: #FF6100">&#xe71c;</view>
						<view class="topic-name">{{item.topicTagName}}</view>
						<view class="tag" style="background: linear-gradient( 223deg, #FEA732 0%, #FF6100 100%);"
							v-if="item.topicType === 3">热门</view>
						<view class="tag" style="background: linear-gradient( 226deg, #FFBEB7 0%, #FF4250 100%);"
							v-if="item.topicType === 2">有奖</view>
					</view>
					<view style="color: #848B9E;font-size: 24rpx;">{{item.hotCount}}&nbsp;热度</view>
				</view>
				<view v-for="item in listInfo.data" style="margin-bottom: 8px;" class="moto-flex-row-between"
					@click="selectTopic(item)">
					<view class="moto-flex-row-left">
						<view class="iconv2" style="font-size: 16px;color: #FF6100">&#xe71c;</view>
						<view class="topic-name">{{item.topicTagName}}</view>
					</view>
					<view style="color: #848B9E;font-size: 24rpx;">{{item.hotCount}}&nbsp;热度</view>
				</view>
				<view style="height: 50px;">
					<view v-if="listInfo.loading" class="status">加载中...</view>
					<view class="status" v-if="listInfo.nomore">没有更多了</view>
					<view class="status" v-if="listInfo.empty">暂无内容</view>
				</view>
			</view>
		</scroll-view>
	</el-dialog>
</template>

<script>
	import {
		debounce,
		throttle
	} from 'lodash'
	export default {
		props: {
			seleted: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				showSearch: false,
				dialogVisible: false,
				listInfo: {
					page: 1,
					size: 20,
					data: [],
					nomore: false,
					loading: false
				},
				searchInfo: {
					page: 1,
					size: 20,
					searchKeyword: '',
					data: [],
					nomore: false,
					loading: false,
					empty: false
				},
				awardTopicList: [],
				hotTopicList: []
			}
		},
		methods: {
			selectTopic(item) {
				if(this.seleted.includes(item.topicTagId)){
					getApp().$message.warning('已添加该话题')
					return
				}
				this.$emit('topicSelect', item)
				this.dialogVisible = false
			},
			getTopicList() {
				this.listInfo.loading = true
				const params = {
					page: this.listInfo.page,
					size: this.listInfo.size
				}
				getApp().$openApi.motoCms.getTopicList(params).then(res => {
					this.listInfo.loading = false
					if (res.data.code === 200) {
						const data = res.data.data.dataList.filter(item => item.topicType === 1)
						if (data.length) {
							this.listInfo.data.push(...data)
						}
						if (!data.length) {
							this.listInfo.nomore = true
						}
					}
				})
			},
			getTagListAct() {
				getApp().$openApi.motoCms.getTagListAct().then(res => {
					if (res.data.code === 200) {
						this.awardTopicList = res.data.data.filter(item => item.topicType === 2)
						this.hotTopicList = res.data.data.filter(item => item.topicType === 3)
					}
				})
			},
			onListLoadMore: throttle(function() {
				this.listInfo.page++
				this.getTopicList()
			}, 500),
			onSearchChange: debounce(function() {
				this.searchInfo.page = 1
				this.searchInfo.nomore = false
				this.searchInfo.empty = false
				if (!this.searchInfo.searchKeyword) {
					this.showSearch = false
					return
				}
				this.showSearch = true
				this.search()
			}, 500),
			search() {
				const params = {
					keyword: this.searchInfo.searchKeyword,
					page: this.searchInfo.page,
					size: this.searchInfo.size
				}
				getApp().$openApi.motoCms.getTopicList(params).then(res => {
					this.searchInfo.loading = false
					if (res.data.code === 200) {
						const data = res.data.data.dataList.filter(item => item.topicType === 1)
						if (data.length) {
							this.searchInfo.data.push(...data)
						}
						if (!data.length && this.searchInfo.page === 1) {
							this.searchInfo.empty = true
							return
						}
						if (!data.length) {
							console.lo
							this.searchInfo.nomore = true
						}
					}
				})
			},
			createTopic() {
				getApp().$openApi.motoCms.createTopic({
					topicTagId: '',
					topicTagName: this.searchInfo.searchKeyword
				}).then(res => {
					if (res.data.code === 200) {
						this.$emit('topicSelect', {
							topicId: res.data.data.topicTagId,
							topicName: this.searchInfo.searchKeyword
						})
						getApp().$message.success('创建成功')
						this.dialogVisible = false
					}
				})
			},
			confirmSearch() {
				this.searchInfo.page = 1
				this.searchInfo.nomore = false
				this.searchInfo.empty = false
				this.search()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.el-dialog__title {
		font-size: 34rpx;
	}

	.search-btn {
		width: 120rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		color: #141E34;
		background-color: #ff6100;
		border-radius: 8rpx;
		margin-left: 20rpx;
		color: #FFFFFF;
	}

	.scroll-container {
		width: 940rpx;
		height: 1000rpx;
	}

	.class-title {
		font-size: 24rpx;
		color: #848B9E;
		margin-bottom: 10rpx;
	}

	.topic-name {
		font-size: 26rpx;
		color: #141E34;
		margin-left: 12rpx;
	}

	.tag {
		width: 48rpx;
		height: 30rpx;
		line-height: 30rpx;
		font-size: 20rpx;
		text-align: center;
		color: #FFFFFF;
		border-radius: 4rpx;
		margin-left: 10rpx
	}

	.status {
		height: 100rpx;
		line-height: 100rpx;
		width: 900rpx;
		text-align: center;
	}
</style>