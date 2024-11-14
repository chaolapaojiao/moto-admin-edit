<template>
	<view>
		<el-row :gutter="20">
			<el-col :span="7">
				<pub-preview :vote="linkVote" :circle="linkCircle" :title="articleTitle" :images="articleImageList"
					:content="articleContent"></pub-preview>
			</el-col>
			<el-col :span="16">
				<view class="forms-container">
					<view style="padding: 30px 40px 0 40px">
						<view class="title">
							<textarea style="font-size: 18px;color: #141E34;font-weight: 400;"
								placeholder-style="font-size: 18px" v-model="articleTitle" auto-height
								placeholder="请输入文章标题"></textarea>
							<view class="line"></view>
						</view>
						<view class="moto-flex-row-left" style="flex-wrap: wrap;">
							<view v-for="(item,index) in linkTopicList" class="moto-flex-row-left topic-item">
								<view class="topic-name">#{{item.topicTagName}}</view>
								<view class="iconv2 delete-icon" @click="removeTopic(item.topicTagId)">&#xe671;</view>
							</view>
						</view>
						<view v-if="!linkTopicList.length" style="height: 10px;"></view>
						<editor-component ref="editorComponents" @textchange="onTextChange"
							@ready="onEditorReady"></editor-component>
					</view>
					<view class="moto-flex-row-left" style="padding: 0 34px;margin-bottom: 12px;">
						<view v-if="linkClass" class="moto-flex-row-left" style="margin-right: 20px;">
							<view class="iconv2 link-icon" style="margin-right: 8px;font-size: 17px;">&#xe697;</view>
							<view class="link-name">{{linkClass.name}}</view>
							<view class="iconv2 delete-icon" @click="linkClass = null">&#xe671;</view>
						</view>
						<view v-if="linkVote" class="moto-flex-row-left">
							<view class="iconv2 link-icon" style="margin-right: 8px;font-size: 17px;">&#xe789;</view>
							<view class="link-name">{{linkVote.voteTitle}}</view>
							<view class="iconv2 delete-icon" @click="linkVote = null">&#xe671;</view>
						</view>
					</view>
					<scroll-view :show-scrollbar="false" v-if="linkModifyList.length" class="modify-scroll" scroll-x>
						<view class="moto-flex-row-left" style="white-space: nowrap;">
							<view class="link-name" style="margin-right: 20px;">改装清单: </view>
							<view v-for="(item,index) in linkModifyList" class="modify-item moto-flex-row-left">
								<image v-if="item.itemUrl" mode="aspectFill" class="modify-item-image"
									:src="item.itemUrl"></image>
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
									<view class="link-name">{{linkLocation ? linkLocation.name : '关联位置'}}</view>
								</view>
								<view class="moto-flex-row-left" style="margin-left: 20px;" @click="openCicleSelect">
									<view class="iconv2 link-icon">&#xe785;</view>
									<view class="link-name">{{linkCircle ? linkCircle.circleName : '关联圈子'}}
									</view>
								</view>
							</view>
							<view style="color: #848B9E;">正文字数: {{wordCount}}</view>
						</view>
						<view class="moto-flex-row-between" style="margin-top: 30px;margin-left: -10px;">
							<view class="moto-flex-row-left">
								<view v-for="item in toolList" @click="onToolsClick(item)">
									<view class="moto-flex-column-center tool-item">
										<view class="iconv2 tool-icon">{{item.icon}}</view>
										<view class="tool-name">{{item.name}}</view>
									</view>
								</view>
							</view>
							<view class="moto-flex-row-left">
								<view class="save-btn">保存草稿</view>
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
	import pubPreview from '@/components/moto-cms/pub-preview.vue';
	export default {
		components: {
			editorComponent,
			pubCircleSelect,
			pubLocationSelect,
			pubTopicSelect,
			pubClassSelect,
			pubVoteEdit,
			pubModifyEdit,
			pubPreview
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
				wordCount: 0,
				articleTitle: '',
				articleId: null,
				recommendCircle: null,
				linkCircle: null,
				linkLocation: null,
				linkClass: null,
				linkTopicList: [],
				linkVote: null,
				linkModifyList: [],
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
				const id = e.id
				this.getArticleDetail(id)
			}
			this.getCircleRecommend()
		},
		mounted() {
			const sysinfo = uni.getSystemInfoSync()
			const html = ''
			// '<p><em style="font-size: 17px;">编程语言，它是 JavaS</em><strong style="font-size: 17px;"><em>cript 的一个超集，这意</em></strong><em style="font-size: 17px;">味着任何</em><em style="font-size: 20px;">有效的 JavaScript 代码都是有</em><em style="font-size: 17px;">效的 TypeScript 代码。然而，TypeScript 增加了许多额外的特<u>性，包括类型注解和编译</u></em><u style="font-size: 17px;">时类型检查</u><span style="font-size: 17px;">，这使得开发者能够编写更清晰、更健壮的代</span></p><p><em style="font-size: 17px;">编程语言，它是</em><em style="font-size: 17px; color: rgb(19, 86, 189);"> JavaScript 的一个超集，这意味着任何有效</em><em style="font-size: 17px;">的 JavaScrip<u>t 代码都是有效的 TypeS</u>cript 代码。</em><strong style="font-size: 17px;"><em>然而，TypeScript 增加</em></strong><em style="font-size: 17px;">了许多额外的特<u>性，包括类型注解和编译</u></em><u style="font-size: 17px;">时类型检查</u><span style="font-size: 17px;">，这使得开发者能够编写更清晰、更健壮的代</span></p><p><em style="font-size: 17px;">编程语言，它</em><em style="font-size: 24px;">是 JavaScript 的一</em><em style="font-size: 17px;">个超集，这意</em><em style="font-size: 17px; color: rgb(204, 149, 14);">味着任何有效的 JavaScript 代码</em><em style="font-size: 17px;">都是有效的 TypeScript 代码。然而，TypeScript 增加了许多额外的特<u>性，包括类型注解和编译</u></em><u style="font-size: 17px;">时类型检查</u><span style="font-size: 17px;">，这使得开发者能够编写更清晰、更健壮的代</span></p><p style="text-indent: 1em;"><em style="font-size: 17px;">编程语言，它是 JavaScrip<s>t 的一个超集，这意</s>味着任何有效的 JavaScript 代码都是有效的 TypeScript 代码。然而，TypeScript 增加了许多额外的特<u>性，包括类型注解和编译</u></em><u style="font-size: 17px;">时类型检查</u><span style="font-size: 17px;">，这使得开发者能够编写更清晰、更健壮的代</span></p>'
			this.$refs.editorComponents.parseHtml(html)
		},
		methods: {
			onToolsClick(item) {
				if (item.type === 'topic') {
					if (this.linkTopicList.length >= 5) {
						getApp().$message.warning('最多添加5个话题')
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
			removeModifyItem(index) {
				this.linkModifyList.splice(index, 1)
			},
			onModifyEdit(item) {
				this.linkModifyList.push(item)
			},
			onVoteEdit(item) {
				this.linkVote = item
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
			getCircleRecommend() {
				const postData = {
					page: 1,
					size: 10,
					select: 'RECOMMEND'
				}
				getApp().$openApi.motoCms.getCircleList(postData).then(res => {
					if (res.data.code === 200) {
						this.recommendCircle = res.data.data.dataList
					}
				})
			},
			getArticleDetail(id) {
				getApp().$openApi.motoCms.getCircleArticleInfo({
					articleId: id
				}).then(res => {
					if (res.data.code === 200) {
						this.formData.content = []
						const data = res.data.data
						this.formData.user_id = data.author.openId
						this.formData.title = data.articleTitle
						const html = data.articleContextList[0].context.replaceAll('<img',
							'<img crossorigin="anonymous"')
						this.$refs.editorComponents.parseHtml(data.articleContextList[0].context)
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
					getApp().$message.warning('请输入文章标题')
					return
				}
				this.editorCtx.getContents({
					success: async (e) => {
						const contentList = translateOutputContent(e.delta.ops)
						const haveText = contentList.find(item => {
							return item.contextClass === 1 && item.context && item.context !== '\n'
						})
						if (!haveText) {
							getApp().$message.warning('至少输入一段文本')
							return
						}
						const haveImage = contentList.find(item => {
							return item.contextClass === 2 && item.context
						})
						if (!haveImage) {
							getApp().$message.warning('至少上传一张照片')
							return
						}
						let postData = {
							type: 2,
							contentList: contentList,
							title: this.formData.title
						}
						if (this.articleId) {
							postData.articleId = this.articleId
						}
						// uni.showLoading({
						// 	title: '发布中'
						// })
						// console.log(postData)
						// getApp().$openApi.motoCms.pushCircleArticle(postData).then(
						// 	res => {
						// 		if (res.data.code == 200) {
						// 			uni.showToast({
						// 				title: '发布成功',
						// 				icon: 'none'
						// 			})
						// 		}
						// 	})
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
			},
			async previewArticle() {

			}
		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uni-cms/common/style/article-detail.scss';

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
		background-color: blue;
		margin-right: 40px;
	}

	.forms-container {
		margin-top: 60px;
		background-color: #FFFFFF;
		box-shadow: -2px 4px 5px 0px rgba(0, 0, 0, 0.05);
	}

	.tool-container {
		box-shadow: 0px -2px 3px 0px rgba(0, 0, 0, 0.05);
		height: 140px;
		padding: 14px 34px 0 34px;
		box-sizing: border-box;
	}

	.link-icon {
		font-size: 18px;
		color: #141E34;
		margin-right: 5px;
	}

	.link-name {
		font-size: 16px;
		color: #141E34;
	}

	.tool-item {
		margin-right: 24px;
		width: 50px;
	}

	.tool-icon {
		font-size: 20px;
		color: #141E34;
		margin-bottom: 2px;
	}

	.tool-name {
		font-size: 16px;
		color: #141E34;
	}

	.save-btn {
		width: 100px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 15px;
		border: 1px solid #e8e8e8;
		border-radius: 4px;
		margin-right: 20px;
	}

	.pub-btn {
		width: 100px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 15px;
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
</style>