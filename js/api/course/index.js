// 获取课程列表
function getInfo(_this){
	uni.showLoading({
		title:'加载中...',
		mask:true
	})
	_this.$reqHttp({
		url:"/class-info/page",
		data:{
			start:_this.start,
			length:_this.length,
			babyIdList:_this.checkedBaby
		},
		success:(res) => {
			if(res.data.success){
				_this.courseList = [..._this.courseList,...res.data.data]
				uni.setStorageSync('recordsTotal', res.data.recordsTotal)
			}else{
				_this.$message(res.data.msg)
			}
			if(res.data.recordsTotal <= _this.courseList.length){
				_this.moreStatus = "noMore"
			}else _this.moreStatus = "more"
		},
		complete:()=>{
			uni.hideLoading()
		}
	})
}

// 退费接口1
function reFund(obj,_this){
	_this.$reqHttp({
		url:"/class-info/refund",
		data:{
			id: obj.id
		},
		success:(res) => {
			if(res.data.success){
				_this.RefundPopup = false
				setTimeout(()=>{
					_this.$message(res.data.msg)
					_this.isClick = false
				},500)
			}else{
				_this.isClick = false
				_this.$message(res.data.msg)
			}
		}
	})
}

function getInfodetail(_this){
	_this.$reqHttp({
		url:"/class-info/detail",
		data:{
			id: _this.myid
		},
		success:(res)=>{
			if(res.data.success){
				_this.detailCourse = res.data.data
			}else{
				_this.$message(res.data.msg)
			}
		}
	})
}
//退费接口2
function reFund1(_this){
	_this.$reqHttp({
		url:"/class-info/refund",
		data:{
			id: _this.detailCourse.id
		},
		success:(res) => {
			if(res.data.success){
				_this.RefundPopup = false
				this.getInfodetail(_this)
				setTimeout(()=>{
					_this.$message(res.data.msg)
				},1000)
			}else{
				_this.$message(res.data.msg)
			}
		}
	})
}

// 上课记录
function classRecord(option,_this){
	_this.$reqHttp({
		url:"/class-schedule/page",
		data:{
			start:_this.start ,
			length:_this.length,
			classId:option.classid,
			states:"20,30",
			method:'record',
			babyIdStr:JSON.stringify(_this.checkedBaby)
		},
		success:(res) => {
			if(res.data.success){
				_this.list = [..._this.list, ...res.data.data]
				_this.start = _this.start + _this.length
				_this.moreStatus = "more"
			}else{
				_this.$message(res.data.msg)
			}
			if(res.data.recordsTotal <= _this.start){
				_this.moreStatus = "noMore"
			}else _this.moreStatus = "more"
		}
	})
}

// 课程详情
function detail(_this){
	_this.$reqHttp({
			url: '/class-schedule/detail',
			data: {
				id: _this.id
			},
			success: (res) => {
				if(res.data.success){
					_this.detailCourseList = res.data.data
				}else{
					_this.$message(res.data.msg)
				}
			}
		}
	)
}
//  课程加课
function addClass(_this){
	if(!_this.classDate || !_this.classTime){
		_this.$message("请填写完整信息")
		_this.isClick = false
		return
	}
	_this.$reqHttp({
			url: '/class-schedule/add',
			data: {
				id: _this.list.id,
				classDate:_this.classDate,
				classTime:_this.classTime
			},
			success: (res) => {
				setTimeout(()=>{
					if(res.data.success){
						_this.$message(res.data.msg)
						uni.navigateBack({
							delta: 2
						})
					}
					_this.$message(res.data.msg)
				},800)
			}
		}
	)
}

// 请假
function leave(item,_this){
	_this.$reqHttp({
		url:"/class-schedule/leave",
		data:{
			id:item.id,
			isDeduct:_this.detailCourseList.isDeduct
		},
		success:(res) => {
			if(res.data.success){
				_this.$message("请假成功")
			}else{
				_this.$message(res.data.msg)
			}
		}
	})
}

// 调课
function adjust(item,_this){
	if(!_this.classDate || !_this.classTime){
		_this.$message("请填写完整信息")
		_this.isClick = false
		return
	}
	_this.$reqHttp({
		url:"/class-schedule/adjust",
		data:{
			id:item.id,
			classDate:_this.classDate,
			classTime:_this.classTime,
			isAllUpdate:_this.isChecked ? 1 : 0
		},
		success:(res) => {
			if(res.data.success){
				_this.$message("调课成功")
				setTimeout(()=>{
					uni.navigateBack({
						delta:2
					})
				},800)
			}else{
				_this.isClick = false
				_this.$message(res.data.msg)
			}
		}
	})
}

// 添加课程
function addCourse(_this,type){
	if(_this.addCourse.draftState == 30){
		if(!_this.addCourse.name){
			_this.$message("请填写课程名")
			_this.isClick = false
			return
		}
		
		if(!_this.addCourse.orgId){
			_this.$message("请选择机构")
			_this.isClick = false
			return
		}
		
		if(!_this.addCourse.babyId){
			_this.$message("请选择宝宝")
			_this.isClick = false
			return
		}
		
		addCourseRequst(_this,type)
		return
	}
	
	if(!_this.addCourse.name || !_this.addCourse.orgId  || !_this.addCourse.babyId  || _this.addCourse.totalClassHour.toString() == ''){
		_this.$message("请填写完整信息")
		_this.isClick = false
		console.log(_this.addCourse.name,_this.addCourse.orgId,_this.addCourse.babyId,_this.addCourse.totalClassHour)
		return
	}
	
	if(_this.addCourse.payType == 10 && _this.addCourse.deductHour.toString() == ''){
		_this.$message("扣除课时不能为空")
		_this.isClick = false
		return
	}
	
	if(!_this.addCourse.checkTime){
		_this.$message("请选择上课时间")
		_this.isClick = false
		return
	}
	
	if(_this.addCourse.payType == 10 && _this.addCourse.restHour.toString() == ''){
		_this.$message("剩余课时不能为空")
		_this.isClick = false
		return
	}
	
	// if(_this.payType == 10 && !_this.addCourse.totalPrice){
	// 	_this.$message("课程总价不能为空")
	// 	return
	// }
	
	if(_this.addCourse.payType == 20 && !_this.addCourse.hourPrice){
		_this.$message("课时单价不能为空")
		_this.isClick = false
		return
	}
	
	if(_this.addCourse.payType == 20 && !_this.addCourse.usedHour){
		_this.$message("已上课时不能为空")
		_this.isClick = false
		return
	}
	
	if(parseInt(_this.addCourse.totalClassHour) <= 0 ){
		_this.$message("总课时不能小于 1")
		_this.isClick = false
		return
	}
	
	if(_this.addCourse.payType == 10 && parseInt(_this.addCourse.restHour) > parseInt(_this.addCourse.totalClassHour)){
		_this.$message('剩余课时数不能大于总课时数')
		_this.isClick = false
		return
	}
	
	if(_this.addCourse.payType == 10 && parseInt(_this.addCourse.restHour) <= 0){
		_this.$message('剩余课时数不能小于 1')
		_this.isClick = false
		return
	}
	
	if(parseInt(_this.addCourse.deductHour) <= 0){
		_this.$message("扣除课时不能小于 1")
		_this.isClick = false
		return
	}
	
	if(_this.addCourse.payType == 10 && (parseInt(_this.addCourse.restHour) / parseInt(_this.addCourse.deductHour) >= 1000)){
		_this.$message('课节数不能大于1000节，请重新填写剩余课时数或扣除课时')
		_this.isClick = false
		return
	}
	
	if(parseInt(_this.addCourse.deductHour) > 10){
		_this.$message("扣除课时数不能大于 10")
		_this.isClick = false
		return
	}
	
	if(_this.addCourse.payType == 10 && parseInt(_this.addCourse.deductHour) > parseInt(_this.addCourse.restHour)){
		_this.$message("扣除课时数不能大于剩余课时")
		_this.isClick = false
		return
	}
	
	addCourseRequst(_this,type)
}

function addCourseRequst(_this,type){
	if(type == 'add'){
		uni.showLoading({
			title:'添加中',
			mask:true
		})
		_this.$reqHttp({
			url:"/class-info/add",
			data:{
				classBabyPic: _this.addCourse.classBabyPic,
				name: _this.addCourse.name,
				orgId: _this.addCourse.orgId,
				babyId: _this.addCourse.babyId,
				totalClassHour: _this.addCourse.totalClassHour,
				restHour: _this.addCourse.restHour,
				totalPrice: _this.addCourse.totalPrice || 0,
				arrangeType: _this.addCourse.arrangeType,
				// startTime: _this.addCourse.startTime,
				deductHour: _this.addCourse.deductHour,
				planJson: _this.addCourse.checkTime,
				remark: _this.addCourse.remark,
				originalId:_this.lists.id || '',
				moveHours:_this.moveHours,
				state:_this.addCourse.draftState || 10,
				payType:_this.addCourse.payType,
				hourPrice: _this.addCourse.hourPrice || 0,
				usedHour: _this.addCourse.usedHour
			},
			success:(res) => {
				if(res.data.success){
					uni.hideLoading()
					_this.$message("添加成功")
					uni.navigateBack({})
				}else{
					uni.hideLoading()
					_this.isClick = false
					_this.$message(res.data.msg)
				}
			},
			fail:(err) => {
				_this.isClick = false
				_this.$message("添加失败")
			}
		})
	}else if(type == 'upate'){
		updateCourse(_this)
	}
}

// 获取课程列表
function getTransferCourse(_this){
	const length = uni.getStorageSync("recordsTotal");
	_this.$reqHttp({
		url:"/class-info/page",
		data:{
			start:0,
			length: length
		},
		success:(res) => {
			if(res.data.success){
				_this.list = res.data.data.filter(item => {
					return item.id != _this.courseList.id && item.orgName == _this.courseList.orgName && item.babyId == _this.courseList.babyId && item.state == 10
				})
			}else{
				_this.$message(res.data.msg)
			}
		}
	})
}

// 转移课时
function transfer(_this){
	if(!_this.transCourse.id || !_this.transCourse.hour){
		_this.$message("请填写完整信息")
		_this.isClick = false
		return
	}
	
	if(parseInt(_this.transCourse.hour) > _this.courseList.restHour){
		_this.$message('转移课时数不能大于剩余课时数')
		_this.isClick = false
		return
	}
	
	_this.$reqHttp({
		url:"/class-schedule/move",
		data:{
			originalId: _this.courseList.id,
			targetId: _this.transCourse.id,
			moveHours: _this.transCourse.hour
		},
		success:(res) => {
			if(res.data.success){
				_this.$message("转移成功")
				uni.navigateBack({
					delta:2
				})
				
			}else{
				_this.isClick = false
				_this.$message(res.data.msg)
			}
		},
		fail:()=>{
			_this.isClick = false
		}
	})
}

// 课程评价
function doevaluate(_this){
	if(!_this.text){
		_this.$message("请输入内容")
		_this.isClick = false
		return
	}
	
	if(_this.text.length > 500){
		_this.$message("提交失败，最多500字")
		_this.isclick = false
		return
	}
	
	_this.$reqHttp({
		url:"/class-schedule/evaluate",
		data:{
			id: _this.id,
			evaluate: _this.text
		},
		success:(res) => {
			if(res.data.success){
				_this.$message("感谢您的评价！")
				uni.navigateBack({})
			}else{
				_this.isClick = false
				_this.$message(res.data.msg)
			}
		}
	})
}

// 删除课程
function delCourse(item,_this){
	_this.$reqHttp({
		url:"/class-info/delete",
		data:{
			id: item.id,
		},
		success:(res) => {
			if(res.data.success){
				_this.$message("删除成功")
				_this.isClick = false
			}else{
				_this.isClick = false
				_this.$message(res.data.msg)
			}
		}
	})
}

// 修改课程
function updateCourse(_this){
	uni.showLoading({
		title:'修改中',
		mask:true
	})
	_this.$reqHttp({
		url:"/class-info/update",
		data:{
			id: _this.addCourse.id,
			classBabyPic: _this.addCourse.classBabyPic,
			name: _this.addCourse.name,
			orgId: _this.addCourse.orgId,
			babyId: _this.addCourse.babyId,
			totalClassHour: _this.addCourse.totalClassHour,
			restHour: _this.addCourse.restHour,
			totalPrice: _this.addCourse.totalPrice || '',
			arrangeType: _this.addCourse.arrangeType,
			startTime: _this.addCourse.startTime,
			deductHour: _this.addCourse.deductHour,
			planJson: _this.selectedTime.toString(),
			remark: _this.addCourse.remark,
			state: _this.addCourse.draftState || 10,
			payType:_this.addCourse.payType,
			hourPrice: _this.addCourse.hourPrice || '',
			usedHour: _this.addCourse.usedHour || ''
		},
		success:(res) => {
			if(res.data.success){
				uni.hideLoading()
				_this.$message("修改成功")
				uni.navigateBack({})
			}else{
				uni.hideLoading()
				_this.isClick = false
				_this.$message(res.data.msg)
			}
		},
		fail:(err) => {
			_this.isClick = false
			_this.$message("修改失败")
		}
	})
}


// 结算记录
function settlementRecord(option,_this){
	_this.$reqHttp({
		url:"/settlement/page",
		data:{
			start:_this.start,
			length:_this.length,
			classId:option.classid
		},
		success:(res) => {
			if(res.data.success){
				_this.list = [..._this.list, ...res.data.data]
				_this.start = _this.start + _this.length
				_this.moreStatus = "more"
			}else{
				_this.$message(res.data.msg)
			}
			if(res.data.recordsTotal <= _this.start){
				_this.moreStatus = "noMore"
			}else _this.moreStatus = "more"
		}
	})
}

// 添加结算记录
function addSettlementRecord(_this,func){
	_this.$reqHttp({
		url:"/settlement/add",
		data:{
			classId: _this.settlementClassId,
			hours:_this.settlementHours
		},
		success:(res) => {
			if(res.data.success){
				_this.$message(res.data.msg)
				if(typeof func == 'function'){
					func()
				}
			}else{
				_this.$message(res.data.msg)
			}
		},
		complete(){
			// _this.isClick = false
		}
	})
}


export default{
	getInfo,
	reFund,
	classRecord,
	detail,
	addClass,
	leave,
	adjust,
	reFund1,
	addCourse,
	getInfodetail,
	getTransferCourse,
	transfer,
	doevaluate,
	delCourse,
	updateCourse,
	settlementRecord,
	addSettlementRecord
}