<template>
	<view class="content" v-cloak>
		<!-- 周日历 -->
		<view class="xiao-calendar" v-if="isMonth">
			<!-- <van-dropdown-menu :overlay="false">
				<van-dropdown-item :class="{popupstyle:isShow}" 
					@change="onChangeMonth" 
					@close="onCloseMonth" 
					@open="onOpenMonth" 
					:value="value" 
					:options="allMonth"
				/>
			</van-dropdown-menu> -->
			<view class="change-week" style="width: 33%;margin-left: 24rpx;" @click="onOpenMonth">
				<view class="second-tem">{{dateValue}}</view>
				<view class="next-week" style="margin-left: -44rpx;">
					<van-icon name="arrow-down" />
				</view>
			</view>
			<!-- <w-picker :visible.sync="isShow" mode="date"
				:current="true" 
				fields="month"
				@confirm="onChangeMonth($event,'date')" 
				@cancel="onCloseMonth" 
				:disabled-after="false" 
				ref="date">
			 </w-picker> -->
			 <van-popup
			 	round
			 	:show="isShow"
			 	@click-overlay="isShow = false"
			 	position="bottom">
				 <van-datetime-picker
					v-if="isShow"
					:value="currentDate"
					type="year-month"
					@confirm="onChangeMonth"
					@cancel="isShow = false"
				 />
			</van-popup>
			<view class="backtoday" v-if="showTodayicon" @click="backToday(0)">今</view>
			<view class="weekcalendar" @click="changeCalType(0)">周日历</view>
			<!-- 月历 -->
			<calendar ref="changeMonth" @xchange="getChangedata" @getSelectedDate="getSelectedDate"></calendar>
		</view>
		<!-- 月日历 -->
		<view class="xiao-calendar" v-if="!isMonth">
			<view class="change-week">
				<view class="pre-week" @click="getPreWeek()">
					<van-icon name="arrow-left" />
				</view>
				<view class="second-tem" @click="open">{{week[0].startEnd}} ~ {{week[week.length-1].startEnd}}</view>
				<view class="next-week" @click="getNextWeek()">
					<van-icon name="arrow" />
				</view>
			</view>
			<view class="backtoday" v-if="showTodayicon" @click="backToday(1)">今</view>
			<view class="monthcalendar" @click="changeCalType(1)">月日历</view>
			<!-- 周日历 -->
			<weekcalendar ref="childinfo" @getSelectedDate="getSelectedDate"></weekcalendar>
			<!-- 宝宝列表 -->
			<van-checkbox-group :value="checkedBaby" @change="chooseBaby" class="select-baby">
				<view v-for="item,index in babyList" :key="index" class="babybox">
					<van-checkbox
						label-class="labelclass eli" 
						icon-size="24rpx" 
						shape="square" 
						:name="item.id"
					>{{item.nickName}}</van-checkbox>
					<view class="hasAction" :style="{'background-color':item.color,'right':item.nickName.length == 2 ? '5rpx' : '-' + item.nickName.length * 6 + 'rpx' }">
						<view class="inner"></view>
					</view>
				</view>
			</van-checkbox-group>
		</view>
		<view class="xiao-calendarback1"></view>
		<view class="xiao-calendarback2"></view>
		<view class="course-list">
			<view class="daily-course" v-html="selectedDate.name"></view>
			<view class="my-course" v-for="item,index in dailyCourse" :key="index" @click="toDetail(item)">
				<view class="baby_avatar">
					<image :src="item.classBabyPic" mode=""></image>
				</view>
				<view class="cou-left">
					<view class="starttime">{{ item.classTime.slice(0,5) }}</view>
					<view class="endtime">{{ item.classTime.slice(-5) }}</view>
				</view>
				<view class="linear-line1"></view>
				<view class="cou-right">
					<view class="cou-name eli">
						<view class="icon" :style="{'background-color':item.babyColor}">
							<view class="dot"></view>
						</view>
						<text class="eli" style="display: inline-block;width: 80%;">{{ item.className }}({{item.babyName}})</text>
					</view>
					<view class="cou-hours">
						<img style="width:26rpx;height: 26rpx;" src="/static/images/koukes-ic.png" alt="">
						<text>扣课时数：{{ item.deductHour }}</text>
					</view>
					<view class="cou-edction">
						<img style="width:25rpx;height: 24rpx;" src="/static/images/jig-icon.png" alt="">
						<text class="eli">机构：{{ item.organizationName }}</text>
					</view>
				</view>
				<view class="cou-state" 
					:class="item.state == 30 || item.state == 20 ? 'finished' : item.state == 11 ? 'classing' : 'cou-state'">
					<text>{{ item.state == 11 ? '上课中' : item.stateStr }}</text>
				</view>
			</view>
			<uni-load-more :status="moreStatus" @clickLoadMore="loadMore"></uni-load-more>
		</view>
		<!-- 右下角添加按钮 -->
		<view v-if="identity_check == 10 || identity_check == 20" class="addicon" @click="toAddCourse">
			<!-- <van-icon size="50rpx" name="plus" /> -->
			<view class="add_icon">添加课程</view>
		</view>
		<Footer></Footer>
		<!-- 点击切换周 -->
		<uni-calendar
			ref="calendar"
			:insert="false"
			@confirm="onConfirmtDate()"
		     />
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	import calendar from '../../wxcomponents/xiao-calendar/xiao-calendar.vue'
	import weekcalendar from '../../wxcomponents/xiao-calendar/weekcalendar.vue'
	
	import home from '../../js/api/index/home.js'
	import common from '../../js/common/common.js'
	import message from '../../js/api/my/message.js'
	
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	export default {
		components:{ calendar,weekcalendar,wPicker,uniCalendar },
		data() {
			return {
				isShow:false,
				isMonth:true,
				isOnLoad:true,
				checkedBaby:[],
				dailyCourse:[],
				currentDate:new Date().getTime(),
				// 选择月份
				value:0,
				dateValue:"",
				postdate:new Date().getFullYear() + '-' + (new Date().getMonth() +1),
				allMonth:[],
				// 周日历
				week:[],
				babyList:[],
				allWeek:[],
				mybaby:[],
				showTodayicon:false,
				selectedDate:{
					name:"当日课程",
					today:{
						fullDate: ''
					}
				},
				start:0,
				length:8,
				moreStatus:"noMore",
				identity_check:'',
				isClick:false
			}
		},
		onLoad(option) {
			uni.hideHomeButton()
			this.formatter()
			this.dateInit()
			
			if(Object.keys(option).length > 0){
				uni.setStorageSync('pId',decodeURIComponent(option.scene))
			}
		},
		onShow() {
			this.getPolling()
			this.$store.commit("choiceFooter",1)
			this.identity_check = uni.getStorageSync("identity_check")
		},
		onShareAppMessage: function(options) {
			return {
				title: '小马消课',
				desc: '小马消课',
				// path: '/pages/index/login?userId=' + this.shareid ,// 路径，传递参数到指定页面。
				imageUrl: '/static/images/sharepic.png'
			}
		},
		methods: {
			open(){
				this.$refs.calendar.open();
			},
			onConfirmtDate(e){
				this.$refs.childinfo.userDefinedWeek(e.fulldate)
				this.week = this.$refs.childinfo.week
				if(e.fulldate == this.selectedDate.today)
					this.showTodayicon = false
				else this.showTodayicon = true
			},
			formatter(){
				let now = new Date()
				let year = now.getFullYear()
				let month = now.getMonth() + 1
				let day = now.getDate()
				let m = month < 10 ? ('0' + month) : month
				let d = day < 10 ? ('0' + day) : day
				let date = {
					fullDate: year + "-" + m + "-" + d
				}
				this.selectedDate.today = date
			},
			// 刷新数据
			getPolling(){
				uni.showLoading({
					title:"加载中",
					mask:true
				})
				common.babyList(this,1,()=>{
					this.courseInfo()
					uni.hideLoading()
				})
				uni.hideLoading()
			},
			courseInfo(){
				if (uni.getStorageSync('userToken')) {
					this.isClick = false
				
					this.dailyCourse = []
					home.getCourse(this)
					home.monthCalCourse(this)
					this.$refs.changeMonth.getBaby()
				}
			},
			// 获取课程列表
			getInfo(){
				if (this.isOnLoad){
					home.getCourse(this)
				}
			},
			// 调整详情页
			toDetail(item){
				if(this.isClick){
					return
				}
				this.isClick = true
				uni.navigateTo({
					url:"../course/detail?id=" + item.id + "&classid=" + item.classId
				})
			},
			// 日历数据初始化
			dateInit(){
				let year = new Date().getFullYear()
				let month = new Date().getMonth()+1
				let day = new Date().getDate()
				month = month < 10 ? "0" + month : month,
				this.dateValue = year + "年" + month + "月"
			},
			// 切换导航
			// tabbarChange(item,index) {
			// 	if(index == this.active) return
			// 	// this.active = index
			// 	uni.redirectTo({
			// 		url:item.page
			// 	})
			// },
			// 控制选择月份弹窗
			onCloseMonth(){
				this.isShow = false
			},
			onOpenMonth(){
				this.isShow = true
			},
			// 选中弹窗内容更新月份
			onChangeMonth(event){
				let now = new Date()
				let year = now.getFullYear()
				let month = now.getMonth()
				let day = now.getDate()
				let chooseDate = common.formatDate(event.detail).split('-')
				let currentYear = parseInt(chooseDate[0])
				
				this.value = chooseDate[1] - 1
				
				this.postdate = currentYear + "-" + chooseDate[1]
				this.dateValue = this.postdate.replace('-','年') + "月"
				
				this.$refs.changeMonth.dateInit(currentYear,this.value)
				this.$refs.changeMonth.getFullDate(currentYear)
				this.$refs.changeMonth.currentIndex = this.value
				this.$refs.changeMonth.year = currentYear
				this.$refs.changeMonth.month = this.value
				this.$refs.changeMonth.active = -1
				this.$refs.changeMonth.isToday = '' + year + (month+1) + day
				
				if(year != currentYear || month != this.value) 
					this.showTodayicon = true
				else this.showTodayicon = false
				
				home.monthCalCourse(this)
				this.$refs.changeMonth.getBaby()
				
				this.isShow = false
			},
			// 选择宝宝
			chooseBaby(event){
				this.checkedBaby = event.detail
				this.$refs.childinfo.checkaBaby = this.checkedBaby
				this.$refs.childinfo.getBabycourse()
				console.log(event)
				console.log("===>",this.babyList)
			},
			// 切换到周日历  0=周日历  1=月日历
			changeCalType(type){
				this.start = 0
				this.formatter()
				this.showTodayicon = false;
				this.selectedDate.name = "当日课程"
				this.dailyCourse = []
				let now = new Date()
				let year = now.getFullYear()
				let month = now.getMonth()
				
				this.postdate = year + '-' + (month+1)
				
				if(type == 0){
					this.isMonth = false
					this.$nextTick(function(){
						this.week = this.$refs.childinfo.week
					})
				}else{
					this.isMonth = true
					this.dateInit()
					this.$nextTick(function(){
						this.$refs.changeMonth.dateInit()
						home.monthCalCourse(this)
						this.$refs.changeMonth.getBaby()
					})
				}
				this.getInfo()
			},
			// 上一周
			getPreWeek(){
				this.$refs.childinfo.getPreWeek()
				this.week = this.$refs.childinfo.week
				let times = this.$refs.childinfo.times
				if(times == 0)
					this.showTodayicon = false
				else this.showTodayicon = true
			},
			// 下一周
			getNextWeek(){
				this.$refs.childinfo.getNextWeek()
				this.week = this.$refs.childinfo.week
				let times = this.$refs.childinfo.times
				if(times == 0)
					this.showTodayicon = false
				else this.showTodayicon = true
			},
			// 返回今天
			backToday(type){
				if(type==0){
					let now = new Date();
					let year = now.getFullYear();
					let month = now.getMonth() + 1;
					let day = now.getDate()
					this.postdate = year + '-' + month
					this.dateValue = year + '年' + month + "月"
					this.$refs.changeMonth.dateInit(year,month-1)
					this.$refs.changeMonth.getFullDate(year)
					this.$refs.changeMonth.currentIndex = month -1
					this.$refs.changeMonth.active = -1
					this.$refs.changeMonth.isToday = '' + year + month + day
					home.monthCalCourse(this)
					this.$refs.changeMonth.getBaby()
				}else{
					this.$refs.childinfo.dataInit()
					this.week = this.$refs.childinfo.week
				}
				
				this.showTodayicon = false
				
				this.selectedDate.name = "当日课程"
				this.dailyCourse = []
				this.formatter()
				this.start = 0
				this.getInfo()
			},
			//联动更新左上角月份信息
			getChangedata(data,y){
				let month = new Date().getMonth()
				let currentYear = new Date().getFullYear()
				this.value = data
				let year = this.postdate.substr(0,4)
				if(y != year) year = y
				this.dateValue = year + '年' + (data+1) + "月"
				this.postdate = year + '-' + ((data+1) < 10 ? '0' + (data+1) : (data+1))
				if(year != currentYear || data != month) 
					this.showTodayicon = true
				else this.showTodayicon = false
				
				console.log(year,currentYear,data,month)
				this.getPolling()
			},
			//联动更新课程日期
			getSelectedDate(data,type){
				this.selectedDate = data
				let now =new Date()
				let year = now.getFullYear()
				let month = now.getMonth()+1
				let day = now.getDate()
				day = day < 10 ? '0' + day : day,
				month = month < 10 ? '0' + month : month
				let date = year +'-'+ month +'-'+ day
				if(data.today.fullDate != date)
					this.showTodayicon = true
				else this.showTodayicon = false
				this.start = 0
				this.getInfo()
				if(type == 1){
					setTimeout(()=>{
						this.$refs.childinfo.isClick = false
						// this.$refs.changeMonth.isClick = false
					},200)
				}else{
					setTimeout(()=>{
						// this.$refs.childinfo.isClick = false
						this.$refs.changeMonth.isClick = false
					},200)
				}
				
			},
			// 添加课程
			toAddCourse(){
				if(!common.checkLogin(this)){
					return
				}
				if(this.isClick){
					return
				}
				this.isClick = true
				message.scribeMessage(this,'../course/addCourse')
			},
			// 加载更多
			loadMore(){
				if(this.moreStatus != "more"){
					return
				}
				this.moreStatus = "loading"
				this.start = this.start + this.length
				this.getInfo()
			}
		}
	}
</script>
<style>
	page{
		/* overflow: hidden; */
	}
	[v-cloak]{
		display: none;
	}
	.van-icon-add-o:before{
		margin-top: 5rpx;
	}
	.van-tabbar{
		height: 120rpx !important;
		box-shadow: 0px 7rpx 21rpx 0px rgba(0, 0, 0, 0.18) !important;
	}
	.van-dropdown-menu{
		background: none !important;
	}
	.van-dropdown-item{
		width: 709rpx;
		height: 480rpx;
		margin:0 18rpx;
		border-radius: 30rpx;
		box-shadow: 0px 7rpx 21rpx 0px rgba(0, 0, 0, 0.18);
	}
	.van-dropdown-menu__title{
		left: -240rpx;
	}
	.popupstyle{
		display: none;
	}
	.labelclass{
		font-size: 26rpx;
		font-family: PingFang SC;
		/* font-weight: 500; */
		color: #333333 !important;
		margin-right: 10rpx;
		margin-left: 8rpx !important;
		word-break: keep-all;
		width: 70%;
	}
	.van-checkbox__icon {
		border-radius: 7rpx !important;
	}
	.van-cell{
		width: 50% !important;
		background: none !important;
		margin: 10rpx 0;
	}
	.van-cell:after{
		border: none !important;
	}
	.van-cell__title, .van-cell__value {
		flex: none !important;
	}
</style>
<style lang="scss">
	[v-cloak]{
		display: none;
	}
	page{
		background-repeat: repeat-y;
		background-position: center;
		background-size: 100%;
		background-attachment: fixed;
		background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABcwAAAx1CAYAAAC0EMh5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAhdEVYdENyZWF0aW9uIFRpbWUAMjAyMDowOToyMyAxMDozNzoxN8BzxLoAAP94SURBVHhe7N3ZduNImrZZcVBEdl9eXVqvus4+rf4rI139fgBMboIDJDhIoqS9K00kQUykGO4rnkAZd//1//zP//sEAAAAAAA/3O6//vt/Xqb7AAAAAADwY+2nWwAAAAAA+NEEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwBAAAAACAEcwAAAAAACMEcAAAAAABCMAcAAAAAgBDMAQAAAAAgBHMAAAAAAAjBHAAAAAAAQjAHAAAAAIAQzAEAAAAAIARzAAAAAAAIwRwAAAAAAEIwBwAAAACAEMwB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33/Tls2fm693L22/t76+/pxPjVOWnt+yXXNuva2f2bVjru1/bf1y6rlT2nbXbFu2/D7bvmvdNmpZuz/Xn8+5ddp6a86ts7bvU849X9px27hU22bp/HrX7H++z7aP+eitLT9naZtzr+lW7XinznXDOQjmAAAAwHh1+W73e97yS1wSUlpEObVN/1ydzNIJtWWXHPsS/Xn2x9h6vK3rNf1rnL/e+Tlsdcm5XrP/U+61v2v3c267pc9Uv03dv9drKGv7mi8/d173smWfS+dyiUvPu1//Hq/51HvZntv6Gmu7tu2l59Zve05b79b3fsk99nnpa/8M585x/nw97kcI5gAAAPDDVUc5HMYrzF+bSosKlwaltt3c0nPntplbW2/r9reYn2e9L+29ac/1y0pbf+09bOu35/v9L2nH6ceaU8+tOXWe12jnuOX1tXXno9efR90/d15t+7X1zm2/1fycl8Yp555v+vPt99uWbzlWma9T27fRW9tXO87Sfnrzx6csHas/Tj/O6depc7hk296l2y29h721fW09ztb9z0dp78Nc22c/1px7fov+nJq2rH9uvqwfa+dwyfmdWVcwBwAAgB+uvuCz5i3/IyK0QHGre+yjafua73PpcRtl/vijbD3e2noffb5L7nkOS/vasv/2uZx/Rvv791Dncsnrved7s9XSMU+9D5e8pvl+7vX6PuN9KueOu/b8Jedb6177+s4dv+372v2Xfvtb9tPcej7lHudxizOvQTAHAACAH6xi+XG/y+0F07Gcix19jDi1bh2sjbbNfP21ZUuW1i1L26+tW9aWN/35bnFqvaX9tGWntruX9v6X9zrufH/94y3Haud3qWu3O6e9R2vn3t7TS46/tM9zj0v/eH7MLduXtvzc8+f06y1ts/R8v+yezu23f77/fdXYcj5t+37d+eM1S9sumT+/ts2WffXm67fHbfSfoV57vum36UfTv6dL+vX7dft9LFl7vt9f0x976fkVgjkAAAD8UPXlnjVveU3FUrH87s7FiRYwltZbW75FbXft67nlfbj0nK99fedceg7vdR6nXHvca17bfJv2+JJ9XWLtuM25457adsl83Uu332rrft/j2B/lK5/7qT+76rn582u/z7ZsaZtLtP0vHWOurbNl3WtcuF/BHAAAAH6g6iAVyd8tlj+C93pd7xV1OG0pql37u3jE32F9Xrd+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AABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAcAAAAAgCCYAwAAAABAEMwBAAAAACAI5gAAAAAAEARzAAAAAAAIgjkAAAAAAATBHAAAAAAAgmAOAAAAAABBMAf4/3bsQAAAAIBh0P2pP5DCCAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAIMIcAAAAAAAizAEAAAAAYNsBbf9eNU1zEwYAAAAASUVORK5CYII=");
	}
	.content {
		width: 100%;
		height: 100%;
		position: relative;
		margin-top: 18rpx;
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
	.xiao-calendar{
		position: absolute;
		top: 0;
		left: 18rpx;
		right: 18rpx;
		width: 714rpx;
		height: 585rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 32rpx 0px rgba(8, 45, 101, 0.14);
		border-radius: 30rpx;
		z-index: 3;
		.weekcalendar,.monthcalendar{
			position: absolute;
			top: 24rpx;
			right: 35rpx;
			width: 138rpx;
			height: 54rpx;
			background: #5294F7;
			border-radius: 30rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 52rpx;
			text-align: center;
		}
		.select-baby{
			width: 95%;
			display: flex;
			justify-content: center;
			align-items: center;
			overflow-x: auto;
			margin: 0 auto;
			direction: ltr;
			margin-top: -13rpx;
			flex-wrap: wrap;
			.hasAction{
				width: 24rpx;
				height: 24rpx;
				background-color: #FFB837;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				right: 0;
				.inner{
					width: 12rpx;
					height: 12rpx;
					border-radius: 50%;
					background-color: #FFFFFF;
				}
			}
			.babybox{
				width: 120rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin: 0 50rpx;
				position: relative;
			}
		}
		.change-week{
			width: 60%;
			height: 100rpx;
			font-size: 26rpx;
			// margin-left: 8rpx;
			color: #666666;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.pre-week,.next-week{
				width: 50rpx;
				height: 100%;
				margin-top: 60rpx;
				text-align: center;
			}
			.second-tem{
				margin: 0 -30rpx;
				margin-top: -11rpx;
			}
		}
		.backtoday{
			width: 54rpx;
			height: 54rpx;
			border-radius: 50%;
			color: #FD794C;
			font-size: 28rpx;
			font-weight: 500;
			background: #FFFFFF;
			font-family: PingFang SC;
			border: 1px solid #FD794C;
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			top: 22rpx;
			right: 200rpx;
		}
	}
	.xiao-calendarback1{
		position: absolute;
		top: 45rpx;
		left: 39rpx;
		right: 36rpx;
		width: 672rpx;
		height: 553rpx;
		background: rgba(255, 255, 255, 0.62);
		border-radius: 30rpx;
		z-index: 2;
	}
	.xiao-calendarback2{
		position: absolute;
		top: 85rpx;
		left: 58rpx;
		right: 58rpx;
		width: 635rpx;
		height: 525rpx;
		background: rgba(255, 255, 255, 0.35);
		border-radius: 30rpx;
		z-index: 1;
	}
	.course-list{
		position: absolute;
		top: 550rpx;
		left: 18rpx;
		right: 18rpx;
		width: 714rpx;
		height: auto;
		margin-top: 93rpx;
		font-family: PingFang SC;
		padding-bottom: 150rpx;
		.daily-course{
			font-size: 32rpx;
			font-weight: bold;
			color: #FFFFFF;
		}
		.my-course{
			width: 651rpx;
			height: 143rpx;
			margin: 24rpx 0 20rpx 0;
			background: #FFFFFF;
			box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.06);
			border-radius: 10rpx;
			display: flex;
			direction: ltr;
			align-items: center;
			padding: 31rpx 33rpx;
			position: relative;
			.baby_avatar{
				width: 104rpx;
				height: 104rpx;
				border-radius: 50%;
				margin-right: 27rpx;
				image{
					width: 104rpx;
					height: 104rpx;
					border-radius: 50%;
				}
			}
			.cou-left{
				width: 104rpx;
				height: 111rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #333333;
				text-align: center;
				position: relative;
				padding-right: 25rpx;
				.starttime{
					position: absolute;
					top: 0;
				}
				.endtime{
					position: absolute;
					bottom: 0;
					color: #909090;
				}
			}
			.linear-line1{
				width: 2rpx;
				height: 100%;
				background: linear-gradient(
					to bottom,
					rgba(0, 0, 0, 0) 0%,
					rgba(0, 0, 0, 0) 10%,
					rgba(0, 0, 0, 0) 20%,
					rgba(193, 196, 248, 0.4) 30%,
					rgba(193, 196, 248, 0.5) 40%,
					rgba(193, 196, 248, 0.8) 50%,
					rgba(193, 196, 248, 0.5) 60%,
					rgba(193, 196, 248, 0.4) 70%,
					rgba(0, 0, 0, 0) 80%,
					rgba(0, 0, 0, 0) 90%,
					rgba(0, 0, 0, 0) 100%)
			}
			.cou-right{
				// border-left: 1px solid #C1C4F8;
				padding-left: 29rpx;
				width: 80%;
				.cou-name{
					font-size: 28rpx;
					font-weight: bold;
					color: #333333;
					display: flex;
					align-items: center;
					width: 90%;
					.icon{
						width: 24rpx;
						height: 24rpx;
						background: #FFB837;
						border-radius: 50%;
						display: inline-block;
						display: flex;
						justify-content: center;
						align-items: center;
						.dot{
							width:12rpx;
							height: 12rpx;
							background-color: #FFFFFF;
							border-radius: 50%;
							margin: 0 3rpx;
						}
					}
					text{
						
					}
				}
				.cou-hours{
					margin: 12rpx 0;
				}
				.cou-hours,.cou-edction{
					font-size: 26rpx;
					font-weight: 500;
					color: #909090;
				}
				text{
					margin-left: 14rpx;
					width: 80%;
					vertical-align: bottom;
					display: inline-block;
				}
			}
			.cou-state{
				position: absolute;
				right: 0;
				width: 46rpx;
				height: 107rpx;
				padding: 19rpx 0;
				border-top-left-radius: 20rpx;
				border-bottom-left-radius: 20rpx;
				background-color: #FFB837;
				font-size: 26rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
			}
			.finished{
				background-color: #CCCCCC;
			}
			.classing {
				background-color: #1ED87F;
			}

			
		}
	}
	
	.eli {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
