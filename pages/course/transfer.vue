<template>
	<view v-cloak>
		<view class="custom" :style="{top:customBarH*2 + 15 + 'rpx'}">
			<van-icon @click="navigationBack" size="50rpx" color="#fff" name="arrow-left" />
			<text>转移剩余课时</text>
		</view> 
		<!-- 头部背景 -->
		<view class="topback">
			<image src="/static/images/back.png" mode=""></image>
			<view class="top-box">
				<view class="course">
					<view class="eil" style="max-width: 50%;">
						<text class="course-name">{{courseList.name}}</text>
					</view>
					<text class="baby-name eil" style="max-width: 15.3%;">{{courseList.babyName}}</text>
				</view>
				<view class="class-time">
					<view class="time-items">
						<view>{{courseList.totalClassHour}}</view>
						<view>总课时</view>
					</view>
					<view class="time-items">
						<view>{{courseList.usedHour}}</view>
						<view>已上课时</view>
					</view>
					<view class="time-items">
						<view>{{courseList.restHour}}</view>
						<view>剩余课时</view>
					</view>
					<view class="time-tips" v-if="courseList.isEndTip == 1 && courseList.state == 10">
						即将结课
					</view>
				</view>
			</view>
		</view>
		<view class="class-time" style="margin-top: 12rpx;">
			<view class="time-items">
				<view>{{courseList.totalPrice}}</view>
				<view>总费用(元)</view>
			</view>
			<view class="time-items">
				<view>{{courseList.usedPrice}}</view>
				<view>已上费用</view>
			</view>
			<view class="time-items">
				<view>{{courseList.restPrice}}</view>
				<view>剩余费用</view>
			</view>
		</view>
		<!-- 转移课时显示内容 -->
		<view class="education-info" style="margin-top: 20rpx;">
			<view @click="onChoose">
				<van-field
					label="转入课程"
					:value="transCourse.name"
					readonly 
					is-link 
					placeholder="请选择" 
					input-align="right"
					label-class="labelclass">
				</van-field>
			</view>
			<view class="bottomline" style="margin-top: 0rpx;"></view>
			<van-field
				label="转移课时数" 
				type="number"
				:value="transCourse.hour"
				@change="onHour"
				placeholder="请输入转移课时数" 
				custom-style="padding-top:30rpx;border-bottom-left-radius: 30rpx;border-bottom-right-radius: 30rpx;"
				input-align="right"/>
			<!-- <view class="transfer-tips">只允许转至同机构、同宝宝的其它课程</view> -->
		</view>
		<view class="footer">
			<van-button 
				round
				custom-style="width:604rpx;height:90rpx" 
				type="info" @click="onTransfer">确定
			</van-button>
		</view>
		<!-- 课程列表 -->		
		<van-popup :show="showPopup"
			 round
			 @click-overlay="showPopup = false"
			 custom-style="max-height:40%"
			 position="bottom">
			 <view class="my-picker">
				<view class="aency-items" v-for="item,index in list" :key="index" @click="onConfirm(item)">
					<text>{{item.name}}</text>
				</view>
			</view>
			<!-- <view class="backcover"></view> -->
			<!-- <view class="newaddbutton">
				<view class="">
					<van-icon name="add-o" />
					<text>新增</text>
				</view>
			</view> -->
		</van-popup>
	</view>
</template>

<script>
	import course from "../../js/api/course/index.js"
	export default {
		data() {
			return {
				customBarH:	uni.getSystemInfoSync().statusBarHeight,
				RefundPopup:false,
				showPopup:false,
				courseList:{},
				list:[],
				transCourse:{
					name:'',
					id:'',
					hour:''
				},
				isClick:false
			};
		},
		onLoad(option){
			this.courseList = JSON.parse(option.list)
			this.transCourse.hour = option.moveHours
			course.getTransferCourse(this)
		},
		methods:{
			//返回
			navigationBack(){
				uni.navigateBack({})
			},
			//打电话
			callPhone(item){
				uni.makePhoneCall({
					phoneNumber:item.tel
				})
			},
			// 转移课时
			onTransfer(){
				if(this.isClick){
					return
				}
				
				this.isClick = true
				course.transfer(this)
			},
			onConfirm(item){
				this.transCourse.name = item.name
				this.transCourse.id = item.id
				this.showPopup = false
			},
			onChoose(){
				if(this.list.length == 0){
					this.$message("只允许转至同机构、同宝宝的其它课程")
				}else
					this.showPopup = true;
			},
			onHour(event){
				// if(parseInt(event.detail) > this.courseList.restHour){
				// 	this.$message('转移课时数不能大于剩余课时数')
				// 	return
				// }
				this.transCourse.hour = event.detail
			}
		}
	}
</script>
<style>
	page{
		background-color: #F8F8F8;
	}
	.field-index--van-field{
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}
	.van-cell:after{
		border-bottom: none !important;
	}
	.van-icon-arrow-left:before {
		/* vertical-align: middle; */
		margin: 0 25rpx;
	}
	.van-cell{
		height: 102rpx !important;
		padding-top: 27rpx !important;
	}
</style>
<style lang="scss">
	[v-cloak]{
		display: none;
	}
	.custom{
	  position: fixed;
	  width: 100%;
	  top: var(--status-bar-height);
	  left: 0;
	  height: auto;
	  z-index: 999;
	}
	
	.my-picker{
		overflow-y:auto;
		width: 100%;
		max-height: 500rpx;
		.aency-items{
			border-bottom: 1px solid #eeee;
			width: 100%;
			height: 24rpx;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #333333;
			padding: 39rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}
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
		width: 100%;
		position: relative;
		height: 479rpx;
		image{
			width: 100%;
		}
		.top-box{
			position: absolute;
			top: 174rpx;
			left: 24rpx;
			right: 24rpx;
			width: 702rpx;
			.course{
				width: 100%;
				font-family: PingFang SC;
				color: #FFFFFF;
				display: flex;
				align-items: center;
				margin-left: 30rpx;
				.course-name{
					font-size: 48rpx;
					font-weight: bold;				
				}
				.baby-name{
					vertical-align: middle;
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
		height: 204rpx;
		margin:0 auto;
		background: #FFFFFF;
		box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.08);
		border-radius: 30rpx;
		margin-top: 25rpx;
		// padding-top: 21rpx;
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
		.transfer-tips{
			position: absolute;
			top: 97rpx;
			right: 103rpx;
			width: 497rpx;
			height: 50rpx;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 25rpx;
			font-size: 26rpx;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 48rpx;
			text-align: center;
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
			}
		}
		.time-tips{
			position: absolute;
			top: 16rpx;
			right: 11rpx;
			width: 94rpx;
			height: 40rpx;
			background: #FB6362;
			border-radius: 20rpx 6rpx 10rpx 0px;
			font-size: 20rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
			line-height: 38rpx;
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
	
	.eil{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
