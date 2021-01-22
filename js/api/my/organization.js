// 添加机构
function orgaReq(_this) {
	if (!_this.obj.name) {
		_this.isclick = false
		_this.$message("请填写机构名称！")
		return false;
	}
	
	
	if(_this.obj.phone){
		if (_this.onBlur()) {
			_this.$message("电话错误，请重新输入")
			_this.isclick = false
			return false;
		}
	}
	

	uni.showLoading({
		title: '添加中',
		mask: true
	})

	_this.$reqHttp({
		url: "/organization/add",
		data: {
			name: _this.obj.name,
			address: _this.obj.address,
			phone: _this.obj.phone
		},
		success: (res) => {
			if (res.data.success) {
				uni.hideLoading()
				_this.$message("添加成功！")
				_this.$store.commit('SET_ORIGID',res.data.data)
				uni.navigateBack({})
			} else {
				uni.hideLoading()
				_this.$message(res.data.msg)
				_this.isclick = false
			}
		},
		complete:()=>{
			// uni.hideLoading()
			_this.isclick = false
		}
	})
}

//修改机构
function onUpate(_this) {
	if (!_this.obj.name) {
		_this.isclick = false
		_this.$message("请填写机构名称！")
		return
	}
	
	if(_this.obj.phone){
		if (_this.onBlur()) {
			_this.$message("电话错误，请重新输入")
			_this.isclick = false
			return false;
		}
	}

	uni.showLoading({
		title: '修改中',
		mask: true
	})
	_this.$reqHttp({
		url: "/organization/update",
		data: {
			id: _this.obj.id,
			name: _this.obj.name,
			address: _this.obj.address,
			phone: _this.obj.phone
		},
		success: (res) => {
			if (res.data.success) {
				_this.$message("修改成功！")
				uni.navigateBack({})
			} else {
				_this.$message("提交失败,请稍后再试")
			}
		},
		complete:()=>{
			_this.isclick = false
			uni.hideLoading()
		}
	})
}

// 获取机构列表
function getOrganization(_this) {
	_this.$reqHttp({
		url: "/organization/page",
		data: {
			start: _this.start,
			length: _this.length
		},
		success: (res) => {
			if (res.data.success) {
				_this.list = res.data.data
			}
			if (res.data.recordsTotal <= _this.length) {
				_this.moreStatus = "noMore"
			} else _this.moreStatus = "more"
		}
	})
}


// 删除机构
function delOrg(orgid, _this) {
	_this.$reqHttp({
		url: "/organization/delete",
		data: {
			id: orgid
		},
		success: (res) => {
			if (res.data.success) {
				_this.$message(res.data.msg)
				getOrganization(_this)
			} else {
				_this.$message(res.data.msg)
			}
		}
	})
}

export default {
	orgaReq,
	onUpate,
	getOrganization,
	delOrg
}
