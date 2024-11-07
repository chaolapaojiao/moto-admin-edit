<template>
	<view>
		<el-dialog v-model="dialogVisible" title="关联圈子" width="500" align-center>

		</el-dialog>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dialogVisible: false,
				tabs: [{
						name: "推荐",
						select: "RECOMMEND",
						page: 1,
						nomore: false,
						data: []
					}, {
						name: "车型",
						select: "MODEL",
						page: 1,
						nomore: false,
						data: []
					}, {
						name: "我的",
						select: "JOIN",
						page: 1,
						nomore: false,
						data: []
					}, {
						name: "历史",
						select: "HISTORY",
						page: 1,
						nomore: false,
						data: []
					},
					{
						name: "兴趣",
						select: "HOBBY",
						page: 1,
						nomore: false,
						data: []
					},
					{
						name: "地区",
						select: "REGION",
						page: 1,
						nomore: false,
						data: []
					},
					{
						name: "品牌",
						select: "BRAND",
						page: 1,
						nomore: false,
						data: []
					}
				]
			}
		},
		created() {

		},
		methods: {
			getCircleList() {

			}
		}
	}
</script>

<style>
</style>