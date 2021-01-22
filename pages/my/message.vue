<template>
	<view v-cloak>
		<view class="top">
			<view @click="goMsgSetting" class="remind">
				<image src="../../static/images/tixing-ic.png" mode=""></image>提醒设置
			</view>
			<view @click="onClearMsg">
				<image src="../../static/images/sanc-ic.png" mode=""></image>清空
			</view>
		</view>
		<view class="main">
			<view class="list" v-for="item in messageList">
				<view class="title">
					<view class="name">{{item.title}}<view v-if="item.isRead==0"></view>
					</view>
					<view class="time">{{item.createTime}}</view>
				</view>
				<view class="content" v-html="item.content"></view>
			</view>
		</view>
		<!-- <view class="no-more" v-if="messageList.length < page.total" @click="loadMore">加载更多~</view>
		<view class="no-more" v-if="messageList.length >= page.total">没有更多记录啦~</view> -->
		<!-- <view style="margin-top: 46rpx;"> -->
			<uni-load-more :status="moreStatus" @clickLoadMore="loadMore"></uni-load-more>
		<!-- </view> -->
	</view>
</template>

<script>
	import message from '../../js/api/my/message.js'
	export default {
		data() {
			return {
				messageList: [],
				page: {
					start: 0,
					length: 10,
					total: ''
				},
				moreStatus:'noMore'
			};
		},
		onShow() {
			message.messageList(this)
		},
		methods: {
			onClearMsg(){
				message.clearmsg(this)
			},
			goMsgSetting() {
				message.scribeMessage(this,'./msgSetting')
			},
			loadMore() {
				if(this.moreStatus != 'more'){
					return
				}
				this.page.start = this.page.start
				this.page.length = this.page.length + 15
				message.messageList(this)
			}
		},
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
	.top {
		margin: 0rpx 50rpx;
		padding-top: 29rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 26rpx;
		line-height: 28rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #666666;
	}

	.top .remind {
		color: #5294F8;
	}

	.top view {
		display: flex;
		align-items: center;
	}

	.top view image {
		width: 23rpx;
		height: 26rpx;
		display: block;
		margin-right: 7rpx;
	}

	.main {
		margin: 20rpx 24rpx 0;
		background: #FFFFFF;
		box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.06);
		border-radius: 30rpx;
	}

	.list {
		padding: 35rpx 28rpx;
		border-bottom: 1rpx solid #eee;
	}
	
	.list:last-child{
		border: none;
	}

	.list .title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #343434;
		margin-bottom: 31rpx;
	}

	.title .name {
		position: relative;
	}

	.title .name view {
		width: 16rpx;
		height: 16rpx;
		background: #FA5842;
		border-radius: 50%;
		position: absolute;
		right: -16rpx;
		top: 0;
	}

	.title .time {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #B4B4B4;
	}

	.list .content {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #909090;
		line-height: 36rpx;
	}

	.no-more {
		margin: 46rpx auto;
		width: 260rpx;
		height: 66rpx;
		background: #EEEEEE;
		border-radius: 33rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #909090;
		text-align: center;
		line-height: 66rpx;
	}
</style>
