<template>
	<view v-cloak>
		<view class="main">
			<view class="list">
				<view class="title">上课</view>
				<view class="list-right">
					<view class="remind-time">提前<input type="number" disabled="disabled" v-model="time.attendClass" />分钟提醒</view>
					<van-switch :checked="time.attendClassIsOpen == 1" @change="upperCourse" size="50rpx"/>
				</view>
			</view>
			<view class="list">
				<view class="title">下课</view>
				<view class="list-right">
					<view class="remind-time">提前<input type="number" disabled="disabled" v-model="time.overClass"  />分钟提醒</view>
					<van-switch :checked="time.overClassIsOpen == 1" @change="lowerCourse"  size="50rpx"/>
				</view>
			</view>
			<view class="list">
				<view class="title">课程结课</view>
				<view class="list-right">
					<view class="remind-time">小于<input type="number" disabled="disabled"  v-model="time.finishClass"  />课时提醒</view>
					<van-switch :checked="time.finishClassIsOpen == 1" @change="lessThan" size="50rpx"/>
				</view>
			</view>
			<view class="list">
				<view class="title">上课前一天</view>
				<view class="list-right">
					<view class="remind-time" style="margin-right: 68rpx;">提前<input type="number" disabled="disabled" value="1" />天提醒</view>
					<van-switch :checked="time.tomorrowAttendClassIsOpen == 1" @change="tomorrowAttend" size="50rpx"/>
				</view>
			</view>
		</view>
		<!-- <view class="preservation" @click="preservation">保存设置</view> -->
	</view>
</template>


<script>
	import message from '../../js/api/my/message.js'
	export default {
		data() {
			return {
				upper: true, //上课
				lower: true, //下课
				small: true, //结课
				time:{
					attendClass:60,//上课
					overClass:60,//下课
					finishClass:10,//结课
					ondayClass:"1",
					attendClassIsOpen: 1,
					overClassIsOpen: 1,
					finishClassIsOpen:1,
					tomorrowAttendClassIsOpen:1
				},
			};
		},
		methods: {
			upperCourse(detail) { //上
				this.time.attendClassIsOpen = detail.detail ? 1 : 0
				message.setSwitch(this)
			},
			lowerCourse(detail) { //上课
				this.time.overClassIsOpen = detail.detail ? 1 : 0
				message.setSwitch(this)
			},
			lessThan(detail) { //上课
				this.time.finishClassIsOpen = detail.detail ? 1 : 0
				message.setSwitch(this)
			},
			tomorrowAttend(detail) { //上课
				this.time.tomorrowAttendClassIsOpen = detail.detail ? 1 : 0
				message.setSwitch(this)
			},
			preservation(){
				message.modifyMsg(this)
			}
		},
		onLoad() {
			message.msgRemind(this)
		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
	}
</style>
<style lang="scss" scoped>
	[v-cloak]{
		display: none;
	}
	.main {
		margin: 20rpx 24rpx 0;
		background: #FFFFFF;
		box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.06);
		border-radius: 30rpx;
	}

	.list {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 22rpx 0 30rpx;
		height: 102rpx;
		border-bottom: 1px solid #eee;
	}

	.title {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #323232;
	}

	.list-right {
		display: flex;
		align-items: center;
	}

	.remind-time {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #666666;
		margin-right: 43rpx;
	}

	.remind-time input {
		width: 114rpx;
		height: 48rpx;
		background: #FFFFFF;
		border: 1rpx solid #EEEEEE;
		border-radius: 4rpx;
		padding-left: 12rpx;
		margin: 0 6rpx 0 8rpx;
	}
	.preservation{
		margin: 89rpx auto;
		width: 604rpx;
		height: 90rpx;
		background: #5294F7;
		border-radius: 45rpx;
		text-align: center;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFEFE;
		line-height: 90rpx;
	}
</style>
