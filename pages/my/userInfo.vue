<template>
	<view v-cloak>
		<view class="main">
			<view class="list">
				<view class="title">头像</view>
				<image class="portrait" :src="userImg || '/static/images/jiaz.png'" mode="" @tap="ChooseImage"></image>
			</view>
			<view class="list">
				<view class="title">手机号</view>
				<input type="number" class="content" style="text-align: right;" disabled maxlength="11" placeholder-style="text-align:right"
				 :class="{'noPhone':isPhone}" @input="isPhone = false" @blur="onBlur" placeholder="请输入手机号" v-model="userPhone" />
			</view>
			<view class="list">
				<view class="title">昵称</view>
				<input type="text" class="content" style="text-align: right;" maxlength="11" placeholder-style="text-align:right" v-model="userName" />
			</view>
			<view class="list" @click="showPopup">
				<view class="title">性别</view>
				<view class="content">{{gender}}
					<image class="jiantou" src="../../static/images/more-ic.png" mode="">
				</view>
			</view>
			<view class="list" @click="identitySelection">
				<view class="title">家庭身份</view>
				<view class="content">{{identity}}
					<image class="jiantou" src="../../static/images/more-ic.png" mode="">
				</view>
			</view>
			<view class="list" @click="showBirthday">
				<view class="title">生日</view>
				<view class="content">{{birthday}}
					<image class="jiantou" src="../../static/images/more-ic.png" mode="">
				</view>
			</view>
			<view class="list" @click="showRegion">
				<view class="title">地区</view>
				<view class="content">{{region}}
					<image class="jiantou" src="../../static/images/more-ic.png" mode="">
				</view>
			</view>
		</view>
		<view class="preservation" @click="updataUserInfo">保存</view>
		<!-- 性别 -->
		<van-popup :show="isGender" @close="onClose" position="bottom" round="30rpx">
			<view class="my-picker">
				<view class="aency-items" v-for="(item,index) in genderList" :key="index" @click="genderSelection(item)">
					<text>{{item}}</text>
				</view>
			</view>
			<view class="cancelbutton" @click="onClose">
				<view class="">
					<text>取消</text>
				</view>
			</view>
		</van-popup>
		<!-- 身份 -->
		<van-popup :show="isIdentity" @close="onClose" position="bottom" round="30rpx">
			<view class="my-picker">
				<view class="aency-items" v-for="(item,index) in identityList" :key="index" @click="identityState(item)">
					<text>{{item}}</text>
				</view>
			</view>
			<view class="cancelbutton" @click="onClose">
				<view class="">
					<text>取消</text>
				</view>
			</view>
		</van-popup>
		<!-- 生日 -->
		<w-picker :visible.sync="isBirthday" mode="date" startYear="1900" endYear="2150" :current="true" fields="day"
		 @confirm="birthdaySelection($event)" @cancel="onClose" :disabled-after="false" ref="date"></w-picker>
		<!-- 地区 -->
		<w-picker :visible.sync="isRegion" mode="region" default-type="value" :hide-area="false" @confirm="regionSelection($event)"
		 @cancel="onClose" ref="region"></w-picker>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	import userInfo from '../../js/api/my/user.js'
	import common from '../../js/common/common.js'
	export default {
		components: {
			wPicker
		},
		data() {
			return {
				// 性别
				isGender: false,
				genderList: ['男', '女'],
				gender: '',
				//身份
				isIdentity: false,
				identityList: ['妈妈', '爸爸', '爷爷', '奶奶', '其他'],
				identity: '',
				// 生日
				isBirthday: false,
				birthday: '',
				// 地区
				isRegion: false,
				region: '',
				userImg: '/static/images/jiaz.png', //用户头像
				userName: '', //用户名字,
				userPhone: '',
				isPhone: false
			};
		},
		methods: {
			ChooseImage() {
				let _this = this
				uni.chooseImage({
					count: 1, //可选择数量，默认9
					sizeType: ['compressed'], //只能上传压缩图
					sourceType: ['album', 'camera'], //从相册选择或从使用相机
					success: (chooseImageRes) => {
						this.userImg = chooseImageRes.tempFilePaths[0];
						uni.uploadFile({
							url: _this.$img + '/upload/imageFile',
							filePath: _this.userImg,
							name: 'file',
							header: {
								token: _this.$token,
								file: _this.userImg,
							},
							success: (res) => {
								var data = JSON.parse(res.data)
								_this.userImg = data.url
							}
						});
					}
				});
			},
			showPopup() { // 性别弹窗
				this.isGender = true
			},
			genderSelection(gender) { //性别弹窗赋值
				this.isGender = false
				this.gender = gender
			},
			identitySelection() { // 身份弹窗
				this.isIdentity = true
			},
			identityState(identity) { //身份弹窗赋值
				this.isIdentity = false
				this.identity = identity
			},
			onClose() { //关闭弹窗
				this.isGender = false
				this.isIdentity = false
				this.isBirthday = false
				this.isRegion = false
			},
			// 生日
			showBirthday() {
				this.isBirthday = true
			},
			birthdaySelection(event) {
				this.birthday = event.value
			},
			// 地区
			showRegion() {
				this.isRegion = true
			},
			regionSelection(event) {
				this.region = event.result
			},
			updataUserInfo() {
				if (isNaN(this.userPhone)) {
					this.$message("请输入正确的手机号")
					return
				}
				userInfo.updataUserInfo(this)
			},
			// 校验是不是手机号码
			onBlur() {
				// 手机号码
				let regphone = /^1(3|4|5|6|7|8|9)\d{9}$/
				let isPhone = regphone.test(this.userPhone)
				if (isPhone) {
					this.isPhone = false
				} else {
					this.isPhone = true
				}
			}
		},
		onLoad(opstions) {
			this.userId = opstions.id
			console.log(JSON.parse(opstions.userinfo))
			if (opstions.userinfo) {
				let userinfo = JSON.parse(opstions.userinfo)
				this.userImg = userinfo.head
				this.userPhone = userinfo.phone
				this.userName = userinfo.nickName
				this.gender = userinfo.sex == 1 ? '男' : '女'
				this.identity = userinfo.identity == 10 ? '爸爸' : userinfo.identity == 20 ? '妈妈' : userinfo.identity == 30 ? '爷爷' :
					userinfo.identity == 40 ? '奶奶' : '其他'
				this.birthday = userinfo.birthDate
				this.region = userinfo.address
			}
			common.userInfo(this)
		}
	}
</script>
<style>
	page {
		background-color: #F8F8F8;
	}
</style>
<style lang="scss" scoped>
	[v-cloak] {
		display: none;
	}

	.main {
		margin: 20rpx 24rpx 0;
		background: #FFFFFF;
		box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.06);
		border-radius: 30rpx;
	}

	.noPhone {
		color: red !important;
	}

	.list {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 30rpx;
		height: 102rpx;
		border-bottom: 1rpx solid #eee;
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
		color: #909090;
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

	.aency-items {
		border-bottom: 1px solid #eeee;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
	}

	.cancelbutton {
		width: 100%;
		height: 110rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		text-align: center;
		cursor: pointer;
		line-height: 117rpx;
	}
</style>
