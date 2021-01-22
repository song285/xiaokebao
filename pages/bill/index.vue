<template>
	<view>
		<view class="select_box">
			<!-- <evan-checkbox-popup :options="baseInfo.babyList" :max="1" @objConfirm.stop="onConfirmBaby">
				{{ selectedBaby }}<van-icon custom-style="margin-left:5rpx;bottom:-4rpx;" name="arrow-down" />
			</evan-checkbox-popup>
			<evan-checkbox-popup :options="baseInfo.orgList" :max="1" @objConfirm.stop="onConfirmOrg">
				{{ selectedOrg }}<van-icon custom-style="margin-left:5rpx;bottom:-4rpx;" name="arrow-down" />
			</evan-checkbox-popup> -->
			<view class="top-item" @click="showBaby = true">
				<view class="eli" style="max-width: 117rpx;">
					{{ selectedBaby }}
				</view>
				<van-icon custom-style="margin-left:7rpx;bottom:-2rpx;font-size:26rpx" name="arrow-down" />
			</view>
			<van-popup :show="showBaby"
				 @click-overlay="showBaby = false"
				 custom-style="height:40%"
				 position="bottom">
				 <view class="top-tab">
					 <!-- <view class="cancelButton" @click="showBaby = false">取消</view> -->
					 <view style="text-align: center;">
					 	请选择宝宝
					 </view>
					 <!-- <view class="newaddButton" @click="toAddBaby" v-if="babyList.length >= 6 ? false : true">新增</view> -->
				 </view>
				 <view class="my-picker">
					<view class="aency-items" v-for="item,index in baseInfo.babyList" :key="index" @click="bindBabyChange(item)">
						<text>{{item.label}}</text>
					</view>
				</view>
			</van-popup>
			
			<view class="top-item" @click="showOrg = true">
				<view class="eli" style="max-width: 117rpx;">
					{{ selectedOrg }}
				</view>
				<van-icon custom-style="margin-left:7rpx;bottom:-2rpx;font-size:26rpx" name="arrow-down" />
			</view>
			<van-popup :show="showOrg"
				 @click-overlay="showOrg = false"
				 custom-style="height:40%"
				 position="bottom">
				 <view class="top-tab">
					 <!-- <view class="cancelButton" @click="showOrg = false">取消</view> -->
					 <view style="text-align: center;">
					 	请选择机构
					 </view>
					 <!-- <view class="newaddButton" @click="toAddBaby" v-if="babyList.length >= 6 ? false : true">新增</view> -->
				 </view>
				 <view class="my-picker">
					<view class="aency-items" v-for="item,index in baseInfo.orgList" :key="index" @click="bindOrgChange(item)">
						<text>{{item.label}}</text>
					</view>
				</view>
			</van-popup>
			
			<evan-checkbox-popup :options="baseInfo.classList" @confirm.stop="onConfirmClas" title="请选择课程">
				{{ selectedCro }}<van-icon custom-style="margin-left:7rpx;bottom:-2rpx;font-size:26rpx" name="arrow-down" />
			</evan-checkbox-popup>
			<view class="showall" @click="showall">
				查看全部
			</view>
		</view>
		<view class="main_box">
			<view class="date_box">
				<view class="date" @click="open">
					{{ currentYear }}年{{ currentMonth }}月<van-icon custom-style="margin-left:5rpx;bottom:-4rpx;" size="20rpx" name="arrow-down" />
				</view>
				<view class="date_label" v-if="postdata.weekstart">
					{{ `${postdata.weekstart} ` }}
					<text v-if="postdata.weekend"> {{ `~ ${postdata.weekend }`}}</text>
				</view>
			</view>
			<view class="total_price" v-if="billDate.length > 0">
				<view class="total_inner_box">
					<view class="title">总计(元)</view>
					<view class="data">{{ billTotal.totalPrice }}</view>
				</view>
				<view class="total_inner_box">
					<view class="title">已用(元)</view>
					<view class="data">{{ billTotal.usedPrice }}</view>
				</view>
				<view class="total_inner_box">
					<view class="title">剩余(元)</view>
					<view class="data">{{ billTotal.restPrice }}</view>
				</view>
				<view class="total_inner_box">
					<view class="title">课时总计(节)</view>
					<view class="data">{{ billTotal.totalClassHour }}</view>
				</view>
				<view class="total_inner_box">
					<view class="title">已用课时(节)</view>
					<view class="data">{{ billTotal.usedHour }}</view>
				</view>
				<view class="total_inner_box">
					<view class="title">剩余课时(节)</view>
					<view class="data">{{ billTotal.restHour }}</view>
				</view>
			</view>
			<view class="course_list_box" v-for="item,index in billDate">
				<view class="title_box">
					<view class="left">
						<view class="baby eli" :style="{'border-color':item.babyColor,'color':item.babyColor}">{{ item.babyName }}</view>
						<view class="course_name eli">{{ item.name }}</view>
					</view>
					<view class="right eli">
						{{ item.orgName }}
					</view>
				</view>
				<view class="detail_box">
					<view class="course_price">课程价格：<text style="color: #666666;">￥{{ item.totalPrice }}({{ item.totalClassHour }}个课时)</text></view>
					<view class="other_info">
						<view class="">
							已用：<text style="color: #666666;">￥{{ item.usedPrice }}({{ item.usedHour }}个课时)</text>
						</view>
						<view class="">
							剩余：<text style="color: #666666;">￥{{ item.restPrice }}({{ item.restHour }}个课时)</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="billDate.length == 0 || billDate.length == 0" class="noDate">
			没有查询到数据
		</view>
		
		<!-- 加载更多 -->
		<!-- <uni-load-more v-if="billDate.length > 0" :status="moreStatus" @clickLoadMore="loadMore"></uni-load-more> -->
		<view style="padding-bottom: 150rpx;height: 1rpx;"></view>
		<!-- 底部导航 -->
		<Footer></Footer>
		<uni-calendar
			ref="calendar"
			:range="true"
			:insert="false"
			@confirm="onConfirmtDate()"
		     />
	</view>
</template>

<script>
	import bill from '../../js/api/bill/bill.js'
	import common from '../../js/common/common.js'
	
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	export default {
		components: {
			uniCalendar
		},
		data() {
			return {
				start:0,
				length:'',
				currentYear:'',
				currentMonth:'',
				baseInfo:[],
				selectedBaby:'宝宝',
				selectedOrg:'机构',
				selectedCro:'课程',
				moreStatus:"noMore",
				postdata:{
					babyId:'',
					orgId:'',
					classId:'',
					weekstart:'',
					weekend:''
				},
				billDate:'',
				billTotal:'',
				isClick:false,
				showOrg:false,
				showBaby:false
			};
		},
		onLoad() {
			uni.hideHomeButton()
		},
		onShow() {
			bill.baseInfo(this)
			bill.getBill(this)
			this.dateInit()
			this.$store.commit("choiceFooter",3)
			this.billDate = ''
		},
		onShareAppMessage: function(options) {
			return {
				title: '小马消课',
				desc: '小马消课',
				// path: '/pages/index/login?userId=' + this.shareid ,// 路径，传递参数到指定页面。
				imageUrl: '/static/images/sharepic.png'
			}
		},
		methods:{
			bindBabyChange(item){
				this.selectedBaby = item.label
				this.showBaby = false
				
				this.postdata.babyId = item.value
				this.start = 0
				this.billDate = []
				bill.getBill(this)
			},
			bindOrgChange(item){
				this.selectedOrg = item.label
				this.showOrg = false
				
				this.postdata.orgId = item.value
				this.start = 0
				this.billDate = []
				bill.getBill(this)
			},
			showall(){
				this.postdata = {
					babyId:'',
					orgId:'',
					classId:'',
					weekstart:'',
					weekend:''
				}
				this.selectedBaby = '宝宝'
				this.selectedOrg = '机构'
				this.dateInit()
				this.start = 0
				this.billDate = []
				bill.getBill(this)
			},
			dateInit(){
				let now = new Date()
				this.currentYear = now.getFullYear()
				this.currentMonth = now.getMonth() +1
			},
			// 加载更多
			loadMore(){
				if(this.moreStatus != 'more'){
					return
				}
				this.moreStatus = "loading"
				bill.getBill(this)
			},
			onConfirmtDate(e){
				if(!common.checkLogin(this)){
					return
				}
				let checkSatrtDate = new Date(e.range.after) - new Date(e.range.before)
				if(checkSatrtDate < 0) {
					this.postdata.weekstart = e.range.after || e.fulldate
					this.postdata.weekend = e.range.before || e.fulldate
				}else{
					this.postdata.weekstart = e.range.before || e.fulldate
					this.postdata.weekend = e.range.after || e.fulldate
				}
				this.currentYear = e.year
				this.currentMonth = e.month
				this.start = 0
				this.billDate = []
				bill.getBill(this)
			},
			open(){
				if(!common.checkLogin(this)){
					return
				}
				this.$refs.calendar.open();
			},
			// 切换导航
			onChange(item, index) {
				if(index == this.active) return
				this.active = index
				uni.redirectTo({
					url: item.page
				})
			},
			onConfirmBaby(e){
				this.selectedBaby = e[0].label
				this.postdata.babyId = e[0].value
				this.start = 0
				this.billDate = []
				bill.getBill(this)
			},
			onConfirmOrg(e){
				this.selectedOrg = e[0].label                                                                                                                                                                                                                 
				this.postdata.orgId = e[0].value
				this.start = 0
				this.billDate = []
				bill.getBill(this)
			},
			onConfirmClas(e){
				console.log(e)
				e.forEach(e => {
					this.postdata.classId = [...this.postdata.classId, ...this.baseInfo.classList[e].value];
				})
				// this.postdata.classId = e
				this.start = 0
				this.billDate = []
				bill.getBill(this)
			},
		}
	}
</script>

<style>
	page{
		background-color: #F8F8F8;
	}
	.van-tabbar{
		height: 120rpx !important;
		box-shadow: 0px 7rpx 21rpx 0px rgba(0, 0, 0, 0.18) !important;
	}
</style>

<style lang="scss" scoped>
	.top-item{
		display: flex;
		justify-content: center;
		align-items: center;
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
	.showall{
		font-size: 24rpx;
		color: #007AFF;
	}
	.noDate{
		color: #909090;
		text-align: center;
		margin: 50rpx;
	}
	.select_box{
		background-color: #fff;
		height: 88rpx;
		display: flex;
		box-shadow: 0px 0px 5rpx 0px rgba(0, 0, 0, 0.06);
		justify-content: space-around;
		align-items: center;
		font-family: PingFang SC;
		font-size: 28rpx;
		color: #323233;
		position: sticky;
		top: 0;
		z-index: 1;
	}
	.main_box{
		margin: 0 24rpx;
	}
	.date_box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		font-weight: 500;
		.date{
			width: 204rpx;
			height: 60rpx;
			background: #FFFFFF;
			border: 1rpx solid #EEEEEE;
			border-radius: 30rpx;
			font-size: 22rpx;
			color: #333333;
			line-height: 57rpx;
			text-align: center;
		}
		.date_label{
			font-size: 22rpx;
			color: #B4B4B4;
			line-height: 36rpx;
		}
	}
	.total_price{
		width: 702rpx;
		padding-top: 56rpx;
		margin: 0 auto;
		background: #FFFFFF;
		box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.06);
		border-radius: 30rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		.total_inner_box{
			width: 200rpx;
			text-align: center;
			font-size: 28rpx;
			color: #666666;
			font-weight: 500;
			margin-bottom: 64rpx;
			.data{
				font-size: 42rpx;
				color: #333333;
				margin-top: 11rpx;
				overflow: auto;
			}
		}
	}
	.course_list_box{
		width: 654rpx;
		padding: 42rpx 24rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #909090;
		line-height: 36rpx;
		margin-top: 20rpx;
		.title_box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				width: 50%;
				.baby{
					// width: 80rpx;
					// height: 28rpx;
					padding: 0rpx 14rpx;
					// line-height: 25rpx;
					background-color: #FFFFFF;
					border-radius: 6rpx;
					color: #FFFFFF;
					font-size: 22rpx;
					margin-right: 14rpx;
					border: 1rpx solid;
				}
				.course_name{
					color: #333333;
					font-weight: bold;
					font-size: 32rpx;
				}
			}
			.right{
				width: 30%;
				text-align: right;
				font-size: 26rpx;
				color: #666666;
			}
		}
		.course_price{
			margin: 24rpx 0 0 0;
		}
		.other_info{
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			view{
				margin-top: 20rpx;
			}
		}
	}
	
	// .course_list_box:last-child{
	// 	margin-bottom: 180rpx;
	// }
</style>
