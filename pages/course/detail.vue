<template>
	<view v-cloak>
		<view class="course">
			<van-cell-group>
				<van-field :value="detailCourseList.className" input-class="inputclass" label="课程名称" readonly input-align="right"/>
				<van-field :value="detailCourseList.babyName" input-class="inputclass" label="上课宝宝" readonly  input-align="right"/>
				<van-field :value="detailCourseList.week + ' ' +detailCourseList.classTime" input-class="inputclass" label="上课时间" readonly  input-align="right"/>
				<van-field 
					:value="status" 
					input-class="inputclass" 
					label="课程状态" 
					readonly  
					input-align="right"/>
				<van-field :value="detailCourseList.deductHour" input-class="inputclass" label="扣课时数" readonly input-align="right"/>
				<van-field :value="detailCourseList.totalClassHour" input-class="inputclass" label="总课时" readonly input-align="right"/>
				<van-field :value="detailCourseList.restHour" input-class="inputclass" label="剩余课时" readonly input-align="right">
					<template #right-icon >
						<view class="right-icon" v-if="detailCourseList.isEndTip == 1 && detailCourseList.classState == 10" @click="onRenew()">续费</view>
					 </template>
				</van-field>
				<van-field :value="detailCourseList.organizationName" input-class="inputclass" label="机构名称" readonly input-align="right">
					<template #right-icon>
						<image v-if="!!detailCourseList.organizationPhone" class="right-call" src="/static/images/dinah-ic.png" mode="" @click="callPhone(detailCourseList)"></image>
					</template>
				</van-field>
				<!-- <van-field :value="detailCourseList.remark" input-class="inputclass" label="备注" readonly input-align="right"/> -->
				<view class="list">
					<view class="title">备注</view>
					<view  class="content">{{ detailCourseList.remark }}</view>
				</view>
			</van-cell-group>
		</view>
		<view class="footer">
			<van-button round block type="info" @click="changeCrouse" v-show="identity_check == 10 || identity_check == 20" v-if="detailCourseList.state == 10">课程变更</van-button>
			<van-button round block type="info" @click="evaluateCrouse" v-if="detailCourseList.state == 20 && !detailCourseList.evaluate">课程评价</van-button>
			<van-popup :show="showPopup"
				 round
				 safe-area-inset-bottom
				 @click-overlay="showPopup = false"
				 position="bottom"
			>
				 <view class="my-picker">						 
					<view class="aency-items" v-for="item,index in courseState" :key="index" @click="bindStateChange(index)">
						<text>{{item}}</text>
					</view>
				 </view>
				 <view class="cancelbutton" @click="showPopup = false">
				 	<view class="">
				 		<text>取消</text>
				 	</view>
				 </view>
			</van-popup>
		</view>
		<!-- 自定义弹窗 -->
		<van-popup round :show="isLeave" @close="onClose">
			<view class="del-popup" v-if="isLessons">
				<view class="content">后续是否补课？</view>
				<view class="del-btn">
					<view @click="leaveCancel1">否</view>
					<view @click="leaveItem1">是</view>
				</view>
			</view>
			<view class="del-popup" v-if="!isLessons">
				<view class="content">是否仍扣除课时？</view>
				<view class="del-btn">
					<view @click="leaveCancel2">否</view>
					<view @click="leaveItem2">是</view>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import course from "../../js/api/course/index.js"
	export default {
		data() {
			return {
				detailCourseList:{},
				detailCourse:{},
				courseState:['加课','请假','调课'],
				showPopup:false,
				myid:'',
				id:'',
				isLeave:false,
				isLessons:true,
				identity_check:''
			}
		},
		computed:{
			status(){
				return this.detailCourseList.state == 10 ? '待上课' : this.detailCourseList.state == 20 ? '已完成' : '已取消' 
			}
		},
		onLoad(option) {
			this.myid = option.classid
			this.id = option.id
		},
		onShow() {
			this.getInfo()
			this.identity_check = uni.getStorageSync("identity_check")
		},
		methods: {
			// 续费
			onRenew(){
				course.getInfodetail(this)
				setTimeout(()=>{
					let obj = JSON.stringify(this.detailCourse)
					uni.navigateTo({
						url:"./addCourse?title=一键续课&list=" + obj
					})
				},500)
			},
			getInfo(){
				course.detail(this)
			},
			// 打电话
			callPhone(item){
				uni.makePhoneCall({
					phoneNumber:item.organizationPhone
				})
			},
			changeCrouse(){
				this.showPopup = true
			},
			bindStateChange(index){
				let obj = JSON.stringify(this.detailCourseList)
				if(index == 0){
					// 加课
					uni.navigateTo({
						url:"addClasses?list=" + obj
					})
				}else if(index == 1){
					// 请假
					this.isLeave = true
				}else{
					// 调课
					uni.navigateTo({
						url:"changeCourse?list=" + obj
					})
				}
				this.showPopup = false
			},
			evaluateCrouse(){
				uni.navigateTo({
					url:"evaluateCourse?id=" + this.detailCourseList.id
				})
			},
			// 弹窗1否
			leaveCancel1(){
				this.isLessons = false
			},
			// 弹窗1是
			leaveItem1(){
				let obj = JSON.stringify(this.detailCourseList)
				uni.navigateTo({
					url:"changeCourse?list=" + obj
				})
			},
			// 弹窗2否
			leaveCancel2(){
				this.detailCourseList.isDeduct = 0
				course.leave(this.detailCourseList,this)
				uni.navigateBack({})
			},
			// 弹窗2是
			leaveItem2(){
				this.detailCourseList.isDeduct = 1
				course.leave(this.detailCourseList,this)
				uni.navigateBack({})
			},
			onClose(){
				this.isLeave = false
			}
		},
	}
</script>
<style>
	page{
		background-color: #F8F8F8;
	}
	.inputclass{
		font-size: 28rpx !important;
		font-family: PingFang SC !important;
		/* font-weight: 500 !important; */
		color: #909090 !important;
	}
	.van-field__clear-root, .van-field__icon-container{
		padding: 0 10rpx !important;
	}
	.van-cell{
		height: 102rpx !important;
		padding-top: 27rpx !important;
		border-radius: 30rpx;
	}
</style>
<style lang="scss" scoped>
	[v-cloak]{
		display: none;
	}
	.course{
		width: 702rpx;
		// padding-top: 18rpx;
		padding-bottom: 28rpx;
		margin: 20rpx auto;
		background: #FFFFFF;
		box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.06);
		border-radius: 30rpx;
		position: relative;
	}
	
	.right-icon{
		width: 90rpx;
		height: 46rpx;
		background: #FFFFFF;
		border: 1px solid #FB6462;
		border-radius: 30rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FB6462;
		line-height: 48rpx;
		position: absolute;
		right: 105rpx;
		bottom: 20rpx;
		z-index: 9;
		text-align: center;
	}
	.right-call{
		width: 44rpx;
		height: 44rpx;
		padding-right: 10rpx !important;
		padding-top: 5rpx !important;
	}
	.footer{
		margin: 65rpx 72rpx;
		// .my-picker{
		// 	overflow-y:auto;
		// 	width: 100%;
		// 	height: 400rpx;
		// }
		.aency-items{
			border-bottom: 1px solid #eeee;
			width: 100%;
			height: 54rpx;
			text-align: center;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #333333;
			padding: 39rpx 0;
		}
		
		.aency-items:last-child{
			border-bottom: 4px solid #eeee;
		}
		// .backcover{
		// 	width: 100%;
		// 	height: 20rpx;
		// 	background-color: #F8F8F8;
		// }
		.cancelbutton{
			width: 100%;
			height: 110rpx;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: 500;
			text-align: center;
			cursor: pointer;
			line-height: 117rpx;
		}
	}
	
	.list {
		margin: 0 30rpx;
		// height: 102rpx;
		margin-top: 28rpx;
	}
	
	.list .title {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #646566;
	}
	
	.list .content {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #909090;
		margin-top: 10rpx;
	}
	
	
	.del-popup {
		border-radius: 50rpx;
		width: 620rpx;
		font-size: 32rpx;
		text-align: center;
		font-family: PingFang SC;
		font-weight: 500;
		color: #343434;
		padding-top: 60rpx;
		line-height: 70rpx;
		.content{
			padding-bottom: 30rpx;
		}
	}
	
	.del-btn {
		display: flex;
		align-items: center;
		margin-top: 20rpx;
	}
	
	.del-btn view {
		text-align: center;
		width: 50%;
		line-height: 100rpx;
		border-top: 1px solid #ccc;
	}
	
	.del-btn view:first-child {
		border-right: 1px solid #ccc;
	}
</style>
