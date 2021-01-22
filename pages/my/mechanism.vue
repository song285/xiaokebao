<template>
	<view v-cloak>
		<view class="main">
			<van-swipe-cell class="delparent" :right-width="68"  v-for="item,index in list" :key="index">
				<view class="list" @click="updateInfo(item)">
					<view class="title eli">{{ item.name }}</view>
					<view class="content">
						<image class="jiantou" src="../../static/images/more-ic.png" mode="">
					</view>
				</view>
				<view slot="right" class="delbtn" @click="onClearmsg(item.id)">删除</view>
				<view class="bottomline"></view>
			</van-swipe-cell>
		</view>
		<view class="preservation" @click="goEductionInfo" v-if="list.length < 12">
			<image class="tianj-ic" src="../../static/images/tianj-ic.png" mode="">添加机构
		</view>
		<view style="padding-bottom: 32rpx;"></view>
		<view  v-if="list.length >= 12" style="padding: 69rpx;"></view>
		<!-- 右下角添加按钮 -->
		<view class="addicon" @click="goEductionInfo" v-if="list.length >= 12">
			<!-- <van-icon size="50rpx" name="plus" /> -->
			<view class="add_icon">添加机构</view>
		</view>
		<!-- <uni-load-more :status="moreStatus" @clickLoadMore="loadMore"></uni-load-more> -->
		<!-- <view class="tips">温馨提示：长按即可删除</view> -->
	</view>
</template>

<script>
	// import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import organization from "../../js/api/my/organization.js"
	export default {
		// components: {uniLoadMore},
		data() {
			return {
				list:[],
				start:0,
				length:15,
				moreStatus:"noMore",
				isClick:false
			};
		},
		onShow() {
			organization.getOrganization(this)
			this.isClick = false
		},
		onReachBottom(){
				this.start = this.length
				this.length = this.length + 15
				organization.getOrganization(this)
		},
		methods:{
			// 长按删除
			onClearmsg(orgid){
				organization.delOrg(orgid,this)
			},
			//跳添加机构
			goEductionInfo(){
				if(this.isClick){
					return
				}
				this.isClick = true
				uni.navigateTo({
					url:'./eductionInfo'
				})
			},
			// 修改机构信息
			updateInfo(item){
				let _item = JSON.stringify(item)
				uni.navigateTo({
					url:"eductionInfo?title=修改机构信息&list=" + _item
				})
			},
			// 加载更多
			// loadMore(){
			// 	if(this.moreStatus != "more"){
			// 		return
			// 	}
			// 	this.moreStatus = "loading"
			// 	this.start = this.length
			// 	this.length = this.length + 15
			// 	organization.getOrganization(this)
			// }
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
.delbtn{
	width: 130rpx;
	height: 100%;
	background: #F97878;
	text-align: center;
	line-height: 100rpx;
	color: #fff;
	font-size: 28rpx;
}
.delparent:first-child .delbtn{
	border-top-right-radius: 30rpx;
}
.delparent:last-child .delbtn{
	border-bottom-right-radius: 30rpx;
}
.list{
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 0 30rpx;
	height: 102rpx;
	// border-bottom: 1px solid #ebedf0;
}
.delparent:last-child .bottomline {
	border: none;
}

.list:last-child{
	border: none;
}

.list .title{
	font-size: 28rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #323232;
	width: 80%;
}
.list .content{
	display: flex;
	align-items: center;
	font-size: 28rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #909090;
}
.list .portrait{
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: block;
}
.list .jiantou{
	width: 10rpx;
	height: 18rpx;
	display: block;
	margin-left: 17rpx;
}
.preservation{
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 69rpx auto;
	margin-bottom: 32rpx;
	width: 604rpx;
	height: 90rpx;
	background: #5294F7;
	border-radius: 45rpx;
	font-size: 32rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #FFFEFE;
}
.tianj-ic{
	width: 33rpx;
	height: 33rpx;
	display: block;
	margin-right: 9rpx;
}
.addicon{
	width: 102rpx;
	height: 102rpx;
	background: #FFFFFF;
	box-shadow: 0px 7rpx 21rpx 0px rgba(0, 0, 0, 0.18);
	border-radius: 50%;
	position: fixed;
	bottom: 145rpx;
	right: 18rpx;
	color: #5294F7;
	display: flex;
	justify-content: center;
	align-items: center;
}
.tips{
	text-align: center;
	font-size: 28rpx;
	color: #333333;
}

.bottomline{
	border-bottom: 1px solid #ebedf0;
	// background-color: #ebedf0;
	height: 1px;
	margin: 0 20rpx;
}

.eli{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
