<template>
	<view v-cloak>
		<view class="custom" :style="{top:customBarH*2 + 15 + 'rpx'}">
			<van-icon @click="navigationBack" size="50rpx" color="#fff" name="arrow-left" />
			<text>课程</text>
		</view> 
		<!-- 头部背景 -->
		<view class="topback">
			<image src="/static/images/back.png" mode=""></image>
			<view class="top-box">
				<view class="course">
					<view class="eil" style="max-width: 50%;">
						<text class="course-name">{{detailCourse.name}}</text>
						<!-- <text v-if="detailCourse.name.length <= 7" class="baby-name" style="vertical-align: super;">{{detailCourse.babyName}}</text> -->
					</view>
					<text class="baby-name eil" style="max-width: 15.3%;">{{detailCourse.babyName}}</text>
				</view>
				<view class="class-time">
					<view class="time-items">
						<view>{{detailCourse.totalClassHour}}</view>
						<view>总课时</view>
					</view>
					<view class="time-items">
						<view>{{detailCourse.usedHour}}</view>
						<view>已上课时</view>
					</view>
					<view class="time-items">
						<view>{{detailCourse.restHour}}</view>
						<view>剩余课时</view>
					</view>
				</view>
			</view>
		</view>
		<view class="class-time" style="margin-top: 15rpx;">
			<view class="time-items">
				<view>{{detailCourse.totalPrice}}</view>
				<view>总费用(元)</view>
			</view>
			<view class="time-items">
				<view>{{detailCourse.usedPrice}}</view>
				<view>已上费用</view>
			</view>
			<view class="time-items">
				<view>{{detailCourse.restPrice}}</view>
				<view>剩余费用</view>
			</view>
		</view>
		<view class="education-info" style="margin-top: 20rpx;">
			<!-- <van-field
				readonly 
				is-link 
				input-align="right"
				label-class="labelclass">
				<template #label>
					<text style="padding-right: 10rpx;">{{detailCourse.orgName}}</text>
					<image class="phone" src="/static/images/dinah-ic.png" mode="" @click="callPhone(detailCourse)"></image>
				</template>
			</van-field>
			<view class="bottomline"></view>
			<van-field
				:value="detailCourse.remark"
				label="备注" 
				maxlength="50"
				readonly 
				input-align="right"/> -->
			<view class="list">
				<view class="title">{{detailCourse.orgName}}</view>
				<img v-if="!!detailCourse.orgPhone" style="width: 35rpx;height: 35rpx;vertical-align: middle;margin: 10rpx;" @click.stop="callPhone(detailCourse)" src="/static/images/dinah-ic.png" alt="">
				<view class="content" style="float: right;">
					<image class="jiantou" src="../../static/images/more-ic.png" mode="">
				</view>
			</view>
			<view class="list" style="padding: 10rpx 0;">
				<view class="title">备注</view>
				<view class="content" style="display: block;">
					{{detailCourse.remark}}
				</view>
			</view>
		</view>
		<view class="footer" v-if="detailCourse.state == 10" v-show="identity_check == 10 || identity_check == 20">
			<van-button custom-style="width:202rpx;height:89rpx;font-size: 30rpx;" round type="info" @click="onRenew()">一键续课</van-button>
			<van-button 
				v-if="detailCourse.payType == 10"
				custom-style="width:202rpx;height:89rpx;font-size: 30rpx;" 
				@click="RefundPopup = true" 
				round
				color="#FA8388">退费
			</van-button>
			<van-button 
				v-if="detailCourse.payType == 10"
				custom-style="width:258rpx;height:89rpx;font-size: 30rpx;" 
				type="info" round @click="navigationToTransfer">转移剩余课时
			</van-button>
		</view>
		<view class="xiao-overly" v-if="RefundPopup">
			<van-icon size="51rpx" 
				color="#fff" 
				@click="RefundPopup = false" 
				name="close" 
				custom-style="position:absolute;top:262rpx;right:50rpx;"/>
			<view class="xiao-popup">
				<img style="width: 100%;height: 258rpx;" src="/static/images/popup-ic.png" alt="">
				<view class="popup-label">
					<view class="label">本节课程共可退回</view>
					<view class="surplusprice">{{detailCourse.restPrice}}元</view>
				</view>
				<view class="education-popup">
					<text class="edction-tips">联系机构进行退费</text>
					<view style="display: flex;justify-content: flex-end;width: 200rpx;">						
						<text class="edction-name eil" style="width: 110rpx;text-align: right;">{{detailCourse.orgName}}</text>
						<image v-if="!!detailCourse.orgPhone" style="width: 44rpx;height: 44rpx;" src="/static/images/dinah-ic.png" @click="callPhone(detailCourse)"></image>
					</view>
				</view>
				<view class="popup-button">
					<van-button custom-style="height:90rpx;width:513rpx;" type="info" round @click="onRefund">结课</van-button>
				</view>
				<view class="tips-bottom">
					注：如已联系退费，请点击结课
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import course from '../../js/api/course/index.js'
	export default {
		data() {
			return {
				RefundPopup:false,
				customBarH:	uni.getSystemInfoSync().statusBarHeight,
				detailCourse:{},
				myid:null,
				identity_check:""
			};
		},
		onLoad(option) {
			this.myid = option.id
			course.getInfodetail(this)
			this.identity_check = uni.getStorageSync("identity_check")
		},
		methods:{
			// 转移课时
			navigationToTransfer(){
				let data = JSON.stringify(this.detailCourse)
				uni.navigateTo({
					url:"transfer?list=" + data
				})
			},
			//返回
			navigationBack(){
				uni.navigateBack({})
			},
			//打电话
			callPhone(item){
				uni.makePhoneCall({
					phoneNumber:item.orgPhone
				})
			},
			// 退费
			onRefund(){
				course.reFund1(this)
			},
			// 续费
			onRenew(){
				let obj =JSON.stringify(this.detailCourse)
				uni.navigateTo({
					url:"./addCourse?title=一键续课&list=" + obj
				})
			},
		},
	}
</script>
<style>
	page{
		background-color: #F8F8F8;
	}
	.field-index--van-field{
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		border-radius: 30rpx;
	}
	.van-cell:after{
		border-bottom: none !important;
	}
	.van-icon-arrow-left:before {
		/* vertical-align: middle; */
		margin: 0 25rpx;
	}
	.labelclass{
		max-width: none !important;
	}
</style>
<style lang="scss">
	[v-cloak]{
		display: none;
	}
	.xiao-overly{
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 28rpx;
		z-index: 9;
	}
	.xiao-popup{
		width: 590rpx;
		height: 625rpx;
		background-color: #FFFFFF;
		border-radius: 30rpx;
		box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.06);
		.popup-label{
			position: relative;
			top: -235rpx;
			text-align: center;
			color: #FFFFFF;
			.surplusprice{
				font-size: 82rpx;
				margin-top: 3rpx;
			}
		}
		.education-popup{
			margin-top: -115rpx;
			padding: 0 49rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.edction-name{
				display: inline-block;
				padding-right: 14rpx;
			}
			.phone{
				vertical-align: middle;
			}
		}
		.popup-button{
			width: 513rpx;
			height: auto;
			margin: 0 auto;
			margin-top: 63rpx;
			margin-bottom: 24rpx;
		}
		.tips-bottom{
			font-size: 26rpx;
			color: #909090;
			text-align: center;
		}
	}
	.custom{
	  position: fixed;
	  // width: 100%;
	  top: var(--status-bar-height);
	  left: 0;
	  height: auto;
	  z-index: 999;
	}
	
	.custom text{
	  color: #fff;
	  font-size: 33rpx;
	  font-weight: 500;
	  max-width: 280rpx;
	  top: 60rpx;
	  vertical-align: super;
	}
	.topback{
		width: 750rpx;
		position: relative;
		height: 479rpx;
		image{
			width: 750rpx;
			height: 422rpx;
		}
		.top-box{
			position: absolute;
			top: 174rpx;
			left: 24rpx;
			right: 24rpx;
			width: 702rpx;
			.course{
				// width: 100%;
				font-family: PingFang SC;
				color: #FFFFFF;
				margin-left: 30rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.course-name{
					font-size: 48rpx;
					font-weight: bold;
				}
				
				.baby-name{
					// width: 130rpx;
					// height: 41rpx;
					border: 1rpx solid #FFFFFF;
					border-radius: 30rpx;
					font-size: 26rpx;
					font-weight: 300;
					margin-left: 22rpx;
					padding: 6rpx 16rpx;
					line-height: 36rpx;
				}
			}
			
		}
	}
	.education-info{
		width: 702rpx;
		height: auto;
		margin:0 auto;
		background: #FFFFFF;
		box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.08);
		border-radius: 30rpx;
		margin-top: 20rpx;
		padding: 20rpx 0;
		position: relative;
		font-family: PingFang SC;
		.bottomline{
			width: 642rpx;
			height: 1px;
			margin: 0 auto;
			margin-top: 20rpx;
			background-color: #ebedf0;
		}
		.phone{
			width: 44rpx;
			height: 44rpx;
			vertical-align: middle;
		}
	}
	.class-time{
		width: 702rpx;
		height: 204rpx;
		margin:0 auto;
		background: #FFFFFF;
		box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.08);
		border-radius: 30rpx;
		margin-top: 29rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: relative;
		font-family: PingFang SC;
		.time-items{
			width: 188rpx;
			text-align: center;
			font-size: 48rpx;
			font-weight: bold;
			color: #333333;
			view:nth-child(2){
				font-size: 28rpx;
				font-weight: 500;
				color: #666666;
			}
			view:nth-child(1){
				overflow: auto;
			};
		}
	}
	.footer{
		margin: 76rpx 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		button{
			margin: 0 10rpx;
		}
	}
	
	.list {
		padding-bottom: 20rpx;
		margin: 0 30rpx;
		margin-top: 10rpx;
		border-bottom: 1px solid #eee;
	}
	
	.list:last-child{
		border: none;
	}
	
	.list .title {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #646566;
		display: inline-block;
	}

	.list .content {
		display: inline-block;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #909090;
		padding-top: 10rpx;
		word-break: break-all;
	}
	
	.list .jiantou {
		width: 10rpx;
		height: 18rpx;
		display: block;
		margin-left: 17rpx;
	}
	
	.eil{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
