<template>
	<view>
		<view class="mybox">
			<view>
				<input type="number" maxlength="11" placeholder="请输入手机号" v-model="phone" />
			</view>
			<view class="second">
				<input type="number" maxlength="6" placeholder="请输入手机验证码" v-model="code" />
				<view class="code" :class="{geting:isGeting}" @click.stop="getCode">{{tips}}</view>
			</view>
			<image @click="clearPhone" v-if="phone" src="../../static/images/close-ic.png" mode=""></image>
		</view>
		
		
		<button type="default" :disabled="isAbled" @click="onSubmit">确定</button>
	</view>
</template>

<script>
	import common from '../../js/common/common.js'
	export default {
		data() {
			return {
				phone:'',
				code:'',
				tips:'获取验证码',
				timer:60,
				isGeting:false,
				isClick:false,
				shareid:'',
			};
		},
		onShow() {
			this.isClick = false
		},
		computed:{
			isAbled(){
				return this.code.length != 6 || this.phone.length != 11
			}
		},
		onLoad(option) {
			if(Object.keys(option).length == 0){
				return
			}
			this.shareid = option.shareid
		},
		methods:{
			clearPhone(){
				setTimeout(()=>{
					this.phone = ''
				},50)
			},
			getCode(){
				if(this.isGeting) return
				
				//手机正则
				const phone = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
				
				let isphone = phone.test(this.phone)
				
				if (!isphone) {
					this.$message("请输入正确的手机号")
					return
				}
				
				let timer = setInterval(()=>{
					if(this.timer <= 0) {
						this.tips = "获取验证码"
						this.isGeting = false
						this.timer = 60
						clearInterval(timer)
						return
					}
					this.isGeting = true
					this.tips = "重新获取" + this.timer + "s"
					this.timer --
				},1000)
				
				common.getPhoneCode(this)
				
			},
			onSubmit(){
				if(this.isClick) return
				
				this.isClick = true
				
				if(!this.phone){
					this.$message("请输入手机号")
					this.isClick = false
					return
				}
				
				if(!this.code){
					this.$message("请输入验证码")
					this.isClick = false
					return
				}
				
				common.phoneLogin(this)
				
			}
		}
	}
</script>

<style>
	page{
		background-color: #F8F8F8;
		font-size: 28rpx;
		color: #666666;
	}
</style>

<style lang="scss" scoped>
	.mybox{
		width: 670rpx;
		margin: 50rpx auto;
		padding: 20rpx;
		border-radius: 30rpx;
		background-color: #FFFFFF;
		position: relative;
	}
	.mybox input{
		height: 60rpx;
		line-height: 60rpx;
		width: 600rpx;
	}
	.second{
		position: relative;
		border-top: 1rpx solid #F8F8F8;
		margin-top: 10rpx;
	}
	.second input{
		padding-top: 10rpx;
	}
	.code{
		height: 30rpx;
		border: 2rpx solid #007AFF;
		color: #007AFF;
		font-size: 24rpx;
		text-align: center;
		border-radius: 30rpx;
		padding: 8rpx 30rpx;
		line-height: 30rpx;
		position: absolute;
		right: 0;
		top: 20rpx;
		z-index: 9;
	}
	button{
		background-color: #007AFF;
		width: 670rpx;
		color: #fff;
		font-size: 34rpx;
		border-radius: 50rpx;
		border: none !important;
	}
	button::after{
		border: none !important;
	}
	button[disabled]{
		background-color: #CCCCCC;
		border: none !important;
	}
	image{
		position: absolute;
		top: 9rpx;
		right: 0rpx;
		width: 34rpx;
		height: 34rpx;
		padding: 20rpx;
		z-index: 9;
	}
	.geting{
		border: 2rpx solid #ccc;
		color: #ccc;
	}
</style>	
