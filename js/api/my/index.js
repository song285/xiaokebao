import common from '../../common/common.js'
//家长列表
function parentList(_this) {
	_this.$reqHttp({
		url: '/user/page',
		data: {
			start: 0,
			length: 15
		},
		success: (res) => {
			if (res.data.success) {
				_this.parenList = res.data.data
			}else{
				_this.$message(res.data.msg)
			}
		}
	})
}
//获取切换家长列表
function switchParents(_this) {
	_this.$reqHttp({
		url: '/user/relate-family',
		data: {
			start: 0,
			length: 15
		},
		success: (res) => {
			if (res.data.success) {
				_this.switchParentsList = res.data.data
			}else{
				_this.$message(res.data.msg)
			}
		}
	})
}
//删除宝贝
function delBaby(_this) {
	_this.$reqHttp({
		url: '/baby/delete',
		data: {
			id: _this.babyId
		},
		success: (res) => {
			if (res.data.success) {
				_this.$message(res.data.msg)
				common.babyList(_this)
			} else {
				_this.$message(res.data.msg)
			}
		}
	})
}
//删除家长
function delParent(_this) {
	_this.$reqHttp({
		url: '/user/delete',
		data: {
			id: _this.userId
		},
		success: (res) => {
			if (res.data.success) {
				_this.$message(res.data.msg)
				parentList(_this)
			} else {
				_this.$message(res.data.msg)
			}
		}
	})
}

// 获取客服信息
function service(_this) {
	_this.$reqHttp({
		url: '/sys-param/service',
		data: {},
		success: (res) => {
			if (res.data.success) {
				_this.serviceData = res.data.data
			}else{
				_this.$message(res.data.msg)
			}
		}
	})
}
export default {
	parentList,
	switchParents,
	delBaby,
	delParent,
	service
}
