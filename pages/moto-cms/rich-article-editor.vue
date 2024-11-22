<template>
	<view class="page-contaniner">
		<view  style="height: 100%;display: flex;width: 100%;">
			<view style="width: 30%;min-width: 400px;">
				<pub-preview :vote="linkVoteInfo" :circle="linkCircle" :title="articleTitle"
					:images="articleImageList.slice(0, 3)" :content="articleContent"></pub-preview>
			</view>
			<view style="height: 100%;width: 60%;min-width: 800px;">
				<view class="forms-container card-shadow">
					<view style="padding: 30px 40px 0 40px;height: 100%;">
						<view class="title">
							<textarea style="font-size: 17px;color: #141E34;font-weight: 500;"
								placeholder-style="font-size: 17px;font-weight: 400" v-model="articleTitle" auto-height
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
						<editor-component :bottomHeight="bottomHeight" ref="editorComponents" @textchange="onTextChange"
							@ready="onEditorReady"></editor-component>
					</view>
					<view
						style="position: absolute;bottom: 100px;background-color: #FFFFFF;width: 100%;padding-top: 4px;">
						<pub-keyword-input :relatedLabelList.sync="relatedLabelList" v-if="articleType === 'ARTICLE'"
							ref="pub-keyword-input"></pub-keyword-input>
						<view class="moto-flex-row-left" style="padding: 0 34px;margin-bottom: 12px;"
							v-if="articleType === 'CIRCLE_BIG_ARTICLE'">
							<view v-if="linkClass" class="moto-flex-row-left" style="margin-right: 20px">
								<view class="iconv2 link-icon" style="margin-right: 8px;font-size: 17px;">&#xe697;
								</view>
								<view class="link-name">{{linkClass.name}}</view>
								<view class="iconv2 delete-icon" @click="linkClass = null">&#xe671;</view>
							</view>
							<view v-if="linkVoteInfo.voteItemList.length" class="moto-flex-row-left">
								<view class="iconv2 link-icon" style="margin-right: 8px;font-size: 17px;">&#xe789;
								</view>
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
									<view class="link-name" style="font-size: 13px;">{{item.itemName}}</view>
									<view class="iconv2 delete-icon" @click="removeModifyItem(index)">&#xe671;</view>
								</view>
							</view>
						</scroll-view>
						<scroll-view :show-scrollbar="false" v-if="linkModelList.length" class="modify-scroll" scroll-x>
							<view class="moto-flex-row-left" style="white-space: nowrap;">
								<view class="link-name" style="margin-right: 20px;">关联车型: </view>
								<view v-for="(item,index) in linkModelList" class="modify-item moto-flex-row-left">
									<view class="link-name" style="font-size: 13px;">
										{{item.brandName}}{{item.modelName}}</view>
									<view class="iconv2 delete-icon" @click="removeModelItem(index)">&#xe671;</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="tool-container">
						<view class="moto-flex-row-between" style="margin-bottom: 15px;">
							<view class="moto-flex-row-left" v-if="articleType === 'CIRCLE_BIG_ARTICLE'">
								<view class="moto-flex-row-left" @click="openLocationSelect">
									<view class="iconv2 link-icon">&#xe784;</view>
									<view class="link-name">{{linkLocation ? linkLocation.name : '关联位置'}}</view>
								</view>
								<view class="moto-flex-row-left" style="margin-left: 30px;" @click="openCicleSelect">
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
									<view class="iconv2 link-icon" style="font-size: 18px;">&#xe73e;</view>
									<view class="link-name">关联车型
									</view>
								</view>
							</view>
							<view style="color: #848B9E;font-size: 13px;">正文字数: {{wordCount}}</view>
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
			</view>
		</view>
		<pub-circle-select @circleSelect="onCircleSelect" ref="circle-select"></pub-circle-select>
		<pub-location-select @locationSelect="onLocatonSelect" ref="location-select"></pub-location-select>
		<pub-topic-select :seleted="linkTopicList.map(item => item.topicTagId)" @topicSelect="onTopicSelect"
			ref="topic-select"></pub-topic-select>
		<pub-class-select :linkClass="linkClass" @classSelect="onClassSelect" ref="class-select"></pub-class-select>
		<pub-vote-edit @voteEdit="onVoteEdit" ref="vote-edit"></pub-vote-edit>
		<pub-modify-edit @modifyEdit="onModifyEdit" ref="modify-edit"></pub-modify-edit>
		<pub-model-select :linkModelList=linkModelList @modelSelect="onModelSelect"
			ref="model-select"></pub-model-select>
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
				linkModelList: [],
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
			if (e.type) {
				this.articleType = e.type
			}
			if (e.id) {
				this.articleId = e.id
				if (this.articleType === 'CIRCLE_BIG_ARTICLE') {
					this.getCircleArticleDetail()
				} else {
					this.getNewDetail()
				}
			}
			if (e.draftId) {
				this.draftId = e.draftId
				this.getDraftInfo()
			}
		},
		computed: {
			bottomHeight() {
				const height = 0
				if (this.articleType === 'ARTICLE') {
					height = 20
				}
				if ((this.linkClass && this.linkModelList.length) || this.linkClass && this.linkModifyInfo.modifyItemList
					.length) {
					return height + 70 + 'px'
				} else if (this.linkClass || this.linkModelList.length || this.linkModifyInfo.modifyItemList.length) {
					return height + 35 + 'px'
				} else if (!this.linkClass && !this.linkModelList.length && !this.linkModifyInfo.modifyItemList.length) {
					return height + 'px'
				}
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
						this.articleTitle = data.articleTitle
						this.linkCircle = data.linkCircle ? data.linkCircle : null
						this.linkClass = data.linkClass ? data.linkClass : null
						this.linkLocation = data.linkLocation ? data.linkLocation : null
						this.linkModelList = data.linkModelList ? data.linkModelList : []
						if (data.linkTopicList && data.linkTopicList.length) {
							this.linkTopicList = data.linkTopicList
						}
						this.linkVoteInfo = data.linkVoteInfo
						this.linkModifyInfo = data.linkModifyInfo
						const htmlContent = translateInputContent(data.contentList)
						this.$refs.editorComponents.parseHtml(htmlContent)
					}
				})
			},
			removeModelItem(index) {
				this.linkModelList.splice(index, 1)
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
			onModelSelect(item) {
				this.linkModelList.push(item)
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
			getCircleArticleDetail() {
				getApp().$openApi.motoCms.getCircleArticleInfo({
					articleId: this.articleId
				}).then(res => {
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
			getNewDetail() {
				getApp().$openApi.motoCms.getNewsInfo({
					articleId: this.articleId
				}).then(res => {
					if (res.data.code === 200) {
						const data = res.data.data
						console.log(data)
						this.articleTitle = data.title
						const contextList = data.contentList
						const htmlContent = translateInputContent(contextList)
						this.$refs.editorComponents.parseHtml(htmlContent)
						if (data.linkClass) {
							this.linkClass = {
								articleClass: data.articleClass
							}
						}
						if (data.linkMotorModel && data.linkMotorModel.length) {
							this.linkModelList = data.linkMotorModel
						}
						if (data.relatedLabelList && data.relatedLabelList.length) {
							this.relatedLabelList = data.relatedLabelList
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
				if (this.linkModelList.length) {
					postData.relatedModelIdList = this.linkModelList.map(item => item.modelId)
				}
				uni.showLoading({
					title: '发布中',
					icon: 'none'
				})
				getApp().$openApi.motoCms.pubNews(postData).then(res => {
					console.log(postData)
					uni.hideLoading()
					if (res.data.code === 200) {
						getApp().$Message.success('发布成功')
						this.linkClass = null
						this.articleTitle = ''
						this.relatedLabelList = []
						this.$refs.editorComponents.parseHtml('')
						this.$refs['pub-keyword-input'].inputVisible = false
						this.linkModelList = []
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
				if (!this.articleTitle) {
					getApp().$Message.warning('请输入标题后再保存')
					return
				}
				this.editorCtx.getContents({
					success: (e) => {
						const contentList = translateOutputContent(e.delta.ops)
						const content = {
							type: 2,
							linkCircle: this.linkCircle,
							contentList: contentList,
							linkLocation: this.linkLocation,
							title: this.articleTitle,
							linkClass: this.linkClass,
							linkTopicList: this.linkTopicList,
							linkVoteInfo: this.linkVoteInfo,
							linkModifyInfo: this.linkModifyInfo,
							linkModelList: this.linkModelList
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
	.link-item-group {
		margin-bottom: 20px;
	}

	.link-item-icon {
		font-size: 22px;
	}

	.link-item-title {
		width: 130px;
		margin-left: 10px;
		font-size: 16px;
		font-weight: 400;
	}

	.cirlce-list-scroll {
		flex: 1;
		width: 400px;
		height: 36px;
		margin-left: 10px;
	}

	.line {
		width: 100%;
		height: 1px;
		background-color: #f2f2f2;
		margin-top: 15px;
	}

	.recommend-circle-item {
		height: 36px;
		line-height: 36px;
		background: #F6F7FC;
		border-radius: 4px;
		font-size: 16px;
		color: #474E62;
		padding: 0 10px;
		margin-right: 10px;
	}

	.confirm-button {
		width: 100px;
		margin-right: 370px;
	}

	.circle-slect {
		margin-left: 12px;
		width: 150px;
		border: 1px solid #eee;
		border-radius: 4px;
		font-size: 14px;
		color: #848B9E;
		padding: 8px 0 8px 12px;
	}

	.circle-slect:hover {
		border: 1px solid blue;
	}

	.content-preview {
		width: 380px;
		height: 100px;
		margin-right: 40px;
	}

	.forms-container {
		position: relative;
		margin-top: 40px;
		background-color: #FFFFFF;
		// width: 90%;
		height: calc(100% - 40px);
		padding: 0;
		box-sizing: border-box;
	}

	.tool-container {
		width: 100%;
		position: absolute;
		bottom: 0;
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
		font-size: 20px;
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
		width: 95%;
		padding: 0 34px;
		margin-bottom: 12px;
	}

	.modify-item {
		height: 30px;
		padding: 0 6px;
		border: 1px solid #F1F2F5;
		border-radius: 4px;
		margin-right: 12px;
	}

	.modify-item-image {
		height: 20px;
		width: 20px;
		border-radius: 4px;
		margin-right: 10px;
	}

	.page-contaniner {
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
</style>