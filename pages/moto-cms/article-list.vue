<template>
	<view style="width: 100%;">
		<view class="page-header moto-flex-row-between">
			<view>文章列表</view>
			<el-button type="primary" @click="openEdit()">新增</el-button>
		</view>
		<view style="height: 50px;"></view>
		<el-table :data="tabelData" style="width: 100%;" :header-cell-style="{ 'text-align': 'center' }"
			:cell-style="{height: '100px'}">
			<el-table-column type="selection" width="55" />
			<el-table-column label="封面" min-width="30%" align="center">
				<template #default="scope">
					<image mode="aspectFill" class="image-preview" :src="scope.row.imageUrl"></image>
				</template>
			</el-table-column>
			<el-table-column label="标题" min-width="30%" align="center">
				<template #default="scope">{{ scope.row.title }}</template>
			</el-table-column>
			<el-table-column property="name" label="内容" min-width="30%">
				<template #default="scope">{{scope.row.previewText}}</template>
			</el-table-column>
			<el-table-column property="name" label="操作" min-width="30%" align="center">
				<template #default="scope">
					<view>
						<el-button type="primary" @click="openEdit(scope.row.id)">编辑</el-button>
						<el-button type="danger">删除</el-button>
					</view>
				</template>
			</el-table-column>
		</el-table>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageInfo: {
					page: 1,
					size: 10,
					type: 'CIRCLE'
				},
				tabelData: []
			}
		},
		onLoad() {
			this.getPubList()
		},
		methods: {
			getPubList() {
				getApp().$openApi.motoCms.getPubArticleList(this.pageInfo).then(res => {
					if (res.data.code === 200) {
						this.tabelData = res.data.data.releaseList
					}
				})
			},
			openEdit(id) {
				const host= window.location.host
				console.log(host)
				if (id) {
					uni.navigateTo({
						url: '/pages/moto-cms/article-editor?id=' + id
					})
				} else {
					
					window.open(`http://${host}/pages/moto-cms/article-editor`, '_blank')
				}
			}
		}
	}
</script>

<style lang="scss">
	.page-header {
		position: fixed;
		left: 240px;
		height: 50px;
		background-color: #FFFFFF;
		width: calc(100% - 240px);
		z-index: 999;
		padding: 14px 20px;
		box-sizing: border-box;
	}

	.image-preview {
		width: 100px;
		height: 100px;
	}
</style>