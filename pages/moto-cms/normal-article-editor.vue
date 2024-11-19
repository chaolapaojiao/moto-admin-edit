<template>
	<view class="container">
		<el-row :gutter="20" style="height: 100%;">
			<el-col :span="6">
				<pub-preview :vote="linkVoteInfo" :circle="linkCircle" :title="articleTitle"
					:images="imageList.map(item => item.url).slice(0, 3)" :content="articleContent"></pub-preview>
			</el-col>
			<el-col :span="17">
				<view class="editor-container card-shadow">
					<view style="padding: 32rpx;">
						<scroll-view :show-scrollbar="false" class="moto-flex-row-left image-scroll-container" scroll-x>
							<view style="white-space: nowrap" class="moto-flex-row-left">
								<view v-for="(item,index) in imageList" style="position: relative;">
									<image mode="aspectFill" class="article-image" :src="item.url"></image>
									<view class="image-delete-icon iconv2" @click="onImageRemove(index)">&#xe671;</view>
									<view class="image-upload-status" v-if="item.status === 'uploading'">上传中...</view>
									<view class="image-upload-status" v-if="item.status === 'fail'">上传失败...</view>
								</view>
								<el-upload multiple :show-file-list="false" :http-request="onImageUpload">
									<view class="iconv2 image-upload">&#xe695;</view>
								</el-upload>
							</view>
						</scroll-view>
						<view style="height: 30rpx;"></view>
						<textarea style="font-size: 34rpx;color: #141E34;font-weight: 500;"
							placeholder-style="font-size: 34rpx;font-weight: 400" v-model="articleTitle" auto-height
							placeholder="请输入文章标题"></textarea>
						<view class="line"></view>
						<view class="moto-flex-row-left" style="flex-wrap: wrap;margin-top: 10px;">
							<view v-for="(item,index) in linkTopicList" class="moto-flex-row-left topic-item">
								<view class="topic-name">#{{item.topicTagName}}</view>
								<view class="iconv2 delete-icon" @click="removeTopic(item.topicTagId)">&#xe671;</view>
							</view>
						</view>
						<textarea class="content-textarea" placeholder-style="font-size: 34rpx"
							placeholder="分享你的机车生活,交流用车心得,各种生活趣事" v-model="articleContent"></textarea>
					</view>
					<view class="moto-flex-row-left" style="padding: 0 34px;margin-bottom: 12px;">
						<view v-if="linkClass" class="moto-flex-row-left" style="margin-right: 20px;">
							<view class="iconv2 link-icon" style="margin-right: 8px;font-size: 17px;">&#xe697;</view>
							<view class="link-name">{{linkClass.name}}</view>
							<view class="iconv2 delete-icon" @click="linkClass = null">&#xe671;</view>
						</view>
						<view v-if="linkVoteInfo.voteItemList.length" class="moto-flex-row-left">
							<view class="iconv2 link-icon" style="margin-right: 8px;font-size: 17px;">&#xe789;</view>
							<view class="link-name">{{linkVoteInfo.voteTitle}}</view>
							<view class="iconv2 delete-icon" @click="linkVoteInfo.voteItemList = []">&#xe671;</view>
						</view>
					</view>
					<scroll-view :show-scrollbar="false" v-if="linkModifyInfo.modifyItemList.length"
						class="modify-scroll" scroll-x>
						<view class="moto-flex-row-left" style="white-space: nowrap;">
							<view class="link-name" style="margin-right: 20px;">改装清单: </view>
							<view v-for="(item,index) in linkModifyInfo.modifyItemList"
								class="modify-item moto-flex-row-left">
								<image v-if="item.itemUrl" mode="aspectFill" class="modify-item-image"
									:src="item.itemUrl">
								</image>
								<view class="link-name">{{item.itemName}}</view>
								<view class="iconv2 delete-icon" @click="removeModifyItem(index)">&#xe671;</view>
							</view>
						</view>
					</scroll-view>
					<view class="tool-container">
						<view class="moto-flex-row-between">
							<view class="moto-flex-row-left">
								<view class="moto-flex-row-left" @click="openLocationSelect">
									<view class="iconv2 link-icon">&#xe784;</view>
									<view class="link-name">
										{{linkLocation ? (linkLocation.name ?linkLocation.name :  linkLocation.locationName) : '关联位置'}}
									</view>
								</view>
								<view class="moto-flex-row-left" style="margin-left: 20px;" @click="openCicleSelect">
									<view class="iconv2 link-icon">&#xe785;</view>
									<view class="link-name">{{linkCircle ? linkCircle.circleName : '关联圈子'}}
									</view>
								</view>
							</view>
							<view style="color: #848B9E;font-size: 26rpx;">正文字数: {{articleContent.length}}</view>
						</view>
						<view class="moto-flex-row-between" style="margin-top: 10px;margin-left: -10px;">
							<view class="moto-flex-row-left">
								<view v-for="item in toolList" @click="onToolsClick(item)">
									<view class="moto-flex-column-center tool-item">
										<view class="iconv2 tool-icon">{{item.icon}}</view>
										<view class="tool-name">{{item.name}}</view>
									</view>
								</view>
							</view>
							<view class="moto-flex-row-left">
								<view class="save-btn" @click="saveDraft">保存草稿</view>
								<view class="pub-btn" @click="submit">发布</view>
							</view>
						</view>
					</view>
				</view>
			</el-col>
		</el-row>
		<pub-circle-select @circleSelect="onCircleSelect" ref="circle-select"></pub-circle-select>
		<pub-location-select @locationSelect="onLocatonSelect" ref="location-select"></pub-location-select>
		<pub-topic-select :seleted="linkTopicList.map(item => item.topicTagId)" @topicSelect="onTopicSelect"
			ref="topic-select"></pub-topic-select>
		<pub-class-select @classSelect="onClassSelect" ref="class-select"></pub-class-select>
		<pub-vote-edit @voteEdit="onVoteEdit" ref="vote-edit"></pub-vote-edit>
		<pub-modify-edit @modifyEdit="onModifyEdit" ref="modify-edit"></pub-modify-edit>
	</view>
</template>

<script>
	import {
		imageUpload
	} from '@/utils/imageTool'
	import pubCircleSelect from '@/components/moto-cms/pub-circle-select.vue'
	import pubLocationSelect from '@/components/moto-cms/pub-location-select.vue'
	import pubTopicSelect from '@/components/moto-cms/pub-topic-select.vue'
	import pubClassSelect from '@/components/moto-cms/pub-class-select.vue';
	import pubVoteEdit from '@/components/moto-cms/pub-vote-edit.vue';
	import pubModifyEdit from '@/components/moto-cms/pub-modify-edit.vue';
	import pubPreview from '@/components/moto-cms/pub-preview.vue';
	export default {
		components: {
			pubCircleSelect,
			pubLocationSelect,
			pubTopicSelect,
			pubClassSelect,
			pubVoteEdit,
			pubModifyEdit,
			pubPreview
		},
		data() {
			return {
				draftId: '',
				articleId: '',
				dialogImageUrl: '',
				articleTitle: '',
				articleContent: '',
				imageList: [],
				linkCircle: null,
				linkLocation: null,
				linkClass: null,
				linkModel: null,
				linkTopicList: [],
				linkVoteInfo: {
					editFlag: false,
					voteTitle: '',
					voteItemList: []
				},
				linkModifyInfo: {
					editFlag: false,
					modifyItemList: []
				},
				toolList: [{
						name: '话题',
						icon: '\ue787',
						type: 'topic'
					},
					{
						name: '分类',
						icon: '\ue71b',
						type: 'class'
					},
					{
						name: '投票',
						icon: '\ue789',
						type: 'vote'
					},
					{
						name: '清单',
						icon: '\ue78a',
						type: 'list'
					},
				]
			}
		},
		onLoad(option) {
			if (option.id) {
				this.articleId = option.id
				this.getEditData()
			}
		},
		methods: {
			getEditData() {
				getApp().$openApi.motoCms.getCircleArticleInfo({
					articleId: this.articleId
				}).then(res => {
					if (res.data.code === 200) {
						const data = res.data.data
						this.articleTitle = data.articleTitle
						this.articleContent = data.articleContextList[0].context
						this.imageList = data.articleImageList.map(item => {
							return {
								url: item,
								id: Date.now()
							}
						})
						if (data.linkCircle) {
							this.linkCircle = data.linkCircle
						}
						if (data.location) {
							this.linkLocation = data.location
							console.log(this.linkLocation)
						}
						if (data.linkClass) {
							this.linkClass = {
								articleClass: data.articleClass
							}
						}
						if (data.topicTagList && data.topicTagList.length) {
							this.linkTopicList = data.topicTagList
						}
						if (data.voteInfo) {
							this.linkVoteInfo = {
								editFlag: false,
								voteTitle: data.voteInfo.voteTitle,
								voteItemList: data.voteInfo.voteItemList
							}
						}
						if (data.modifyInfo && data.modifyInfo.modifyItemList.length) {
							this.linkModifyInfo = {
								editFlag: false,
								modifyItemList: data.modifyInfo.modifyItemList
							}
						}
					}
				})
			},
			onImageRemove(index) {
				this.imageList.splice(index, 1)
			},
			async onImageUpload(e) {
				this.imageList.push({
					id: e.file.uid,
					url: URL.createObjectURL(e.file),
					status: 'uploading'
				})
				const result = await imageUpload(URL.createObjectURL(e.file))
				const image = this.imageList.find(item => item.id == e.file.uid)
				if (result) {
					image.url = result
					image.status = ''
				} else {
					image.status = 'fail'
					e.onError()
				}
			},
			submit() {
				if (this.articleContent.length < 6) {
					getApp().$Message.warning('正文内容不能少于6个字')
					return false
				}
				if (this.articleContent.length > 2000) {
					getApp().$Message.warning('正文内容不能多于2000个字')
					return false
				}
				if (!this.imageList.length) {
					getApp().$Message.warning('请上传至少一张图片')
					return false
				}
				uni.showLoading({
					title: '发布中',
					mask: true
				})
				var imageUrlList = this.imageList.map((e) => {
					return {
						contextClass: 2,
						context: e.url
					}
				})
				var contentList = [{
					contextClass: 1,
					context: this.articleContent
				}, ...imageUrlList]
				let postData = {
					'type': 1,
					"circleId": this.linkCircle ? this.linkCircle.circleId : null,
					"contentList": contentList,
					"location": this.linkLocation,
					"title": this.articleTitle,
					"autoJoinCircle": true,
					"draftId": this.draftId
				}
				if (this.linkTopicList.length) {
					postData.topicTagIdList = this.linkTopicList.map(item => item.topicTagId)
				}
				if (this.linkClass) {
					postData.articleClass = this.linkClass.articleClass
				}

				if (this.articleId) {
					postData.articleId = this.articleId
				}
				if (this.linkVoteInfo.voteItemList.length) {
					postData.voteInfo = this.linkVoteInfo
				}
				if (this.linkModifyInfo.modifyItemList.length) {
					postData.modifyInfo = this.linkModifyInfo
				}
				getApp().$openApi.motoCms.pubCircleArticle(postData).then(res => {
					if (res.data.code === 200) {
						uni.hideLoading()
						getApp().$Message.success('发布成功')
						this.articleContent = ''
						this.articleTitle = ''
						this.linkCircle = null
						this.linkLocation = null
						this.linkClass = null
						this.linkTopicList = []
						this.linkVoteInfo = {
							editFlag: false,
							voteTitle: '',
							voteItemList: []
						}
						this.linkModifyInfo = {
							editFlag: false,
							modifyItemList: []
						}
						this.imageList = []
					} else {
						uni.hideLoading()
					}
				})
			},
			onToolsClick(item) {
				if (item.type === 'topic') {
					if (this.linkTopicList.length >= 5) {
						getApp().$Message.warning('最多添加5个话题')
						return
					}
					this.$refs['topic-select'].getTopicList()
					this.$refs['topic-select'].getTagListAct()
					this.$refs['topic-select'].dialogVisible = true
				} else if (item.type === 'class') {
					this.$refs['class-select'].dialogVisible = true
				} else if (item.type === 'vote') {
					this.$refs['vote-edit'].dialogVisible = true
				} else if (item.type === 'list') {
					this.$refs['modify-edit'].dialogVisible = true
				}
			},
			openModelSelect() {
				this.$refs['model-select'].dialogVisible = true
			},
			removeModifyItem(index) {
				this.linkModifyInfo.modifyItemList.splice(index, 1)
				this.linkModifyInfo.editFlag = true
			},
			onModifyEdit(item) {
				this.linkModifyInfo.modifyItemList.push(item)
				this.linkModifyInfo.editFlag = true
			},
			onVoteEdit(item) {
				this.linkVoteInfo.voteTitle = item.voteTitle
				this.linkVoteInfo.voteItemList = item.voteItemList
				this.linkVoteInfo.editFlag = true
			},
			onClassSelect(item) {
				this.linkClass = item
			},
			removeTopic(id) {
				this.linkTopicList = this.linkTopicList.filter(item => item.topicTagId !== id)
			},
			onTopicSelect(item) {
				this.linkTopicList.push(item)
			},
			openLocationSelect() {
				this.$refs['location-select'].initLocation()
				this.$refs['location-select'].dialogVisible = true
			},
			onLocatonSelect(item) {
				this.linkLocation = item
			},
			onCircleSelect(item) {
				this.linkCircle = item
			},
			openCicleSelect() {
				this.$refs['circle-select'].getCircleList()
				this.$refs['circle-select'].dialogVisible = true
			},
			saveDraft() {
				const imageUrlList = this.imageList.map(item =>{
					return {
						contextClass: 2,
						context: item.url
					}
				})
				var contentList = [{
					contextClass: 1,
					context: this.articleContent
				}, ...imageUrlList]
				const content = {
					type: 2,
					linkCircle: this.linkCircle,
					contentList: contentList,
					linkLocation: this.linkLocation,
					articleTitle: this.articleTitle,
					linkClass: this.linkClass,
					linkTopicList: this.linkTopicList,
					linkVoteInfo: this.linkVoteInfo,
					linkModifyInfo: this.linkModifyInfo
				}
				const postData = {
					articleType: "CIRCLE",
					draftData: JSON.stringify(content),
					draftId: this.draftId
				}
				uni.showLoading({
					title: '发布中'
				})
				getApp().$openApi.motoCms.saveDraft(postData).then(res => {
					uni.hideLoading()
					if (res.data.code === 200) {
						getApp().$Message.success('保存草稿成功')
						this.draftId = res.data.data.draftId
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100%;
		width: 100%;
		position: relative;
	}

	.editor-container {
		width: 950px;
		height: 100%;
		background-color: #FFFFFF;
		box-sizing: border-box;
		padding-top: 20rpx;
	}

	.image-upload {
		width: 220rpx;
		height: 220rpx;
		text-align: center;
		line-height: 220rpx;
		font-size: 40rpx;
		color: #999;
		border-radius: 8rpx;
		border: 2rpx dashed #eee;
		margin-bottom: 10rpx;
	}

	.line {
		width: 100%;
		height: 2rpx;
		background-color: #f2f2f2;
		margin: 30rpx 0 60rpx 0;
	}

	::v-deep .el-upload--picture-card {
		width: 220rpx;
		height: 220rpx;
	}

	::v-deep .el-upload-list--picture-card {
		display: flex;
		flex-wrap: nowrap !important;
		overflow: scroll;
		white-space: nowrap;
		scrollbar-width: none;
	}

	::v-deep .el-upload-list__item {
		flex-shrink: 0;
		width: 220rpx;
		height: 220rpx;
	}

	.content-textarea {
		font-size: 34rpx;
		color: #141E34;
		width: 100%;
		letter-spacing: 1.5rpx;
		line-height: 48rpx;
		height: 390px;
	}

	.tool-container {
		width: 950px;
		box-shadow: 0 -2rpx 5rpx 0 rgba(0, 0, 0, 0.05);
		height: 180rpx;
		padding: 28rpx 68rpx 0 68rpx;
		box-sizing: border-box;
	}

	.link-icon {
		font-size: 32rpx;
		color: #141E34;
		margin-right: 10rpx;
	}

	.link-name {
		font-size: 28rpx;
		color: #141E34;
	}

	.tool-item {
		margin-right: 28rpx;
		width: 100rpx;
	}

	.tool-icon {
		font-size: 32rpx;
		color: #141E34;
		margin-bottom: 4rpx;
	}

	.tool-name {
		font-size: 26rpx;
		color: #141E34;
	}

	.save-btn {
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 26rpx;
		border: 2rpx solid #e8e8e8;
		border-radius: 8rpx;
		margin-right: 40rpx;
	}

	.pub-btn {
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 26rpx;
		color: #FFFFFF;
		background-color: #ff6100;
		border-radius: 8rpx;
	}

	.topic-item {
		margin: 4rpx 40rpx 4rpx 0;
	}

	.topic-name {
		color: #3459AE;
		font-size: 34rpx;
	}

	.delete-icon {
		margin-left: 10rpx;
		font-size: 28rpx;
		color: #BFC4CF;
	}

	.modify-scroll {
		width: 95%;
		padding: 0 68rpx;
		margin-bottom: 24rpx;
	}

	.modify-item {
		height: 80rpx;
		padding: 0 28rpx;
		border: 2rpx solid #F1F2F5;
		border-radius: 8rpx;
		margin-right: 24rpx;
	}

	.modify-item-image {
		height: 60rpx;
		width: 60rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}

	.article-image {
		width: 220rpx;
		height: 220rpx;
		border-radius: 8rpx;
		margin-right: 32rpx;
	}

	.image-delete-icon {
		position: absolute;
		right: 32rpx;
		top: 0;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 4rpx;
		color: #FFFFFF;
		font-size: 28rpx;
	}

	.image-scroll-container {
		width: 900px;
	}

	.image-upload-status {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		width: 220rpx;
		height: 220rpx;
		border-radius: 8rpx;
		background-color: rgba(0, 0, 0, 0.3);
		color: #FFFFFF;
		font-size: 28rpx;
		text-align: center;
		line-height: 220rpx;
	}
</style>