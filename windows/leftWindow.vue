<template>
	<view class="moto-flex-row-left sidebar-container">
		<el-menu class="sidebar" default-active="0">
			<template v-for="(item, index) in menuList">
				<el-menu-item :index="String(index)">
					<view class="iconv2 menu-icon">&#xe758;</view>
					<view class="menu-title">{{item.title}}</view>
				</el-menu-item>
			</template>
		</el-menu>
		<view class="split-line"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menuList: [{
					title: '文章管理',
					linkUrl: '/pages/moto-cms/pub-list',

				}]
			}
		},
		methods: {

		}
	}
</script>

<style>
	@import '/uni.scss';
	.sidebar-container{
		height: 100%;
	}
	.sidebar {
		position: fixed;
		width: 238px;
		height: 100vh;
		background-color: #FFFFFF;
		border: 0 !important;
	}

	.split-line {
		width: 2px;
		height: 100vh;
	}

	.menu-title {
		font-size: 15px;
	}

	.el-menu-item {
		border-bottom: 1px solid #f5f5f5;
	}

	.menu-icon {
		margin: 0 4px 0 30px;
		font-size: 16px;
	}
	
</style>