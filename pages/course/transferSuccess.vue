<template>
	<view>
		<view class="success">
			<image src="/static/images/cheng-ic.png" mode=""></image>
			<view>
				转移成功
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
.success{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 124rpx;
	font-size: 28rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #343434;
}
.success image{
	width: 120rpx;
	height: 118rpx;
	display: block;
	margin-bottom: 39rpx;
}
</style>
