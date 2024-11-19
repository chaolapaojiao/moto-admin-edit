<template>
	<scroll-view scroll-x style="width: 1000px;padding-left: 50rpx;margin-bottom: 20rpx;padding-top: 20rpx;">
		<el-tag v-for="tag in relatedLabelList" :key="tag" style="margin-right: 20rpx;" closable
			:disable-transitions="false" @close="handleClose(tag)">
			{{ tag }}
		</el-tag>
		<el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" style="width: 200rpx;" size="small"
			@keyup.enter="handleInputConfirm" @blur="handleInputConfirm"/>
		<el-button v-else class="button-new-tag" size="small" @click="showInput">
			+ 添加关键词
		</el-button>
	</scroll-view>
</template>

<script>
	export default {
		props: {
			relatedLabelList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				inputVisible: false,
				inputValue: ''
			}
		},
		methods: {
			handleClose(tag) {
				const tags = this.relatedLabelList
				tags.splice(tags.indexOf(tag), 1)
				this.$emit('update:relatedLabelList', tags)
			},
			handleInputConfirm(e) {
				if (this.inputValue) {
					const tags = this.relatedLabelList
					tags.push(this.inputValue)
					this.$emit('update:relatedLabelList', tags)
				}
				this.showInput = false
				this.inputValue = ''
			},
			showInput() {
				this.inputVisible = true
			}
		}
	}
</script>

<style>
</style>