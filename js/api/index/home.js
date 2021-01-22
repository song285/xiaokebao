// 获取课程列表
function getCourse(_this){
	
	_this.$reqHttp({
		url: '/class-schedule/page',
		data: {
			start:_this.start,
			length:_this.length,
			classDate: _this.selectedDate.today.fullDate,
			babyIdStr:JSON.stringify(Array.from(new Set(_this.checkedBaby)))
		},
		success: (res) => {
			if(res.data.success){
				_this.dailyCourse = [..._this.dailyCourse, ...res.data.data]
				_this.dailyCourse = Array.from(new Set(_this.dailyCourse))
			}else{
				// _this.isClick = false
				_this.$message("获取异常，请联系管理员")
			}
			if(_this.dailyCourse.length >= res.data.recordsTotal){
				_this.moreStatus = "noMore"
			}else _this.moreStatus = "more"
		},
	})
}

// 获取月日历课程信息
function monthCalCourse(_this){
	_this.$reqHttp({
		url:'/class-schedule/month-list',
		data:{
			babyIdStr:JSON.stringify(Array.from(new Set(_this.checkedBaby))),
			month: _this.postdate
		},
		success:(res) => {
			if(res.data.success){
				_this.allMonth = res.data.data
				// 过滤同一天的信息  只渲染一遍
				// let hash = {};
				// for(let i=0;i < res.data.data.length;i++){
				// 	hash = {}
				// 	res.data.data.map((item)=> {
				// 		hash[item.babyColor + '-' + item.babyId] = item
				// 		_this.mybaby = Object.values(hash)
				// 	})
				// }
			}else{
				_this.$message("获取异常，请联系管理员")
			}
		}
	})
}

// 获取周日历课程信息
function weekCalCourse(_this){
	_this.$reqHttp({
		url:'/class-schedule/week-list',
		data:{
			babyIdStr:JSON.stringify(Array.from(new Set(_this.checkedBaby))),
			weekStart: _this.week[0].fullDate,
			weekEnd: _this.week[_this.week.length-1].fullDate
		},
		success:(res) => {
			if(res.data.success){
				_this.list = res.data.data
				// 过滤同一天的信息  只渲染一遍
				let hash = {};
				for(let i=0;i<_this.type.length;i++){
					hash = {}
					let key = _this.type[i] == "上午" ? 'am' : _this.type[i] == "下午" ? 'pm' : 'night'
					_this.list[key].map((item)=> {
						hash[item.classDate + '-' + item.babyId] = item
						_this.list[key] = Object.values(hash)
					})
					console.log(_this.list)
				}
			}else{
				_this.$message("获取异常，请联系管理员")
			}
		}
	})
}

export default{
	getCourse,
	monthCalCourse,
	weekCalCourse
}