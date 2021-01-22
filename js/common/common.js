// 时间戳转换
function formatDate(now){
	let time = new Date(now);
	let year=time.getFullYear();  //取得4位数的年份
	let month=time.getMonth()+1;  //取得日期中的月份，其中0表示1月，11表示12月
	let date=time.getDate();      //返回日期月份中的天数（1到31）
	return year +"-" + (month < 10 ? '0' + month : month) + "-" + (date < 10 ? '0' + date : date)
}
// 宝宝列表
function babyList(_this,type,succ){
	_this.$reqHttp({
		url: '/baby/page',
		data: {
			start:0,
			length:15
		},
		success: (res) => {
			// _this.checkedBaby = []
			if(res.data.success){
				_this.babyList = res.data.data
				if(type == 1){
					_this.checkedBaby = []
					res.data.data.forEach((item,index) => {
						_this.checkedBaby.push(item.id.toString())
					})
				}else if(type == 2){
					if(res.data.recordsTotal == 1){
						_this.addCourse.babyName = res.data.data[0].nickName
						_this.addCourse.babyId = res.data.data[0].id
					}
					if(_this.$store.state.babyid) {
						res.data.data.forEach((item,index) => {
							if(item.id == _this.$store.state.babyid) {
								_this.addCourse.babyName = res.data.data[index].nickName
								_this.addCourse.babyId = res.data.data[index].id
							}
						})
					}
				}
				if(typeof succ == "function"){
					succ()
				}
			}else{
				_this.$message("获取宝宝失败，请联系管理员")
			}
		},
		fail(err){
			_this.$message(err)
		}
	})
}
// 用户信息
function userInfo(_this) {
	_this.$reqHttp({
		url: '/user/get',
		data: {
			// id: 1
		},
		success: (res) => {
			if (res.data.success) {
				_this.userinfo = res.data.data
				_this.userName = res.data.data.nickName
				_this.userImg = res.data.data.head
				_this.gender = res.data.data.sex == 1 ? '男' : '女'
				_this.birthday = res.data.data.birthDate
				_this.identity = res.data.data.identity == 10 ? '爸爸' : res.data.data.identity==20 ? '妈妈' : res.data.data.identity==30 ? '爷爷': res.data.data.identity==40 ? '奶奶':'其他',
				_this.region = res.data.data.address
				_this.shareid = res.data.data.id,
				uni.setStorageSync("nowUserId",res.data.data.id)
				
				// uni.setStorageSync("currentFamily",res.data.data.nickName + '的家')
			} else {
				_this.$message(res.data.msg)
			}
		}
	})
}

function count(_this){
	let count = 0
	_this.$reqHttp({
		url:"/organization/page",
		data:{
			start:0,
			length: 1
		},
		success:(res) => {
			_this.length = res.data.recordsTotal
		}
	})
}
// 获取机构列表
function organization(_this){
	count(_this)
	setTimeout(()=>{
		_this.$reqHttp({
			url:"/organization/page",
			data:{
				start:_this.start,
				length: _this.length
			},
			success:(res) => {
				if(res.data.success){
					_this.list = res.data.data
					if(res.data.recordsTotal == 1){
						_this.addCourse.orgName = res.data.data[0].name
						_this.addCourse.orgId = res.data.data[0].id
					}
					if(_this.$store.state.origId) {
						res.data.data.forEach((item,index) => {
							if(item.id == _this.$store.state.origId) {
								_this.addCourse.orgName = res.data.data[index].name
								_this.addCourse.orgId = res.data.data[index].id
							}
						})
					}
				}
			}
		})
	},500)
}

// 获取用户信息
function login(_this){
	uni.getUserInfo({
		provider: 'weixin',
		success: (info) => {//这里请求接口
			_this.$reqHttp({
				url:'/user/wx-login',
				data:{
					userInfo:info.rawData,
				},
				success:(res) => {
					if(res.data.success){ 
						enter(_this)
					}else{
						_this.isClick = false
						// _this.$message(res)
					}
					_this.$message(res.data.msg)
				},
				fail:(err)=>{
					_this.isClick = false
				}
			})
		},
		fail: () => {
			_this.isClick = false
			_this.$message("请允许获取个人信息")
		}
	})
}

// 手机号一键登录
function wxPhoneLogin(e,_this){
	let pId = uni.getStorageSync('pId') || ''
	uni.showLoading({
		title:'正在登录...',
		mask:true
	})
	
	uni.login({
		provider: 'weixin', 
		success: (res) => {
			if(e.detail.errMsg == "getPhoneNumber:ok"){
				console.log(e.detail)
				console.log(res)
				uni.setStorageSync("wxcode",res.code)
				_this.$reqHttp({
					url:'/user/wx-login',
					data:{
						code:uni.getStorageSync("wxcode"),
						userId:_this.shareid,
						iv:e.detail.iv,
						encryptedData:e.detail.encryptedData,
						pId:pId
					},
					success:(res) => {
						console.log("==>",e)
						if(res.data.success){
							uni.setStorageSync("userToken",res.data.data.token)
							uni.setStorageSync("isFirstLogin",res.data.data.isFirstLogin)
							uni.setStorageSync("identity_check",res.data.data.identity)
							uni.setStorageSync('currentFamily',res.data.data.homeName)
							
							uni.redirectTo({
								url:'/pages/my/index'
							})
							_this.$store.commit("choiceFooter",4)
							
							if(res.data.data.isFirstLogin || res.data.data.isFirstInvite){
								uni.reLaunch({
									url:'/pages/index/loginAgreement',
									
								})
							}
							// uni.navigateBack({})
						}else{
							_this.isClick = false
							// _this.$message(res)
						}
						
						uni.hideLoading()
						
						_this.$message(res.data.msg)

					},
					fail:(err)=>{
						uni.hideLoading()
						console.log(err)
						_this.isClick = false
					}
				})
			}else{
				_this.isClick = false
				_this.$message("微信登录授权失败")
			}
		},
		fail: () => {
			uni.hideLoading()
			_this.isClick = false
			_this.$message("微信登录授权失败")
		}
	})
	
}

// 手机验证码登录
function phoneLogin(_this){
	let pId = uni.getStorageSync('pId') || ''
	uni.showLoading({
		title:'正在登录...',
		mask:true
	})
	_this.$reqHttp({
		url:'/user/phone-login',
		data:{
			phone:_this.phone,
			checkCode:_this.code,
			userId:_this.shareid,
			pId:pId
		},
		success:(res) => {
			if(res.data.success){
				uni.setStorageSync("userToken",res.data.data.token)
				uni.setStorageSync("isFirstLogin",res.data.data.isFirstLogin)
				uni.setStorageSync("identity_check",res.data.data.identity)
				uni.setStorageSync('currentFamily',res.data.data.homeName)
				
				// uni.reLaunch({
				// 	url:'/pages/index/loginAgreement'
				// })
				
				// if(!res.data.data.isFirstLogin){
				// 	_this.$store.commit("choiceFooter",4)
				// 	uni.redirectTo({
				// 		url:'/pages/my/index'
				// 	})
				// }
				uni.redirectTo({
					url:'/pages/my/index'
				})
				_this.$store.commit("choiceFooter",4)
				
				if(res.data.data.isFirstLogin || res.data.data.isFirstInvite){
					uni.reLaunch({
						url:'/pages/index/loginAgreement',
					})
				}
			}else{
				_this.isClick = false
			}
			uni.hideLoading()
			_this.$message(res.data.msg)
		},
		fail:(err)=>{
			uni.hideLoading()
			console.log(err)
			_this.isClick = false
		}
	})
}

// 获取验证码
function getPhoneCode(_this){
	_this.$reqHttp({
		url:'/user/check-code',
		data:{
			phone:_this.phone,
		},
		success:(res) => {
			if(res.data.success){
				_this.$message(res.data.msg)
			}else{
				_this.isClick = false
				_this.$message(res.data.msg)
			}
		},
		fail:(err)=>{
			_this.isClick = false
		}
	})
}

// 检查是否已登录
function checkLogin(_this){
	let token = uni.getStorageSync("userToken")
	if(!token){
		_this.$message("请先登录")
		return false
	}
	return true
}

// 获取家庭列表
function getFamilyList(_this){
	_this.$reqHttp({
		url:'/user/relate-family',
		data:{
			isSwitch:_this.isSwitch,
			inviteId:uni.getStorageSync('shareid') || 0
		},
		success:(res) => {
			if(res.data.success){
				_this.items = res.data.data
			}else{
				_this.isClick = false
				_this.$message(res.data.msg)
			}
		},
		fail:(err)=>{
			_this.isClick = false
			_this.$message(res.data.msg)
		}
	})
}

// 进入某个家庭
function enter(_this){
	if(!_this.current){
		_this.$message("请选择家庭")
		return
	}
	uni.login({
		success(res) {
			uni.getUserInfo({
				provider: 'weixin',
				success: (info) => {//这里请求接口
					_this.$reqHttp({
						url:'/user/select-family',
						data:{
							mainUserId: _this.mainUserId,
							userInfo:info.rawData,
							identity: _this.value1
						},
						success:(res) => {
							if(res.data.success){
								uni.setStorageSync('userToken',res.data.data.token)
								uni.setStorageSync("identity_check",res.data.data.identity)
								
								if( _this.isFirstLogin ){
									_this.$store.commit("choiceFooter",4)
									uni.redirectTo({
										url:'/pages/my/index'
									})
									return;
								}
								_this.$store.commit("choiceFooter",1)
								uni.redirectTo({
									url:'/pages/index/index'
								})
							}else{
								_this.isClick = false
								_this.$message(res.data.msg)
							}
						},
						fail:(err)=>{
							_this.isClick = false
							_this.$message(res.data.msg)
						}
					})
				},
				fail: () => {
					_this.isClick = false
					// _this.$message("请允许获取个人信息")
				}
			})
		}
	})
	
}

export default{
	babyList,
	formatDate,
	userInfo,
	organization,
	login,
	phoneLogin,
	getPhoneCode,
	checkLogin,
	getFamilyList,
	enter,
	wxPhoneLogin
}