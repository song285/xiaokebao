<template>
	<view v-cloak>
		<van-swipe-cell :right-width="108" v-for="item,index in courseList" :key="index" >
			<view class="body-box" 
				:class="{'finished':item.state != 10}" 
				:style="{'background-color':item.state != 10 ? '#b9b9b9' : item.babyColor }"
				@click="toMyCourse(item)">
				<view class="course-box">
					<view class="course-name " ref='courseName'>
						<view class="courname eli" style="width: min-content;">
							{{item.name}}<text v-if="item.state == 30">(暂存)</text>
						</view>
						<view class="time-tips" :style="{ left: item.name.length * 19 + 'px','color':item.babyColor }" v-if="item.isEndTip == 1 && item.state == 10">
							即将结课
						</view>
					</view>
					<view class="course-right">
						<van-icon name="arrow" />
					</view>
				</view>
				<view class="main_center">
					<view class="left">
						<image :src="item.classBabyPic" mode="" :style="{ filter: item.state == 20 || item.state == 30 ? 'grayscale(100%)' : '' }"></image>
					</view>
					<view class="right">
						<view class="other-info">
							<view class="other-left spacil">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/blue/jig.png" v-if="item.state == 10 && item.babyColor == '#47A6FF'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/cyan/jig.png" v-if="item.state == 10 && item.babyColor == '#29C2DE'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/green/jig.png" v-if="item.state == 10 && item.babyColor == '#1ED87F'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/red/jig.png" v-if="item.state == 10 && item.babyColor == '#F24242'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/orange/jig.png" v-if="item.state == 10 && item.babyColor == '#FF7F2E'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/yellow/jig.png" v-if="item.state == 10 && item.babyColor == '#FFBA5F'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/jigouh-ic@2x.png" v-if="item.state != 10" alt="">
								<!-- <view class="eli" style="margin-left: 15rpx;" :style="{ 'max-width':item.orgName.length * 30 + 'rpx' }">{{item.orgName}} -->
								<view class="eli" style="margin-left: 15rpx;" :style="{ 'max-width':140 + 'rpx' }">{{item.orgName}}
									<!-- <img v-if="item.orgName.length <= 6" style="width: 35rpx;height: 35rpx;margin-left: 10rpx;" @click.stop="callPhone(item)" src="/static/images/dinaw-ic.png" alt=""> -->
								</view>
								<img v-if="!!item.orgPhone" style="width: 35rpx;height: 35rpx;margin-left: 10rpx;" @click.stop="callPhone(item)" src="/static/images/dinaw-ic.png" alt="">
							</view>
							<view class="other-right">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/blue/zongks.png" v-if="item.state == 10 && item.babyColor == '#47A6FF'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/cyan/zongks.png" v-if="item.state == 10 && item.babyColor == '#29C2DE'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/green/zongks.png" v-if="item.state == 10 && item.babyColor == '#1ED87F'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/red/zongks.png" v-if="item.state == 10 && item.babyColor == '#F24242'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/orange/zongks.png" v-if="item.state == 10 && item.babyColor == '#FF7F2E'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/yellow/zongks.png" v-if="item.state == 10 && item.babyColor == '#FFBA5F'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/zhongksh-ic@2x.png" v-if="item.state != 10" alt="">
								<text v-if="item.payType == 10">总课时：{{item.totalClassHour}}</text>
								<text v-if="item.payType == 20">剩余课时：{{item.restHour}}</text>
							</view>
						</view>
						<view class="other-info">
							<view class="other-left">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/blue/baobao.png" v-if="item.state == 10 && item.babyColor == '#47A6FF'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/cyan/baobao.png" v-if="item.state == 10 && item.babyColor == '#29C2DE'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/green/baobao.png" v-if="item.state == 10 && item.babyColor == '#1ED87F'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/red/baobao.png" v-if="item.state == 10 && item.babyColor == '#F24242'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/orange/baobao.png" v-if="item.state == 10 && item.babyColor == '#FF7F2E'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/yellow/baobao.png" v-if="item.state == 10 && item.babyColor == '#FFBA5F'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/baobh-ic@2x.png" v-if="item.state != 10" alt="">
								<text class="eli" style="width: 75%;display: inline-block;">宝宝：{{item.babyName}}</text>
							</view>
							<view class="other-right">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/blue/rest.png" v-if="item.state == 10 && item.babyColor == '#47A6FF'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/cyan/rest.png" v-if="item.state == 10 && item.babyColor == '#29C2DE'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/green/rest.png" v-if="item.state == 10 && item.babyColor == '#1ED87F'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/red/rest.png" v-if="item.state == 10 && item.babyColor == '#F24242'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/orange/rest.png" v-if="item.state == 10 && item.babyColor == '#FF7F2E'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/yellow/rest.png" v-if="item.state == 10 && item.babyColor == '#FFBA5F'" alt="">
								<img style="width: 30rpx;height: 30rpx;" src="/static/images/shnegyh-ic@2x.png" v-if="item.state != 10" alt="">
								<text v-if="item.payType == 10">剩余课时：{{item.restHour}}</text>
								<text v-if="item.payType == 20">待结算：{{item.unSettlementHour}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="bottomline"></view>
				<view class="footer" :style="{ 'justify-content' : identity_check == 10 || identity_check == 20 ? 'space-between' : 'flex-end' }" @click.stop>
					<!-- 预付费状态 -->
					<van-button round
						custom-style="height:58rpx;" 
						@click="toClassRecord(item)"
					><text :style="{ 'color': item.state != 10 ? '#666' : item.babyColor }">上课记录</text></van-button>
					<!-- 预付费状态 -->
					<van-button round v-show="item.payType == 10"
						custom-style="height:58rpx;" 
						@click="openTransferPopup(item)" 
						v-if="item.payType == 10 && item.state == 10 && (identity_check == 10 || identity_check == 20)"
					><text :style="{ 'color': item.state != 10 ? '#666' : item.babyColor }">转移课时</text></van-button>
					<!-- 未付费状态 -->
					<van-button round
						custom-style="height:58rpx;" 
						@click="toSettlementRecord(item)" 
						v-if="item.payType == 20 && item.state == 10 && (identity_check == 10 || identity_check == 20)"
					><text :style="{ 'color': item.state != 10 ? '#666' : item.babyColor }">结算记录</text></van-button>
					<!-- 预付费状态 -->
					<van-button round v-show="item.payType == 10"
						custom-style="height:58rpx;" 
						@click="toRefund(item)"
						v-if="item.payType == 10 && item.state == 10 && (identity_check == 10 || identity_check == 20)"
					><text :style="{ 'color': item.state != 10 ? '#666' : item.babyColor }">退费</text></van-button>
					<!-- 未付费状态 -->
					<van-button round
						custom-style="height:58rpx;" 
						@click="toSettlement(item)"
						v-if="item.payType == 20 && item.state == 10 && (identity_check == 10 || identity_check == 20)"
					><text :style="{ 'color': item.state != 10 ? '#666' : item.babyColor }">结算</text></van-button>
					<!-- 未付费状态 -->
					<van-button round
						custom-style="height:58rpx;"  
						@click="toEdit(item)"
						v-if="item.state == 10 && (identity_check == 10 || identity_check == 20)"
					><text :style="{ 'color': item.state != 10 ? '#666' : item.babyColor }">修改</text></van-button>
					<!-- 暂存 -->
					<van-button round
						custom-style="height:58rpx;" 
						@click="toEdit(item)"
						v-if="item.state == 30 && (identity_check == 10 || identity_check == 20)"
					><text :style="{ 'color': item.state == 30 ? '#666' : item.babyColor }">修改提交</text></van-button>
				</view>
			</view>
			<view slot="right" class="delbtn" @click="delCourse(item)">删除</view>
		</van-swipe-cell>
		<!-- 退费弹窗 -->
		<view class="xiao-overly" v-if="RefundPopup">
			<van-icon size="51rpx" 
				color="#fff" 
				@click="RefundPopup = false" 
				name="close" 
				custom-style="position:absolute;top:196rpx;right:50rpx;"/>
			<view class="xiao-popup">
				<img style="width: 100%;height: 258rpx;" src="/static/images/popup-ic.png" alt="">
				<view class="popup-label">
					<view class="label">本节课程共可退回</view>
					<view class="surplusprice">{{obj.restPrice}}元</view>
				</view>
				<view class="education-popup">
					<text class="edction-tips">联系机构进行退费</text>
					<view style="display: flex;justify-content: flex-end;width: 200rpx;">						
						<text class="edction-name eli" style="width: 110rpx;text-align: right;">{{obj.orgName}}</text>
						<image v-if="!!obj.orgPhone" style="width: 44rpx;height: 44rpx;" src="/static/images/dinah-ic.png" @click="callPhone(obj)"></image>
					</view>
				</view>
				<view class="popup-button">
					<van-button custom-style="height:90rpx;width:513rpx;" color="#5294F7" type="info" round @click="onRefund(obj)">结课</van-button>
				</view>
				<view class="tips-bottom">
					注：如已联系退费，请点击结课
				</view>
			</view>
		</view>
		<!-- 右下角添加按钮 -->
		<view v-if="identity_check == 10 || identity_check == 20" class="addicon" @click="navigetionAddCourse">
			<!-- <van-icon size="50rpx" name="plus" /> -->
			<view class="add_icon">添加课程</view>
		</view>
		<!-- 添加课程按钮 -->
		<!-- <view class="newaddButton">
			<van-button round icon="add-o" type="info" @click="navigetionAddCourse">添加课程</van-button>
		</view> -->
		<uni-load-more :status="moreStatus" @clickLoadMore="loadMore"></uni-load-more>
		<view style="padding-bottom: 150rpx;height: 1rpx;"></view>
		<!-- 底部导航 -->

		<Footer></Footer>
		
		<!-- 转移课时弹窗 -->
		<van-popup closeable close-icon='close' custom-style="width:80%;"
			@click-overlay="closeTransfer" 
			@close="closeTransfer" round :show="showTransfer">
			<view class="transferTitle">转移课时</view>
			<view class="transfer_input_class">
				<text class="">转移课时数：</text>
				<input type="number"  v-model="moveHours" />
			</view>
			<view class="transfer_button">
				<button type="default" @click="toTransfer">合并(与旧课程合并)</button>
				<button type="default" @click="toAddCourse">新课程(转移至新课程)</button>
			</view>
		</van-popup>
		
		<!-- 结算课时弹窗 -->
		<van-popup custom-style="width:80%;"
			round :show="showSettlement">
			<view class="transferTitle">结算课时</view>
			<view class="transfer_input_class">
				<text class="">结算课时数：</text>
				<input type="number"  v-model="settlementHours" />
			</view>
			<view class="transfer_button">
				<button type="default" @click="confirmSettlement">确认</button>
				<button type="default" @click="closeSettlement">取消</button>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import index from "../../js/api/course/index.js"
	import common from "../../js/common/common.js"
	import message from '../../js/api/my/message.js'
	
	export default {
		data() {
			return {
				RefundPopup:false,
				showTransfer:false,
				moveHours:'',
				courseList:[],
				checkedBaby:[],
				identity_check:'',
				obj:{},
				moreStatus:"noMore",
				start:0,
				length:5,
				isClick:false,
				transferObj:'',
				endtip:0,
				settlementHours:'',
				showSettlement:false,
				settlementClassId:'',
				settlementOld:'',
				timer:null
			};
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
			// 刷新页面
			refresh(){
				this.checkedBaby = []
				this.start = 0
				common.babyList(this,1)
				this.courseList = []
				setTimeout(()=>{
					index.getInfo(this)
				},500)
			},
			// endtipWidth(){
			// 	let that = this;
			// 	//创建节点选择器
			// 	let query = wx.createSelectorQuery();
			// 	//选择class id
			// 	query.select('.courname').boundingClientRect(function (rect) {
			// 		that.endtip = rect.width
			// 	}).exec();
			// },
			// 删除课程
			delCourse(item){
				if(this.identity_check != 10 && this.identity_check != 20){
					this.$message("您暂无操作权限")
					return
				}
				if(this.isClick){
					return
				}
				this.isClick = true
				let _this = this
				uni.showModal({
					content: '您确定删除该课程吗？',
					success: function (res) {
						if (res.confirm) {
							index.delCourse(item,_this)
							_this.start = 0
							_this.courseList = []
							common.babyList(_this,1)
							index.getInfo(_this)
						}
					},
					complete:function(){
						_this.isClick = false
					}
				})
			},
			// 修改课程
			toEdit(item){
				if(this.isClick){
					return
				}
				this.isClick = true
				uni.navigateTo({
					url:"./addCourse?title=修改课程&datas=" + JSON.stringify(item)
				})
			},
			getInfo(){
				index.getInfo(this)
			},
			// 去退费
			toRefund(item){
				this.RefundPopup = true
				this.obj = {
					id:item.id,
					restPrice:item.restPrice,
					orgName:item.orgName,
					orgPhone:item.orgPhone
				}
			},
			// 退费
			onRefund(obj){
				if(this.isClick){
					return
				}
				this.isClick = true
				
				index.reFund(obj,this)
				
				this.$nextTick(function(){
					this.refresh()
				})
			},
			// 关闭退费弹窗
			closeTransfer(){
				this.showTransfer = false
				this.isClick = false
			},
			
			// 结算
			toSettlement(item){
				this.showSettlement = true
				this.settlementClassId = item.id
				this.settlementHours = item.unSettlementHour
				this.settlementOld = item.unSettlementHour
			},
			// 确认结算
			confirmSettlement(){
				if(!this.settlementHours){
					this.$message('结算课时不能为空')
					return
				}
				
				if(this.settlementHours <= 0){
					this.$message('结算课时不能小于1个课时')
					return
				}
				
				if(this.settlementHours > this.settlementOld){
					this.$message('待结算课时不足')
					return
				}
				this.showSettlement = false
				
				clearTimeout(this.timer)
				this.timer = setTimeout(()=>{
					index.addSettlementRecord(this,() => { this.refresh() })
				},1000)
			},
			// 关闭结算弹窗
			closeSettlement(){
				this.showSettlement = false
				this.isClick = false
			},
			// 切换导航
			// onChange(item,index) {
			// 	if(index == this.active) return
			// 	this.active = index
			// 	uni.redirectTo({
			// 		url:item.page
			// 	})
		 //    },
			// 打电话
			callPhone(item){
				if(this.isClick){
					return
				}
				this.isClick = true
				uni.makePhoneCall({
					phoneNumber:item.orgPhone,
					success:(res)=>{
						this.isClick = false
					},
					fail:(err)=>{
						this.isClick = false
					}
				})
			},
			//添加课程
			navigetionAddCourse(){
				if(!common.checkLogin(this)){
					return
				}
				if(this.isClick){
					return
				}
				this.isClick = true
				message.scribeMessage(this,'./addCourse')
			},
			toClassRecord(item){
				if(this.isClick){
					return
				}
				this.isClick = true
				uni.navigateTo({
					url:"classRecord?classid=" + item.id
				})
			},
			// 结算记录
			toSettlementRecord(item){
				if(this.isClick){
					return
				}
				this.isClick = true
				uni.navigateTo({
					url:"classRecord?classid=" + item.id + '&title=结算记录'
				})
			},
			toTransfer(){
				// this.showTransfer = true
				if(!this.moveHours){
					this.$message("请填写转移课时数")
					return
				}
				if(this.isClick){
					return
				}
				this.isClick = true
				let data = JSON.stringify(this.transferObj)
				uni.navigateTo({
					url:"transfer?list=" + data + "&moveHours=" + this.moveHours
				})
				this.showTransfer = false
			},
			openTransferPopup(item){
				this.showTransfer = true
				this.transferObj = item
			},
			toAddCourse(){
				if(!this.moveHours){
					this.$message("请填写转移课时数")
					return
				}
				if(this.moveHours > this.transferObj.restHour){
					this.$message("转移课时数不能大于剩余课时")
					return
				}
				if(this.isClick){
					return
				}
				this.isClick = true
				let data = JSON.stringify(this.transferObj)
				uni.navigateTo({
					url:"./addCourse?moveHours=" + this.moveHours + "&title=转移课时数" + "&lists=" + data
				})
				this.showTransfer = false
			},
			toMyCourse(item){
				if(this.isClick){
					return
				}
				this.isClick = true
				uni.navigateTo({
					url:"myCourse?id=" + item.id
				})
			},
			// 加载更多
			loadMore(){
				if(this.moreStatus != 'more'){
					return
				}
				this.moreStatus = "loading"
				this.start = this.start + this.length
				this.getInfo()
			},
			getBabylist(){
				common.babyList(this,1,()=>{
					this.getCourselist()
				})
			},
			getCourselist(){
				index.getInfo(this)
			}
		},
		onLoad() {
			uni.hideHomeButton()
		},
		onShow() {
			this.isClick = false
			this.start = 0
			this.courseList = []
			this.getBabylist()
			this.identity_check = uni.getStorageSync("identity_check")
			this.$store.commit("choiceFooter",2)
			// setTimeout(()=>{
			// 	this.endtipWidth()
			// },1500)
		}
	}
</script>
<style>
	page{
		/* overflow: hidden; */
	}
	.van-icon-add-o:before{
		margin-top: 2rpx;
	}
	.van-tabbar{
		height: 120rpx !important;
		box-shadow: 0px 7rpx 21rpx 0px rgba(0, 0, 0, 0.18) !important;
	}
	.van-button__text{
		font-size: 28rpx
	}
	.van-button--default{
		border: none !important;
	}
	.van-button::after{
		border: none !important;
	}
</style>
<style lang="scss">
	[v-cloak]{
		display: none;
	}
	.transferTitle{
		color: #666666;
		text-align: center;
		width: 100%;
		margin-top: 30rpx;
	}
	.transfer_input_class{
		padding: 30rpx;
		color: #666666;
		display: flex;
		justify-content: center;
		align-items: center;
		text{
			font-size: 30rpx;
		}
		input{
			width: 40%;
			border: 1rpx solid #f2f2f2;
			padding: 10rpx 20rpx;
		}
	}
	.transfer_button{
		margin: 0 30rpx;
		button::after{
			border: none;
		}
		button{
			border: 1rpx solid #F8F8F8;
			border-radius: 50rpx;
			width: 80%;
			font-size: 28rpx;
			color: #fff;
			margin: 20rpx auto;
			background-color: #007AFF;
		}
	}
	.transfer_button button:nth-child(2){
		margin-bottom: 30rpx;
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
		z-index: 99999999999;
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
				color: #323232;
				.edction-name{
					display: inline-block;
					padding-right: 14rpx;
				}
				image{
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
	}
	.body-box{
		width: 655rpx;
		height: 285rpx;
		margin: 20rpx auto;
		background: #47A6FF;
		box-shadow: 0px 0px 18rpx 0px rgba(11, 74, 124, 0.16);
		border-radius: 30rpx;
		padding: 34rpx 27rpx 16rpx;
		position: relative;
		padding-top: 20rpx;
		.course-box{
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #FFFFFF;
			.course-name{
				max-width: 80%;
				width: 100%;
				font-size: 34rpx;
				font-family: PingFang SC;
				font-weight: 500;
				position: relative;
			}
		}
		.other-info{
			width: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			color: #FFFFFF;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			padding: 11rpx 0;
			vertical-align: middle;
			white-space: nowrap;
			image{
				vertical-align: middle;
			}
			text{
				padding: 0 11rpx;
				vertical-align: middle;
			}
			.spacil{
				display: flex;
				align-items: center;
			}
			.other-left{
				width: 270rpx;
				vertical-align: middle;
			}
			.other-right{
				width: 40%;
				text-align: left;
				vertical-align: middle;
			}
		}
		.bottomline{
			width: 100%;
			height: 1px;
			position: absolute;
			left: 0;
			right: 0;
			background-color: #FFFFFF;
			opacity: 0.15;
			margin: 18rpx 0;
		}
		.footer{
			margin-top: 39rpx;
			display: flex;
			justify-content: space-between;
		}
	}
	.time-tips{
		position: absolute;
		top: 0;
		left: 0;
		width: 100rpx;
		height: 40rpx;
		background: #FFFFFF;
		border-radius: 20rpx 6rpx 10rpx 0px;
		font-size: 20rpx;
		font-weight: 500;
		color: #FB6362;
		text-align: center;
		line-height: 38rpx;
	}
	.newaddButton{
		width: 403rpx;
		height: 90rpx;
		margin: 0 auto;
		margin-top: 51rpx;
		// margin-bottom: 200rpx;
		button{
			width: 403rpx;
			height: 90rpx;
		}
	}
	.finished{
		background-color: #b9b9b9;
		position: relative;
		button{
			position: absolute;
			right: 30rpx;
			color: #666666 !important;
		}
	}
	
	.main_center{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 20rpx;
		.left{
			width: 104rpx;
			height: 104rpx;
			border-radius: 50%; 
			image{
				width: 104rpx;
				height: 104rpx;
				border-radius: 50%;
			}
		}
		.right{
			margin-left: 30rpx;
		}
	}
	
	.eli {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.delbtn{
		width: 192rpx;
		height: 100%;
		background: #F97878;
		text-align: center;
		line-height: 100rpx;
		color: #fff;
		font-size: 30rpx;
		line-height: 340rpx;
		border-radius: 30rpx;
	}
</style>
