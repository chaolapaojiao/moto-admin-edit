<template>
	<el-dialog style="padding-bottom: 0" v-model="dialogVisible" title="关联车型" width="400" align-center>
		<view>
			<view class="moto-flex-row-left" style="margin-bottom: 10px;">
				<el-input @input="onSearchChange" v-model="searchInfo.searchKeyword" style="width: 400px;"
					placeholder="搜索感兴趣的车型" />
				<view class="search-btn" @click="onSearchChange">搜索</view>
			</view>
			<scroll-view scroll-y class="model-list-container" :show-scrollbar="false" @scrolltolower="onScrolltolower">
				<el-empty v-if="!searchInfo.searchKeyword" description="请输入搜索内容" :image-size="100" />
				<view style="white-space: normal;">
					<view v-for="item in modelList" class="model-card" @click="selectModel(item)">
						<view class="moto-flex-row-left">
							<image class="model-image" :src="item.modelImageUrl"></image>
							<view>
								<view class="model-name">{{item.brandName}}{{item.modelName}}</view>
								<view class="model-price">{{item.priceStr ? '指导价:' + item.priceStr : '暂无售价'}}</view>
							</view>
						</view>
						<view class="line"></view>
					</view>
					<view style="height: 50px;">
						<view v-if="searchInfo.loading" class="status">加载中...</view>
						<view class="status" v-if="searchInfo.nomore">没有更多了</view>
						<view class="status" v-if="searchInfo.empty">暂无内容</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</el-dialog>
</template>

<script>
	import {
		throttle,
		debounce
	} from 'lodash'
	export default {
		props: {
			linkModelList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				dialogVisible: false,
				searchInfo: {
					page: 1,
					searchKeyword: '',
					scrollId: '',
					loading: false,
					empty: false,
					nomore: false
				},
				modelList: []
			}
		},
		methods: {
			onSearchChange: debounce(function() {
				this.searchInfo.page = 1
				this.searchInfo.scrollId = ''
				this.searchInfo.empty = false
				this.searchInfo.nomore = false
				if (this.searchInfo.searchKeyword) {
					this.confirmSearch()
				} else {
					this.modelList = []
				}
			}, 500),
			onScrolltolower: throttle(function() {
				this.confirmSearch()
			}, 500),
			confirmSearch() {
				if (this.searchInfo.nomore || this.searchInfo.empty) {
					return
				}
				this.searchInfo.loading = true
				const params = {
					keyword: this.searchInfo.searchKeyword,
					size: 10,
					searchClass: 3,
					scrollId: this.searchInfo.scrollId
				}
				getApp().$openApi.motoCms.globalSearch(params).then(res => {
					this.searchInfo.loading = false
					if (res.data.code === 200) {
						if (this.searchInfo.page === 1 && !res.data.data.motorModelList) {
							this.searchInfo.empty = true
							return
						}
						if (res.data.data.motorModelList.length < 10 || res.data.data.motorModelList.length) {
							this.searchInfo.nomore = true
						}
						this.searchInfo.scrollId = res.data.data.scrollId
						this.modelList.push(...res.data.data.motorModelList)
					}
				})
			},
			selectModel(item) {
				const result = this.linkModelList.find(model => model.modelId === item.modelId)
				if (result) {
					getApp().$Message.warning('已关联该车型')
					return
				}
				this.$emit('modelSelect', item)
				this.dialogVisible = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-btn {
		width: 60px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		color: #141E34;
		background-color: #ff6100;
		border-radius: 4px;
		margin-left: 10px;
		color: #FFFFFF;
	}

	.model-card {
		padding: 12px;
		padding-left: 24px;
	}

	.model-image {
		width: 80px;
		height: 60px;
		margin-right: 20px;
	}

	.model-list-container {
		height: 500px;
		overflow: scroll;
		scrollbar-width: none;
	}

	.model-name {
		font-size: 13px;
		margin-bottom: 4px;
	}

	.model-price {
		font-size: 11px;
		color: #999999;
	}

	.line {
		width: 100%;
		background-color: #eee;
		height: 1px;
	}

	.status {
		height: 50px;
		line-height: 50px;
		width: 100%;
		text-align: center;
	}
</style>