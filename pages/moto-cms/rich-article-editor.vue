<template>
	<view>
		<el-row :gutter="10">
			<el-col :span="7">
				<pub-preview :vote="linkVoteInfo" :circle="linkCircle" :title="articleTitle"
					:images="articleImageList.slice(0, 3)" :content="articleContent"></pub-preview>
			</el-col>
			<el-col :span="16">
				<view class="forms-container card-shadow">
					<view style="padding: 30px 40px 0 40px">
						<view class="title">
							<textarea style="font-size: 34rpx;color: #141E34;font-weight: 500;"
								placeholder-style="font-size: 34rpx;font-weight: 400" v-model="articleTitle" auto-height
								placeholder="请输入文章标题"></textarea>
							<view class="line"></view>
						</view>
						<view class="moto-flex-row-left" style="flex-wrap: wrap;margin-top: 10px;">
							<view v-for="(item,index) in linkTopicList" class="moto-flex-row-left topic-item">
								<view class="topic-name">#{{item.topicTagName}}</view>
								<view class="iconv2 delete-icon" @click="removeTopic(item.topicTagId)">&#xe671;</view>
							</view>
						</view>
						<view v-if="!linkTopicList.length" style="height: 10px;"></view>
						<editor-component ref="editorComponents" @textchange="onTextChange"
							@ready="onEditorReady"></editor-component>
					</view>
					<pub-keyword-input :relatedLabelList.sync="relatedLabelList"
						v-if="articleType === 'ARTICLE'" ref="pub-keyword-input"></pub-keyword-input>
					<view class="moto-flex-row-left" style="padding: 0 34px;margin-bottom: 12px;"
						v-if="articleType === 'CIRCLE_BIG_ARTICLE'">
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
									:src="item.itemUrl"></image>
								<view class="link-name">{{item.itemName}}</view>
								<view class="iconv2 delete-icon" @click="removeModifyItem(index)">&#xe671;</view>
							</view>
						</view>
					</scroll-view>
					<view class="tool-container">
						<view class="moto-flex-row-between">
							<view class="moto-flex-row-left" v-if="articleType === 'CIRCLE_BIG_ARTICLE'">
								<view class="moto-flex-row-left" @click="openLocationSelect">
									<view class="iconv2 link-icon">&#xe784;</view>
									<view class="link-name">{{linkLocation ? linkLocation.name : '关联位置'}}</view>
								</view>
								<view class="moto-flex-row-left" style="margin-left: 20px;" @click="openCicleSelect">
									<view class="iconv2 link-icon">&#xe785;</view>
									<view class="link-name">{{linkCircle ? linkCircle.circleName : '关联圈子'}}
									</view>
								</view>
							</view>
							<view class="moto-flex-row-left" v-else>
								<view class="moto-flex-row-left" @click="onToolsClick({type: 'class'})">
									<view class="iconv2 link-icon">&#xe71b;</view>
									<view class="link-name">{{linkClass ? linkClass.name : '选择分类'}}</view>
								</view>
								<view class="moto-flex-row-left" style="margin-left: 20px;" @click="openModelSelect">
									<view class="iconv2 link-icon" style="font-size: 34rpx;">&#xe73e;</view>
									<view class="link-name">{{linkModel ? linkModel.modelName : '关联车型'}}
									</view>
								</view>
							</view>
							<view style="color: #848B9E;font-size: 26rpx;">正文字数: {{wordCount}}</view>
						</view>
						<view class="moto-flex-row-between" style="margin-top: 10px;margin-left: -10px;">
							<view class="moto-flex-row-left" v-if="articleType === 'CIRCLE_BIG_ARTICLE'">
								<view v-for="item in toolList" @click="onToolsClick(item)">
									<view class="moto-flex-column-center tool-item">
										<view class="iconv2 tool-icon">{{item.icon}}</view>
										<view class="tool-name">{{item.name}}</view>
									</view>
								</view>
							</view>
							<view v-else>

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
		<pub-model-select ref="model-select"></pub-model-select>
	</view>
</template>

<script>
	import request from '@/api/http.js'
	const http = request.http
	import * as imageConversion from 'image-conversion'
	// 自动保存mixin
	import {
		parseImageUrl
	} from "@/uni_modules/uni-cms/common/parse-image-url";
	import {
		translateInputContent,
		translateOutputContent
	} from '@/uni_modules/uni-cms/common/translate-content'
	import editorComponent from "@/uni_modules/uni-cms/components/editor/editor.vue"
	import pubCircleSelect from '@/components/moto-cms/pub-circle-select.vue'
	import pubLocationSelect from '@/components/moto-cms/pub-location-select.vue'
	import pubTopicSelect from '@/components/moto-cms/pub-topic-select.vue'
	import pubClassSelect from '@/components/moto-cms/pub-class-select.vue';
	import pubVoteEdit from '@/components/moto-cms/pub-vote-edit.vue';
	import pubModifyEdit from '@/components/moto-cms/pub-modify-edit.vue';
	import pubModelSelect from '@/components/moto-cms/pub-model-select.vue';
	import pubPreview from '@/components/moto-cms/pub-preview.vue';
	import pubKeywordInput from '@/components/moto-cms/pub-keyword-input.vue';
	export default {
		components: {
			editorComponent,
			pubCircleSelect,
			pubLocationSelect,
			pubTopicSelect,
			pubClassSelect,
			pubVoteEdit,
			pubModifyEdit,
			pubPreview,
			pubModelSelect,
			pubKeywordInput
		},
		data() {
			// 初始化表单数据
			let formData = {
				"category_id": "",
				"title": "",
				"content": null,
				"excerpt": "",
				"is_sticky": null,
				"is_essence": null,
				"thumbnail": [{}],
				"publish_date": null
			}
			return {
				systemInfo: uni.getSystemInfoSync(),
				formData,
				articleType: 'CIRCLE_BIG_ARTICLE',
				wordCount: 0,
				articleTitle: '',
				articleId: null,
				draftId: null,
				recommendCircle: null,
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
				relatedLabelList: [],
				articleImageList: [],
				articleContent: '',
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
		onLoad(e) {
			if (e.id) {
				this.articleId = e.id
				this.getArticleDetail(this.articleId)
			}
			if (e.type) {
				this.articleType = e.type
			}
			if (e.draftId) {
				this.draftId = e.draftId
				this.getDraftInfo()
			}
		},
		mounted() {
			const sysinfo = uni.getSystemInfoSync()
			const html = ''
			this.$refs.editorComponents.parseHtml(html)
		},
		methods: {
			getDraftInfo() {
				getApp().$openApi.motoCms.getDraftInfo({
					draftId: this.draftId
				}).then(res => {
					if (res.data.code === 200) {
						const data = JSON.parse(res.data.data.draftData)
						console.log(data)
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
						const htmlContent = translateInputContent(data.contentList)
						this.$refs.editorComponents.parseHtml(htmlContent)
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
					if (this.articleType === 'ARTICLE') {
						this.$refs['class-select'].articleClassList = this.$refs['class-select'].newsClassList
					}
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
			getArticleDetail(id) {
				getApp().$openApi.motoCms.getCircleArticleInfo({
					articleId: id
				}).then(res => {
					console.log(res)
					if (res.data.code === 200) {
						const data = res.data.data
						this.articleTitle = data.articleTitle
						const contextList = data.articleContextList
						const htmlContent = translateInputContent(contextList)
						this.$refs.editorComponents.parseHtml(htmlContent)
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
			onEditorReady(editorCtx) {
				if (!editorCtx) return

				// 将编辑器上下文赋值给组件实例的editorCtx属性
				this.editorCtx = editorCtx

				// 设置编辑器内容
				this.setContents()
			},
			setContents() {
				// 检查编辑器上下文是否存在
				if (this.editorCtx && this.formData.content) {
					const content = this.formData.content
					this.editorCtx.setContents({
						delta: content
					})
				}
			},
			submit(status) {
				if (!this.articleTitle) {
					getApp().$Message.warning('请输入文章标题')
					return
				}
				this.editorCtx.getContents({
					success: async (e) => {
						const contentList = translateOutputContent(e.delta.ops)
						if (this.articleType === 'CIRCLE_BIG_ARTICLE') {
							this.pubCircleArticle(contentList)
						} else {
							this.pubNews(contentList)
						}
					}
				})
			},
			pubNews(contentList) {
				let postData = {
					type: 1,
					contentList: contentList,
					title: this.articleTitle,
					relatedLabelList: this.relatedLabelList
				}
				if (this.linkClass) {
					postData.articleClass = this.linkClass.articleClass
				} else {
					postData.articleClass = 0
				}
				if (this.articleId) {
					postData.articleId = this.articleId
				}
				if (this.draftId) {
					postData.draftId = this.draftId
				}
				uni.showLoading({
					title: '发布中',
					icon: 'none'
				})
				getApp().$openApi.motoCms.pubNews(postData).then(res => {
					uni.hideLoading()
					if (res.data.code === 200) {
						getApp().$Message.success('发布成功')
						this.linkClass = null
						this.articleTitle = ''
						this.relatedLabelList = []
						this.$refs.editorComponents.parseHtml('')
						this.$refs['pub-keyword-input'].inputVisible = false
					}
				})
			},
			pubCircleArticle(contentList) {
				const haveText = contentList.find(item => {
					return item.contextClass === 1 && item.context && item.context !== '\n'
				})
				if (!haveText) {
					getApp().$Message.warning('至少输入一段文本')
					return
				}
				const haveImage = contentList.find(item => {
					return item.contextClass === 2 && item.context
				})
				if (!haveImage) {
					getApp().$Message.warning('至少上传一张照片')
					return
				}
				let postData = {
					type: 2,
					contentList: contentList,
					title: this.articleTitle
				}
				if (this.articleId) {
					postData.articleId = this.articleId
				}
				if (this.draftId) {
					postData.draftId = this.draftId
				}
				if (this.linkCircle) {
					postData.circleId = this.linkCircle.circleId
				}
				if (this.linkLocation) {
					postData.location = this.linkLocation
				}
				if (this.linkClass) {
					postData.articleClass = this.linkClass.articleClass
				}
				if (this.linkTopicList && this.linkTopicList.length) {
					postData.topicTagIdList = this.linkTopicList.map(item => item.topicTagId)
				}
				if (this.linkVoteInfo.voteItemList.length) {
					postData.voteInfo = this.linkVoteInfo
				}
				if (this.linkModifyInfo.modifyItemList.length) {
					postData.modifyInfo = this.linkModifyInfo
				}
				uni.showLoading({
					title: '发布中'
				})
				getApp().$openApi.motoCms.pubCircleArticle(postData).then(
					res => {
						uni.hideLoading()
						if (res.data.code == 200) {
							getApp().$Message.success('发布成功')
							this.$refs.editorComponents.parseHtml('')
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
							this.$refs['vote-edit'].init()
							this.$refs['modify-edit'].init()
						}
					})
			},
			saveDraft() {
				this.editorCtx.getContents({
					success: (e) => {
						const contentList = translateOutputContent(e.delta.ops)
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
							articleType: this.articleType,
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
				})
			},
			onTextChange(e) {
				console.log(e)
				this.articleImageList = e.images
				this.articleContent = e.content
				this.wordCount = e.detail
				// 自动保存
				this.autoSaveContent && this.autoSaveContent()
			},
			navigateBack() {
				const pages = getCurrentPages()

				if (pages.length > 1) {
					uni.navigateBack(-1)
				} else {
					uni.redirectTo({
						url: '/uni_modules/uni-cms/pages/article/list/list'
					})
				}
			},

			async openImageUpload(index) {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						this.formData.thumbnail[index].source = res.tempFilePaths[0]
						http.upload('common/imageUpload', {
							name: 'file',
							filePath: res.tempFilePaths[0]
						}).then(res => {
							const result = JSON.parse(res.data)
							if (result.code === 200) {
								this.formData.thumbnail[index].source = result.data.url
							}
						})
					}
				});
			},
			async onInsertCover(selectMediaItems) {
				const coverIndex = this.coverIndex !== null ? this.coverIndex : 0
				const image = selectMediaItems[0]
				const newThumbnail = [...this.formData.thumbnail]
				const parseImages = await parseImageUrl(image.src)

				newThumbnail[coverIndex] = parseImages[0]

				this.$refs.insertImageDrawer.close()
				this.formData.thumbnail = newThumbnail
			},
			removeThumbnail(index) {
				const newThumbnail = [...this.formData.thumbnail]
				newThumbnail[index] = {}

				this.formData.thumbnail = newThumbnail
				this.autoGetCover = false
			}
		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uni-cms/common/style/article-detail.scss';

	.link-item-group {
		margin-bottom: 40rpx;
	}

	.link-item-icon {
		font-size: 44rpx;
	}

	.link-item-title {
		width: 260rpx;
		margin-left: 20rpx;
		font-size: 32rpx;
		font-weight: 400;
	}

	.cirlce-list-scroll {
		flex: 1;
		width: 800rpx;
		height: 72rpx;
		margin-left: 20rpx;
	}

	.line {
		width: 100%;
		height: 2rpx;
		background-color: #f2f2f2;
		margin-top: 30rpx;
	}

	.recommend-circle-item {
		height: 72rpx;
		line-height: 72rpx;
		background: #F6F7FC;
		border-radius: 8rpx;
		font-size: 32rpx;
		color: #474E62;
		padding: 0 20rpx;
		margin-right: 20rpx;
	}

	.confirm-button {
		width: 200rpx;
		margin-right: 740rpx;
	}

	.circle-slect {
		margin-left: 24rpx;
		width: 300rpx;
		border: 2rpx solid #eee;
		border-radius: 8rpx;
		font-size: 28rpx;
		color: #848B9E;
		padding: 16rpx 0 16rpx 24rpx;
	}

	.circle-slect:hover {
		border: 2rpx solid blue;
	}

	.content-preview {
		width: 760rpx;
		height: 200rpx;
		background-color: blue;
		margin-right: 80rpx;
	}

	.forms-container {
		margin-top: 80rpx;
		background-color: #FFFFFF;
		width: 90%;
	}

	.tool-container {
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
</style>