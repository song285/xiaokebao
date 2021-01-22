<template>
	<view v-cloak>
		<view class="main">
			<view class="list" @tap="ChooseImage">
				<view class="title">头像</view>
				<image class="portrait" :src="headerImg" mode=""></image>
			</view>
			<view class="list">
				<view class="title"><text class="tips">*</text>昵称</view>
				<input type="text" placeholder-style="text-align:right" placeholder="请输入宝宝昵称" v-model="name" />
			</view>
			<view class="list" @click="genderSelection">
				<view class="title"><text class="tips">*</text>性别</view>
				<view class="content">{{gender ? gender : '请选择性别'}}
					<image class="jiantou" src="../../static/images/more-ic.png" mode="">
				</view>
			</view>
			<view class="list" @click="showBirthday">
				<view class="title"><text class="tips">*</text>生日</view>
				<view class="content">
					{{birthday ? birthday : '请选择生日'}}
					<image class="jiantou" src="../../static/images/more-ic.png" mode="">
				</view>
			</view>
			<view class="list" @click="colorSelection">
				<view class="title"><text class="tips">*</text>课程颜色</view>
				<view class="content">{{colorText ? colorText : '请选择颜色'}}
					<image class="jiantou" src="../../static/images/more-ic.png" mode="">
				</view>
			</view>
			<view class="list">
				<view class="title">身高(cm)</view>
				<input type="number" maxlength="3" placeholder-style="text-align:right"  placeholder="请输入宝宝身高" v-model="height" />
			</view>
			<view class="list">
				<view class="title">体重(kg)</view>
				<input type="number" maxlength="3" placeholder-style="text-align:right"  placeholder="请输入宝宝体重" v-model="weight" />
			</view>
			<view class="list">
				<view class="title">爱好</view>
				<input type="text" maxlength="25" placeholder-style="text-align:right"  placeholder="请输入宝宝爱好,限25个字以内" v-model="hobby" />
			</view>
			<view class="list">
				<view class="title">特长</view>
				<input type="text" maxlength="25" placeholder-style="text-align:right"  placeholder="请输入宝宝特长,限25个字以内" v-model="strongPoint" />
			</view>
		</view>
		<view class="preservation" @click="preservation">保存</view>
		<!-- 性别 -->
		<van-popup :show="isGenderShow" @close="onClose" position="bottom" round="30rpx">
			<view class="aency-items" v-for="(item,index) in genderList" :key="index" @click="genderState(item)">
				<text>{{item.name}}</text>
			</view>
			<view class="cancelbutton aency-items" @click="onClose">
				<view class="">
					<text>取消</text>
				</view>
			</view>
		</van-popup>
		<!-- 颜色 -->
		<van-popup :show="isColorShow" @close="onClose" position="bottom" round="30rpx">
			<view class="aency-items" v-for="(item,index) in colorList" :key="index" @click="colorState(item)">
				<text style="text-decoration:underline;text-decoration-style: double;" :style="{'text-decoration-color':item.color}">{{item.rgba}}</text>
			</view>
			<view class="cancelbutton aency-items" @click="onClose">
				<view class="">
					<text>取消</text>
				</view>
			</view>
		</van-popup>
		<w-picker :visible.sync="isBirthday" mode="date" startYear="2000" endYear="2050" :current="true" fields="day"
		 @confirm="onConfirm($event,'date')" @cancel="onClose" :disabled-after="false" ref="date"></w-picker>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	import addBaby from "../../js/api/my/addBaby.js"
	export default {
		components: {
			wPicker
		},
		onShow() {
			addBaby.getBabyColor(this)
		},
		data() {
			return {
				//性别
				isGenderShow: false,
				genderList: [{
					name: '男',
					id: 1
				}, {
					name: '女',
					id: 2
				}],
				gender: '',
				genderId: '',
				//颜色
				isColorShow: false,
				colorList: [],
				color: '',
				colorText: '',
				//生日
				isBirthday: false,
				birthday: '',
				name: '', //昵称
				headerImg: '/static/images/boy.png', //头像
				height: '', //身高
				weight: '', //体重
				hobby: '', //爱好
				strongPoint: '', //特长
				babyId: '', //宝贝id
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
						_this.headerImg = chooseImageRes.tempFilePaths[0];
						uni.uploadFile({
							url:_this.$img + '/upload/imageFile',
							filePath: _this.headerImg,
							name: 'file',
							header:{
								token:_this.$token,
								file:_this.headerImg,
							},
							success: (res) => {
								var data = JSON.parse(res.data)
								_this.headerImg = data.url
							}
						});
					}
				});
			},

			genderSelection() { //性别弹窗显示
				this.isGenderShow = true
			},
			genderState(gender) { //性别弹窗关闭赋值
				this.isGenderShow = false
				this.gender = gender.name
				this.genderId = gender.id
			},
			colorSelection() { //颜色弹窗显示
				this.isColorShow = true
			},
			colorState(item) { //颜色弹窗关闭赋值
				this.isColorShow = false
				this.color = item.color
				this.colorText = item.rgba
			},
			showBirthday() {
				this.isBirthday = true
			},
			onConfirm(event) {
				this.birthday = event.value
			},
			//关闭弹窗
			onClose() {
				this.isGenderShow = false
				this.isColorShow = false
				this.isBirthday = false
			},
			preservation() {
				if (this.name == '') {
					this.$message("请输入宝宝昵称")
					return
				}
				if (this.gender == '') {
					this.$message("请选择宝宝性别")
					return
				}
				if (this.birthday == '') {
					this.$message("请选择宝宝生日")
					return
				}
				if (this.colorText == '') {
					this.$message("请选择宝宝颜色")
					return
				}
				if (this.babyId == '' || this.babyId == undefined) {
					addBaby.addBaby(this)
				} else {
					addBaby.update(this)
				}
			}
		},
		onLoad(option) {
			if (option.item) {
				console.log(option)
				let item = JSON.parse(option.item)
				console.log(item)
				this.babyId = item.id
				this.name = item.nickName
				this.headerImg = item.head
				this.height = item.height
				this.weight = item.weight
				this.colorText = item.color
				switch(item.color){
					case '#F24242': this.colorText = '红色';break;
					case '#FF7F2E': this.colorText = '橙色';break;
					case '#FFBA5F': this.colorText = '黄色';break;
					case '#47A6FF': this.colorText = '蓝色';break;
					case '#29C2DE': this.colorText = '青色';break;
					case '#1ED87F': this.colorText = '绿色';break;
				}
				this.color = item.color
				this.gender = item.sex == 1 ? '男' : '女'
				this.genderId = item.sex
				this.birthday = item.birthDate
				this.hobby = item.hobby
				this.strongPoint = item.strongPoint
			}
			uni.setNavigationBarTitle({ //设置title
				title: option.title
			})

		}
	}
</script>
<style>
	page {
		background-color: #F8F8F8;
	}
</style>
<style lang="scss" scoped>
	[v-cloak]{
		display: none;
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
		border-bottom: 1px solid rgba(238, 238, 238, .35);
	}

	.list:last-child {
		border: none;
	}

	.list .title {
		font-size: 28rpx;
		font-family: PingFang SC;
		color: #323232;
	}
	.title .tips{
		color: red;
	}
	.list .content {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		font-family: PingFang SC;
		color: #909090;
	}

	.list input {
		height: 102rpx;
		width: 450rpx;
		padding-left: 20rpx;
		border: none;
		background: #fff;
		font-size: 29rpx;
		font-family: PingFang SC;
		text-align: right;
		color: #909090;
		overflow: auto;
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
</style>
