<template>
	<view class="moto-flex-row-center" style="width: 90%;height: 100%;">
		<scroll-view :show-scrollbar="false" scroll-y class="card card-shadow" @scrolltolower="onLoadMore">
			<view style="height: 32px;"></view>
			<view v-for="(item,index) in commentList">
				<view class="moto-flex-row-left" style="margin-bottom: 32px;align-items: flex-start">
					<image class="user-avatar" :src="item.author.avatarUrl"></image>
					<view class="content-container">
						<view class="moto-flex-row-between" style="align-items: flex-start;">
							<view>
								<view class="user-name">{{item.author.name}}</view>
								<view class="moto-flex-row-left" style="margin-bottom: 4px;">
									<view style="font-size: 14px;margin-right: 10px;color: rgba(51, 51, 51, .6);">
										{{item.interactType === 'COMMENT' ? '评论了你的动态' : '回复了你的评论'}}
									</view>
									<view style="font-size: 14px;margin-right: 10px;color:rgba(51, 51, 51, .6)">10-12
									</view>
								</view>
								<view class="comment-content">{{item.commentContent}}</view>
								<view class="moto-flex-row-left" style="margin-top: 10px;">
									<view class="action-reply moto-flex-row-left" v-if="!item.showInput"
										@click="openInput(index)">
										<view class="iconv2 reply-icon">&#xe6d7;</view>
										<view class="reply-text">回复</view>
									</view>
									<view v-else class="moto-flex-row-left">
										<view class="input-box">
											<view class="moto-flex-row-left">
												<el-input :ref="'input' + index" :autofocus="true"
													style="font-size: 15px;color: #333;height: 36px;"
													@blur="onInputBlur(index)" v-model="inputValue"
													placeholder-style="font-size: 14px" placeholder="回复芝士饭团"
													@keyup.enter.prevent="sendComment(item)"></el-input>
												<view @click="uploadImage(item)" class="iconv2"
													style="color: #666666;font-size: 18px;">&#xe620;</view>
											</view>
											<view v-if="imageUrl" style="padding-left: 10px;position: relative;">
												<image class="comment-image" :src="imageUrl"></image>
												<view class="image-status" v-if="imageStatus === 'loading'">上传中...
												</view>
												<view class="image-stauts" v-if="imageStatus === 'fail'">上传失败...</view>
												<view @click="deleteImage" v-if="imageStatus !== 'loading'" class="iconv2 delete-btn">&#xe671;</view>
											</view>
										</view>
										<view class="send-btn" confirm-type="search" @click="sendComment(item)">发送
										</view>
									</view>
									<view v-if="!item.showInput" class="iconv2" style="font-size: 18px;">&#xe644;</view>
								</view>
							</view>
							<image mode="aspectFill" class="article-image" :src="item.articleImageUrl"></image>
						</view>
						<view class="line"></view>
					</view>
				</view>
			</view>
			<view v-if="pageInfo.loading" class="status">加载中...</view>
			<view class="status" v-else-if="pageInfo.nomore">没有更多了</view>
			<view class="status" v-else-if="pageInfo.empty">暂无内容</view>
			<view class="status" v-else></view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		imageUpload
	} from '@/utils/imageTool'
	import {
		throttle
	} from 'lodash'
	export default {
		data() {
			return {
				pageInfo: {
					page: 1,
					size: 10,
					loading: false,
					nomore: false,
					empty: false
				},
				inputValue: '',
				imageStatus: '',
				imageUrl: '',
				notCloseInput: false,
				commentList: [],
				articleTypeMap: {

				}
			}
		},
		onLoad() {
			this.getCommentList()
		},
		methods: {
			getCommentList() {
				if (this.pageInfo.nomore) {
					return
				}
				const params = {
					page: this.pageInfo.page,
					size: this.pageInfo.size,
					showCommentImage: true,
					type: 'COMMENT'
				}
				this.pageInfo.loading = true
				getApp().$openApi.user.getInteractList(params).then(res => {
					this.pageInfo.loading = false
					if (res.data.code === 200) {
						const data = res.data.data.dataList.map(item => {
							return {
								...item,
								showInput: false
							}
						})
						this.commentList.push(...data)
						if (!data.length && this.pageInfo.page === 1) {
							this.pageInfo.empty = true
							return
						}
						if (!data.length || data.length < this.pageInfo.size) {
							this.pageInfo.nomore = true
							return
						}
						this.pageInfo.page++
					}
				})
			},
			onLoadMore: throttle(function() {
				this.getCommentList()
			}, 500),
			openInput(index) {
				this.commentList[index].showInput = true
				this.$nextTick(() => {
					this.$refs['input' + index][0].focus()
				})
			},
			onInputBlur(index) {
				setTimeout(() => {
					if (!this.notCloseInput) {
						this.commentList[index].showInput = false
						this.notCloseInput = false
					}
				}, 200)
				this.inputValue = ''
			},
			uploadImage(item) {
				this.notCloseInput = true
				item.showInput = true
				this.$nextTick(() => {
					item.showInput = true
				})
				uni.chooseImage({
					count: 1, //默认9
					success: async (res) => {
						this.imageUrl = res.tempFilePaths[0]
						this.imageStatus = 'loading'
						const result = await imageUpload(res.tempFilePaths[0])
						console.log(result)
						if (result) {
							this.imageUrl = result
							this.imageStatus = ''
						} else {
							this.imageStatus = 'fail'
						}
					}
				});
			},
			deleteImage(){
				this.imageUrl = ''
			},
			sendComment(item) {
				if (!this.inputValue && !this.imageUrl) {
					this.showInput = false
					return
				}
				item.showInput = true
				const commentData = {}
				commentData.linkId = item.articleId
				commentData.replyCommentId = item.commentId
				commentData.toUserOpenId = item.author.openId
				commentData.toUserName = item.author.name
				commentData.type = item.articleType
				commentData.content = this.inputValue
				this.commentData.commentImage = this.imageUrl
				getApp().$openApi.user.sendComment(commentData).then(res => {
					if (res.data.code === 200) {
						getApp().$Message.success('回复成功')
					}
					item.showInput = false
					this.inputValue = ''
					this.imageUrl = ''
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.card {
		width: 600px;
		height: 100%;
		background-color: #FFFFFF;
		padding: 0px 24px;
		box-sizing: border-box;
		border-radius: 8px;
	}

	.user-avatar {
		height: 48px;
		width: 48px;
		border-radius: 24px;
		margin-right: 20px;
	}

	.article-image {
		height: 78px;
		width: 78px;
		border-radius: 8px;
	}

	.content-container {
		flex: 1;
		border-bottom: 1px solid #eee;
		padding-bottom: 32px;
	}

	.user-name {
		font-size: 16px;
		font-weight: 500;
		color: #333333;
		margin-bottom: 2px;
	}

	.reply-icon {
		color: rgba(51, 51, 51, 0.9);
		font-size: 16px;
		margin-right: 5px;
	}

	.reply-text {
		color: rgba(51, 51, 51, 0.9);
		font-size: 16px;
	}

	.action-reply {
		border: 1px solid #eee;
		padding: 5px 10px;
		border-radius: 15px;
		margin-right: 10px;
	}

	.input-box {
		width: 300px;
		padding: 0 10px;
		background-color: #f7f7f7;
		border-radius: 20px;
		margin-right: 10px;
	}

	.comment-content {
		font-size: 14px;
		color: #333333;
	}

	.status {
		height: 50px;
		line-height: 50px;
		color: #666666;
		font-size: 14px;
		width: 100%;
		text-align: center;
	}

	.send-btn {
		width: 60px;
		height: 30px;
		background-color: #ff6100;
		border-radius: 20px;
		color: #FFFFFF;
		font-size: 14px;
		text-align: center;
		line-height: 30px;
	}

	::v-deep .el-input-inner {
		border: 0
	}

	::v-deep .el-input__wrapper {
		border: 0;
		box-shadow: none;
		background-color: #f7f7f7;
	}

	.comment-image {
		width: 50px;
		height: 50px;
		border-radius: 8px;
	}

	.image-status {
		position: absolute;
		top: 0;
		left: 10px;
		width: 50px;
		height: 50px;
		background-color: rgba(0, 0, 0, 0.3);
		text-align: center;
		line-height: 50px;
		color: #FFFFFF;
		font-size: 10px;
		border-radius: 8px;
	}

	.delete-btn {
		position: absolute;
		left: 50px;
		top: 2px;
		background-color: rgba(0, 0, 0, 0.3);
		border-top-right-radius: 8px;
		border-bottom-left-radius: 4px;
		font-size: 9px;
		color: #FFFFFF;
		width: 10px;
		height: 10px;
	}
</style>