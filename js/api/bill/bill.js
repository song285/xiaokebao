import common from '../../common/common.js'

// 账单请求
function getBill(_this){
	if(!common.checkLogin(_this)){
		return
	}
	_this.$reqHttp({
		url: '/account/detail',
		data: {
			start:_this.start,
			length:_this.length,
			babyId:_this.postdata.babyId,
			orgId:_this.postdata.orgId,
			classIdStr:_this.postdata.classId || '',
			weekStart:_this.postdata.weekstart,
			weekEnd:_this.postdata.weekend
		},
		success: (res) => {
			if(res.data.success){
				_this.billDate = [..._this.billDate, ...res.data.data.detail]
				_this.billTotal = res.data.data.summary
				_this.start = _this.start + _this.length
				_this.moreStatus = "more"
			}else{
				_this.$message("获取账单失败，请联系管理员")
			}
			// if(res.data.data.detail.length <= 0){
			// 	_this.moreStatus = "noMore"
			// }else _this.moreStatus = "more"
		}
	})
}

// 获取宝宝 机构  课程
function baseInfo(_this){
	if(!common.checkLogin(_this)){
		return
	}
	_this.$reqHttp({
		url: '/account/query-cond',
		success: (res) => {
			if(res.data.success){
				_this.baseInfo = res.data.data
			}else{
				_this.$message("获取账单失败，请联系管理员")
			}
		}
	})
}

export default {
	getBill,
	baseInfo
}