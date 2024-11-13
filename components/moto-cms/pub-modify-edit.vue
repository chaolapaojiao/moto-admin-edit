<template>
	<el-dialog v-model="dialogVisible" title="添加改件" width="500" align-center>
		<view>
			<view style="margin-bottom: 20px;position: relative;">
				<image mode="aspectFill" v-if="imageUrl" :src="imageUrl" class="modify-image" />
				<view v-else class="iconv2 image-upload" @click="imageUpload">&#xe695;</view>
				<view class="status" v-if="imageStatus === 'loading'">正在上传...</view>
				<view class="status" v-if="imageStatus === 'fail'">上传失败</view>
			</view>
			<view class="moto-flex-row-left">
				<view class="option-title">名称</view>
				<input class="input-item" v-model="modifyName" placeholder-style="font-size: 15px"
					placeholder="请输入改装件名称" />
			</view>
			<view class="line"></view>
			<view class="moto-flex-row-left" style="margin-top: 20px;">
				<view class="option-title">价格</view>
				<input type="number" class="input-item" v-model="modifyPrice" placeholder-style="font-size: 15px"
					placeholder="请输入改装件价格" />
			</view>
			<view class="line"></view>
			<view class="moto-flex-row-right">
				<view class="confirm-btn" @click="confirmEdit">添加改件</view>
			</view>
		</view>
	</el-dialog>
</template>

<script>
	import request from '@/api/http.js'
	const http = request.http
	export default {
		data() {
			return {
				dialogVisible: false,
				modifyName: '',
				modifyPrice: '',
				imageUrl: '',
				imageStatus: ''
			}
		},
		methods: {
			imageUpload(e) {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						this.imageUrl = res.tempFilePaths[0]
						this.imageStatus = 'loading'
						http.upload('common/imageUpload', {
							name: 'file',
							filePath: res.tempFilePaths[0]
						}).then(res => {
							const result = JSON.parse(res.data)
							if (result.code === 200) {
								this.imageUrl = result.data.url
								this.imageStatus = ''
							} else {
								this.imageStatus = 'fail'
							}
						})
					}
				});
			},
			confirmEdit() {
				if (!this.modifyName) {
					getApp().$message.warning('请输入改件名称')
					return
				}
				const data = {
					itemName: '',
					itemPrice: '',
					itemUrl: '',
					type: 1
				}
				this.$emit('modifyEdit', data)
				this.dialogVisible = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.image-upload {
		width: 100px;
		height: 100px;
		text-align: center;
		line-height: 100px;
		font-size: 20px;
		color: #999;
		border: 1.5px dashed #eaeaea;
	}

	.option-title {
		width: 50px;
		font-size: 14px;
		color: #141E34;
	}

	.line {
		width: 100%;
		height: 1px;
		margin: 4px 0;
		background-color: #EBECEF;
	}

	.input-item {
		width: 400px;
		height: 30px;
		font-size: 14px;
		color: #141E34;
	}

	.confirm-btn {
		width: 90px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		background-color: #ff6100;
		border-radius: 4px;
		color: #FFFFFF;
		font-weight: 400;
		margin-top: 20px;
	}

	.modify-image {
		width: 100px;
		height: 100px;
		border-radius: 4px;
	}

	.status {
		position: absolute;
		top: 0;
		left: 0;
		height: 100px;
		width: 100px;
		color: #FFFFFF;
		text-align: center;
		line-height: 100px;
		background-color: rgba(0, 0, 0, 0.4);
	}
</style>