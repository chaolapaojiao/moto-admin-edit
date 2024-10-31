<template>
	<page-meta>
		<head>
			<title>{{title}}</title>
			<meta name="keyword" :content="title" />
		</head>
	</page-meta>
	<view class="content">
		<button @click="openEditor">文章列表</button>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				title: 'Hello'
			}
		},
		serverPrefetch() {
			this.title = '机车圈'
		},
		onLoad() {
			this.title = '机车圈'
		},
		methods: {
			openEditor() {
				uni.navigateTo({
					url: '/pages/moto-cms/pub-list'
				})
			}
		}
	}
</script>

<style>
	.content {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>