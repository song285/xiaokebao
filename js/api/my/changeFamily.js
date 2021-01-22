// 切换家庭
function changeFamily(item,_this){
	_this.$reqHttp({
		url: '/user/switch-family',
		data: {
			mainUserId:item.id
		},
		success: (res) => {
			if(res.data.success){
				if(_this.currentFamily == item.homeName){
					_this.$message('正在当前家庭')
					return
				}
				uni.setStorageSync('userToken',res.data.data.token)
				uni.setStorageSync('currentFamily',item.homeName)
				uni.setStorageSync('identity_check',res.data.data.identity)
				_this.currentFamily = item.homeName
				_this.init()
				_this.identity_check = res.data.data.identity
				_this.$message(res.data.msg)
			}else{
				_this.$message(res.data.msg)
			}
		}
	})
}

export default{
	changeFamily
}