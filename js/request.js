import {message} from './message.js'
let times = 0
let isLogin = uni.getStorageSync('userToken')

function http(opt) {
	// uni.setStorageSync('times',1)
	var _this = this
	opt = opt || {};
	opt.url = opt.url || '';
	opt.data = opt.data || {};
	opt.method = opt.method || 'POST';
	opt.headerState = opt.headerState || 0;
	opt.headerobj = opt.headerobj || {}
	opt.header = headerDate(_this);
	
	function headerDate(_this) {
		switch (opt.headerState) { 
			case 0://有用到
				return {
					"content-type": 'application/x-www-form-urlencoded',
					"responseType": 'text',
					// token: _this.$token
					token:uni.getStorageSync("userToken")
				}
			case 1: //有用到
				return {
					"content-type": 'application/json',
					// token: _this.$token
					token:uni.getStorageSync("userToken")
				}
			case 2:
				return {
					"content-type": 'application/x-www-form-urlencoded',
					// token: _this.$token
					token:uni.getStorageSync("userToken")
				}
			case 3:
				return {
					"content-type": 'multipart/form-data',
					// token: _this.$token
					token:uni.getStorageSync("userToken")
				}
		}
	}
	opt.success = opt.success || function() {};
	opt.fail = opt.fail || function() {};
	opt.complete = opt.complete || function() {};
	return new Promise((resolve,reject) => {
		uni.request({
			url: this.$url + opt.url,
			data: opt.data,
			method: opt.method,
			header: opt.header,
			dataType:'json',
			success: function(res) {
				uni.onNetworkStatusChange(function (ress) {
				    console.log(ress.isConnected);
				});
				if(res.data.code == -1){
					times++
					if((res.data.msg == 'token信息过期，请重新获取' || res.data.msg == 'token不能为空,请重新获取') && times == 1){
						 _this.$message("请先登录")
						 uni.removeStorageSync("currentFamily")
					}
					return
				}
				if(res.statusCode == 200){
					opt.success(res);
				}else{
					uni.showToast({
						icon:'none',
					    title: "系统异常",
					});
				}
			},
			fail: function(res) {
				opt.fail(res)
				_this.$message("服务器网络异常")
			},
			complete:function(res){
				opt.complete(res)
			}
		})
	})
}

export default {
	http
}
