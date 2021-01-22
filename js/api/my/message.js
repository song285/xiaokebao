function messageList(_this) {
	_this.$reqHttp({
		url: '/sys-msg/page',
		data: {
			start: _this.page.start,
			length:  _this.page.length,
		},
		success: (res) => {
			if (res.data.success) {
				_this.messageList = res.data.data
				_this.page.total = res.data.recordsTotal
			}else{
				_this.$message("获取失败，请联系管理员")
			}
			
			if(_this.messageList.length >= res.data.recordsTotal){
				_this.moreStatus = "noMore"
			}else{
				 _this.moreStatus = "more"
			}
		}
	})
}

function msgRemind(_this) {
	_this.$reqHttp({
		url: '/user-msg-setting/get',
		data: {
		},
		success: (res) => {
			if (res.data.success) {
				_this.time = res.data.data
			}else{
				_this.$message("获取失败，请联系管理员")
			}
		}
	})
}

function modifyMsg(_this) {
	_this.$reqHttp({
		url: '/user-msg-setting/msg-remind-set',
		data: {
			attendClass:_this.time.attendClass,
			attendClassIsOpen:_this.time.attendClassIsOpen,
			overClass:_this.time.overClass,
			overClassIsOpen:_this.time.overClassIsOpen,
			finishClass:_this.time.finishClass,
			finishClassIsOpen:_this.time.finishClassIsOpen,
		},
		success: (res) => {
			if (res.data.success) {
				_this.$message(res.data.msg)
			}else{
				_this.$message("保存失败，请联系管理员")
			}
		}
	})
}

function clearmsg(_this){
	_this.$reqHttp({
		url: '/sys-msg/clear',
		success:(res)=>{
			if(res.data.success){
				_this.$message(res.data.msg)
				messageList(_this)
			}else{
				_this.$message(res.data.msg)
			}
		}
	})
}

function setSwitch(_this){
	_this.$reqHttp({
		url: '/user-msg-setting/set-isopen',
		data: {
			finishClassIsOpen:_this.time.finishClassIsOpen,
			overClassIsOpen:_this.time.overClassIsOpen,
			attendClassIsOpen:_this.time.attendClassIsOpen,
			tomorrowAttendClassIsOpen:_this.time.tomorrowAttendClassIsOpen
		},
		success:(res)=>{
			if(res.data.success){
				_this.$message(res.data.msg)
			}else{
				_this.$message(res.data.msg)
			}
		}
	})
}

// 授权消息推送
function scribeMessage(_this,url){
	let arr = ['-nOUyBXMaeGl5_KTZUS9FLWEuwa7jIsnM4Jjgr6tMY4','P0ZiNwUN3q7tmUEil9D-Q8R4NV1iI4zvQtvcGhUzDo0','OqDX8diqwDUlGTf7T-kwHTPmR_3Sgii6hm0c1E8YXw4']
	
	_this.$reqHttp({
		url: '/user/get-subscribe',
		data: {
			token:_this.$token
		},
		success:(res) => {
			if (!res.data.data) {
				uni.requestSubscribeMessage({
					tmplIds: [arr[0],arr[1],arr[2]],
					success(res) { 
						if(res[arr[0]] == 'accept' || res[arr[1]] == 'accept' || res[arr[2]] == 'accept'){
							_this.isClick = false
							_this.$reqHttp({
								url:"/user/subscribe",
								data:{
									token:_this.$token
								},
								success:(res) => {
									if(res.data.success){
										uni.navigateTo({
											url: url
										})
									}
								},
								fail:(err)=>{
									_this.isClick = false
								}
							})
						}else{
							uni.navigateTo({
								url: url
							})
						}
					},
					fail(err){
						_this.isClick = false
						console.warn("====>",err)
					}
				})
			}else{
				uni.navigateTo({
					url: url
				})
			}
		}
	})
	
	
}


export default{
	messageList,
	msgRemind,
	modifyMsg,
	clearmsg,
	setSwitch,
	scribeMessage
}