<template>
	<view class="uni-container">
		<uni-forms ref="form" :label-width="90" :model="formData" validateTrigger="submit" err-show-type="toast">
			<view class="edit-box">
				<view class="title">
					<textarea class="uni-input" v-model="formData.title" auto-height placeholder="文章标题"
						@input="() => autoSaveContent && autoSaveContent()" />
				</view>
				<editor-component ref="editorComponents" @textchange="onTextChange"
					@ready="onEditorReady"></editor-component>
				<view class="link-item-group">
					<view class="line"></view>
					<view class="moto-flex-row-left">
						<text class="iconv2 link-item-icon">&#xe785;</text>
						<el-tooltip class="box-item" effect="dark" content="点击查看更多圈子" placement="top">
							<text class="link-item-title" @click="openCicleSelect">添加圈子</text>
						</el-tooltip>
						<scroll-view class="cirlce-list-scroll" style="white-space: nowrap;" scroll-x
							:show-scrollbar="false">
							<view class="moto-flex-row-left">
								<view class="recommend-circle-item" v-for="(item ,index) in recommendCircle">
									{{item.circleName}}
								</view>
							</view>
						</scroll-view>
					</view>
				</view>

				<view style="display: flex;">
					<button type="primary" class="confirm-button" @click="submit(0)">发布</button>
				</view>
			</view>
		</uni-forms>
		<dialog-circle-select ref="circle-select"></dialog-circle-select>
		<!-- #ifdef H5 -->
		<uni-popup ref="popup" v-if="formDataId">
			<article-preview :id="formDataId" @close="() => $refs.popup.close()"></article-preview>
		</uni-popup>
		<!-- #endif -->
	</view>
</template>

<script>
	import request from '@/api/http.js'
	const http = request.http
	import * as imageConversion from 'image-conversion'
	// 引入编辑器组件
	import EditorComponent from "@/uni_modules/uni-cms/components/editor/editor.vue"
	// 引入表单验证器
	import {
		validator
	} from '@/uni_modules/uni-cms/common/validator/uni-cms-articles.js'
	// 自动保存mixin
	import {
		parseImageUrl
	} from "@/uni_modules/uni-cms/common/parse-image-url";
	import {
		translateInputContent,
		translateOutputContent
	} from '@/uni_modules/uni-cms/common/translate-content'
	// 引入文章预览组件
	// #ifdef H5
	import ArticlePreview from "@/uni_modules/uni-cms/components/preview/preview.vue";
	// #endif
	import dialogCircleSelect from '@/components/moto-cms/dialog-circle-select.vue'
	// 根据字段获取验证器
	function getValidator(fields) {
		let result = {}
		for (let key in validator) {
			if (fields.includes(key)) {
				result[key] = validator[key]
			}
		}
		return result
	}

	export default {
		components: {
			dialogCircleSelect,
			EditorComponent,
			// #ifdef H5
			ArticlePreview
			// #endif,
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
				// 初始化表单数据的id
				formDataId: '',
				// 表单数据
				formData,
				// 表单验证规则
				rules: {
					...getValidator(Object.keys(formData))
				},
				// 字数统计
				wordCount: null,
				// 插入图片抽屉宽度
				articleId: null,
				recommendCircle: null,
			}
		},
		// 当页面准备好时，设置表单验证规则
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		// 当页面加载时，如果有id则获取表单数据
		onLoad(e) {
			if (e.id) {
				this.articleId = e.id
				const id = e.id
				this.formDataId = id
				this.getArticleDetail(id)
			}
			
			this.getCircleRecommend()
			uni.$on('openTitleInput', this.showImgTitleInput)
		},
		mounted() {
			const sysinfo = uni.getSystemInfoSync()
			this.formData.title = 'title'
			const html = ''
				// '<p><em style="font-size: 17px;">编程语言，它是 JavaS</em><strong style="font-size: 17px;"><em>cript 的一个超集，这意</em></strong><em style="font-size: 17px;">味着任何</em><em style="font-size: 20px;">有效的 JavaScript 代码都是有</em><em style="font-size: 17px;">效的 TypeScript 代码。然而，TypeScript 增加了许多额外的特<u>性，包括类型注解和编译</u></em><u style="font-size: 17px;">时类型检查</u><span style="font-size: 17px;">，这使得开发者能够编写更清晰、更健壮的代</span></p><p><em style="font-size: 17px;">编程语言，它是</em><em style="font-size: 17px; color: rgb(19, 86, 189);"> JavaScript 的一个超集，这意味着任何有效</em><em style="font-size: 17px;">的 JavaScrip<u>t 代码都是有效的 TypeS</u>cript 代码。</em><strong style="font-size: 17px;"><em>然而，TypeScript 增加</em></strong><em style="font-size: 17px;">了许多额外的特<u>性，包括类型注解和编译</u></em><u style="font-size: 17px;">时类型检查</u><span style="font-size: 17px;">，这使得开发者能够编写更清晰、更健壮的代</span></p><p><em style="font-size: 17px;">编程语言，它</em><em style="font-size: 24px;">是 JavaScript 的一</em><em style="font-size: 17px;">个超集，这意</em><em style="font-size: 17px; color: rgb(204, 149, 14);">味着任何有效的 JavaScript 代码</em><em style="font-size: 17px;">都是有效的 TypeScript 代码。然而，TypeScript 增加了许多额外的特<u>性，包括类型注解和编译</u></em><u style="font-size: 17px;">时类型检查</u><span style="font-size: 17px;">，这使得开发者能够编写更清晰、更健壮的代</span></p><p style="text-indent: 1em;"><em style="font-size: 17px;">编程语言，它是 JavaScrip<s>t 的一个超集，这意</s>味着任何有效的 JavaScript 代码都是有效的 TypeScript 代码。然而，TypeScript 增加了许多额外的特<u>性，包括类型注解和编译</u></em><u style="font-size: 17px;">时类型检查</u><span style="font-size: 17px;">，这使得开发者能够编写更清晰、更健壮的代</span></p>'
			this.$refs.editorComponents.parseHtml(html)
		},
		methods: {
			openCicleSelect() {
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
				// 检查文章标题是否存在
				if (!this.formData.title) {
					// 隐藏加载中
					uni.hideLoading()
					// 显示文章标题必填的提示
					return uni.showToast({
						icon: 'none',
						title: '文章标题必填',
					})
				}

				return new Promise(resolve => {
					// 验证表单
					this.$refs.form.validate().then((res) => {
						// 获取编辑器内容
						this.editorCtx.getContents({
							success: async (e) => {
								console.log(e.html)
								console.log(JSON.stringify(e))
								const contentList = translateOutputContent(e.delta.ops)
								console.log(JSON.stringify(contentList))
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

								resolve()
							}
						})
					}).catch((e) => {
						console.error(e)
					})
				})
			},

			/**
			 * 提交表单
			 * @param {Object} value - 表单数据
			 */
			submitForm(value) {

			},

			/**
			 * 文本内容变化时更新字数统计
			 * @param {Object} e - 文本内容变化事件
			 */
			onTextChange(e) {
				this.wordCount = e.detail

				// 自动保存
				this.autoSaveContent && this.autoSaveContent()
			},

			/**
			 * 返回上一页或跳转到文章列表页
			 */
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
				if (this.formDataId) {
					// 先保存文章
					await this.submit(0)
					this.$refs.popup.open()
				}
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
		font-size: 24px;
	}

	.link-item-title {
		margin-left: 10px;
		font-size: 18px;
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
		height: 0.5px;
		background-color: #f2f2f2;
		margin-bottom: 20px;
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
</style>