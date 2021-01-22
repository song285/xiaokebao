<template name="footer">
	<view class="footer-view">
		<view class="footer-bar">
			<view class="index" :class="addClass ==1 ? 'on' :''" @tap="choice(1)">课表</view>
			<view class="knowledge-base" :class="addClass ==2 ? 'on' :''" @tap="choice(2)">课程</view>
			<view class="notice" :class="addClass ==3 ? 'on' :''" @tap="choice(3)">账单</view>
			<view class="my" :class="addClass ==4 ? 'on' :''" @tap="choice(4)">我的</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// msgCount:0,
				addClass:this.$store.state.footerClass,
			}
		},
		mounted() {
			this.$store.commit("choiceFooter",1)
		},
		methods: {
			choice(num) {
				this.$store.commit("choiceFooter",num)
				// this.addClass = num
				if(num==1){
					uni.redirectTo({
						url:'/pages/index/index'
					})
				}
				if(num==2){
					uni.reLaunch({
						url:'/pages/course/index'
					})
				}
				if(num==3){
					uni.redirectTo({
						url:'/pages/bill/index'
					})
				}
				if(num==4){
					uni.redirectTo({
						url:'/pages/my/index'
					})
				}
			}
		}
	}
</script>

<style scoped>
	.footer-view {
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.footer-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 120rpx;
		width: 100vw;
		background: #FFFFFF;
		box-shadow: 0px 7rpx 21rpx 0px rgba(0, 0, 0, 0.18);
	}

	.footer-bar>view {
		padding-top: 55rpx;
		height: 39rpx;
		width: 25%;
		text-align: center;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #656565;
		background-repeat: no-repeat;
	}

	.footer-bar .index {
		background-image: url('/static/images/kebiao1-ic.png');
		background-position: 77rpx 11rpx;
		background-size: 34rpx 36rpx;
	}

	.footer-bar .index.on {
		background-image: url('/static/images/kebiao2-active.png');
		color: #007AFF;
	}

	.footer-bar .knowledge-base {
		background-image: url('/static/images/kecheng1-ic.png');
		background-position: 78rpx 11rpx;
		background-size: 34rpx 38rpx;
	}

	.footer-bar .knowledge-base.on {
		background-image: url('/static/images/kecheng2-active.png');
		color: #007AFF;
	}

	.footer-bar .notice {
		background-image: url('/static/images/shangdwx-ic.png');
		background-position: 74rpx 11rpx;
		background-size: 41rpx 41rpx;
		position: relative;
	}

	.footer-bar .notice.on {
		background-image: url('/static/images/zhangd-active.png');
		color: #007AFF;
		position: relative;
	}

	.footer-bar .notice .tips {
		padding: 0 12rpx;
		height: 30rpx;
		background: #FC3434;
		border-radius: 15rpx;
		text-align: center;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 30rpx;
		position: absolute;
		left: 90rpx;
		top: 0;
	}

	.footer-bar .my {
		background-image: url("/static/images/wod1-ic.png");
		background-position: 77rpx 11rpx;
		background-size: 38rpx 38rpx;
	}

	.footer-bar .my.on {
		background-image: url("/static/images/wod2-active.png");
		color: #007AFF;
	}
</style>
