<template>
	<view class="editor-container" :style="{'--bottomHeight': bottomHeightCss}">
		<view class="editor" :style="{height: editorHeight <= 0 ? 'auto': `${editorHeight}px`}">
			<web-editor ref="webEditor" id="editor" @ready="onEditorReady" @statuschange="onStatusChange"
				@textchange="(e) => $emit('textchange', e)" showImgSize showImgToolbar showImgResize
				:upload-handler="uploadHandlerForH5" @focus="onEditorFocus" @blur="onEditorBlur"></web-editor>
		</view>
		<view class="editor-toolbar">
			<view class="editor-toolbar-box moto-flex-row-center">
				<tool-undo @change="({type, value}) => format(type, value)" :disabled="!showFooterToolBar"></tool-undo>
				<tool-redo @change="({type, value}) => format(type, value)" :disabled="!showFooterToolBar"></tool-redo>
				<tool-format-clear @change="({type, value}) => format(type, value)"
					:disabled="!showFooterToolBar"></tool-format-clear>
				<view class="editor-toolbar-divider"></view>
				<tool-header @change="({type, value}) => format(type, value)" :active="formats.header"
					:disabled="!showFooterToolBar"></tool-header>
				<tool-font-size @change="({type, value}) => format(type, value)" :active="formats.fontSize"
					:disabled="!showFooterToolBar"></tool-font-size>
				<tool-bold @change="({type, value}) => format(type, value)" :active="formats.bold"
					:disabled="!showFooterToolBar"></tool-bold>
				<tool-italic @change="({type, value}) => format(type, value)" :active="formats.italic"
					:disabled="!showFooterToolBar"></tool-italic>
				<tool-strike @change="({type, value}) => format(type, value)" :active="formats.strike"
					:disabled="!showFooterToolBar"></tool-strike>
				<tool-underline @change="({type, value}) => format(type, value)" :active="formats.underline"
					:disabled="!showFooterToolBar"></tool-underline>
				<!-- <tool-link @change="({type, value}) => format(type, value)" :active="formats.link"
					:disabled="!showFooterToolBar"></tool-link> -->
				<tool-align @change="({type, value}) => format(type, value)" :active="formats.align"
					:disabled="!showFooterToolBar"></tool-align>
				<!-- <tool-hr @change="({type, value}) => format(type, value)" :disabled="!showFooterToolBar"></tool-hr> -->
				<!-- <tool-list @change="({type, value}) => format(type, value)" :active="formats.list"
					:disabled="!showFooterToolBar"></tool-list> -->
				<tool-line-indent @change="({type, value}) => format(type, value)" :active="formats.textIndent"
					:disabled="!showFooterToolBar"></tool-line-indent>
				<tool-space-both @change="({type, value}) => format(type, value)"
					:active="formats.marginLeft && formats.marginRight"
					:disabled="!showFooterToolBar"></tool-space-both>
				<tool-line-height @change="({type, value}) => format(type, value)" :active="formats.lineHeight"
					:disabled="!showFooterToolBar"></tool-line-height>
				<tool-letter-space @change="({type, value}) => format(type, value)" :active="formats.letterSpacing"
					:disabled="!showFooterToolBar"></tool-letter-space>
				<view class="editor-toolbar-divider"></view>
				<tool-background @change="({type, value}) => format(type, value)" :active="formats.background"
					:disabled="!showFooterToolBar"></tool-background>
				<tool-color @change="({type, value}) => format(type, value)" :active="formats.color"
					:disabled="!showFooterToolBar"></tool-color>
				<view class="editor-toolbar-divider"></view>
				<tool-image :getEditorContent="getEditorContent" @change="({type, value}) => format(type, value)"
					:disabled="!showFooterToolBar"></tool-image>
				<!-- <tool-video @change="({type, value}) => format(type, value)"
					:disabled="!showFooterToolBar"></tool-video> -->
				<!-- <tool-unlock-content @change="({type, value}) => format(type, value)"
					:disabled="!showFooterToolBar"></tool-unlock-content> -->
				<!-- <tool-ai @change="({type, value}) => format(type, value)" :active="showImChat"
					:disabled="!showFooterToolBar"></tool-ai> -->
			</view>
		</view>
	</view>
</template>

<script>
	import ToolColor from "./tools/color.vue";
	import ToolBold from "./tools/bold.vue";
	import ToolItalic from "./tools/italic.vue";
	import ToolStrike from "./tools/strike.vue";
	import ToolList from "./tools/list.vue";
	import ToolHr from "./tools/hr.vue";
	import ToolUndo from "./tools/undo.vue";
	import ToolRedo from "./tools/redo.vue";
	import ToolHeader from "./tools/header.vue";
	import ToolAlign from "./tools/align.vue";
	import ToolLink from "./tools/link.vue";
	import ToolUnderline from "./tools/underline.vue";
	import ToolLineIndent from "./tools/line-indent.vue";
	import ToolSpaceBoth from "./tools/space-both.vue";
	import ToolLineHeight from "./tools/line-height.vue";
	import ToolLetterSpace from "./tools/letter-space.vue";
	import ToolBackground from "./tools/background.vue";
	import ToolImage from "./tools/image.vue";
	import ToolFormatClear from "./tools/format-clear.vue";
	// import ToolUnlockContent from "./tools/unlock-content.vue";
	// import ToolAi from "./tools/ai.vue";
	import ToolVideo from "./tools/video.vue";
	// import uniImChat from '../ai/chat.vue';
	import ToolFontSize from './tools/font-size.vue'
	// #ifdef H5
	import WebEditor from "./web/editor.vue";
	// #endif
	import {
		imageUpload
	} from '@/utils/imageTool.js';
	export default {
		name: "editor",
		emits: ['change', 'textchange', 'ready'],
		components: {
			ToolBackground,
			ToolLetterSpace,
			ToolLineHeight,
			ToolLineIndent,
			ToolUnderline,
			ToolAlign,
			ToolUndo,
			ToolItalic,
			ToolBold,
			ToolStrike,
			ToolList,
			ToolHr,
			ToolRedo,
			ToolHeader,
			ToolLink,
			ToolSpaceBoth,
			ToolImage,
			ToolColor,
			ToolFormatClear,
			// ToolUnlockContent,
			// ToolAi,
			ToolVideo,
			// uniImChat,
			ToolFontSize,
			// #ifdef H5
			WebEditor,
			// #endif
		},
		props: {
			bottomHeight: {
				type: String,
				default: '0px'
			}
		},
		data() {
			return {
				bottomHeightCss: '0px',
				formats: {}, // 编辑器格式状态
				keyboardHeight: 0, // 键盘高度
				showFooterToolBar: true, // 是否显示底部工具栏
				showToolSettingMask: false, // 是否显示工具栏设置遮罩层
				showInsertBlockToolSetting: false, // 是否显示插入块工具栏
				showToolPopup: '', // 当前工具栏弹出的工具名称，为空则表示没有弹出的工具
				toolPopupRect: {}, // 弹出工具栏的位置和大小
				showImChat: false, // 是否显示 AI 聊天窗口
				currentLink: { // 当前链接的信息
					title: '', // 链接标题
					url: '' // 链接URL
				},
				drawerWidth: 0, // 插入图片抽屉宽度
			}
		},
		computed: {
			// `editorHeight`计算属性，返回编辑器高度。当键盘弹出时，编辑器高度为键盘高度减去工具栏高度，否则为窗口高度减去工具栏高度
			editorHeight() {
				// toolbar 默认高度
				const toolbarHeight = 150
				let toolHeight = 0

				// 如果有弹出框，设置弹出框高度为50
				if (this.showToolPopup !== '') {
					toolHeight = 50
				}

				// 如果键盘高度大于0，返回窗口高度减去键盘高度减去工具栏高度减去工具栏弹出框高度，否则返回0。
				return 0
			}
		},
		watch: {
			// 监听`showFooterToolBar`属性，当值为false时，清空弹出工具栏名称和弹出工具栏位置信息
			showFooterToolBar(newValue) {
				if (!newValue) {
					this.showToolPopup = ''
					this.toolPopupRect = {}
				}
			}
		},
		mounted() {
			// 调用`uni.getSystemInfoSync()`获取系统信息，保存到`systemInfo`属性中。
			this.systemInfo = uni.getSystemInfoSync()
			// 设置插入图片抽屉宽度为窗口宽度的80%
			this.drawerWidth = this.systemInfo.windowWidth * .8
			uni.$on('parstImage', (src) => {
				this.format('image', {
					src: src,
					data: {
						source: src
					}
				})
			})
		},
		methods: {
			getEditorContent() {
				return this.$refs.webEditor.getEditorContext()
			},
			parseHtml(htmlContent) {
				this.$refs.webEditor.parseHtml(htmlContent)
			},
			// 编辑器加载完成时触发
			onEditorReady(editorCtx) {
				// 通过 #ifdef 条件编译根据不同的平台执行不同的操作

				// #ifdef H5
				// // 在 H5 平台上，将编辑器的 `editorCtx` 对象保存到组件的 `editorCtx` 属性中，并触发 `ready` 事件，将 `editorCtx` 对象作为参数传递给父组件。
				if (editorCtx) {
					this.editorCtx = editorCtx
					this.$emit('ready', editorCtx)
				}
				// // 在 H5 平台上，为了实现键盘弹出时自动调整编辑器高度，监听 `window.visualViewport` 对象的 `resize` 事件，并绑定 `resizeHandler` 方法。
				window.visualViewport.addEventListener('resize', resizeHandler.bind(this));

				function resizeHandler() {
					// 获取窗口高度和 `visualViewport` 高度
					const innerHeight = window.innerHeight
					const visualViewportHeight = window.visualViewport.height

					// 如果键盘高度大于0，调用 `this.onKeyboardHeightChange()` 方法，传入一个对象作为参数，对象包含 `height` 和 `duration` 两个属性，分别表示键盘高度和键盘弹出动画的持续时间，否则不做任何操作。
					this.onKeyboardHeightChange({
						height: parseInt(innerHeight - visualViewportHeight),
						duration: 0
					})
				}

				// #endif

				// #ifndef H5
				// 在非 H5 平台上，调用 `this.createSelectorQuery()` 方法获取编辑器的 `editorCtx` 对象，并将其保存到组件的 `editorCtx` 属性中。
				this.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
					// 将 `editorCtx` 对象作为参数传递给父组件。
					this.$emit('ready', res.context)
				}).exec()
				// 监听键盘高度变化事件
				uni.onKeyboardHeightChange(this.onKeyboardHeightChange.bind(this))
				// #endif
			},
			// 监听键盘高度变化事件
			onKeyboardHeightChange(res) {
				// 如果键盘高度等于 `this.keyboardHeight`，则直接返回。
				if (res.height < 20 || res.height === this.keyboardHeight) return
				// 根据 `res.height` 的值设置 `duration` 变量的值，如果 `res.height` 大于 0，则将 `duration` 的值设置为 `res.duration * 1000`，否则将其设置为 0。
				const duration = res.height > 0 ? res.duration * 1000 : 0
				// 调用 `setTimeout` 函数，将 `uni.pageScrollTo` 方法的调用放入异步任务队列中，以确保在页面滚动到顶部后再更新编辑器的位置。
				setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: 0,
						success: () => {
							// 在页面滚动到顶部后，调用 `this.updatePosition()` 方法，传入 `res.height` 作为参数，更新编辑器的位置。
							this.updatePosition(res.height)
							// 调用 `this.editorCtx.scrollIntoView()` 方法，将编辑器滚动到可视区域内。
							setTimeout(() => this.editorCtx.scrollIntoView(), 0)
						}
					})
				}, duration)
			},
			// 更新键盘高度
			updatePosition(keyboardHeight) {
				this.keyboardHeight = keyboardHeight
			},
			// 显示工具栏弹出层
			showToolPopupView(id) {
				uni.createSelectorQuery().in(this).select('#' + id).boundingClientRect(btnData => {
					uni.createSelectorQuery().in(this).select('#' + id + '-popup').boundingClientRect(
						popupData => {
							const center = popupData.width / 2

							// 根据位置信息计算出工具栏弹出层的位置，始终将弹出层显示在最中间，将位置信息保存到组件的 `toolPopupRect` 属性中
							if (btnData.left > center) {
								this.toolPopupRect.left = (btnData.left - center) + btnData.width / 2
							} else {
								this.toolPopupRect.left = 10
							}
							if (popupData.width > this.systemInfo.windowWidth) {
								this.toolPopupRect.right = 10
							}

							// 根据传递的id参数，设置组件的 `showToolPopup` 属性的值，如果 `showToolPopup` 属性的值等于传递的id参数，则将其设置为空字符串（隐藏工具栏弹出层），否则将其设置为传递的id参数（显示工具栏弹出层）。
							this.showToolPopup = this.showToolPopup !== id ? id : ''
							// 如果 `showToolPopup` 属性的值为空字符串，则将组件的 `toolPopupRect` 属性设置为空对象，清空工具栏弹出层位置信息。
							if (this.showToolPopup === '') {
								this.toolPopupRect = {}
							}
						}).exec();
				}).exec();
			},
			// 显示插入块元素工具栏
			showInsertBlockView() {
				this.editorCtx.blur()
				uni.hideKeyboard()
				this.showToolSettingMask = true
				this.showInsertBlockToolSetting = true
				this.showToolPopup = false
				this.toolPopupRect = {}

			},
			// 关闭插入块元素工具栏
			closeToolSetting() {
				this.showToolSettingMask = false
				this.showInsertBlockToolSetting = false
			},
			// 编辑器辑器状态改变时触发
			onStatusChange(e) {
				this.formats = e.detail
			},
			// 编辑器获取焦点时触发
			onEditorFocus() {
				// 显示工具栏
				this.showFooterToolBar = true
			},
			// 编辑器失去焦点时触发
			onEditorBlur() {
				// 将键盘高度设置为 0
				this.updatePosition(0)
				// 隐藏工具栏
				this.showFooterToolBar = false
			},
			// 手动隐藏键盘
			hideKeyboard() {
				this.editorCtx.blur()
			},
			// 设置编辑器格式
			format(name, value) {
				// name 不存在时，不设置编辑器格式
				if (!name || !this.editorCtx) return

				// 根据传递的 name 和 value 参数，设置编辑器的格式。
				switch (name) {
					case 'hr':
						// 插入分割线
						this.editorCtx.insertDivider()
						break
					case 'undo':
						// 撤销操作
						this.editorCtx.undo()
						break
					case 'redo':
						// 重做操作
						this.editorCtx.redo()
						break
					case 'link':
						// 插入链接，由于小程序端不支持插入链接，所以在小程序端通过 insertText 方法插入 markdown 格式的链接。在 H5 端，通过 format 方法插入链接。
						// #ifdef H5
						this.editorCtx.format('link', value)
						// #endif

						// #ifndef H5
						this.editorCtx.insertText({
							text: `[${value.text}](${value.link})`
						})
						// #endif
						break
					case 'space-both':
						// 设置两端缩进左右间距
						this.editorCtx.format('marginLeft', value)
						this.editorCtx.format('marginRight', value)
						break
					case 'format-clear':
						// 清除格式
						this.editorCtx.removeFormat()
						break
					case 'image':
						// 插入图片
						this.editorCtx.insertImage(value)
						break
					case 'unlockContent':
						// 插入付费解锁内容块
						const isExist = document.querySelector('.ql-unlock-content')

						// 如果已经存在付费解锁内容块，则弹出提示框，否则插入付费解锁内容块。
						if (isExist) {
							uni.showModal({
								content: '付费解锁不允许重新插入',
								showCancel: false
							})
							return
						}
						this.editorCtx.insertUnlockContent(value)
						break
					case 'ai':
						// 打开AI智能助手
						this.showImChat = !this.showImChat
						break
					case 'mediaVideo':
						// 仅H5支持
						// #ifdef H5
						this.editorCtx.insertMediaVideo(value)
						// #endif
						break
					default:
						this.editorCtx.format(name, value)
						break
				}
				// 插入内容后，将编辑器滚动到底部
				setTimeout(() => this.editorCtx.scrollIntoView(), 200)
			},
			// 获取编辑器所选内容的格式
			getFormat(range) {
				this.formats = range ? this.editorCtx.getFormat(range) : {}
				return this.formats
			},
			// 复制图片进入编辑器上传
			uploadHandlerForH5({
				blob,
				ext,
				size
			}, el) {
				// 返回一个 Promise 对象，以便在上传成功后，将图片的 URL 插入到编辑器中。
				return new Promise(async (resolve, reject) => {
					const result = await imageUpload(blob)
					if (result) {
						resolve(result)
					} else {
						reject(result)
					}
				})
			},
			onInsertImage(selectMediaItems) {
				const image = selectMediaItems[0]

				this.$refs.insertImageDrawer.close()

				// 图片如果没有违规，调用 format 方法，将图片插入到富文本编辑器中，并滚动到插入的位置。
				this.format('image', {
					src: image.src,
					data: {
						source: image.src
					}
				})
				setTimeout(() => this.editorCtx.scrollIntoView(), 0)
			},
			uploadEditorImage({
				filePath,
				fileExt,
				size
			}) {

			},
			// 在移动端插入超链接
			showLinkPopup(link) {
				this.currentLink.url = link
				this.hideKeyboard()
				this.$refs.popup.open()
			},
			// 插入超链接
			linkChange() {
				if (!this.currentLink.url) return
				this.format('link', {
					text: this.currentLink.title || this.currentLink.url,
					link: this.currentLink.url
				})
				this.$refs.popup.close()
			}
		},
		watch: {
			bottomHeight() {
				this.bottomHeightCss = this.bottomHeight
			}
		}
	}
</script>

<style scoped lang="scss">
	@import '@/uni_modules/uni-cms/common/style/editor-icon.css';
	@import "quill.scss";

	@media screen and (min-width: 768px) {
		@import "h5.scss";
	}

	.editor-container {
		height: calc(70% - var(--bottomHeight));
		overflow: scroll;
		scrollbar-width: none;
	}

	.editor-toolbar {
		position: absolute;
		background-color: #f8f8f8;
		top: -40px;
		right: 0;
		z-index: 999;
		width: 100%;
		height: 40px;
	}

	// 修改编辑器默认样式
	::v-deep .ql-container {
		.ql-editor {
			&.ql-blank:before {
				font-style: normal;
				line-height: 1.75;
				font-size: 17px;
			}

			@mixin font {
				font-size: 17px;
				line-height: 1.75;
			}

			@mixin mb {
				margin-bottom: 20px;
			}

			.ql-syntax {
				@include mb;
			}

			p {
				@include font;
				@include mb;
			}

			h1,
			h2,
			h3,
			h4,
			h5,
			h6 {
				@include mb;
			}

			ol,
			ul {
				@include font;
				@include mb;

				li {
					margin-bottom: 10px !important;

					&:last-child {
						margin-bottom: 0;
					}
				}
			}

			.divider {
				@include mb;
			}

			code {
				word-break: break-word;
				border-radius: 2px;
				overflow-x: auto;
				background-color: #fff5f5;
				color: #ff502c;
				padding: 0.065em 0.4em;
				font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
			}
		}
	}
</style>