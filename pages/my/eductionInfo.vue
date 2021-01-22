<template>
	<view v-cloak>
		<view>
			<view class="main">
				<view class="list">
					<view class="title"><text class="tips">*</text>机构名称</view>
					<view class="content">
						<input type="text" v-model="obj.name" placeholder="请输入机构名称" placeholder-style="text-align:right" />
					</view>
				</view>
				<view class="list">
					<view class="title">机构地点</view>
					<view class="content">
						<input type="text" v-model="obj.address" placeholder="请输入机构地点" placeholder-style="text-align:right" />
					</view>
				</view>
				<view class="list">
					<view class="title">机构电话</view>
					<view class="content">
						<input type="number" maxlength="12" v-model="obj.phone" :class="{'noPhone':isPhone}" @input="isPhone = false" @blur="onBlur"
					 placeholder="请输入机构电话" />
					 </view>
				</view>
			</view>
			<view class="preservation" @click="onSubmit" v-if="!isUpdate">保存</view>
			<view class="preservation" @click="onUpdate" v-if="isUpdate">修改</view>
		</view>
	</view>
</template>

<script>
	import organization from "../../js/api/my/organization.js"
	export default {
		data() {
			return {
				obj: {
					name: "",
					address: "",
					phone: ""
				},
				isPhone: false,
				isUpdate: false,
				isclick: false,
				wherefrom:''
			};
		},
		onLoad(option) {
			if(option.hasOwnProperty('from')){
				this.wherefrom = option.from
			}
			
			if (!option.hasOwnProperty('title')) {
				return
			}
			this.obj = JSON.parse(option.list)
			this.isUpdate = true
			uni.setNavigationBarTitle({
				title: option.title
			})
			
		},
		methods: {
			onSubmit() {
				if (this.isclick) {
					return
				}
				this.isclick = true
				organization.orgaReq(this)
			},
			// 修改信息
			onUpdate() {
				if (this.isclick) {
					return
				}
				this.isclick = true
				organization.onUpate(this)
			},
			// 校验是不是手机号码
			onBlur() {
				//手机正则
				const phone = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
				
				//座机正则
				const tel = /^0\d{2,3}[1-9]\d{6,7}$/
				
				const tel1 = /^[1-9][0-9]{6,7}$/
				
				let isphone = phone.test(this.obj.phone)
				let istel = tel.test(this.obj.phone)
				let istel1 = tel1.test(this.obj.phone)
				
				if (isphone || istel || istel1) {
					this.isPhone = false
					return false;
				} else {
					this.isPhone = true
					return true;
				}
			}
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

	.list {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 30rpx;
		height: 102rpx;
		border-bottom: 1px solid #ebedf0;
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
	
	.tips{
		color: red;
	}

	.list .content {
		// display: flex;
		// align-items: center;
		// font-size: 28rpx;
		// font-family: PingFang SC;
		// font-weight: 500;
		// color: #909090;
		overflow: auto;
		width: 70%;
	}

	.list input {
		height: 102rpx;
		padding-left: 20rpx;
		border: none;
		background: #fff;
		font-size: 29rpx;
		font-family: PingFang SC;
		text-align: right;
	}

	.noPhone {
		color: red;
	}

	.preservation {
		margin: 51rpx auto;
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
