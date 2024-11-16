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
	import {
		imageUpload
	} from '@/utils/imageTool'
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
					success: async (res) => {
						this.imageUrl = res.tempFilePaths[0]
						this.imageStatus = 'loading'
						const result = await imageUpload(res.tempFilePaths[0])
						if (result) {
							this.imageUrl = result
							this.imageStatus = ''
						} else {
							this.imageStatus = 'fail'
						}
					}
				});
			},
			confirmEdit() {
				if (!this.modifyName) {
					getApp().$Message.warning('请输入改件名称')
					return
				}
				const data = {
					itemName: this.modifyName,
					itemPrice: this.modifyPrice ? this.modifyPrice : 0,
					itemUrl: this.imageUrl,
					type: 1
				}
				this.modifyName = ''
				this.modifyPrice = ''
				this.imageUrl = ''
				this.$emit('modifyEdit', data)
				this.dialogVisible = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.image-upload {
		width: 200rpx;
		height: 200rpx;
		text-align: center;
		line-height: 200rpx;
		font-size: 40rpx;
		color: #999;
		border: 3rpx dashed #eaeaea;
	}

	.option-title {
		width: 100rpx;
		font-size: 28rpx;
		color: #141E34;
	}

	.line {
		width: 100%;
		height: 2rpx;
		margin: 8rpx 0;
		background-color: #EBECEF;
	}

	.input-item {
		width: 800rpx;
		height: 60rpx;
		font-size: 28rpx;
		color: #141E34;
	}

	.confirm-btn {
		width: 180rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		background-color: #ff6100;
		border-radius: 8rpx;
		color: #FFFFFF;
		font-weight: 400;
		margin-top: 40rpx;
	}

	.modify-image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 8rpx;
	}

	.status {
		position: absolute;
		top: 0;
		left: 0;
		height: 200rpx;
		width: 200rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 200rpx;
		background-color: rgba(0, 0, 0, 0.4);
	}
</style>