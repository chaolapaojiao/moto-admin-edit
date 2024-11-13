<template>
	<el-dialog style="z-index: -1;" v-model="dialogVisible" title="编辑投票" width="500" align-center>
		<view style="padding:0 10px;">
			<input v-model="voteTitle" class="input-title" placeholder-style="font-size: 15px" placeholder="请输入投票标题" />
			<view class="line"></view>
			<view class="block-item">投票选项</view>
			<view>
				<view v-for="(item, index) in voteItemList">
					<view class="moto-flex-row-left">
						<view class="option-title">选项{{index + 1}}</view>
						<input class="input-item" v-model="item.itemText" placeholder-style="font-size: 15px"
							placeholder="请输入选项内容" />
						<view class="iconv2" style="color: #141E34" v-if="index > 1" @click="deleteItem(index)">&#xe671;
						</view>
					</view>
					<view class="line"></view>
				</view>
				<view class="moto-flex-row-right" style="margin-top: 20px;">
					<view class="add-btn" @click="addOption">添加选项</view>
					<view class="confirm-btn" @click="confirmEdit">完成编辑</view>
				</view>
			</view>
		</view>
	</el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				dialogVisible: false,
				voteTitle: '',
				voteItemList: [{
						itemText: ''
					},
					{
						itemText: ''
					}
				],
			}
		},
		methods: {
			addOption() {
				if (this.voteItemList.length >= 5) {
					getApp().$message.warning('最多只能添加5个选项')
					return
				}
				this.voteItemList.push({
					itemText: ''
				})
			},
			deleteItem(index) {
				this.voteItemList.splice(index, 1)
			},
			confirmEdit() {
				if (!this.voteTitle) {
					getApp().$message.warning('请输入投票标题')
					return
				}
				if (!this.voteItemList[0].itemText && !this.thisvoteItemList[1].itemText) {
					getApp().$message.warning('至少需要设置两个选项')
					return
				}
				const voteInfo = {
					voteTitle: this.voteTitle,
					voteItemList: this.voteItemList.filter(item => item.itemText.trim())
				}
				this.$emit('voteEdit', voteInfo)
				this.dialogVisible = false
			}
		}
	}
</script>

<style lang="scss">
	.el-dialog__title {
		font-size: 17px !important;
	}

	.line {
		width: 100%;
		height: 1px;
		margin: 10px 0;
		background-color: #EBECEF;
	}

	.block-item {
		color: #141E34;
		font-size: 13px;
		margin: 10px 0;
	}

	.option-title {
		width: 50px;
		font-size: 14px;
		color: #141E34;
	}

	.add-btn {
		width: 90px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		background: #F7F8FB;
		font-size: 13px;
		color: #141E34;
		border-radius: 4px;
		margin-right: 20px;
	}

	.confirm-btn {
		width: 90px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		background: #ff6100;
		font-size: 13px;
		color: #FFFFFF;
		border-radius: 4px;
	}

	.input-title {
		font-size: 16px;
		color: #141E34;
		width: 100%
	}

	.input-item {
		width: 400px;
		height: 38px;
		font-size: 14px;
		color: #141E34;
	}
</style>