<template>
	<view v-cloak>
		<view class="course">
			<van-cell-group>
				<van-field :value="course.className" 
					input-class="inputclass" 
					label="课程名称" 
					readonly 
					input-align="right"
				/>
				<van-field :value="course.week + ' ' + course.classDate + ' ' + course.classTime"
					input-class="inputclass" 
					label="原上课时间" 
					readonly  
					input-align="right"
				/>
				<view @click="open">
					<van-field 
						:value="classDate"
						input-class="inputclass" 
						label="调课日期" 
						placeholder="请选择" 
						is-link 
						readonly 
						input-align="right"
					/>
				</view>
				<!-- <van-popup
					round
					:show="showDatepopup"
					@click-overlay="this.showDatepopup = false"
					position="bottom"
				>
					<van-datetime-picker
						:value="currentDate"
						type="date"
						@confirm="onDatetime"
						title="请选择上课日期"
						@cancel="this.showDatepopup = false"
					/>
				</van-popup> -->
				<uni-calendar
					ref="calendar"
					:insert="false"
					@confirm="onConfirmtDate()"
				     />
				<view @click="showTimepopup = true">
					<van-field 
						:value="classTime"
						input-class="inputclass" 
						label="上课时间" 
						placeholder="请选择" 
						is-link 
						readonly
						input-align="right"
					/>
				</view>
				<van-popup
					round
					:show="showTimepopup"
					@click-overlay="this.showTimepopup = false"
					position="bottom"
				>
					<van-picker id="picker"
						:show-toolbar="true"
						:columns="columns" 
						swipe-duration="500"
						title="请选择起止时间"
						@confirm="onConfirmtime"
						@change="autoChange"
						@cancel="this.showTimepopup = false"/>
				</van-popup>
				<van-field :value="course.organizationName" 
					input-class="inputclass" 
					label="关联机构" 
					readonly 
					input-align="right"
				/>
				<van-field :value="course.deductHour" 
					input-class="inputclass" 
					label="扣课课时" 
					readonly 
					input-align="right"
				/>
				<van-field :value="course.babyName" 
					input-class="inputclass" 
					label="上课宝宝" 
					readonly 
					input-align="right"
				/>
				<view class="checkbox-tips">
					<van-checkbox
					  :value="isChecked"
					  shape="square"
					  @change="onChange"
					  icon-size="26rpx"
					>
					  <text>后续课程是否全部改动</text><text style="color: #5294F7;">（不选则默认改动一节）</text>
					</van-checkbox>
				</view>
			</van-cell-group>
		</view>
		<view class="footer">
			<van-button round block type="info" @click="onAdjust">确认</van-button>
		</view>
	</view>
</template>

<script>
	import common from "../../js/common/common.js"
	import course from "../../js/api/course/index.js"
	export default {
		data() {
			return {
				course:{},
				isChecked:false,
				showTimepopup:false,
				showDatepopup:false,
				classDate:'',
				classTime:'',
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
					defaultIndex:1,
				},{
					values:[],
					defaultIndex:0,
				}],
				currentDate:new Date().getTime(),
				isClick:false
			};
		},
		mounted() {
			this.timeInit()
		},
		onLoad(option) {
			this.course = JSON.parse(option.list)
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
			// 改变checkbox状态
			onChange(event){
				this.isChecked = event.detail
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
				this.showTimepopup = false
			},
			// 开始时间选择确定
			onDatetime(event){
				this.classDate = common.formatDate(event.detail)
				this.showDatepopup = false
			},
			onAdjust(){
				if(this.isClick){
					return
				}
				this.isClick = true
				course.adjust(this.course,this)
			}
		}
	}
</script>
<style>
	page{
		background-color: #F8F8F8;
	}
	.inputclass{
		font-size: 28rpx !important;
		font-family: PingFang SC !important;
		font-weight: 500 !important;
		color: #666666 !important;
	}
	.van-cell{
		height: 102rpx !important;
		padding-top: 27rpx !important;
		border-radius: 30rpx;
	}
	.van-checkbox__icon {
		border-radius: 7rpx !important;
	}
	.hover-class{
		background: none;
	}
	.van-cell--clickable{
		background: none;
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
		.checkbox-tips{
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #909090;
			padding-top: 29rpx;
			padding-left: 32rpx;
		}
	}
	.footer{
		margin: 186rpx 72rpx;
	}
</style>
