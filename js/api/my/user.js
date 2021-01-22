
function updataUserInfo(_this) {
	uni.showLoading({
		title:'修改中',
		mask:true
	})
	_this.$reqHttp({
		url: '/user/update',
		data: {
			id: 1,
			nickName: _this.userName,
			head : _this.userImg,
			sex: _this.gender == '男' ? 1 : 2,
			identity : _this.identity == '爸爸' ? 10 : _this.identity == '妈妈' ? 20 : _this.identity == '爷爷' ? 30 :_this.identity == '奶奶' ? 40 : 50,
			birthDate: _this.birthday,
			address: _this.region,
			phone:_this.userPhone
		},
		success: (res) => {
			if (res.data.success) {
				let idy = _this.identity == '爸爸' ? 10 : _this.identity == '妈妈' ? 20 : _this.identity == '爷爷' ? 30 :_this.identity == '奶奶' ? 40 : 50
				uni.setStorageSync("identity_check",idy)
				uni.hideLoading()
				_this.$message("修改成功")
				uni.navigateBack({})
			}else{
				uni.hideLoading()
				_this.$message(res.data.msg)
			}
		}
	})
}
export default {
	updataUserInfo
}
