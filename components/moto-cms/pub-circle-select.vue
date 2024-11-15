<template>
	<view>
		<el-dialog style="padding-bottom: 0" v-model="dialogVisible" title="关联圈子" width="500" align-center
			@close="onDialogClose">
			<view>
				<view class="moto-flex-row-left" style="margin-bottom: 10px;">
					<el-input @input="onSearchChange" v-model="searchInfo.searchKeyword" style="width: 400px;"
						placeholder="搜索感兴趣的圈子" />
					<view class="search-btn" @click="confirmSearch">搜索</view>
				</view>
				<scroll-view @scrolltolower="onSearchTolower" :show-scrollbar="false" scroll-y v-if="showSearch"
					class="seach-container">
					<view style="white-space: nowrap;">
						<view v-for="item in searchInfo.data" class="moto-flex-row-between"
							style="margin-bottom: 10px;;">
							<view class="moto-flex-row-left">
								<image :src="item.imageUrl" mode="aspectFit" class="card-circle-image"></image>
								<view class="moto-lines-1" style="margin-left: 10px;color: #141E34;">
									{{ item.circleName }}
								</view>
							</view>
							<view class="select-btn" @click="selectCircle(item)">选择</view>
						</view>
						<view style="width: 450px;" v-if="searchInfo.loading" class="status">加载中...</view>
						<view style="width: 450px;" class="status" v-if="searchInfo.nomore">没有更多了</view>
						<view style="width: 450px;" v-if="!searchInfo.loading && !searchInfo.nomore" class="status">
						</view>
					</view>
				</scroll-view>
				<view class="moto-flex-row-left" v-else>
					<view style="background-color: #F8F9FB;margin-left: -16px;height: 350px;border-radius: 4px;">
						<view v-for="(item, index) in tabs" @click="onTabChange(index)">
							<view class="tab-item" :class="{'tab-item-active': currentTab === index}">{{item.name}}
							</view>
						</view>
					</view>
					<scroll-view @scrolltolower="onScrolltolower" :show-scrollbar="false" scroll-y
						style="height:350px;width: 350px;margin-left: 20px;">
						<view style="white-space:">
							<view v-for="item in tabs[currentTab].data" class="moto-flex-row-between"
								style="margin-bottom: 10px;;">
								<view class="moto-flex-row-left">
									<image :src="item.imageUrl" mode="aspectFit" class="card-circle-image"></image>
									<view class="moto-lines-1" style="margin-left: 10px;color: #141E34;">
										{{ item.circleName }}
									</view>
								</view>
								<view class="select-btn" @click="selectCircle(item)">选择</view>
							</view>
							<view v-if="loading" class="status">加载中...</view>
							<view class="status" v-if="tabs[currentTab].nomore">没有更多了</view>
							<view v-if="!loading && !tabs[currentTab].nomore" class="status"></view>
						</view>
					</scroll-view>
				</view>
			</view>
		</el-dialog>
	</view>
</template>

<script>
	import {
		throttle
	} from 'lodash'
	export default {
		data() {
			return {
				dialogVisible: false,
				currentTab: 0,
				loading: false,
				showSearch: false,
				searchInfo: {
					searchKeyword: '',
					data: [],
					page: 1,
					size: 10,
					loading: false,
					nomore: false
				},
				tabs: [{
						name: "推荐",
						select: "RECOMMEND",
						page: 1,
						nomore: false,
						data: []
					}, {
						name: "车型",
						select: "MODEL",
						page: 1,
						nomore: false,
						data: []
					},
					{
						name: "兴趣",
						select: "HOBBY",
						page: 1,
						nomore: false,
						data: []
					},
					{
						name: "地区",
						select: "REGION",
						page: 1,
						nomore: false,
						data: []
					},
					{
						name: "品牌",
						select: "BRAND",
						page: 1,
						nomore: false,
						data: []
					}
				]
			}
		},
		methods: {
			selectCircle(item) {
				this.$emit('circleSelect', item)
				this.dialogVisible = false
			},
			getCircleList() {
				const tab = this.tabs[this.currentTab]
				if (tab.nomore) {
					return
				}
				this.loading = true
				const postData = {
					page: tab.page,
					size: 10,
					select: tab.select
				}
				getApp().$openApi.motoCms.getCircleList(postData).then(res => {
					setTimeout(() => {
						this.loading = false
						if (res.data.code === 200) {
							const data = res.data.data.dataList
							if (data.length) {
								tab.data.push(...data)
							}
							if (!data.length || data.length < 10) {
								tab.nomore = true
							}
						}
					}, 300)
				})
			},
			onTabChange(index) {
				this.currentTab = index
				this.getCircleList()
			},
			onScrolltolower: throttle(function() {
				const tab = this.tabs[this.currentTab]
				tab.page++
				this.getCircleList()
			}, 500),
			onSearchTolower: throttle(function() {
				this.searchInfo.page++
				this.search()
			}, 500),
			confirmSearch() {
				this.searchInfo.page = 1
				this.search()
			},
			search() {
				this.showSearch = true
				if (this.searchInfo.nomore) {
					return
				}
				this.searchInfo.loading = true
				var params = {
					keyword: this.searchInfo.searchKeyword,
					searchClass: 4,
					page: this.searchInfo.page,
					size: this.searchInfo.size,
				}
				getApp().$openApi.motoCms.globalSearch(params).then(res => {
					this.searchInfo.loading = false
					if (res.data.code === 200) {
						const data = res.data.data.circleList
						if (data.length) {
							this.searchInfo.data.push(...data)
						}
						if (!data.length || data.length < this.searchInfo.size) {
							this.searchInfo.nomore = true
						}
					}
				})
			},
			onDialogClose() {
				this.dialogVisible = false
				this.showSearch = false
				this.searchInfo = {
					searchKeyword: '',
					data: [],
					page: 1,
					size: 10,
					loading: false,
					nomore: false
				}
			},
			onSearchChange(e) {
				if (!e) {
					this.showSearch = false
				}
			}
		}
	}
</script>

<style lang="scss">
	.tab-item {
		width: 200rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		color: #141E34;
	}

	.tab-item-active {
		background-color: #FFFFFF;
		color: #ff6100;
	}

	.card-circle-image {
		width: 100rpx;
		height: 100rpx;
		border: 2rpx solid #f7f8f9;
		border-radius: 8rpx;
	}

	.select-btn {
		width: 140rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		background: #F7F8FB;
		color: #141E34;
		font-size: 28rpx;
		border-radius: 8rpx;
	}

	.status {
		height: 100rpx;
		line-height: 100rpx;
		width: 700rpx;
		text-align: center;
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

	.seach-container {
		width: 900rpx;
		height: 800rpx;
	}

	.el-dialog__title {
		font-size: 34rpx !important;
	}
</style>