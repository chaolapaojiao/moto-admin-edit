<template>
	<view class="sidebar-container moto-flex-row-left">
		<view class="moto-flex-column-center" style="margin-left: 25px;">
			<view class="pub-btn" @click="choosePubType">创作内容</view>
			<el-menu class="sidebar" :default-active="activeMenu" @select="onSelect" active-text-color="#ff6100">
				<template v-for="(item, index) in menuList">
					<el-sub-menu :index="item.index" v-if="item.isGroup">
						<template #title>
							<view class="moto-flex-row-left">
								<view class="iconv2 menu-icon">{{item.icon}}</view>
								<view class="group-name">{{item.name}}</view>
							</view>
						</template>
						<el-menu-item-group style="background-color: transparent;">
							<el-menu-item v-for="menu in item.childrenMenu" :index="item.index + '-' + menu.index">
								<view style="width: 100%;padding-left: 100rpx;"
									:style="{color: activeMenu === (item.index + '-' + menu.index) ? '#ff6100' : '#717171'}"
									@click="openLinkUrl(menu)">
									<view style="font-size: 26rpx;">
										{{menu.name}}
									</view>
								</view>
							</el-menu-item>
						</el-menu-item-group>
					</el-sub-menu>
				</template>
			</el-menu>
			<view style="width: 20px;"></view>
		</view>
		<pub-type-select ref="pubTypeSelect"></pub-type-select>
	</view>
</template>

<script>
	import pubTypeSelect from '@/components/moto-cms/pub-type-select.vue'
	export default {
		components:{
			pubTypeSelect
		},
		data() {
			return {
				activeMenu: '1-1',
				menuList: [{
						name: '内容管理',
						isGroup: true,
						index: '1',
						icon: '\ue75c',
						childrenMenu: [{
								name: '首页',
								index: '1',
								linkUrl: '/pages/moto-cms/home'
							}, {
								name: '发布记录',
								index: '2',
								linkUrl: '/pages/moto-cms/article-list'
							},
							{
								name: '草稿箱',
								index: '3',
								linkUrl: '/pages/moto-cms/article-draft'
							}
						]
					},
					{
						name: '互动管理',
						icon: '\ue619',
						isGroup: true,
						index: '2',
						childrenMenu: [{
								name: '评论',
								index: '1',
								linkUrl: ''
							},
							{
								name: '点赞',
								index: '2'
							},
							{
								name: '关注',
								index: '3'
							}
						]
					},
				]
			}
		},
		mounted() {
			uni.$on('pageChange', this.onPageChange)
		},
		methods: {
			onPageChange(e){
				for(let index in this.menuList){
					const mneu = this.menuList[index]
					const data = mneu.childrenMenu
					for(let tabIndex in data){
						if(data[tabIndex].linkUrl == e){
							this.activeMenu = this.menuList[index].index + '-' + data[tabIndex].index
						}
					}
				}
				
			},
			onSelect(e) {
				this.activeMenu = e
			},
			openLinkUrl(menu) {
				uni.navigateTo({
					url: menu.linkUrl
				})
			},
			choosePubType(id) {
				this.$refs.pubTypeSelect.dialogVisible = true
			}
		}
	}
</script>

<style lang="scss">
	.sidebar-container {
		height: 100%;
		width: 100%;
	}

	.sidebar {
		width: 280rpx;
		height: 80%;
		background-color: blue;
		border: 0 !important;
	}

	.split-line {
		width: 2px;
		height: 100vh;
	}

	.menu-title {
		font-size: 15px;
	}

	.el-sub-menu__title {
		height: 90rpx !important;
	}

	.el-menu-item {
		height: 80rpx !important;
		width: 100%;
		background-color: #f8f8f8;
		padding: 0!important;
	}

	.menu-icon {
		font-size: 32rpx;
		color: #717171;
	}

	.el-menu {
		background-color: transparent !important;
	}

	.pub-btn {
		width: 270rpx;
		height: 80rpx;
		background-color: #ff6100;
		border-radius: 8rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 80rpx;
		font-size: 24rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.group-name {
		color: #717171;
		margin-left: 20rpx;
	}

	::v-deep .el-menu-item-group__title {
		display: none !important;
		padding: 0 !important;
	}

	.el-menu-item-group__title {
		padding: 0 !important;
	}
</style>