<template>
	<view v-cloak>
		<view class="main">
			<view class="list">
				<view class="title">课程名称</view>
				<view class="content">
					{{list.className}}
				</view>
			</view>
			<view class="list" @click="open">
				<view class="title">选择加课日期</view>
				<view class="content">
					{{classDate || '请选择日期'}}
					<image class="jiantou" src="../../static/images/more-ic.png" mode="">
				</view>
			</view>
			<!-- <van-popup
				round
				:show="showClassDate"
				@click-overlay="this.showClassDate = false"
				position="bottom"
			>
				<van-datetime-picker
					:value="currentDate"
					type="date"
					title="请选择上课日期"
					@confirm="onDatetime"
					@cancel="this.showClassDate = false"
				/>
			</van-popup> -->
			<uni-calendar
				ref="calendar"
				:insert="false"
				@confirm="onConfirmtDate()"
			     />
			<view class="list" @click="onClassTime">
				<view class="title">上课时间</view>
				<view class="content">
					{{classTime || '请选择时间'}}
					<image class="jiantou" src="../../static/images/more-ic.png" mode="">
				</view>
			</view>
			<van-popup
				round
				:show="showClassTime"
				@click-overlay="this.showClassTime = false"
				position="bottom"
			>
				<van-picker id="picker"
					:show-toolbar="true"
					:columns="columns" 
					swipe-duration="500"
					title="请选择起止时间"
					@change="autoChange"
					@confirm="onConfirmtime"
					@cancel="this.showClassTime = false"/>
			</van-popup>
			<view class="list">
				<view class="title">管理机构</view>
				<view class="content">
					{{list.organizationName}}
				</view>
			</view>
			<view class="list">
				<view class="title">扣除课时</view>
				<view class="content">
					{{list.deductHour}}
				</view>
			</view>
			<view class="list">
				<view class="title">上课宝宝</view>
				<view class="content">
					{{list.babyName}}
				</view>
			</view>
		</view>
		<view class="preservation" @click="onAddClass">保存</view>
	</view>
</template>

<script>
	import common from "../../js/common/common.js"
	import index from "../../js/api/course/index.js"
	
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	export default {
		components: {
			uniCalendar
		},
		data() {
			return {
				list:{},
				classTime:'',
				classDate:'',
				showClassTime:false,
				showClassDate:false,
				columns:[{
					values:[],
					defaultIndex:0,
				},{
					values:[],
					defaultIndex:0,
				},{
					values:['~'],
					defaultIndex:0,
				},{
					values:[],
					defaultIndex:2,
				},{
					values:[],
					defaultIndex:0,
				}],
				currentDate:new Date().getTime()
			};
		},
		onLoad(option) {
			this.list = JSON.parse(option.list)
			this.timeInit()
		},
		methods:{
			autoChange(e){
				console.log(e)
				if(e.target.index != 0){
					return
				}
				let items = []
				let currentIndex = this.$mp.page.selectComponent("#picker").getColumnIndex(0)
				currentIndex = currentIndex + 1
				this.$mp.page.selectComponent("#picker").setColumnIndex(3,currentIndex)
			},
			open(){
				this.$refs.calendar.open();
			},
			onConfirmtDate(e){
				this.classDate = e.fulldate
			},
			timeInit(){
				for(let i = 6;i < 24;i++){
					let hour = (i < 10 ? '0' + i : i ) + '时'
					this.columns[0].values.push(hour)
					this.columns[3].values.push(hour)
				}
				for(let i = 0;i < 60;i++){
					if(i % 5 == 0){
						let minute = (i < 10 ? '0' + i : i ) + '分'
						this.columns[1].values.push(minute)
						this.columns[4].values.push(minute)
					}
				}
			},
			// 选择加课日期
			onClassDate(){
				this.showClassDate = true
			},
			// 上课时间
			onClassTime(){
				this.showClassTime = true
			},			
			// 时间段确定
			onConfirmtime(event){
				let array = event.detail.value.toString().split(',')
				let arr = []
				array.forEach(item => {
					arr.push(item.replace(/时|分/,''))
				})
				
				let munite = parseInt(arr[3] +''+ arr[4]) - parseInt(arr[0] +''+ arr[1]) <= 0
				
				if(munite){
					this.$message("请选择正确时间")
					return
				}
				
				this.classTime  = arr[0] + ':' + arr[1] + arr[2] +  arr[3] + ':' + arr[4]
				this.showClassTime = false
			},
			
			// 上课日期弹窗
			onDatetime(event){
				this.classDate = common.formatDate(event.detail)
				this.showClassDate = false
			},
			onAddClass(){
				index.addClass(this)
			}
		}
	}
</script>

<style lang="scss">
	[v-cloak]{
		display: none;
	}
	page {
		background-color: #F8F8F8;
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
		margin: 0 30rpx;
		height: 102rpx;
		border-bottom: 1px solid #eee;
	}
	
	.list:last-child {
		border: none;
	}
	
	.list .title {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #323232;
	}
	
	.list .content {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #909090;
	}
	
	.list input {
		height: 102rpx;
		width: 220rpx;
		padding-left: 20rpx;
		border: none;
		background: #fff;
		font-size: 29rpx;
		font-family: PingFang SC;
		color: #b4b4b4;
		text-align: right;
	}
	
	.list .portrait {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: block;
	}
	
	.list .jiantou {
		width: 10rpx;
		height: 18rpx;
		display: block;
		margin-left: 17rpx;
	}
	
	.preservation {
		margin: 69rpx auto;
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
