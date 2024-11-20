<template>
	<el-dialog style="padding-bottom: 0" v-model="dialogVisible" title="关联车型" width="500" align-center>
		<view>
			<view class="moto-flex-row-left" style="margin-bottom: 10px;">
				<el-input @input="onSearchChange" v-model="searchInfo.searchKeyword" style="width: 400px;"
					placeholder="搜索感兴趣的车型" />
				<view class="search-btn" @click="confirmSearch">搜索</view>
			</view>
		</view>
	</el-dialog>
</template>

<script>
	export default {
		data(){
			return {
				dialogVisible: false,
				searchInfo: {
					searchKeyword: ''
				}
			}
		},
		methods:{
			onSearchChange(){
				
			},
			confirmSearch(){
				
			}
		}
	}
</script>

<style lang="scss">
	.search-btn {
		width: 60px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		color: #141E34;
		background-color: #ff6100;
		border-radius: 4px;
		margin-left: 10px;
		color: #FFFFFF;
	}
</style>