<template>
	<view>
		<view class="outer_box">
			<view class="radio-box" style="margin: 28rpx;margin-left: -20rpx;">
				<view class="title" style="margin-left: 104rpx;">选择家庭：</view>
				<view class="">
					<radio-group @change="radioChange" class="options">
						<label v-for="item,index in items" :key="index">
							<radio color="#007AFF" :value="index" custom-style="margin-bottom:10rpx" />
								<text class="eli" style="display: inline-block;width: 200rpx;vertical-align: middle;">
								{{item.homeName}}
							</text>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="familly" style="margin: 30rpx;">
				<view class="title" style="line-height: 100rpx;margin-left: -61rpx;" @click="showIdentify = true">家庭身份：</view>
				<!-- <view class="">
					<evan-checkbox-popup :options="option1" :max="1" @objConfirm.stop="onConfirmClas">
						{{ selectedVal }}<van-icon custom-style="margin-left:5rpx;bottom:-4rpx;" name="arrow-down" />
					</evan-checkbox-popup>
				</view> -->
				
				<view class="top-item" @click="showIdentify = true">
					<view class="eli" style="max-width: 117rpx;">
						{{ selectedVal }}
					</view>
					<van-icon custom-style="margin-left:5rpx;bottom:-4rpx;" name="arrow-down" />
				</view>
				<van-popup :show="showIdentify"
					 @click-overlay="showIdentify = false"
					 custom-style="height:40%"
					 position="bottom">
					 <view class="top-tab">
						 <!-- <view class="cancelButton" @click="showBaby = false">取消</view> -->
						 <view style="text-align: center;">
						 	请选择家庭身份
						 </view>
						 <!-- <view class="newaddButton" @click="toAddBaby" v-if="babyList.length >= 6 ? false : true">新增</view> -->
					 </view>
					 <view class="my-picker">
						<view class="aency-items" v-for="item,index in option1" :key="index" @click="bindIdentifyChange(item)">
							<text>{{item.label}}</text>
						</view>
					</view>
				</van-popup>
			</view>
		</view>
		<button type="default" open-type="getUserInfo" @getuserinfo="onSubmit">开始使用</button>
	</view>
</template>

<script>
	import common from '../../js/common/common.js'
	export default {
		data() {
			return {
				items: [],
				option1: [
					{ label: '爸爸', value: 10 },
					{ label: '妈妈', value: 20 },
					{ label: '爷爷', value: 30 },
					{ label: '奶奶', value: 40 },
					{ label: '其他', value: 90 },
				],
				selectedVal:'点击选择',
				value1: "",
				current:'',
				identity:0,
				mainUserId:'',
				isFirstLogin:'',
				isClick:false,
				showIdentify:false,
				isSwitch:true
			}
		},
		onShow() {
			uni.hideHomeButton()
			this.isClick = false
			this.isFirstLogin = uni.getStorageSync('isFirstLogin')
			common.getFamilyList(this)
		},
		methods: {
			radioChange: function(evt) {
				this.current = evt.target.value;
				this.identity = this.items[parseInt(this.current)].identity
				this.mainUserId = this.items[parseInt(this.current)].id
				uni.setStorageSync('currentFamily',this.items[parseInt(this.current)].homeName)
				try{
					this.option1.forEach(item => {
						if(item.value == this.identity){
							this.selectedVal = item.label
							this.value1 = item.value
							throw Error()
						}else{
							this.selectedVal = "点击选择"
						}
					})
				}catch(e){
					//TODO handle the exception
				}
			},
			// onChange(detail){
			// 	console.log(detail)
			// 	this.value1 = detail.detail
			// },
			onSubmit(e){
				if(this.isClick) return
				this.isClick = false
				
				common.enter(this)
			},
			// onConfirmClas(e){
			// 	if(this.identity == e[0].value){
			// 		this.$message("身份已选定暂不可修改")
			// 		return
			// 	}
			// 	this.selectedVal = e[0].label
			// 	this.value1 = e[0].value
			// },
			bindIdentifyChange(item){
				if(this.identity == item.value){
					this.$message("身份已选定暂不可修改")
					return
				}
				this.selectedVal = item.label
				this.value1 = item.value
				
				this.showIdentify = false
			}
		}
	}
</script>

<style scoped lang="scss">
	.top-item{
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: 144rpx;
	}
	.my-picker{
		overflow-y:auto;
		width: 100%;
		margin-top: 94rpx;
	}
	.aency-items{
		border-bottom: 1px solid #eeee;
		width: 100%;
		// height: 54rpx;
		text-align: center;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		padding: 30rpx 0;
		position: relative;
	}
	.top-tab{
		width: 100%;
		height: 50rpx;
		position: fixed;
		padding-top: 33rpx;
		border-bottom: 1px solid #EEEEEE;
		padding-bottom: 15rpx;
		background-color: #f7f7f7;
		z-index: 9 !important;
		.cancelButton{
			display: inline-block;
			text-align: left;
			padding-left: 50rpx;
			position: absolute;
			left: 0;
			color: #999;
		}
		.newaddButton{
			padding-right: 50rpx;
			display: inline-block;
			text-align: right;
			position: absolute;
			right: 0;
			color: #007AFF;
		}
	}
	.outer_box{
		width: 650rpx;
		margin: 20rpx auto;
		background-color: #FFFFFF;
		border-radius: 30rpx;
		padding: 20rpx;
		margin-top: 250rpx;
	}
	.radio-box{
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
	.familly{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.title{
		margin-right: 50rpx;
	}
	radio{
		transform: scale(.7);
	}
	.options{
		display: flex;
		flex-direction: column;
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
	button{
		margin-top: 50rpx;
	}
</style>

<style>
	page{
		background-color: #F8F8F8;
		font-size: 28rpx;
		color: #666666;
	}
</style>
