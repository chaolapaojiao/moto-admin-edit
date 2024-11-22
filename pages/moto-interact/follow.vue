<template>
	<view class="moto-flex-row-center" style="width: 90%;height: 100%;">
		<scroll-view :show-scrollbar="false" scroll-y class="card card-shadow">
			<view style="height: 32px;"></view>
			<view v-for="(item,index) in 10">
				<view class="moto-flex-row-left" style="margin-bottom: 32px;align-items: flex-start">
					<image class="user-avatar" src="../../static/image/logo.png"></image>
					<view class="content-container">
						<view class="moto-flex-row-between" style="align-items: flex-start;">
							<view>
								<view class="user-name">芝士饭团</view>
								<view class="moto-flex-row-left">
									<view style="color: rgba(51, 51, 51, 0.8);margin-right: 10px;font-size: 14px;">
										开始关注你了</view>
									<view style="color: rgba(51, 51, 51, 0.8);font-size: 14px;">10-18</view>
								</view>
							</view>
							<view class="action-follow">回关</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageInfo: {
					page: 1,
					size: 20
				}
			}
		},
		onLoad() {
			this.getCommentList()
		},
		methods: {
			getCommentList() {
				const params = {
					page: this.pageInfo.page,
					size: this.pageInfo.size,
					showCommentImage: true
				}
				getApp().$openApi.user.getInteractList(params).then(res => {
					console.log(res)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card {
		width: 600px;
		height: 100%;
		background-color: #FFFFFF;
		padding: 0px 24px;
		box-sizing: border-box;
		border-radius: 8px;
	}

	.user-avatar {
		height: 48px;
		width: 48px;
		border-radius: 24px;
		margin-right: 20px;
	}

	.article-image {
		height: 48px;
		width: 48px;
	}

	.content-container {
		flex: 1;
		border-bottom: 1px solid #eee;
		padding-bottom: 32px;
	}

	.user-name {
		font-size: 16px;
		font-weight: 500;
		color: #333333;
		margin-bottom: 2px;
	}

	.action-follow {
		width: 76px;
		height: 30px;
		background-color: #ff6100;
		border-radius: 20px;
		line-height: 30px;
		text-align: center;
		color: #FFFFFF;
		font-size: 14px;
	}
</style>