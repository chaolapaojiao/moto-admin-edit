<template>
	<view class="draft-container">
		<view class="moto-flex-row-left card-list-container">
			<view v-if="pageInfo.currentPage === 1" class="article-card card-shadow moto-flex-column-center"
				@click="choosePubType">
				<view class="iconv2" style="font-size: 25px;margin-bottom: 5px;">&#xe6e0;</view>
				<view>发布动态</view>
			</view>
			<view v-for="(item, index) in draftList[pageInfo.currentPage]" class="article-card card-shadow">
				<image v-if="item.previewImageUrls && item.previewImageUrls.length" mode="aspectFill"
					class="draft-image" :src="item.previewImageUrls[0]"></image>
				<view v-else class="moto-flex-row-center no-image">暂无图片</view>
				<view class="article-type" v-if="item.articleType === 'CIRCLE_BIG_ARTICLE'">长图文</view>
				<view class="article-type" v-if="item.articleType === 'ARTICLE'">资讯</view>
				<view class="article-type" v-if="item.articleType === 'CIRCLE'">动态</view>
				<view style="padding: 5px 12px;">
					<view class="draft-title moto-lines-1" :style="{color: item.title ? '' : '#BFC4CF'}">
						{{item.title ? item.title : '暂无标题'}}
					</view>
					<view style="color:#BFC4CF;font-size: 12px;">{{item.timeStr}}</view>
				</view>
				<view class="moto-flex-row-left btn-contaniner">
					<view class="btn" @click="deleteDraft(item, index)">删除</view>
					<view class="btn" @click="openDraftEdit(item)">编辑</view>
				</view>
			</view>
		</view>
		<view class="moto-flex-row-center">
			<el-pagination size="small" hide-on-single-page @change="onPageChange" layout="prev, pager, next"
				:default-page-size="pageInfo.size" :total="pageInfo.total" />
		</view>
		<pub-type-select ref="pubTypeSelect"></pub-type-select>
	</view>
</template>

<script>
	import pubTypeSelect from '@/components/moto-cms/pub-type-select.vue'
	export default {
		components: {
			pubTypeSelect
		},
		data() {
			return {
				pageInfo: {
					page: 1,
					size: 8,
					total: 0,
					articleType: 'CIRCLE',
					currentPage: 1
				},
				draftList: []
			}
		},
		onLoad() {
			this.getDraftList()
		},
		methods: {
			getDraftList() {
				const params = {
					page: this.pageInfo.page,
					size: this.pageInfo.size,
					articleType: this.pageInfo.articleType
				}
				getApp().$openApi.motoCms.getDraftList(params).then(res => {
					if (res.data.code === 200) {
						const data = res.data.data.draftList
						console.log(data)
						this.pageInfo.total = data.total
						this.draftList[this.pageInfo.page] = data.dataList
						this.pageInfo.page++
					}
				})
			},
			choosePubType() {
				this.$refs.pubTypeSelect.dialogVisible = true
			},
			deleteDraft(item, index) {
				uni.showModal({
					content: '确定将该草删除？',
					success: (res) => {
						getApp().$openApi.motoCms.delDrafts({
							draftIds: [item.draftId]
						}).then(res => {
							if (res.data.code === 200) {
								this.draftList[this.pageInfo.currentPage].splice(index, 1)
								this.pageInfo.page--
							}
						})
					}
				})
			},
			openDraftEdit(item) {
				const host = window.location.host
				if (item.articleType === 'CIRCLE_BIG_ARTICLE') {
					window.open(
						`http://${host}/pages/moto-cms/rich-article-editor?draftId=${item.draftId}&type=CIRCLE_BIG_ARTICLE`,
						'_blank')
				} else if (item.articleType === 'ARTICLE') {
					window.open(`http://${host}/pages/moto-cms/rich-article-editor?draftId=${item.draftId}&type=ARTICLE`,
						'_blank')
				} else if (item.articleType === 'CIRCLE') {
					window.open(`http://${host}/pages/moto-cms/normal-article-editor?draftId=${item.draftId}`, '_blank')
				}
			},
			onPageChange(e) {
				this.pageInfo.currentPage = e
				if (!this.draftList[this.pageInfo.currentPage]) {
					this.getDraftList()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.draft-container {
		position: relative;
		width: calc(100% - 50px);
		height: 100%;
		padding: 40px;
		box-sizing: border-box;
		min-width: 1000px;
	}

	.article-card {
		position: relative;
		flex-shrink: 0;
		width: 26%;
		height: 160px;
		background-color: #FFFFFF;
		margin-right: 60px;
		margin-bottom: 60px;
		border-radius: 6px;
		overflow: hidden;
	}

	.card-list-container {
		height: 95%;
		flex-wrap: wrap;
		align-items: flex-start;
		align-content: flex-start;
		margin-left: 70px;
		width: 100%;
	}

	.draft-image {
		width: 100%;
		height: 100px;
	}

	.draft-title {
		font-size: 14px;
		width: 100%;
		margin-bottom: 3px;
	}

	.no-image {
		width: 100%;
		height: 100px;
		background-color: #F7F8FB;
		color: #BFC4CF;
		font-size: 14px;
	}

	.btn-contaniner {
		position: absolute;
		bottom: 5px;
		right: 5px;
	}

	.btn {
		padding: 2px 5px;
		border: 1px solid #eee;
		border-radius: 2px;
		font-size: 11px;
		margin-right: 5px;
	}

	.article-type {
		position: absolute;
		top: 0;
		left: 0;
		padding: 2px 6px;
		font-size: 9px;
		color: #FFFFFF;
		background-color: rgba(255, 97, 0, 0.8);
		border-bottom-right-radius: 4px;
	}
</style>