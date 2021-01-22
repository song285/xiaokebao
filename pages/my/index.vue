<template>
	<view v-cloak>
		<view class="empty_custom" :style="{ opacity:showStatusbar.opacity,height:customH + 44 + 'px' }">
			<!-- <text :style="{ top:customT }">小马消课</text> -->
			<view class="custom">
				<text>小马消课</text>
			</view>
		</view>
		<!-- 用户信息 -->
		<view class="header">
			<img src="/static/images/beiji@2x.png" alt="">
			<view class="user-info" v-if="">
				<view class="user-portrait">
					<img :src="userinfo.head || '/static/images/jiaz.png'" alt="">
				</view>
				<view class="user-name">
					<text>{{userinfo.nickName}}</text>
					<text v-if="isLogin" class="editer" @click="goUserInfo(userinfo)">编辑</text>
					<text v-if="!isLogin" class="loginbtn" @click="toLogin">登录</text>
					<view class="user-coordinate">{{userinfo.address}}</view>
				</view>
			</view>
			<!-- 公告 -->
			<view class="sys-infobox" @click="goMessage">
				<view class="sys-left">
					<img src="/static/images/xiaozi-ic@2x.png" alt="">
				</view>
				<view class="sys-info">
					<text v-if="messageList.length <= 0">暂无相关消息</text>
					<swiper 
						v-if="messageList.length > 0" 
						class="swiper-class"
						:autoplay="true" 
						:interval="3000" 
						:vertical="true"
						:duration="1000">
						<swiper-item v-for="(item,index) in messageList" :key="index">
							<view class="swiper-item">
								<text>{{ item.content }}</text>
							</view>
						</swiper-item>
					</swiper>
				</view>
				
				<view class="sys-more">
					<text style="vertical-align: middle;">更多</text>
					<!-- <van-icon name="arrow" color="#5294F7" /> -->
					<img style="width: 13rpx;height: 21rpx;margin-left: 12rpx;vertical-align: middle;" src="/static/images/more-icon.png" alt="">
				</view>
			</view>
		</view>
		<!-- 主体信息 -->
		<view class="main">
			<view class="parent">
				<view>关联家长<text v-if="currentFamily" style="color: #007AFF;font-weight: 400;">{{ `(${currentFamily})` }}</text></view>
				<view class="switch" @click="parentSelection">
					<image src="../../static/images/qieh-ic.png" mode=""></image>切换家庭
				</view>
			</view>
			<view class="parent-list">
				<view class="list-box" v-for="(item,index) in parenList" :key="index">
					<view class="list-items">
						<image 
							v-show="identity_check == 10 || identity_check == 20"
							class="del-icon" 
							src="../../static/images/del-sanc-ic.png" 
							v-if="item.arrowDel" mode="" 
							@tap.stop="delBabypup(1,item.id)">
						</image>
						<img style="width: 100rpx;height: 100rpx;border-radius: 50%;border: 2rpx solid #f2f2f2;" :src="item.head || '/static/images/jiaz.png'" alt="">
					</view>
					<view class="parent-name eli">{{item.nickName}}</view>
				</view>
				<view>
					<button class="sharebtn" open-type="share" :data-id='shareid'>
						<view class="defaultadd">
							<view class="list-items">
								<img style="width: 100rpx;height: 100rpx;" src="/static/images/tianjia-ic@2x.png" alt="">
							</view>
							<view>邀请</view>
						</view>
					</button>
				</view>
			</view>
			<!-- 宝宝管理 -->
			<view class="babies" v-if="Object.keys(babyList).length > 0 || (identity_check == 10 || identity_check == 20)">宝宝管理</view>
			<view class="parent-list">
				<view class="list-box" v-for="(item,index) in babyList" :key="index" @tap="goUpdataAddBaby(item)">
					<view class="list-items">
						<image v-if="identity_check == 10 || identity_check == 20" class="del-icon" src="../../static/images/del-sanc-ic.png" mode="" @tap.stop="delBabypup(2,item.id)"></image>
						<img style="width: 100rpx;height: 100rpx;border-radius: 50%;" :src="item.head" alt="">
					</view>
					<view class="parent-name eli">{{item.nickName}}</view>
				</view>
				<view class="defaultadd" @click="goAddBaby" v-if="babyList.length < 6" v-show="identity_check == 10 || identity_check == 20">
					<view class="list-items">
						<img style="width: 100rpx;height: 100rpx;" src="/static/images/tianjia-ic@2x.png" alt="">
					</view>
					<view>添加</view>
				</view>
			</view>
		</view>
		<!-- 菜单 -->
		<view style="padding-bottom: 200rpx;">
			<van-cell-group :border="false">
				<van-cell v-if="identity_check == 10 || identity_check == 20" title="机构管理" @click="goMechanism">
					<img slot="icon" class="icon-class" src="/static/images/jig-ic@2x.png" alt="">
					<img slot="right-icon" style="width: 11rpx;height: 20rpx;" class="icon-class" src="/static/images/right-icon.png" alt="">
				</van-cell>
				<van-cell title="联系客服" @click="goCustomerService">
					<img slot="icon" style="width: 34rpx;height: 39rpx;" class="icon-class" src="/static/images/lianx-ic@2x.png" alt="">
					<img slot="right-icon" style="width: 11rpx;height: 20rpx;" class="icon-class" src="/static/images/right-icon.png" alt="">
				</van-cell>
				<van-cell title="产品反馈" @click="goFeedback">
					<img slot="icon" style="width: 34rpx;height: 37rpx;" class="icon-class" src="/static/images/chanp-ic@2x.png" alt="">
					<img slot="right-icon" style="width: 11rpx;height: 20rpx;" class="icon-class" src="/static/images/right-icon.png" alt="">
				</van-cell>
				<van-cell title="提醒设置" @click="goMshsetting">
					<img slot="icon" style="width: 32rpx;height: 40rpx;" class="icon-class" src="/static/images/tixing-ic@2x.png" alt="">
					<img slot="right-icon" style="width: 11rpx;height: 20rpx;" class="icon-class" src="/static/images/right-icon.png" alt="">
				</van-cell>
				<van-cell title="关于我们" @click="goAbout">
					<img slot="icon" style="width: 35rpx;height: 35rpx;" class="icon-class" src="/static/images/gaunyu-ic@2x.png" alt="">
					<img slot="right-icon" style="width: 11rpx;height: 20rpx;" class="icon-class" src="/static/images/right-icon.png" alt="">
				</van-cell>
				<van-cell title="帮助中心" @click="goHelp">
					<img slot="icon" style="width: 34rpx;height: 34rpx;" class="icon-class" src="/static/images/bangz-ic@2x.png" alt="">
					<img slot="right-icon" style="width: 11rpx;height: 20rpx;" class="icon-class" src="/static/images/right-icon.png" alt="">
				</van-cell>
				<van-cell title="退出账号" @click="onExit">
					<img slot="icon" style="width: 34rpx;height: 36rpx;" class="icon-class" src="/static/images/tuic-ic@2x.png" alt="">
					<img slot="right-icon" style="width: 11rpx;height: 20rpx;" class="icon-class" src="/static/images/right-icon.png" alt="">
				</van-cell>
			</van-cell-group>
		</view>

		<!-- 切换家长弹窗 -->
		<van-popup :show="isParentShow" @close="onClose" custom-style="max-height:40%" position="bottom" round="30rpx">
			<view class="aency-items" v-for="(item,index) in switchParentsList" :key="index" @click="parentState(item)">
				<text>{{item.homeName}}</text>
			</view>
			<view class="cancelbutton aency-items" @click="onClose">
				<view class="">
					<text>取消</text>
				</view>
			</view>
		</van-popup>
		<!-- 底部导航 -->
		<!-- <van-tabbar :active="active">
			<van-tabbar-item v-for="(item,index) in icon" :key="index" @click="onChange(item,index)">
				<image slot="icon" :src="item.normal" mode="aspectFit" style="width: 38rpx; height: 38rpx;" />
				<image slot="icon-active" :src="item.selected" mode="aspectFit" style="width: 38rpx; height: 38rpx;" />
				{{item.name}}
			</van-tabbar-item>
		</van-tabbar> -->
		<Footer></Footer>
		<!-- 删除弹窗 -->
		<van-popup :show="delBaby" round @close="onClose">
			<view class="del-popup" v-if="isBaby">
				<view>确认删除该宝宝？</view>
				<view>（已添加课程信息的宝宝无法删除）</view>
				<view class="del-btn">
					<view @click="onClose">取消</view>
					<view @click="delBabyItem">确认</view>
				</view>
			</view>
			<view class="del-popup" v-if="!isBaby">
				<view>确认删除该家长？</view>
				<view>（删除后该家长将无法查看各类相关信息）</view>
				<view class="del-btn">
					<view @click="onClose">取消</view>
					<view @click="delBabyItem">确认</view>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import index from '../../js/api/my/index.js'
	import common from '../../js/common/common.js'
	import message from '../../js/api/my/message.js'
	import changeFamily from '../../js/api/my/changeFamily.js'
	export default {
		data() {
			return {
				isSwitch:false,
				customH:0,
				customT:0,
				messageList: [],
				identity_check:"",
				page: {
					start: 0,
					length: 5,
				},
				customHeight: uni.getSystemInfoSync().statusBarHeight,
				userinfo: {},
				shareid: '',
				nowUserId: uni.getStorageSync("nowUserId"),
				// 底部导航信息
				// active: 3,
				// icon: [{
				// 		normal: '/static/images/kebiao1-ic.png',
				// 		selected: '/static/images/kebiao2-active.png',
				// 		name: '课表',
				// 		page: '../index/index'
				// 	},
				// 	{
				// 		normal: '/static/images/kecheng1-ic.png',
				// 		selected: '/static/images/kecheng2-active.png',
				// 		name: '课程',
				// 		page: '../course/index'
				// 	},
				// 	{
				// 		normal: '/static/images/shangdwx-ic.png',
				// 		selected: '/static/images/zhangd-active.png',
				// 		name:'账单',
				// 		page:'../bill/index'
				// 	},
				// 	{
				// 		normal: '/static/images/wod1-ic.png',
				// 		selected: '/static/images/wod2-active.png',
				// 		name: '我的',
				// 		page: '../my/index'
				// 	}
				// ],
				// 关联家长接口
				parenList: [],
				// 宝宝管理接口
				babyList: [],
				isParentShow: false, //切换家长身份弹窗
				switchParentsList: [], //切换家长身份
				delBaby: false, //删除baby弹窗
				babyId: '',
				isBaby: false,
				topRange: '',
				scrollSize: '',
				showStatusbar: {
					'opacity': 0,
					'index': 0
				},
				isClick:false,
				currentFamily:uni.getStorageSync('currentFamily')
			};
		},
		computed:{
			isLogin(){
				return Object.keys(this.userinfo).length > 0
			},
		},
		watch:{
			identity_check(){
				return uni.getStorageSync("identity_check")
			}
		},
		methods: {
			//自定义状态栏机型适配
			GetStatusBarHeight() {
				let that = this
				uni.getSystemInfo({
					success: function (res) {
						that.customH = res.statusBarHeight
						let phoneType = ['iPhone XR','iPhone X','iPhone 11','iPhone XS Max','iPhone 12']
						let isIphone = phoneType.indexOf(res.model) > -1
						if(isIphone){
							that.customT = 60 + '%'
						}else{
							that.customT = 40 + '%'
						}
					}
			    })
			},
			// 登录
			toLogin(){
				uni.navigateTo({
					url: '/pages/index/login'
				})
				
				// uni.login({
				// 	provider:'weixin',
				// 	success(res) {
				// 		uni.setStorageSync('wxcode',res.code)
				// 	}
				// })
			},
			// 切换导航
			onChange(item, index) {
				if(index == this.active) return
				this.active = index
				uni.redirectTo({
					url: item.page
				})
			},
			//跳个人信息
			goUserInfo(userinfo) {
				if(this.isClick){
					return
				}
				this.isClick = true
				uni.navigateTo({
					url: './userInfo?userinfo=' + JSON.stringify(userinfo)
				})
			},
			//跳机构管理
			goMechanism() {
				if(!common.checkLogin(this)){
					return
				}
				if(this.isClick){
					return
				}
				// this.isClick = true
				// uni.navigateTo({
				// 	url:'./mechanism'
				// })
				if(this.isClick){
					return
				}
				this.isClick = true
				message.scribeMessage(this,'./mechanism')
			},
			//添加baby
			goAddBaby() {
				if(!common.checkLogin(this)){
					return
				}
				if(this.isClick){
					return
				}
				// this.isClick = true
				// uni.navigateTo({
				// 	url:'./addBaby'
				// })
				if(this.isClick){
					return
				}
				this.isClick = true
				message.scribeMessage(this,'./addBaby')
			},
			goUpdataAddBaby(item) { //修改宝宝信息
				//console.log(this.identity_check)
				if(this.identity_check == 10 || this.identity_check == 20){
					uni.navigateTo({
						url: './addBaby?title=修改宝宝信息&item=' + JSON.stringify(item)
					})
				}else return
				
			},
			//跳客服
			goCustomerService() {
				if(!common.checkLogin(this)){
					return
				}
				if(this.isClick){
					return
				}
				this.isClick = true
				uni.navigateTo({
					url: "./customerService"
				})
			},
			//消息页
			goMessage() {
				if(!common.checkLogin(this)){
					return
				}
				if(this.isClick){
					return
				}
				this.isClick = true
				uni.navigateTo({
					url: "./message"
				})
			},
			goFeedback() {
				if(!common.checkLogin(this)){
					return
				}
				if(this.isClick){
					return
				}
				this.isClick = true
				uni.navigateTo({
					url: "./feedBack"
				})
			},
			goAbout() {
				if(!common.checkLogin(this)){
					return
				}
				if(this.isClick){
					return
				}
				this.isClick = true
				uni.navigateTo({
					url: "./about"
				})
			},
			goHelp(){
				if(!common.checkLogin(this)){
					return
				}
				if(this.isClick){
					return
				}
				this.isClick = true
				uni.navigateTo({
					url: "./about?title=帮助中心"
				})
			},
			goMshsetting(){
				if(!common.checkLogin(this)){
					return
				}
				if(this.isClick){
					return
				}
				this.isClick = true
				message.scribeMessage(this,'./msgSetting')
			},
			parentSelection() { //切换家庭
				if(!common.checkLogin(this)){
					return
				}
				this.isParentShow = true
			},
			parentState(item) { //弹窗关闭赋值
				changeFamily.changeFamily(item,this)
				this.isParentShow = false
			},
			delBabypup(num, id) { //弹窗删除关闭
				this.delBaby = true
				this.idType = num
				if (num == 1) {
					this.userId = id
					this.isBaby = false
				} else {
					this.babyId = id
					this.isBaby = true
				}
			},
			delBabyItem() { //删除baby
				if (this.idType == 1) {
					index.delParent(this)
				}
				if (this.idType == 2) {
					index.delBaby(this)
				}
				this.delBaby = false
				message.messageList(this)
			},
			//关闭弹窗
			onClose() {
				this.isParentShow = false
				this.delBaby = false
			},
			// 数据初始化
			init(){
				this.isClick = false
				index.switchParents(this)
				common.userInfo(this)
				common.babyList(this)
				index.parentList(this)
				setTimeout(()=>{
					message.messageList(this)
				},800)
			},
			
			// 退出
			onExit(){
				let _this = this
				if(!common.checkLogin(this)){
					return
				}
				uni.showModal({
				    content: '您确定退出吗？',
				    success: function (res) {
				        if (res.confirm) {
							uni.showLoading({
								title:'正在退出...',
								mask:true
							})
				            setTimeout(()=>{
								uni.removeStorageSync('userToken')
								uni.removeStorageSync('currentFamily')
								uni.removeStorageSync('isFirstLogin')
								uni.removeStorageSync('nowUserId')
								_this.messageList=[]
								_this.userinfo={}
								_this.parenList=[]
								_this.babyList=[]
								_this.currentFamily=''
								_this.$message("退出成功")
								uni.hideLoading()
							},1000)
							
				        } else if (res.cancel) {
				            return
				        }
				    }
				});
				
			},
		},
		onShow() {
			this.init()
			this.identity_check = uni.getStorageSync("identity_check")
			this.$store.commit("choiceFooter",4)
		
		},
		onShareAppMessage: function(options) {
			if(!common.checkLogin(this) || options.from !== 'button'){
				return {
					title: '小马消课',
					desc: '小马消课',
					imageUrl: '/static/images/sharepic.png'
				}
			}else{
				return {
					title: '邀请您进入家庭',
					desc: '邀请您进入家庭',
					path: '/pages/index/login?userId=' + this.shareid ,// 路径，传递参数到指定页面。
					imageUrl: '/static/images/sharepic.png'
				}
			}
			
		},
		onLoad() {
			this.GetStatusBarHeight()
			// 监听筛选组件距离顶部的距离
			const query = uni.createSelectorQuery()
			query.select('.empty_custom').boundingClientRect()
			query.exec((res) => {
				this.topRange = res[0].height //获取距离顶部的高度并保存
			})
		},
		onPageScroll(e) {
			this.showStatusbar.opacity = e.scrollTop * 0.02
		}
	}
</script>
<style>
	page {
		/* overflow: hidden; */
	}

	.van-icon-add-o:before {
		margin-top: 5rpx;
	}
	
	.van-icon:before{
		color: #B4B4B4 !important;
		font-size: 28rpx !important;
	}

	.van-tabbar {
		height: 120rpx !important;
		box-shadow: 0px 7rpx 21rpx 0px rgba(0, 0, 0, 0.18) !important;
	}
	.van-cell {
		height: 102rpx !important;
		align-items: center;
		padding-top: 27rpx !important;
	}

	.sharebtn {
		background: none !important;
		font-size: 28rpx;
		line-height: normal;
		padding: unset;
		margin: initial;
	}

	.sharebtn::after {
		border: none !important;
	}
</style>
<style lang="scss">
	[v-cloak] {
		display: none;
	}

	.header {
		width: 100%;
		height: 390rpx;
		position: relative;
		font-family: PingFang SC;

		img {
			width: 100%;
			height: 390rpx;
		}

		.user-info {
			position: absolute;
			top: 180rpx;
			left: 25rpx;
			width: 702rpx;
			display: flex;
			direction: ltr;
			align-items: center;

			.user-portrait {
				width: 116rpx;
				height: 116rpx;
				border-radius: 50%;
				border: 1rpx solid #f2f2f2;
				img {
					width: 116rpx;
					height: 116rpx;
					border-radius: 50%;
				}
			}

			.user-name {
				margin-left: 19rpx;
				font-size: 36rpx;
				font-weight: bold;
				color: #FFFFFF;
				line-height: 36rpx;

				.editer,.loginbtn {
					width: 72rpx;
					height: 34rpx;
					background: #FFFFFF;
					border-radius: 30rpx;
					font-size: 24rpx;
					font-weight: 500;
					color: #5294F7;
					padding: 7rpx 22rpx;
					margin-left: 21rpx;
				}
				.loginbtn{
					border-radius: 13rpx;
					padding: 20rpx 60rpx;
				}

				.user-coordinate {
					font-size: 26rpx;
					font-weight: 500;
					padding-top: 14rpx;
				}
			}
		}
		
		.tologin{
			
		}
		
		.sys-infobox {
			width: 702rpx;
			height: 89rpx;
			margin: 0 auto;
			position: absolute;
			bottom: -43rpx;
			left: 25rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 24rpx 3rpx rgba(17, 51, 103, 0.14);
			border-radius: 45rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;

			.sys-left {
				margin-left: 25rpx;

				img {
					width: 36rpx;
					height: 36rpx;
					vertical-align: -5rpx;
				}
			}

			.sys-info {
				width: 443rpx;
				font-size: 26rpx;
				font-weight: 500;
				color: #666666;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				.swiper-class{
					height: 88rpx;
					line-height: 88rpx;
				}
			}

			.sys-more {
				font-size: 28rpx;
				font-weight: 500;
				color: #5294F7;
				margin-right: 15rpx;
				text {
					vertical-align: 5rpx;
				}
			}
		}
	}

	.main {
		max-width: 702rpx;
		margin: 0 auto;
		margin-top: 85rpx;
		margin-bottom: 40rpx;
		.parent,
		.babies {
			height: 31rpx;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #333333;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.switch {
			display: flex;
			align-items: center;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #666666;

			image {
				height: 28rpx;
				width: 28rpx;
				display: block;
				margin-right: 6rpx;
			}
		}

		.babies {
			margin-top: 65rpx;
		}
		
		.parent-list::-webkit-scrollbar { 
			width: 0 !important 
		}

		.parent-list {
			display: flex;
			direction: ltr;
			align-items: center;
			margin-top: 27rpx;
			text-align: center;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #333333;
			overflow-x: auto;
			
			.list-box {
				margin-right: 70rpx;

				.list-items {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					position: relative;

					.del-icon {
						position: absolute;
						height: 24rpx;
						width: 24rpx;
						display: block;
						top: 0;
						right: 0;
					}
				}

				.parent-name {
					width: 105rpx;
					margin-top: 12rpx;
				}
			}

			.defaultadd {
				color: #909090;
			}
		}
	}

	.icon-class {
		width: 36rpx;
		height: 34rpx;
		margin-right: 20rpx;
		// margin-top: 5rpx;
	}

	.aency-items {
		border-bottom: 1px solid #eeee;
		width: 100%;
		line-height: 110rpx;
		text-align: center;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
	}

	.cancelbutton {
		border: none;
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

	.empty_custom {
		position: fixed;
		top: 0;
		height: calc(var(--status-bar-height) + 40px);
		width: 100%;
		text-align: center;
		font-size: 37rpx;
		z-index: 9;
		color: #fff;
		background-color: #5294F7;
		.custom{
			position: relative;
			height: 100%;
			text {
				position: absolute;
				bottom: 20rpx;
				left: 0;
				right: 0;
				font-size: 1rem;
			}
		}
	}
</style>
