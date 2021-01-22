<template>
	<view v-cloak>
		<view class="main">
			<view class="title">
				<view>客服电话</view>
				<view class="phone" @tap="phone(serviceData.phone)">{{serviceData.phone}}
					<image  class="jiantou" src="../../static/images/more-ic.png" mode="">
				</view>
			</view>
			<view class="code">
				<image :src="serviceData.qrCode" show-menu-by-longpress mode=""></image>
				<view>扫一扫添加客服微信进行反馈</view>
			</view>
		</view>
	</view>
</template>

<script>
	import service from "../../js/api/my/index.js"
	export default {
		data() {
			return {
				serviceData :{}
			};
		},
		methods:{
			phone(num){
				if(!!this.serviceData.phone){
					uni.makePhoneCall({
					    phoneNumber: num
					});
				}
			}
		},
		onLoad() {
			service.service(this)
		}
	}
</script>

<style>
	page{
		background-color: #F8F8F8;
	}
</style>
<style lang="scss" scoped>
	[v-cloak]{
		display: none;
	}
.main{
	margin: 20rpx 24rpx 0;
	background: #FFFFFF;
	box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.06);
	border-radius: 30rpx;
}
.title{
	height: 102rpx;
	margin: 0 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 28rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #343434;
	border-bottom: 1rpx solid #eee;
}
.title .phone{
	font-size: 28rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #909090;
	display: flex;
	align-items: center;
}
.phone image{
	width: 10rpx;
	height: 18rpx;
	display: block;
	margin-left: 17rpx;
}
.code {
	padding: 55rpx 0 75rpx;
	font-size: 28rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #343434;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.code image{
	width: 200rpx;
	height: 200rpx;
	display: block;
	margin-bottom: 24rpx;
}
</style>
