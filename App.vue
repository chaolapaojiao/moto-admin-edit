<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	page {
		height: 100%;
		width: 100%;
		background-color: #f8f8f8;
	}

	uni-left-window {
		min-width: 220px !important;
	}

	uni-top-window {
		min-width: 1000px;
	}

	/*每个页面公共css */
</style>