<template>
	<view>
		<view>评论</view>
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
			getCommentList(){
				const params = {
					page: this.pageInfo.page,
					size: this.pageInfo.size,
					showCommentImage: true
				}
				getApp().$openApi.user.getInteractList(params).then(res=>{
					console.log(res)
				})
			}
		}
	}
</script>

<style>

</style>
