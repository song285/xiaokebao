<template>
	<view v-cloak>
		<!-- <view class='calendar_title'> -->
			<!-- <view class='icon' @click='lastMonth'>
				上个月
			</view>
			<view>{{year}}年{{month}}月</view>
			<view class='icon' @click='nextMonth'>
				下个月
			</view> -->
			<!-- <van-dropdown-menu>
			  <van-dropdown-item :value="value" :options="allMonth" />
			</van-dropdown-menu> -->
		<!-- </view> -->
		<view class='calendar'>
			<view class='header'>
				<view v-for="item,index in date" :key="index">
					{{item}}
				</view>
			</view>
			<view class='date-box'>
				<swiper style="height: 433rpx;" @change="swiperItem" :current="currentIndex" circular>
					<swiper-item v-for="month,indx in everyMonth" :key="indx">
						<view class="me" v-for="(item,index) in month" :key="index">
							<view :class="{active: isToday == item.isToday || index == active}" @click="checkDay(item,index)">
								<view class='date-head'>
									<view>{{ item.dateNum }}</view>
								</view>
								<view class="dotbox" :style="{ 'width': mybaby.length == 4 ? '35rpx' : '50rpx' }">
									<view class="dot" v-for="i,index in baby" :key="index" 
										:style="{'background-color':item.fullDate == i.classDate && i.state == 10 ? i.babyColor : '#ccc',
												 'display': item.fullDate == i.classDate ? '': 'none' }" 
									></view>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active:-1,
				year: 0,
				month: 0,
				date: ['日', '一', '二', '三', '四', '五', '六'],
				dateArr: [],
				isToday: 0,
				babyColor:'',
				baby:[],
				// mybaby:[],
				isTodayWeek: false,
				todayIndex: 0,
				currentIndex:0,
				selectedDate:{
					name:"当日课程",
					today:{
						fullDate:this.todayInit
					}
				},
				everyMonth:[],
				isClick:false,
			};
		},
		mounted() {
			let now = new Date();
			let year = now.getFullYear();
			let month = now.getMonth() + 1;
			let day = now.getDate()
			this.month = month;
			
			this.getFullDate(year)
			
			this.isToday = '' + year + month + day;
			this.currentIndex = month - 1
			this.dateInit();
			this.getBaby()
		},
		computed:{
			todayInit(){
				let now = new Date()
				let year = now.getFullYear()
				let month = now.getMonth() + 1
				let day = now.getDate()
				let m = month < 10 ? ('0' + month) : month
				let d = day < 10 ? ('0' + day) : day
				let date = year + "-" + m + "-" + d
				return date
			},
			mybaby(){
				let hash = {}
				let obj;
				for(let i = 0;i < this.baby.length;i++){
					hash = {}
					this.baby.map((item)=> {
						hash[item.babyColor + '-' + item.babyId] = item
						obj = Object.values(hash)
					})
				}
				return obj
			},
			
		},
		methods:{
			// 月历
			getFullDate(year){
				this.everyMonth = []
				for(let i=0;i<12;i++){
					this.dateInit(year,i)
					this.everyMonth.push(this.dateArr)
				}
			},
			// 获取宝宝
			getBaby(){
				this.baby.length = 0
				let timer = setInterval(()=>{
					if(this.baby.length != 0){
						clearInterval(timer)
						return
					}
					this.baby = this.$parent.allMonth
				},100)
			},
			// 选中某一天
			checkDay(item,index){
				if(this.isClick){
					return
				}
				this.$parent.dailyCourse = []
				this.isClick = true
				this.active = index
				this.isToday = 0
				let now = new Date()
				let today = this.todayInit
				if(item.dates == today){
					this.selectedDate = {
						name:"当日课程",
						today:item,
					}
				}else{
					this.selectedDate = {
						name:item.date + '课程<span style="color:#F21717;font-weight: 500;"> (非今日)</span>',
						today:item
					}
				}
				this.$emit('getSelectedDate',this.selectedDate,0)
				setTimeout(()=>{
					this.isClick = false
				},200)
				
				console.log(this.mybaby)
			},
			// 初始化日历
			dateInit(setYear,setMonth) {
				//全部时间的月份都是按0~11基准，显示月份才+1
				let dateArr = [];                       //需要遍历的日历数组数据
				this.monthArr = [];
				let arrLen = 0;                         //dateArr的数组长度
				let now = setYear ? new Date(setYear,setMonth) : new Date();
				let year = setYear || now.getFullYear();
				this.year = year
				let nextYear = 0;
				let preYear = 0
				let month = setMonth || now.getMonth();                 //没有+1方便后面计算当月总天数
				let nextMonth = (month +1) > 11 ? 1 : (month +1);
				let startWeek = new Date(year,(month),1).getDay();                          //目标月1号对应的星期
				let dayNums = new Date(year,nextMonth,0).getDate();               //获取目标月有多少天  31
				let obj = {};
				let num = 0;
			 //    if (month +1 > 11) {
				// 	nextYear = year +1;
				// 	this.year = nextYear
				// 	dayNums = new Date(nextYear,nextMonth,0).getDate();
			 //    }
				// if (month -1 < 0) {
				// 	preYear = year -1;
				// 	this.year = preYear
				// 	dayNums = new Date(preYear,nextMonth,0).getDate();
				// }
				let mm = month +1
			    arrLen = startWeek + dayNums;
				for (let i = 0; i < arrLen; i++) {
					if (i >= startWeek) {
						num = i - startWeek + 1;
						obj = {
							isToday: '' + year + (month + 1) + num,
							dateNum: num,
							month:month + 1,
							day: num,
							date:month+1 + "月" + (num < 10 ? '0' + num : num) + "日",
							dates:year + '-' + (month+1 < 10 ? ('0' + (month+1)) : month+1) + "-" + (num < 10 ? ('0' + num) : num),
							fullDate:year + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (num < 10 ? '0' + num : num)
						}
					} else {
						obj = {};
					}
					dateArr[i] = obj;
				}
			    this.dateArr = dateArr
			    let nowDate = new Date();
			    let nowYear = nowDate.getFullYear();
			    let nowMonth = nowDate.getMonth() + 1;
			    let nowWeek = nowDate.getDay();
			    let getYear = setYear || nowYear;
			    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
			    if (nowYear == getYear && nowMonth == getMonth) {
			        this.isTodayWeek = true;
			        this.todayIndex = nowWeek;
			    } else {
			        this.isTodayWeek = false;
			        this.todayIndex = -1;
			    }
			},
			/**
			* 上月切换
			*/
			lastMonth() {
				//全部时间的月份都是按0~11基准，显示月份才+1
				let year = this.month - 2 < 0 ? this.year - 1 : this.year;
				let month = this.month - 2 < 0 ? 11 : this.month - 2;
				this.year = year;
				this.month = month +1;
				this.dateInit(year,month);
				this.getFullDate(year)
				console.log(">>>last",year,month)
			},
			/**
			* 下月切换
			*/
			nextMonth() {
				//全部时间的月份都是按0~11基准，显示月份才+1
				let year = this.month +1 > 11 ? this.year + 1 : this.year;
				let month = this.month +1 > 11 ? 0 : this.month;
				this.year = year;
				this.month = month +1;
				this.dateInit(year,month);
				this.getFullDate(year)
				console.log(">>>next",year,month)
			},
			/* 
				左右滑动切换月份
			 */
			swiperItem(event){
				if(this.currentIndex == 11 && event.detail.current == 0){
					this.nextMonth()
				}else if(this.currentIndex == 0 && event.detail.current == 11){
					this.lastMonth()
				}
				this.currentIndex = event.detail.current
				this.month = this.currentIndex
				this.$emit("xchange",event.detail.current,this.year)
				this.active = -1
			}
		}
	}
</script>

<style>
	[v-cloak]{
		display: none;
	}
	.active{
		width: 70rpx;
		height: 70rpx;
		margin: 0 auto;
		background: #5294F7;
		box-shadow: 0px 0px 20rpx 1rpx rgba(30, 78, 149, 0.1);
		border-radius: 50%;
		text-align: center;
		color: #FFFFFF;
		z-index: 9;
	}
	.calendar_title{
		width: 100%;
		height: 90rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}


	/* 日历 */
	.calendar{
		width: 100%;
		font-size: 28rpx;
		margin-top: 17rpx;
		font-family: PingFang SC;
		position: relative;
	}
	.header{
		font-size: 26rpx;
		font-weight: bold;
		color: #5294F8;
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin: -20rpx 0 20rpx;
	}
	.date-box{
		width: 100%;
		margin: 0 auto;
		font-weight: 500;
	}
	.date-box .me{
		display: inline-block;
		width: 14.285%;
		color: #565656;
		text-align: center;
		vertical-align: middle;
		height: 70rpx;
	}
	.date-head{
		line-height: 70rpx;
		position: relative;
	}
	.dotbox{
		/* max-width: 50rpx; */
		/* min-width: 35rpx; */
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: -17rpx;
		flex-wrap: wrap;
		margin-left: 50%;
		transform: translateX(-50%);
	}
	.dotbox .dot{
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		margin: 3rpx;
	}
	.dot-unfinished{
		background-color: #FFB837;
	}
	.dot-finished{
		background-color: #1ED87F;
	}
	.nowDay{
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		text-align: center;
		border: 1rpx solid #FD794D;
		margin: 0 auto;
	}
</style>
