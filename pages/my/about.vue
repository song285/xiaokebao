<template>
	<view>
		<view v-if='!isHelp' class="main" v-html="serviceData.companyProfile"></view>
		<view v-if='isHelp' class="main" v-html="serviceData.help_content"></view>
	</view>
</template>

<script>
	import service from "../../js/api/my/index.js"
	export default {
		data() {
			return {
				serviceData :{},
				isHelp:false
			};
		},
		onLoad(options){
			if(options.title != undefined){
				this.isHelp = true
				uni.setNavigationBarTitle({//设置title
					title:options.title
				})
			}
			service.service(this)
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F8F8F8;
	}
	.main{
		margin: 20rpx 24rpx 0;
		background: #FFFFFF;
		box-shadow: 0px 0px 18rpx 0px rgba(0, 0, 0, 0.06);
		border-radius: 30rpx;
		min-height: 300rpx;
		padding: 30rpx;
	}
</style>
