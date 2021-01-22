<template>
	<view v-cloak>
		<view class="borderbox">
			<textarea placeholder="请填写您的产品反馈，我们会非常重视！" v-model="text" maxlength="100" @input="onCount"/>
			<view class="count">
				<text>{{count}}/100</text>
			</view>
		</view>
		<view class="footer">
			<van-button round block type="info" @click="onSubmit">提交</van-button>
		</view>
	</view>
</template>

<script>
	import feedback from "../../js/api/my/feedback.js"
	export default {
		data() {
			return {
				text:"",
				count:0,
				isclick:false
			};
		},
		methods:{
			onCount(){
				this.count = this.text.length
			},
			onSubmit(){
				if(this.isclick){
					return
				}
				this.isclick = true
				feedback.feedback(this)
			}
		}
	}
</script>

<style lang="scss">
	[v-cloak]{
		display: none;
	}
	page{
		background-color: #F8F8F8;
	}
	.borderbox{
		width: 638rpx;
		height: auto;
		margin: 20rpx auto;
		padding: 32rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.06);
		border-radius: 30rpx;
		font-size: 28rpx;
		color: #333333;
		position: relative;
		textarea{
			padding: 20rpx;
			padding-bottom: 50rpx;
			background: #F8F8F8;
			border-radius: 20rpx;
			width: 598rpx;
		}
		.count{
			position: absolute;
			color: #333333;
			width: 100%;
			text-align: right;
			bottom: 45rpx;
			right: 50rpx;
		}
	}
	.footer{
		margin: 45rpx 72rpx;
	}
</style>
