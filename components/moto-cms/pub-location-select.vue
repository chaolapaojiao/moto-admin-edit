<template>
	<el-dialog style="padding-bottom: 0" v-model="dialogVisible" title="关联位置/打卡点" width="500" align-center
		@close="onDialogClose">
		<map class="map moto-flex-row-center" id="map" :latitude="latitude" :longitude="longitude"
			@regionchange="onRegionChange">
			<cover-image src="/static/image/marker.png" class="map-btn-center">
			</cover-image>
			<cover-image src="/static/image/route_icon_location.png" class="map-btn-my" @click="toCurrentLocation">
			</cover-image>
		</map>
		<view class="moto-flex-row-left" style="margin: 10px 0;">
			<el-input @input="onSearchChange" v-model="searchInfo.searchKeyword" style="width: 400px;"
				placeholder="搜索地点" />
			<view class="search-btn" @click="confirmSearch">搜索</view>
		</view>
		<scroll-view class="list-scrollview" :show-scrollbar="false" scroll-y v-if="showSearch"
			@scrolltolower="onSeachLoadMore">
			<view style="white-space: nowrap">
				<view style="white-space: nowrap">
					<view v-for="item in searchInfo.data" class="location-item" @click="selectLocation(item)">
						<view class="moto-flex-row-left">
							<template v-if="item.pointId">
								<image v-if="item.pointType === 'MOTO_SHOP'" class="point-icon"
									src="/static/image/location_icon_motorshop.png"></image>
								<image v-else-if="item.pointType === 'SHOP'" class="point-icon"
									src="/static/image/location_icon_shop.png"></image>
								<image v-else class="point-icon" src="/static/image/location_icon_mark.png"></image>
							</template>
							<text class="iconv2 location-point" v-else>&#xe744;</text>
							<view>
								<view class="location-name moto-lines-1" style="max-width: 480px;">{{item.name}}</view>
								<view class="moto-flex-row-left">
									<view class="sub-info">{{item.distanceStr}}</view>
									<template v-if="item.address">
										<view class="sub-info" style="margin: 0 10px">|</view>
										<view class="sub-info moto-lines-1" style="max-width: 400px;">{{item.address}}
										</view>
									</template>
								</view>
							</view>
						</view>
						<view class="line"></view>
					</view>
					<view style="height: 50px;">
						<view v-if="searchInfo.loading" class="status">加载中...</view>
						<view class="status" v-if="searchInfo.nomore">没有更多了</view>
						<view class="status" v-if="searchInfo.empty">暂无内容</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<scroll-view :show-scrollbar="false" scroll-y class="list-scrollview" @scrolltolower="onScrolltolower" v-else>
			<view style="white-space: nowrap">
				<view v-for="item in listInfo.data" class="location-item" @click="selectLocation(item)">
					<view class="moto-flex-row-left">
						<template v-if="item.pointId">
							<image v-if="item.pointType === 'MOTO_SHOP'" class="point-icon"
								src="/static/image/location_icon_motorshop.png"></image>
							<image v-else-if="item.pointType === 'SHOP'" class="point-icon"
								src="/static/image/location_icon_shop.png"></image>
							<image v-else class="point-icon" src="/static/image/location_icon_mark.png"></image>
						</template>
						<text class="iconv2 location-point" v-else>&#xe744;</text>
						<view>
							<view class="location-name moto-lines-1" style="max-width: 480px;">{{item.name}}</view>
							<view class="moto-flex-row-left">
								<view class="sub-info">{{item.distanceStr}}</view>
								<template v-if="item.address">
									<view class="sub-info" style="margin: 0 10px">|</view>
									<view class="sub-info moto-lines-1" style="max-width: 400px;">{{item.address}}
									</view>
								</template>
							</view>
						</view>
					</view>
					<view class="line"></view>
				</view>
				<view style="height: 50px;">
					<view v-if="listInfo.loading" class="status">加载中...</view>
					<view class="status" v-if="listInfo.nomore">没有更多了</view>
					<view class="status" v-if="listInfo.empty">暂无内容</view>
				</view>
			</view>
		</scroll-view>
	</el-dialog>
</template>

<script>
	import {
		debounce,
		throttle
	} from 'lodash'
	export default {
		data() {
			return {
				dialogVisible: false,
				latitude: '',
				longitude: '',
				listInfo: {
					page: 1,
					size: 20,
					loading: false,
					nomore: false,
					empty: false,
					data: [],
				},
				searchInfo: {
					page: 1,
					size: 20,
					searchKeyword: '',
					loading: false,
					nomore: false,
					empty: false,
					data: []
				},
				nearbyList: [],
				mapContext: null,
				targetLocation: {
					latitude: '',
					longitude: ''
				},
				showSearch: false
			}
		},
		created() {
			this.mapContext = uni.createMapContext("map", this);
		},
		methods: {
			initLocation() {
				uni.getLocation({
					type: 'wgs84',
					success: (res) => {
						this.latitude = res.latitude
						this.longitude = res.longitude
						this.targetLocation.latitude = this.latitude
						this.targetLocation.longitude = this.longitude
						this.getNearbyPoiList()
					},
					fail: (err) => {
						navigator.geolocation.getCurrentPosition((res) => {
							console.log(res)
						}, (err) => {
							console.log(err)
						});
					}
				});
			},
			selectLocation(item) {
				this.$emit('locationSelect', {
					...item,
					type: 3
				})
				this.dialogVisible = false
			},
			onDialogClose() {
				this.dialogVisible = false
			},
			getNearbyPoiList() {
				if (this.listInfo.nomore) {
					return
				}
				this.listInfo.loading = true
				const params = {
					page: this.listInfo.page,
					size: this.listInfo.size,
					currentLatitude: this.latitude,
					currentLongitude: this.longitude,
					targetLatitude: this.targetLocation.latitude,
					targetLongitude: this.targetLocation.longitude
				}
				getApp().$openApi.motoCms.getNearbyPoiList(params).then(res => {
					console.log(res)
					this.listInfo.loading = false
					if (res.data.code === 200) {
						const data = res.data.data
						if (data.length) {
							this.listInfo.data.push(...data)
						}
						if (this.listInfo.page === 1 && !data.length) {
							this.listInfo.empty = true
							return
						}
						if (!data.length || data.length < this.listInfo.size) {
							this.listInfo.nomore = true
						}
					}
				})
			},
			onSearchChange(e) {
				if (!e) {
					this.showSearch = false
				}
			},
			confirmSearch() {
				this.showSearch = true
				this.searchInfo.page = 1
				this.searchInfo.data = []
				this.search()
			},
			onSeachLoadMore: throttle(function() {
				this.searchInfo.page++
				this.search()
			}, 500),
			search() {
				if (this.searchInfo.nomore) {
					return
				}
				const params = {
					page: this.searchInfo.page,
					size: this.searchInfo.size,
					currentLatitude: this.latitude,
					currentLongitude: this.longitude,
					targetLatitude: this.targetLocation.latitude,
					targetLongitude: this.targetLocation.longitude,
					key: this.searchInfo.searchKeyword
				}
				getApp().$openApi.motoCms.getNearbyPoiList(params).then(res => {
					this.searchInfo.loading = false
					if (res.data.code === 200) {
						const data = res.data.data
						if (data.length) {
							this.searchInfo.data.push(...data)
						}
						if (this.searchInfo.page === 1 && !data.length) {
							this.searchInfo.empty = true
							return
						}
						if (!data.length || data.length < this.listInfo.size) {
							this.searchInfo.nomore = true
						}
					}
				})
			},
			toCurrentLocation() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						this.mapContext.moveToLocation({
							longitude: res.longitude,
							latitude: res.latitude
						});
					}
				});
			},
			onRegionChange: debounce(function() {
				this.listInfo = {
					page: 1,
					size: 20,
					loading: false,
					nomore: false,
					data: []
				}
				this.getMapCenterLocation()
			}, 500),
			onScrolltolower: throttle(function() {
				this.listInfo.page++
				this.getNearbyPoiList()
			}, 500),
			getMapCenterLocation() {
				this.mapContext.getCenterLocation({
					type: 'gcj02',
					success: (res) => {
						this.targetLocation.latitude = res.latitude
						this.targetLocation.longitude = res.longitude
						this.getNearbyPoiList()
					},
					fail: (err) => {
						console.log(err)
					}
				})
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

	.list-scrollview {
		height: 400px;
		width: 100%;
	}

	.location-card {}

	.map {
		width: 500px;
		height: 250px;
		margin-left: -16px;
	}

	.map-btn-center {
		position: absolute;
		left: 225px;
		bottom: 100px;
		width: 50px;
		height: 50px;
	}

	.map-btn-my {
		position: absolute;
		bottom: 10px;
		right: 10px;
		width: 35px;
		height: 35px;
	}

	.location-item {
		height: 50px;
		margin-bottom: 8px;
	}

	.line {
		width: 500px;
		background-color: #f1f1f1;
		height: 1px;
		margin: 10px 0;
	}

	.point-icon {
		width: 24px;
		height: 24px;
		margin-right: 10px;
	}

	.location-point {
		font-size: 24px;
		margin-right: 10px;
	}

	.location-name {
		color: #141E34;
		font-size: 14px;
	}

	.sub-info {
		font-size: 12px;
		color: #999;
	}

	.el-dialog__title {
		font-size: 17px;
	}

	.status {
		height: 50px;
		line-height: 50px;
		width: 450px;
		text-align: center;
	}
</style>