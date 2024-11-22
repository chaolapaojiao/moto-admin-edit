<template>
	<view class="container">
		<view  style="height: 100%;display: flex;width: 100%;">
			<view style="width: 30%;min-width: 400px;">
				<pub-preview :vote="linkVoteInfo" :circle="linkCircle" :title="articleTitle"
					:images="imageList.map(item => item.url).slice(0, 3)" :content="articleContent"></pub-preview>
			</view>
			<view style="height: 100%;width: 60%;min-width: 800px;">
				<view class="editor-container card-shadow">
					<view style="padding: 16px;">
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
						<view style="height: 15px;"></view>
						<textarea style="font-size: 17px;color: #141E34;font-weight: 500;width: 100%;"
							placeholder-style="font-size: 17px;font-weight: 400" v-model="articleTitle" auto-height
							placeholder="请输入文章标题"></textarea>
						<view class="line"></view>
						<view class="moto-flex-row-left" style="flex-wrap: wrap;margin-top: 10px;">
							<view v-for="(item,index) in linkTopicList" class="moto-flex-row-left topic-item">
								<view class="topic-name">#{{item.topicTagName}}</view>
								<view class="iconv2 delete-icon" @click="removeTopic(item.topicTagId)">&#xe671;</view>
							</view>
						</view>
						<textarea :maxlength="-1" class="content-textarea" placeholder-style="font-size: 17px;" :auto-height="true"
							placeholder="分享你的机车生活,交流用车心得,各种生活趣事" v-model="articleContent"></textarea>
					</view>
					<view style="position: absolute;bottom: 100px;width: 100%;background-color: #FFFFFF;">
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
					</view>
					<view class="tool-container">
						<view class="moto-flex-row-between" style="margin-bottom: 15px;">
							<view class="moto-flex-row-left">
								<view class="moto-flex-row-left" @click="openLocationSelect">
									<view class="iconv2 link-icon">&#xe784;</view>
									<view class="link-name">
										{{linkLocation ? (linkLocation.name ?linkLocation.name :  linkLocation.locationName) : '关联位置'}}
									</view>
								</view>
								<view class="moto-flex-row-left" style="margin-left: 30px;" @click="openCicleSelect">
									<view class="iconv2 link-icon">&#xe785;</view>
									<view class="link-name">{{linkCircle ? linkCircle.circleName : '关联圈子'}}
									</view>
								</view>
							</view>
							<view style="color: #848B9E;font-size: 13px;">正文字数: {{articleContent.length}}</view>
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
							<view style="display: flex">
								<view class="save-btn" @click="saveDraft">保存草稿</view>
								<view class="pub-btn" @click="submit">发布</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<pub-circle-select @circleSelect="onCircleSelect" ref="circle-select"></pub-circle-select>
		<pub-location-select @locationSelect="onLocatonSelect" ref="location-select"></pub-location-select>
		<pub-topic-select :seleted="linkTopicList.map(item => item.topicTagId)" @topicSelect="onTopicSelect"
			ref="topic-select"></pub-topic-select>
		<pub-class-select :linkClass="linkClass" @classSelect="onClassSelect" ref="class-select"></pub-class-select>
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
			if (option.draftId) {
				this.draftId = option.draftId
				this.getDraftInfo()
			}
		},
		methods: {
			getDraftInfo() {
				getApp().$openApi.motoCms.getDraftInfo({
					draftId: this.draftId
				}).then(res => {
					if (res.data.code === 200) {
						const data = JSON.parse(res.data.data.draftData)
						this.articleTitle = data.articleTitle
						this.linkCircle = data.linkCircle ? data.linkCircle : null
						this.linkClass = data.linkClass ? data.linkClass : null
						this.linkLocation = data.linkLocation ? data.linkLocation : null
						this.linkModel = data.linkModel ? data.linkModel : null
						if (this.linkTopicList && this.linkTopicList.length) {
							this.linkTopicList = data.linkTopicList
						}
						this.linkVoteInfo = data.linkVoteInfo
						this.linkModifyInfo = data.linkModifyInfo
						data.contentList.forEach((item, index) =>{
							if(item.contextClass === 1){
								this.articleContent = item.context
							}else{
								this.imageList.push({
									url: item.context,
									id: Date.now() + index
								})
							}
						})
					}
				})
			},
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
						uni.$off('textChange')
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
				if(!this.articleTitle){
					getApp().$Message.warning('请输入标题后再保存')
					return
				}
				const imageUrlList = this.imageList.map(item => {
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
					title: this.articleTitle,
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
		position: relative;
		margin-top: 5px;
		width: 850px;
		height: calc(100% - 10px);
		background-color: #FFFFFF;
		box-sizing: border-box;
		padding-top: 10px;
	}
	
	.image-upload {
		width: 110px;
		height: 110px;
		text-align: center;
		line-height: 110px;
		font-size: 20px;
		color: #999;
		border-radius: 4px;
		border: 1px dashed #eee;
		margin-bottom: 5px;
	}
	
	.line {
		width: 100%;
		height: 1px;
		background-color: #f2f2f2;
		margin: 15px 0 30px 0;
	}
	
	::v-deep .el-upload--picture-card {
		width: 110px;
		height: 110px;
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
		width: 110px;
		height: 110px;
	}
	
	.content-textarea {
		font-size: 17px;
		color: #141E34;
		width: 100%;
		letter-spacing: 0.75px;
		line-height: 24px;
	}
	
	.tool-container {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 850px;
		box-shadow: 0 -1px 2.5px 0 rgba(0, 0, 0, 0.05);
		height: 100px;
		padding: 14px 34px 0 34px;
		box-sizing: border-box;
		background-color: #FFFFFF;
		padding-bottom: 10px;
	}
	
	.link-icon {
		font-size: 18px;
		color: #141E34;
		margin-right: 5px;
	}
	
	.link-name {
		font-size: 14px;
		color: #141E34;
	}
	
	.tool-item {
		margin-right: 20px;
		width: 50px;
	}
	
	.tool-icon {
		font-size: 18px;
		color: #141E34;
		margin-bottom: 2px;
	}
	
	.tool-name {
		font-size: 13px;
		color: #141E34;
	}
	
	.save-btn {
		width: 100px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 14px;
		border: 1px solid #e8e8e8;
		border-radius: 4px;
		margin-right: 20px;
	}
	
	.pub-btn {
		width: 100px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 14px;
		color: #FFFFFF;
		background-color: #ff6100;
		border-radius: 4px;
	}
	
	.topic-item {
		margin: 2px 20px 2px 0;
	}
	
	.topic-name {
		color: #3459AE;
		font-size: 17px;
	}
	
	.delete-icon {
		margin-left: 5px;
		font-size: 14px;
		color: #BFC4CF;
	}
	
	.modify-scroll {
		bottom: 90px;
		width: 95%;
		padding: 0 34px;
		margin-bottom: 12px;
	}
	
	.modify-item {
		height: 40px;
		padding: 0 14px;
		border: 1px solid #F1F2F5;
		border-radius: 4px;
		margin-right: 12px;
	}
	
	.modify-item-image {
		height: 30px;
		width: 30px;
		border-radius: 4px;
		margin-right: 10px;
	}
	
	.article-image {
		width: 110px;
		height: 110px;
		border-radius: 4px;
		margin-right: 16px;
	}
	
	.image-delete-icon {
		position: absolute;
		right: 16px;
		top: 0;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 2px;
		color: #FFFFFF;
		font-size: 14px;
	}
	
	.image-scroll-container {
		width: 900px;
	}
	
	.image-upload-status {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		width: 110px;
		height: 110px;
		border-radius: 4px;
		background-color: rgba(0, 0, 0, 0.3);
		color: #FFFFFF;
		font-size: 14px;
		text-align: center;
		line-height: 110px;
	}

</style>