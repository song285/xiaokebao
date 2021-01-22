<template>
	<view>
		<view class="login-box">
			<view class="logo">
				小马消课
			</view>
			<view>
				<!-- <view class="tips">请完成微信授权以继续使用</view> -->
				<button class="login-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" type="default">微信一键登录</button>
				<!-- <button class="login-btn" open-type="getUserInfo" @getuserinfo="login" type="default">微信一键登录</button> -->
				<button style="margin-top: 30rpx;" class="login-btn" @click="navigateCode" type="default">手机号验证码登录</button>
			</view>
			<!-- <view class="agreement">
				<image @click="choice" v-if="!isChoice" src="../../static/images/weix-ic@2x.png" mode=""></image>
				<image @click="choice" v-if="isChoice" src="../../static/images/xuanz-ic@2x.png" mode=""></image>
				<view @click="choice" style="display: inline;">已阅读并同意以下协议：<text @click.stop="goAgreement">《用户服务协议》</text></view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import common from '../../js/common/common.js'
	export default {
		data() {
			return{
				// isChoice:false,
				shareid:'',
				isClick:false,
			}
		},
		onShow() {
			this.isClick = false
			uni.login({
				provider:'weixin',
				success(res) {
					uni.setStorageSync("wxcode",res.code)
				}
			})
		},
		onLoad(option) {
			uni.hideHomeButton()
			let nowUserId = uni.getStorageSync('nowUserId')
			if(Object.keys(option).length == 0){
				return
			}
			if(option.userId == nowUserId){
				this.$store.commit("choiceFooter",1)
				console.log("option.userId>>>",option.userId)
				console.log("nowUserId>>>",nowUserId)
				uni.redirectTo({
					url:'./index'
				})
				return
			}
			
			this.shareid = option.userId
			uni.setStorageSync('shareid',option.userId)
			
			// if(uni.getStorageSync("userToken") && this.shareid){
				
			// }
			// else 
			if(uni.getStorageSync("userToken" && this.shareid)){
				uni.redirectTo({
					url:'./index'
				})
			}
		},
		methods:{
			getPhoneNumber(e){
				if(this.isClick){
					return
				}
				this.isClick = true
				
				this.$nextTick(function(){
					common.wxPhoneLogin(e,this)
				})
				
			},
			navigateCode(){
				uni.navigateTo({
					url:'./register?shareid=' + this.shareid
				})
			},
		}
	}
	
</script>

<style lang="scss" scoped>
	
	.login-box{
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		background: #5294F7;
	}
	.logo{
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		background-color: #5294F7;
		font-size: 48rpx;
		font-weight: 800;
		color: #FFFFFF;
		text-align: center;
		margin-top: -200rpx;
	}
	.login-btn{
		width: 651rpx;
		border: none;
		background-color: #fff;
		color: #5294F7;
		font-size: 36rpx;
		border-radius: 50rpx;
	}
	.no-btn{
		width: 651rpx;
		border: none;
		background-color: #ccc;
		color: #eee;
		font-size: 36rpx;
		border-radius: 50rpx;
	}
	.tips{
		width: 100%;
		color: #fff;
		opacity: 0.8;
		font-size: 28rpx;
		text-align: center;
		padding: 20rpx 0;
	}
	.agreement{
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		padding: 20rpx 0;
		display: flex;
		align-items: center;
	}
	.agreement image{
		height: 40rpx;
		width: 40rpx;
		display: block;
		margin-right: 10rpx;
	}
</style>
