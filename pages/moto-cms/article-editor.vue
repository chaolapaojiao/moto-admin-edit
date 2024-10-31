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
				<view class="settings">
					<uni-forms-item name="excerpt" label="文章摘要">
						<textarea class="excerpt" placeholder="文章摘要" auto-height v-model="formData.excerpt"
							@input="() => autoSaveContent && autoSaveContent()"></textarea>
					</uni-forms-item>
					<uni-forms-item name="thumbnail" label="封面">
						<view class="thumb-mode">
							<radio-group @change="thumbModeChange">
								<radio value="1" class="mode" :checked="thumbMode === 1">单图</radio>
								<radio value="3" class="mode" :checked="thumbMode === 3">三图</radio>
								<radio value="0" class="mode" :checked="thumbMode === 0">无封面图</radio>
							</radio-group>
						</view>
						<view class="thumbnail-list" v-if="thumbMode > 0">
							<view class="thumbnail" v-for="(thumbnail, index) in formData.thumbnail"
								:key="thumbnail.source">
								<template v-if="thumbnail.source">
									<view class="remove-thumbnail" @click="() => removeThumbnail(index)">
										<uni-icons type="closeempty" size="16" color="#fff"></uni-icons>
									</view>
									<image :src="thumbnail.src" mode="aspectFill" style="width: 150px; height: 150px;">
									</image>
								</template>
								<template v-else>
									<uni-icons @click="() => openImageUpload(index)" class="placeholder"
										type="plusempty" size="60" color="#e8e8e8">
									</uni-icons>
								</template>
							</view>
						</view>
						<view v-if="thumbMode > 0" style="color: #999; font-size: 13px; margin-top: 10px;">
							<text>为了保证最佳效果展示；请上传16:9的封面图片</text>
						</view>
					</uni-forms-item>
				</view>
				<view style="display: flex;">
					<button type="primary" style="width: 100px;" @click="submit(0)">发布</button>
					<button type="primary" style="width: 100px;" @click="submit(1)">更新</button>
				</view>
			</view>
		</uni-forms>
		<view class="footer">
			<view class="wrap">
				<view class="left">
					<text class="auto-save">

					</text>
					<text class="word-count" v-if="wordCount !== null">共 {{ wordCount }} 字</text>
				</view>
				<view class="right">
					<view class="uni-button-group">
					</view>
				</view>
			</view>
		</view>
		<!-- #ifdef H5 -->
		<uni-popup ref="popup" type="dialog" v-if="formDataId">
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
	// 引入Delta转换函数
	import {
		translateInputContent,
		translateOutputContent
	} from '@/uni_modules/uni-cms/common/translate-content'
	// 引入表单验证器
	import {
		validator
	} from '@/uni_modules/uni-cms/common/validator/uni-cms-articles.js'
	// 自动保存mixin
	import {
		parseImageUrl
	} from "@/uni_modules/uni-cms/common/parse-image-url";

	// 引入文章预览组件
	// #ifdef H5
	import ArticlePreview from "@/uni_modules/uni-cms/components/preview/preview.vue";
	// #endif

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
			EditorComponent,
			// #ifdef H5
			ArticlePreview
			// #endif
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
				// 初始化表单数据的id
				formDataId: '',
				// 表单数据
				formData,
				// 表单选项
				formOptions: {
					"comment_status_localdata": [{
							"value": 0,
							"text": "关闭"
						},
						{
							"value": 1,
							"text": "开放"
						}
					]
				},
				// 表单验证规则
				rules: {
					...getValidator(Object.keys(formData))
				},
				// 编辑器格式
				formats: {},
				// 字数统计
				wordCount: null,
				// 插入图片抽屉宽度
				drawerWidth: 0,
				// 封面图展示方式
				thumbMode: 1,
				articleId: null
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
		},
		mounted() {
			const sysinfo = uni.getSystemInfoSync()
			this.drawerWidth = sysinfo.windowWidth * .8
		},
		methods: {
			// 封面图展示方式改变
			thumbModeChange(e) {
				const coverCount = Number(e.detail.value)
				this.formData.thumbnail = Array.from(new Array(coverCount)).map((item, index) => {
					if (this.formData.thumbnail[index]) {
						return this.formData.thumbnail[index]
					} else {
						return {}
					}
				})
				this.thumbMode = coverCount
			},
			/**
			 * 获取表单数据
			 * @param {String} id - 文章id
			 */
			getArticleDetail(id) {
				getApp().$openApi.motoCms.getCircleArticleInfo({
					articleId: id
				}).then(res => {
					if (res.data.code === 200) {
						this.formData.content = []
						const data = res.data.data
						this.formData.user_id = data.author.openId
						this.formData.title = data.articleTitle
						this.$refs.editorComponents.parseHtml(data.articleContextList[0].context)
					}
				})
			},
			/**
			 * 当编辑器准备好时，设置编辑器内容
			 * @param {Object} editorCtx - 编辑器上下文
			 */
			onEditorReady(editorCtx) {
				if (!editorCtx) return

				// 将编辑器上下文赋值给组件实例的editorCtx属性
				this.editorCtx = editorCtx

				// 设置编辑器内容
				this.setContents()
			},

			/**
			 * 设置编辑器内容
			 */
			setContents() {
				// 检查编辑器上下文是否存在
				if (this.editorCtx && this.formData.content) {
					// #ifdef H5
					// 如果是H5平台，则直接使用formData中的内容
					const content = this.formData.content
					// #endif

					// #ifndef H5
					// 如果不是H5平台，则需要将formData中的内容转换为编辑器所需的格式
					const content = translateInputContent(this.formData.content)
					// #endif

					// 设置编辑器内容
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

				if (this.formData.thumbnail) {
					for (const thumbnail of this.formData.thumbnail) {
						if (!thumbnail.source) {
							// 如果封面图为空，提示用户
							uni.hideLoading()
							return uni.showToast({
								icon: 'none',
								title: '封面图必填',
							})
						}
					}
				}

				return new Promise(resolve => {
					// 验证表单
					this.$refs.form.validate().then((res) => {
						// 获取编辑器内容
						this.editorCtx.getContents({
							success: async (e) => {
								let postData = {
									'type': 2,
									"contentList": [{
										contextClass: 1,
										context: e.html
									}, {
										contextClass: 2,
										context: 'https://image2.hzmodi.cn/avatar/a8a089ad499617ccab10a177d45e8b41.jpeg'
									}],
									"title": this.formData.title
								}
								if (this.articleId) {
									postData.articleId = this.articleId
								}
								uni.showLoading({
									title: '发布中'
								})
								getApp().$openApi.motoCms.pushCircleArticle(postData).then(
									res => {
										if (res.data.code == 200) {
											uni.showToast({
												title: '发布成功',
												icon: 'none'
											})
										}
									})

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
							if(result.code === 200){
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
</style>