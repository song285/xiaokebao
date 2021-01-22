<template>
	<view v-cloak>
		<view class="my_weeks">
			<view class="week-head" style="margin-left: 47rpx;">
				<view class="">
					<!-- <view class="week-day">时间</view> -->
				</view>
				<view class="week-head-item" 
					:class="{'onActive':isOnactive==index}" 
					@click="isChecked(item,index)" 
					v-for="item,index in week" 
					:key="index"
				>
					<view class="week-day">{{item.weekDay}}</view>
					<view class="week-date">{{item.day}}</view>
				</view>
			</view>
			<view class="week-body" v-for="item in type" v-if="Object.keys(list).length <= 0">
				<view class="week-body-item">
					<view class="week-day one-day">{{item}}</view>
				</view>
				<view class="w-line"></view>
				<view class="showColorbox">
					<view class="color-item" v-for="items in 7">
						<view class="outerbox">
							<view class="hasAction">
								<view class="inner" style="background: none;"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view else class="week-body" v-for="type,tpindex in Object.keys(list)" :key="tpindex">
				<view class="week-body-item">
					<view class="week-day one-day">{{type == 'am' ? '上午' : type == 'pm' ? '下午' : '晚上'}}</view>
				</view>
				<view class="w-line"></view>
				<view class="showColorbox">
					<view v-for="items,index in week" :key='index' class="color-item">
						<view class="outerbox" :style="{ 'width': howWidth}">
							<view class="hasAction" 
								v-for="subItem,indx in list[type]" :key="indx" :data-id="subItem.babyId"
								:style="{ 'background-color': (items.fullDate == subItem.classDate && subItem.state == 10) ? subItem.babyColor : '#ccc' ,
										  'display': items.fullDate == subItem.classDate ? '' : 'none' }">
								<view class="inner"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import home from '../../js/api/index/home.js'
	export default {
		data() {
			return {
				type:['上午','下午','晚上'],
				week:[],
				isWeek:true,
				isOnactive:-1,
				checked:true,
				times:0,
				currentFirstDate:'',
				selectedDate:{
					name:"当日课程",
					today:{
						fullDate: ''
					}
				},
				list:{},
				showColor:false,
				checkedBaby:[],
				isClick:false
			};
		},
		created() {
			this.dataInit()
		},
		computed:{
			howWidth(){
				let am
				let type = Object.keys(this.list)
				let arr1 = this.list[type[0]] || []
				let arr2 = this.list[type[1]] || []
				let arr3 = this.list[type[2]] || []
				
				if(arr1.length == 4 || arr2.length == 4 || arr3.length == 4) am = '45rpx'
				else am = '60rpx'
				
				return am
			}
		},
		methods:{
			isChecked(item,index){
				if(this.isClick){
					return
				}
				this.isClick = true
				this.$parent.dailyCourse = []
				let now = new Date()
				let year = now.getFullYear()
				let month = now.getMonth()+1
				let day = now.getDate()
				let m = month < 10 ? ('0' + month) : month
				let d = day < 10 ? ('0' + day) : day
				let date = '' + year + m + d
				this.isOnactive = index
				if(item.isToday == date){
					this.selectedDate = {
						name:"当日课程",
						today:item
					}
				}else{
					this.selectedDate = {
						name:item.startEnd + '课程<span style="color:#F21717;font-weight: 500;"> (非今日)</span>',
						today:item
					}
				}
				
				this.$emit('getSelectedDate',this.selectedDate,1)
			},
			// user defined week
			userDefinedWeek(date){
				this.week = this.setDate(new Date(date));
				this.selectedToday()
				home.weekCalCourse(this)
				console.log(this.week)
			},
			dataInit(){
				this.checkedBaby = this.$parent.checkedBaby
				this.week = this.setDate(new Date())
				this.selectedToday()
				home.weekCalCourse(this)
			},
			getBabycourse(){
				this.checkedBaby = this.$parent.checkedBaby
				home.weekCalCourse(this)
			},
			// 获取上一周
			getPreWeek(){
				this.times--
				this.week = this.setDate(this.addDate(this.currentFirstDate,-7));
				this.selectedToday()
				home.weekCalCourse(this)
				console.log(this.week)
			},
			// 获取下一周
			getNextWeek(){
				this.times++
				this.week = this.setDate(this.addDate(this.currentFirstDate,7));   
				this.selectedToday()
				home.weekCalCourse(this)
				console.log(this.week)
			},
			// 判断是否选中今天
			selectedToday(){
				let now = new Date()
				let year = now.getFullYear()
				let month = now.getMonth()+1
				let weeks = now.getDay() -1
				let day = now.getDate()
				if(this.week.find(function(item){
					return item.day == day && item.month == month && item.year == year
				})){
					this.isOnactive = weeks
				}else{
					this.isOnactive = -1
				}
			},
			
			formatDate(date){
				let year = date.getFullYear()
				let month = date.getMonth()
				let day = date.getDate()
				let week = ['日','一','二','三','四','五','六'][date.getDay()]
				day = day < 10 ? '0' + day : day,
				month = (month+1) < 10 ? '0' + (month+1) : (month+1)
				return {
					startEnd:month + "月" + day + "日",
					isToday:'' + year+month+day,
					weekDay:week,
					month:month,
					day:day,
					year:year,
					fullDate:year + '-' + month + '-' + day
				}
			},
			addDate(date,n){
				date.setDate(date.getDate() + n);
				return date;
			},
			setDate(date){
				let week = date.getDay()-1;
				date = this.addDate(date,week * -1);
				this.currentFirstDate = new Date(date);
				let weeks = []
				for(let i = 0;i < 7;i++){
					weeks.push(this.formatDate(i==0 ? date : this.addDate(date,1))) 
				}
				return weeks
			},
		},
	}
</script>

<style lang="scss">
	[v-cloak]{
		display: none;
	}
	.showColorbox{
		display: flex;
		justify-content: center;
		align-items: center;
		.color-item{
			width: 60rpx;
			height: 72rpx;
			margin-right: 29rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 1;
		}
	}
	.week-day{
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.one-day{
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #666666 !important;
		width: 57rpx;
	}

	.onActive{
		background-color: #5294F7 !important;
		color: #FFFFFF !important;
	}

	.my_weeks{
		width: 100%;
		height: auto;
	}
	.week-body{
	}
	.week-head,.week-body{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 17rpx;
	}
	.week-head-item{
		width: 60rpx;
		height: 72rpx;
		background: #DFECFF;
		border-radius: 10rpx;
		display: flex;
		font-size: 22rpx;
		direction: rtl;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		font-family: PingFang SC;
		font-weight: 500;
		color: #5294F7;
		margin-left: 29rpx;
	}
	.week-date{
		font-size: 20rpx;
		font-weight: bold;
	}
	.week-body-item{
		width: 192rpx;
		height: 110rpx;
		font-size: 28rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		position: relative;
	}
	.w-line{
		position: absolute;
		width: 591rpx;
		border: 1rpx solid #F4F4F4;
		margin-right: 25rpx;
		right: 0;
	}
	.outerbox{
		width: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		flex-wrap: wrap;
		.hasAction{
			width: 24rpx;
			height: 24rpx;
			border-radius: 50%;
			margin-right:40rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 1rpx -4rpx;
			.inner{
				width: 12rpx;
				height: 12rpx;
				border-radius: 50%;
				background-color: #FFFFFF;
			}
		}
	}
</style>
