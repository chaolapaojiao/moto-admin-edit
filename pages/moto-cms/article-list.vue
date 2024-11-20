<template>
	<view style="width: 100%;height: 100%;overflow: hidden;">
		<view class="article-list-card card-shadow">
			<view class="title">发布记录</view>
			<view class="moto-flex-row-center" style="margin: 10rpx 0 40rpx 0;">
				<view class="tab-container">
					<view class="tab" :class="{'active-tab':nCurrentTab === 0 }" @click="onTabChange(0)">圈子</view>
					<view class="tab" :class="{'active-tab':nCurrentTab === 1 }" @click="onTabChange(1)">资讯</view>
				</view>
			</view>
			<view style="height: 85%;">
				<view v-for="(item,index) in tabs[nCurrentTab].data[tabs[nCurrentTab].currentPage]">
					<article-card @deleteSuccess="onDeleteSuccess" :item="item"></article-card>
				</view>
			</view>
			<view class="moto-flex-row-center">
				<el-pagination hide-on-single-page size="small" @change="onPageChange" layout="prev, pager, next"
					:default-page-size="tabs[nCurrentTab].size" :total="tabs[nCurrentTab].total" />
			</view>
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
				tabs: [{
						type: 0,
						page: 1,
						size: 5,
						currentPage: 1,
						select: 'CIRCLE',
						name: '圈子',
						total: 0,
						data: []
					},
					{
						type: 1,
						page: 1,
						size: 5,
						currentPage: 1,
						select: 'ARTICLE',
						name: '资讯',
						total: 0,
						data: []
					},
				],
				nCurrentTab: 0
			}
		},
		onLoad() {
			this.getPubList()
		},
		methods: {
			onTabChange(tab) {
				this.nCurrentTab = tab
				if (tab === 1 && !this.tabs[1].data.length) {
					this.getPubList()
				}
			},
			getPubList() {
				const tab = this.tabs[this.nCurrentTab]
				const params = {
					page: tab.page,
					size: tab.size,
					type: tab.select
				}
				getApp().$openApi.motoCms.getPubArticleList(params).then(res => {
					if (res.data.code === 200) {
						tab.total = res.data.data.total
						tab.data[tab.page] = res.data.data.releaseList
						tab.page++
					}
				})
			},
			onPageChange(e) {
				const tab = this.tabs[this.nCurrentTab]
				tab.currentPage = e
				if (!tab.data[tab.currentPage]) {
					this.getPubList()
				}
			},
			onDeleteSuccess(id) {
				const tab = this.tabs[this.nCurrentTab]
				const index = tab.data[tab.currentPage].findIndex(item => item.id === id)
				if (index !== -1) {
					tab.data[tab.currentPage].splice(index, 1)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.article-list-card {
		width: calc(100% - 50px);
		height: 100%;
		margin-top: 20rpx;
		padding: 50rpx;
		background-color: #FFFFFF;
		box-sizing: border-box;
	}

	.title {
		font-size: 34rpx;
	}

	.tab-container {
		padding-left: 6rpx;
		padding-right: 6rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 56rpx;
		background: #F6F7FC;
		font-weight: 400;
		border-radius: 4rpx;
		margin-left: 60rpx;
		width: 240rpx
	}

	.active-tab {
		background-color: #FFFFFF !important;
		color: #141E34 !important;
		border-radius: 2rpx;
	}

	.tab {
		padding: 0 24rpx;
		color: #6F7582;
		font-size: 28rpx;
		text-align: center;
		height: 46rpx;
		line-height: 46rpx;
		border-radius: 4rpx;
		transition: .1s;
	}
</style>