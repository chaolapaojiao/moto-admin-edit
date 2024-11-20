<template>
	<el-dialog style="padding-bottom: 0" v-model="dialogVisible" title="关联分类" width="500" align-center>
		<view class="moto-flex-row-between class-container">
			<view v-for="(item, index) in articleClassList"
				:style="{backgroundColor: !item.name ? '#FFFFFF' : '#F8F9FB'}" class="class-item"
				:class="{'class-item-select': item.articleClass === currentSelect}" @click="onClassSelect(item)">
				<view>{{item.name}}</view>
			</view>
		</view>
		<template v-if="showModify">
			<view class="modify-text">为你的改装分组吧</view>
			<view class="moto-flex-row-left">
				<view v-for="item in modifyClassList" class="class-item"
					:class="{'class-item-select': item.modifyClass === currentModifySelect}" style="margin-right: 24px;"
					@click="modifyClassSelect(item)">
					<view>{{item.name}}</view>
				</view>
			</view>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				dialogVisible: false,
				currentSelect: 0,
				currentModifySelect: 0,
				showModify: false,
				articleClassList: [{
						"name": "🔧用车养车",
						"articleClass": 1009
					},
					{
						"name": " 🛠改装升级",
						"articleClass": 1003
					}, {
						"name": "👩🏻‍🦰机车女骑",
						"articleClass": 1001
					}, {
						"name": "📰热点资讯",
						"articleClass": 1011
					}, {
						"name": "🤡奇闻趣事",
						"articleClass": 1010
					}, {
						"name": "📷骑车晒照",
						"articleClass": 1008
					}, {
						"name": "🏞️摩旅路上",
						"articleClass": 1005
					}, {
						"name": " 🏍️复古格调",
						"articleClass": 1004
					}, {
						"name": " ⛰️越野玩家",
						"articleClass": 1006
					}, {
						"name": " ⛽能耗分享",
						"articleClass": 1013
					}, {
						"name": " 🏁️赛事竞技",
						"articleClass": 1014
					},
					{

					}
				],
				newsClassList: [{
					name: '新车发布',
					articleClass: '1'
				}, {
					name: '新车谍照',
					articleClass: '2'
				}, {
					name: '赛事报道',
					articleClass: '3'
				}, {
					name: '行业新闻',
					articleClass: '4'
				}, {
					name: '用车玩车',
					articleClass: '5'
				}, {
					name: '新闻趣事',
					articleClass: '6'
				}, {
					name: '厂家召回',
					articleClass: '7'
				}, {

				}],
				modifyClassList: [{
						name: '性价比组',
						modifyClass: 1
					},
					{
						name: '盆栽组',
						modifyClass: 2
					},
					{
						name: '专业组',
						modifyClass: 3
					}
				],
			}
		},
		methods: {
			onClassSelect(item) {
				this.currentSelect = item.articleClass
				if (item.articleClass !== 1003) {
					this.$emit('classSelect', item)
					this.dialogVisible = false
				} else {
					this.showModify = true
				}
			},
			modifyClassSelect(item) {
				this.currentModifySelect = item.modifyClass
				this.$emit('classSelect', {
					name: " 🛠改装升级",
					articleClass: 1003,
					modifyClass: item.modifyClass
				})
				this.dialogVisible = false
			}
		}
	}
</script>

<style lang="scss">
	.el-dialog__title {
		font-size: 17px !important;
	}
	
	.class-container {
		flex-wrap: wrap;
	}
	
	.class-item {
		width: 100px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		background-color: #F8F9FB;
		color: #141E34;
		font-size: 14px;
		margin-bottom: 14px;
	}
	
	.modify-text {
		font-size: 13px;
		color: #848B9E;
		margin-bottom: 14px;
	}
	
	.class-item-select {
		background-color: #FFF6F0 !important;
		border: 1px solid #FF6100;
	}

</style>