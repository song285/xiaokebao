<template>
	<view class="main" v-cloak>
		<view class="list" v-for="item in list" :key="item">
			<view class="list-name">
				<view class="list-state">
					<text class="list-type" :class="{cancelled:item.state == 30}">{{item.state == 20 ? '已完成' : item.state == 30 ? '已取消' : '已结算'}}</text>
					<view class="eil" style="max-width: 73%;">{{item.className}}</view>
				</view>
				<view class="list-total" v-if="item.deductHour">共扣{{item.deductHour}}课时</view>
				<view class="list-total" v-if="!item.deductHour">结算{{item.hours}}课时，金额{{ item.totalPrice }}元</view>
			</view>
			<view class="list-time" v-if="item.classDate">
				{{item.classDate}} {{item.classTime}}
			</view>
			<view class="list-time" v-if="!item.classDate">
				{{item.createTime}}
			</view>
			<view class="list-evaluate" v-if="!!item.evaluate">
				课程评价：{{item.evaluate}}
			</view>
		</view>
		<uni-load-more :status="moreStatus" @clickLoadMore="loadMore"></uni-load-more>
	</view>
</template>

<script>
	import index from "../../js/api/course/index.js"
	import common from "../../js/common/common.js"
	export default {
		data() {
			return {
				checkedBaby:[],
				list:[],
				obj:'',
				start:0,
				length:10,
				moreStatus:"more"
			}
		},
		onLoad(option) {
			let op = Object.keys(option)
			
			if(!op.includes('title')){
				common.babyList(this,1)
				this.obj = option
				setTimeout(()=>{
					this.getInfo(option)
				},500)
				return
			}
			
			uni.setNavigationBarTitle({//设置title
				title:option.title
			})
			index.settlementRecord(option,this)
		},
		methods: {
			getInfo(option){
				index.classRecord(option,this)
			},
			// 加载更多
			loadMore(){
				if(this.moreStatus != 'more'){
					return
				}
				this.moreStatus = "loading"
				this.getInfo(this.obj)
			}
		}
	}
</script>
<style>
	page{
		background-color: #F8F8F8;
	}
</style>
<style scoped>
	[v-cloak]{
		display: none;
	}
.list{
	width: 702rpx;
	padding: 35rpx 0 3rpx;
	background: #FFFFFF;
	box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.06);
	border-radius: 30rpx;
	margin:20rpx auto;
}
.list-name{
	margin: 0rpx 26rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.list-state{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	font-size: 34rpx;
	font-family: PingFang SC;
	font-weight: bold;
	color: #343434;
	width: 50%;
}
.list-type{
	width: 76rpx;
	height: 34rpx;
	background: #5294F7;
	border-radius: 6rpx;
	font-size: 20rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #FFFFFF;
	display: block;
	text-align: center;
	line-height: 34rpx;
	margin-right: 15rpx;
}
.list-state .cancelled{
	background: #CCCCCC;
}
.list-time{
	padding: 30rpx 26rpx 23rpx;
	font-size: 24rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #A4A4A4;
}
.list-total{
	font-size: 26rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #A4A4A4;
}
.list-evaluate{
	padding: 20rpx 26rpx;
	line-height: 35rpx;
	font-size: 26rpx;
	border-top: 1px solid #EEEEEE;
	font-family: PingFang SC;
	font-weight: 500;
	color: #909090;
}
.eil{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
