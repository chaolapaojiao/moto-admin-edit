<template>
	<view>
		<slot :change="change">
			<toolbarTool type="button" @change="change" :active="active" :disabled="disabled"
				:tooltip="{content: '插入图片'}">
				<uni-icons custom-prefix="editor-icon" type="icon-image" size="22px" style="padding: 1px;"></uni-icons>
			</toolbarTool>
		</slot>
		<uni-drawer class="insert-image-drawer" v-if="drawerWidth" ref="insertImageDrawer" mode="right"
			:width="drawerWidth">
			<uni-media-library mode="picker" :selected-count="1" :media-tabs="['image']"
				@onInsert="onInsert"></uni-media-library>
		</uni-drawer>
	</view>
</template>

<script>
	import request from '@/api/http.js'
	const http = request.http
	import ToolbarTool from "./base.vue"
	export default {
		name: "tool-image",
		emits: ['change'],
		props: {
			active: Boolean,
			disabled: Boolean
		},
		components: {
			ToolbarTool
		},
		data() {
			return {
				drawerWidth: null
			}
		},
		mounted() {
			const sysinfo = uni.getSystemInfoSync()
			this.drawerWidth = sysinfo.windowWidth * .8
		},
		methods: {
			change() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: async (res) => {
						this.onInsert({
							src: res.tempFilePaths[0]
						})
						http.upload('common/imageUpload', {
							name: 'file',
							filePath: res.tempFilePaths[0]
						}).then(res => {
							const result = JSON.parse(res.data)
							if (result.code === 200) {
								this.onInsert({
									src: result.data.url,
								})
							}
						})
					}
				});
			},
			onInsert(selectedMedia) {
				// 目前仅支持单张插入
				this.$emit('change', {
					type: 'image',
					value: {
						src: selectedMedia.src,
						alt: ''
					}
				})
			}
		}
	}
</script>

<style scoped>
	// #ifdef H5
	@import '@/uni_modules/uni-cms/common/style/editor-icon.css';
	// #endif
</style>