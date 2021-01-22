<template>
	<view v-cloak>
		<view class="course first">
			<van-cell-group>
				<!-- <view class="list" @tap="ChooseImage">
					<view class="title">头像</view>
					<image class="portrait" :src="headerImg" mode=""></image>
				</view> -->
				<van-field
					label="课程头像" 
					disabled
					custom-style="height:132rpx !important;line-height: 75rpx;"
					input-align="right">
					<template #right-icon>
					    <img @click="ChooseImage" style="width: 80rpx;height: 80rpx;" :src="addCourse.classBabyPic" alt="">
					</template>
				</van-field>
				<van-field :value="addCourse.name" 
					label="课程名称" 
					required
					placeholder="请输入课程名称" 
					@change="courseName"
					input-align="right">
				</van-field>
				<van-field label-class="labelclass" label="课程类别" readonly input-align="right">
					<template #right-icon>
						<view class="my-switch">
							<view class="my-switch-left" :class="{'active':addCourse.payType==10}" @click="payType(10)">预付费</view>
							<view class="my-switch-right" :class="{'active':addCourse.payType==20}" @click="payType(20)">后付费</view>
						</view>
					</template>
				</van-field>
				<!-- 机构选择器 -->
				<view @click="onShowaency()" style="position: relative;">
					<van-field
						:value="addCourse.orgName" 
						label="机构" 
						required
						clearable
						readonly 
						placeholder="请选择" 
						is-link 
						input-align="right"/>
					<view class="IPhone"></view>
				</view>
				<van-popup :show="showAency"
					 round
					 @click-overlay="showAency = false"
					 custom-style="height:40%"
					 position="bottom">
					 <view class="top-tab">
						 <view class="cancelButton" @click="showAency = false">取消</view>
						 <view class="newaddButton" @click="toEductionInfo">新增</view>
					 </view>
					 <view class="my-picker">						 
						<view class="aency-items" v-for="item,index in list" :key="index" @click="bindAencyChange(item)">
							<text>{{item.name}}</text>
							<image v-if="!!item.phone" src="/static/images/dinah-ic.png" @click.stop="callPhone(item)"></image>
						</view>
					 </view>
				</van-popup>
				<!-- 宝宝选择器 -->
				<view @click="checkaBaby()" style="position: relative;">
					<van-field :value="addCourse.babyName" 
					label="宝宝" 
					required
					readonly 
					placeholder="请选择" 
					is-link 
					input-align="right"/>
					<view class="IPhone"></view>
				</view>
				<van-popup :show="showBaby"
					 round
					 @click-overlay="showBaby = false"
					 custom-style="height:40%"
					 position="bottom">
					 <view class="top-tab">
						 <view class="cancelButton" @click="showBaby = false">取消</view>
						 <view class="newaddButton" @click="toAddBaby" v-if="babyList.length >= 6 ? false : true">新增</view>
					 </view>
					 <view class="my-picker">
						<view class="aency-items" v-for="item,index in babyList" :key="index" @click="bindBabyChange(item)">
							<text>{{item.nickName}}</text>
						</view>
					</view>
				</van-popup>
				<van-field :value="addCourse.totalClassHour" 
					type="number" 
					maxlength="4"
					label="总课时数" 
					required
					placeholder="请输入总课时数" 
					@change="totalTime"
					input-align="right"/>
				<van-field :value="addCourse.restHour" 
					v-show="addCourse.payType == 10"
					type="digit" 
					maxlength="4"
					required
					label="剩余课时数" 
					placeholder="请输入剩余课时数" 
					@change="remainTime"
					input-align="right"/>
				<van-field :value="addCourse.usedHour"
					v-show="addCourse.payType == 20"
					type="digit" 
					maxlength="4"
					required
					label="已上课时数" 
					placeholder="请输入已上课时数" 
					@change="finishedHour"
					input-align="right"/>
				<van-field :value="addCourse.totalPrice == 0 ? '' : addCourse.totalPrice" 
					v-show="addCourse.payType == 10"
					type="number" 
					label="课程总价" 
					maxlength="7"
					:border="false"
					placeholder="课程报名费用" 
					@change="price"
					input-align="right">
					<template #right-icon>
					    <text class="right-icon">元</text>
					</template>
				</van-field>
				<van-field :value="addCourse.hourPrice == 0 ? '' : addCourse.hourPrice"
					v-show="addCourse.payType == 20"
					required
					type="number" 
					label="课时单价" 
					maxlength="7"
					:border="false"
					placeholder="每一课时费用" 
					@change="price"
					input-align="right">
					<template #right-icon>
					    <text class="right-icon">元</text>
					</template>
				</van-field>
				
			</van-cell-group>
		</view>
		<view class="course second">
			<van-cell-group>
				<van-field label-class="labelclass" label="上课时间" readonly input-align="right">
					<template #right-icon>
						<view class="my-switch">
							<view class="my-switch-left" :class="{'active':addCourse.arrangeType==10}" @click="onSwitch(10)">周循环</view>
							<view class="my-switch-right" :class="{'active':addCourse.arrangeType==20}" @click="onSwitch(20)">手动</view>
						</view>
					</template>
				</van-field>
				<view class="choose-time">
					选择每次上课的时间
				</view>
				<van-field
					label="选择时间" 
					readonly
					required
					input-align="left">
					<template #right-icon>
						<view class="pickertime" @click="selecdTime" v-if="selectedTime.length == 0">添加时段</view>
						<view class="pickertime" @click="selecdTime" v-if="selectedTime.length >= 1">继续添加</view>
					</template>
				</van-field>
				<view class="selected-time" v-for="item,index in selectedTime" :key="index">
					<text>{{item}}</text>
					<van-icon size="32rpx" color="#C6C6C6" name="clear" @click="clearItem(index)"/>
				</view>
				<view class="bottomline" v-if="!!selectedTime.length"></view>
				<van-popup
					round
					:show="showTimepopup || showClassDate"
					@click-overlay="showTimepopup = false;showClassDate = false"
					position="bottom">
					<van-picker id="picker"
						v-if="showTimepopup"
						title="请选择起止时间"
						:show-toolbar="true"
						:columns="addCourse.arrangeType==10 ? columns : columns1" 
						swipe-duration="500"
						@confirm="onConfirmtime"
						@change="autoChange"
						@cancel="showTimepopup = false"/>
						
					<!-- <van-datetime-picker
						v-if="showClassDate"
						:value="currentDate"
						title="请选择上课日期"
						type="date"
						@confirm="onConfirmClassdate"
						@cancel="showClassDate = false"
					/> -->
				</van-popup>
				<van-field :value="addCourse.deductHour" 
					label="扣除课时" 
					type="digit"
					required
					placeholder="每次上课扣除课时数" 
					@change="deductionHours"
					input-align="right"/>
				<!-- <view @click="open" style="position: relative;">
					<van-field :value="addCourse.startTime" 
						label="开始日期" 
						readonly 
						required
						placeholder="本期课程第一次上课时间" 
						is-link 
						class="last"
						input-align="right"/>
					<view class="IPhone"></view>
				</view> -->
				<view class="list">
					<view class="title">备注<text style="color: #FB6462;">(非必填)</text></view>
				</view>
				<textarea class="other" maxlength="50" v-model="addCourse.remark"/>
			</van-cell-group>
			<!-- <van-popup
				round
				:show="showStarttime"
				@click-overlay="showStarttime = false"
				position="bottom"
			>
				<van-datetime-picker
					:value="currentDate"
					title="请选择开始日期"
					type="date"
					@confirm="onDatetime"
					@cancel="showStarttime = false"
				/>
				
			</van-popup> -->
			<uni-calendar
				ref="calendar"
				:insert="false"
				@confirm="onConfirmtDate()"
			     />
		</view>
		<view class="footer">
			<view>
				<van-button round block type="info" color="#ccc" @click="onDraft">暂存</van-button>
			</view>
			<view>
				<van-button round block type="info" @click="onSave">提交</van-button>
			</view>
		</view>
	</view>
</template>

<script>
	import common from "../../js/common/common.js"
	import couse from "../../js/api/course/index.js"
	
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	export default {
		components: {
			uniCalendar
		},
		data() {
			return {
				start:0,
				length:15,
				isUpdate:false,
				headerImg:"/static/images/boy.png",
				addCourse:{
					name:'',//课程名称
					orgName:'',//机构名称
					classBabyPic:'/static/images/boy.png',//宝宝头像
					orgId:'',//机构id
					babyName:'',//宝宝名称
					babyId:'',//宝宝id
					totalClassHour:'',//总课时
					restHour:'',//剩余课时
					usedHour:'',//已上课时
					totalPrice:'',//课程总价
					hourPrice:'',//课程单价
					arrangeType:10,//10周循环 或 20手动
					checkTime:'',
					deductHour:'',//扣除课时
					startTime:'',//开始时间
					remark:'',//备注
					classDate:'',//上课时间段
					payType:10,//付费类型
					draftState:''//是否为草稿
				},
				checked:true,
				showAency:false,
				showBaby:false,
				showTimepopup:false,
				showStarttime:false,
				showClassDate:false,
				showNewadd:true,
				// 机构
				list: [],
				// 孩子数量
				babyList:[],
				// 周循环时间段
				columns:[{
					values:['周一', '周二', '周三', '周四', '周五','周六','周日'],
					defaultIndex:0,
				},{
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
				// 手动时间段
				columns1:[{
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
				selectedTime:[],
				currentDate:new Date().getTime(),
				isClick:false,
				moveHours:"",
				lists:{},
				datas:'',//修改课程
				selectedType:''
			};
		},
		mounted() {
			this.timeInit()
		},
		onLoad(option) {
			if(Object.keys(option).length == 0){
				return
			}
			uni.setNavigationBarTitle({//设置title
				title:option.title
			})
			this.moveHours = option.moveHours || 0
			if(option.lists !== undefined){
				this.lists = JSON.parse(option.lists)
			}
			if(option.list !== undefined){
				this.addCourse = JSON.parse(option.list)
			}
			if(option.datas !== undefined){
				this.addCourse = JSON.parse(option.datas)
				console.log(this.addCourse)
				if(this.addCourse.planJson.length > 1) {
					this.selectedTime = this.addCourse.planJson.split(',')
					this.addCourse.checkTime = this.selecdTime.toString()
				}
				
				this.isUpdate = true
			}
		},
		onShow() {
			common.organization(this)
			common.babyList(this,2)
		},
		methods:{
			// 时间选择联动
			autoChange(e){
				if(e.target.index == 1){
					if(this.addCourse.arrangeType == 10){
						let items = []
						let currentIndex = this.$mp.page.selectComponent("#picker").getColumnIndex(1)
						currentIndex = currentIndex + 1
						this.$mp.page.selectComponent("#picker").setColumnIndex(4,currentIndex)
					}
					return
				}
				if(e.target.index == 0){
					if(this.addCourse.arrangeType == 20){
						let items = []
						let currentIndex = this.$mp.page.selectComponent("#picker").getColumnIndex(0)
						currentIndex = currentIndex + 1
						this.$mp.page.selectComponent("#picker").setColumnIndex(3,currentIndex)
					}
				}
				// if(e.detail.value[0] == this.columns.value[this.columns.value.length]){
				// 	this.columns.value = [...this.columns.value,...this.columns.value]
				// }
				// if(e.detail.value[0] == this.columns.value[this.columns.value.length]){
				// 	this.columns.value = [...this.columns.value,...this.columns.value]
				// }
				// console.log(e.detail)
			},
			open(){
				this.$refs.calendar.open();
				this.selectedType = 2
			},
			onConfirmtDate(e){
				if(this.addCourse.arrangeType == 20){
					if (this.selectedType == 2){
						this.addCourse.startTime = e.fulldate;
						return
					}
					this.addCourse.classDate = e.fulldate;
					this.showTimepopup = true
				}else this.addCourse.startTime = e.fulldate;
			},
			timeInit(){
				for(let i = 6;i < 24;i++){
					let hour = (i < 10 ? '0' + i : i ) + '时'
					this.columns[1].values.push(hour)
					this.columns[4].values.push(hour)
					
					this.columns1[0].values.push(hour)
					this.columns1[3].values.push(hour)
				}
				for(let i = 0;i < 60;i++){
					if(i % 5 == 0){
						let minute = (i < 10 ? '0' + i : i ) + '分'
						this.columns[2].values.push(minute)
						this.columns[5].values.push(minute)
						
						this.columns1[1].values.push(minute)
						this.columns1[4].values.push(minute)
					}
				}
			},
			// 上班课程图片
			ChooseImage() {
				let _this = this
				uni.chooseImage({
					count: 1, //可选择数量，默认9
					sizeType: ['compressed'], //只能上传压缩图
					sourceType: ['album', 'camera'], //从相册选择或从使用相机
					success: (chooseImageRes) => {
						_this.addCourse.classBabyPic = chooseImageRes.tempFilePaths[0];
						uni.uploadFile({
							url:_this.$img + '/upload/imageFile',
							filePath: _this.addCourse.classBabyPic,
							name: 'file',
							header:{
								token:_this.$token,
								file:_this.addCourse.classBabyPic,
							},
							success: (res) => {
								var data = JSON.parse(res.data)
								_this.addCourse.classBabyPic = data.url
							}
						});
					}
				});
			},
			courseName(event){
				this.addCourse.name = event.detail
			},
			totalTime(event){
				this.addCourse.totalClassHour = event.detail
			},
			remainTime(event){
				this.addCourse.restHour = event.detail
			},
			price(event){
				if(this.addCourse.payType == 10)
					this.addCourse.totalPrice = event.detail
				else
					this.addCourse.hourPrice = event.detail
			},
			deductionHours(event){
				this.addCourse.deductHour = event.detail
			},
			// 切换上课时间  周循环 || 手动
			onSwitch(val){
				this.addCourse.arrangeType = val
				this.selectedTime = []
				this.selectedType = ''
				this.addCourse.startTime = ''
			},
			// 交费类型切换
			payType(val){
				this.addCourse.payType = val
			},
			// 显示机构选择器
			onShowaency(){
				this.showAency = true
			},
			// 选择机构
			bindAencyChange(item){
				this.addCourse.orgName = item.name
				this.addCourse.orgId = item.id
				this.showAency = false
			},
			// 拨打电话
			callPhone(item){
				uni.makePhoneCall({
				    phoneNumber: item.phone //仅为示例
				});
			},
			// 显示宝宝选择器
			checkaBaby(){
				this.showBaby = true
			},
			// 选择宝宝
			bindBabyChange(item){
				this.addCourse.babyName = item.nickName
				this.addCourse.babyId = item.id
				this.showBaby = false
			},
			// 选择时段
			selecdTime(){
				this.selectedType = ''
				this.addCourse.arrangeType == 10 ? this.showTimepopup = true : this.$refs.calendar.open();
			},
			// 时间段确定
			onConfirmtime(event){
				let array = event.detail.value.toString().split(',')
				let arr = []
				let value
				let munite
				

				array.forEach(item => {
					arr.push(item.replace(/时|分/,''))
				})
				if(this.addCourse.arrangeType == 10){
					value = arr[0] + ' ' + arr[1] + ':' + arr[2] + arr[3] + arr[4] + ':' + arr[5]
					munite = parseInt(arr[4] +''+ arr[5]) - parseInt(arr[1] +''+ arr[2]) <= 0
					// let startTime = (arr[1] > arr[4]) || (arr[5] - arr[2] < 10)
					// if(startTime){
					// 	this.$message("请选择起始时间小于结束的时间")
					// 	return
					// }
				}else if(this.addCourse.arrangeType == 20){
					value = this.addCourse.classDate + ' ' + arr[0] + ':' + arr[1] + arr[2] +  arr[3] + ':' + arr[4]
					munite = parseInt(arr[3] +''+ arr[4]) - parseInt(arr[0] +''+ arr[1]) <= 0
					// let startTime = arr[0] > arr[3] || arr[1] > arr[4]
					// if(startTime){
					// 	this.$message("请选择起始时间小于结束的时间")
					// 	return
					// }
				}
				if(munite){
					this.$message("请选择正确时间")
					return
				}
				
				if(this.selectedTime.includes(value)){
					this.$message("不可选择相同时间段")
					return
				}
				
				this.selectedTime.push(value)
				
				// 过滤同一天的时间段
				this.selectedTime = Array.from(new Set(this.selectedTime))
				
				this.addCourse.checkTime = this.selectedTime.toString()
				this.showTimepopup = false
			},
			clearItem(index1){
				this.selectedTime = this.selectedTime.filter(function(item,index){
					return index != index1
				})
				this.addCourse.checkTime = this.selectedTime.toString()
			},
			// 手动类型日期
			onConfirmClassdate(event){
				this.addCourse.classDate = common.formatDate(event.detail)
				this.showClassDate = false
				this.showTimepopup = true
			},
			// 开始时间选择确定
			onDatetime(event){
				this.addCourse.startTime = common.formatDate(event.detail)
				this.showStarttime = false
			},
			finishedHour(event){
				this.addCourse.usedHour = event.detail
			},
			toEductionInfo(){
				uni.navigateTo({
					url:"../my/eductionInfo"
				})
				this.showAency = false
			},
			toAddBaby(){
				uni.navigateTo({
					url:"../my/addBaby"
				})
				this.showBaby = false
			},
			
			// 添加课程提交请求
			onSave(){
				if(this.isClick){
					return
				}
				this.isClick = true
				this.isUpdate ? couse.addCourse(this,'upate') : couse.addCourse(this,'add')
			},
			
			// 保存为草稿状态
			onDraft(){
				this.addCourse.draftState = 30
				this.onSave()
			},
			
			// 修改课程
			// onUpdate(){
			// 	if(this.isClick){
			// 		return
			// 	}
			// 	this.isClick = true
			// 	couse.updateCourse(this)
			// }
		}
	}
</script>
<style>
	page{
		background-color: #F8F8F8;
	}
	.van-field__label{
		color: #333 !important;
	}
	.field-index--van-field:last-child>.van-cell::after{
		border: none;
	}
	.van-cell{
		height: 102rpx !important;
		padding-top: 27rpx !important;
	}
	.van-cell:last-child{
		border-radius: 30rpx;
	}
</style>
<style lang="scss" scoped>
	[v-cloak]{
		display: none;
	}
	.rubbish{
		color: red;
	}
	.list {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 30rpx;
		height: 102rpx;
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
	.other{
		width: 595rpx;
		height: 190rpx;
		margin: 0 auto;
		background: #F8F8F8;
		border-radius: 10rpx;
		padding: 20rpx;
		margin: 0 32rpx;
	}
	
	.course{
		width: 702rpx;
		padding-top: 18rpx;
		padding-bottom: 38rpx;
		margin: 20rpx auto;
		background: #FFFFFF;
		box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.06);
		border-radius: 30rpx;
		font-family: PingFang SC;
		.right-icon{
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
		}
		.my-picker{
			overflow-y:auto;
			width: 100%;
			max-height: 500rpx;
			margin-top: 110rpx;
		}
		.pickertime{
			position: absolute;
			right: 30rpx;
			bottom: 20rpx;
			width: 176rpx;
			height: 60rpx;
			font-size: 28rpx;
			background: #5294F7;
			border-radius: 30rpx;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 9;
		}
		.top-tab{
			width: 100%;
			height: 50rpx;
			position: fixed;
			padding-top: 33rpx;
			border-bottom: 1px solid #EEEEEE;
			padding-bottom: 15rpx;
			background-color: #FFFFFF;
			z-index: 9 !important;
			border-top-right-radius: 50rpx;
			border-top-left-radius: 50rpx;
			.cancelButton{
				display: inline-block;
				text-align: left;
				padding-left: 50rpx;
				position: absolute;
				left: 0;
				color: #B4B4B4;
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
		.selected-time{
			height: 25rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #909090;
			padding: 25rpx 0;
			text-align: right;
			margin: 0 32rpx;
			text{
				margin-right: 20rpx;
			}
		}

		.bottomline{
			margin: 0 32rpx;
			height: 1px;
			margin-top: 20rpx;
			border-bottom: 1rpx solid #ebedf0;
		}
		// .newaddbutton{
		// 	width: 100%;
		// 	height: 110rpx;
		// 	background: #FFFFFF;
		// 	font-size: 32rpx;
		// 	border-top: 1px solid #eeee;
		// 	font-family: PingFang SC;
		// 	font-weight: 500;
		// 	color: #FFFFFF;
		// 	text-align: center;
		// 	cursor: pointer;
		// 	position: fixed;
		// 	bottom: 0;
		// 	display: flex;
		// 	justify-content: center;
		// 	align-items: center;
		// 	view{
		// 		width: 272rpx;
		// 		height: 80rpx;
		// 		margin: 0 auto;
		// 		background: #5294F7;
		// 		border-radius: 40rpx;
		// 		line-height: 81rpx;
		// 		text{
		// 			margin-left: 10rpx;
		// 		}
				
		// 	}
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
			padding: 30rpx 0;
			position: relative;
			image{
				width: 44rpx;
				height: 44rpx;
				margin-left: 18rpx;
				position: absolute;
			}
		}
		.my-switch{
			position: absolute;
			right: 30rpx;
			bottom: 20rpx;
			width: 248rpx;
			height: 64rpx;
			border-radius: 15rpx;
			background: #EEEEEE;
			border: 1px solid #eee;
			// font-size: 15rpx;
			font-size: 28rpx;
			color: #333333;
			text-align: center;
			line-height: 65rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			line-height: 64rpx;
			z-index: 9;
			.my-switch-left{
				width:120rpx;
				height: 64rpx;
				padding:0 20rpx;
			}
			.my-switch-right{
				width:120rpx;
				height: 64rpx;
				padding:0 20rpx;
			}
			.active{
				width: 120rpx;
				background-color: #FB6362;
				box-shadow: 0px 0px 7rpx 1rpx rgba(140, 27, 30, 0.24);
				color: #FFFFFF;
				border-radius: 15rpx;
			}
		}
	}
	.first{
		padding-top: 0;
		padding-bottom: 0;
	}
	.second{
		padding-bottom: 30rpx;
		position: relative;
		.choose-time {
			position: absolute;
			top: 152rpx;
			right: 230rpx;
			font-size: 26rpx;
			color: #ccc;
			z-index: 9;
		}
	}
	
	.footer{
		display: flex;
		justify-content: space-between;
		view{
			padding: 47rpx 72rpx;
			width: 100%;
		}
	}
	
	.IPhone{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
