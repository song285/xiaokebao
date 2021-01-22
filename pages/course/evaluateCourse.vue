<template>
	<view v-cloak>
		<view class="borderbox">
			<textarea placeholder="请输入课程评价" v-model="text" maxlength="500" @input="onCount"/>
			<view class="count">
				<text>{{count}}/500</text>
			</view>
		</view>
		<view class="footer">
			<van-button round block type="info" @click="onSubmit">提交</van-button>
		</view>
	</view>
</template>

<script>
	import course from '../../js/api/course/index.js'
	export default {
		data() {
			return {
				text:"",
				count:0,
				id:'',
				isClick:false
			};
		},
		onLoad(option) {
			this.id = option.id
		},
		methods:{
			onCount(){
				this.count = this.text.length
			},
			onSubmit(){
				if(this.isClick){
					return
				}
				this.isClick = true
				course.doevaluate(this)
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
