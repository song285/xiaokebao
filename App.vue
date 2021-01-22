<script>
	import home from 'js/api/index/home.js'
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			
		},
		onHide: function() {
			console.log('App Hide')
		},

	}
</script>

<style>
	/*每个页面公共css */
	@import "./wxcomponents/vant/dist/common/index.wxss";
	
	/* 右下角悬浮按钮 */
	.add_icon{
		color: #007AFF;
		font-size: 24rpx;
		word-break: break-all;
		text-align: center;
		width: 50rpx;
		font-weight: bold;
	}
	.eli {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
