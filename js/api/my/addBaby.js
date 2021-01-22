// 添加宝宝
function addBaby(_this){
	uni.showLoading({
		title:'添加中',
		mask:true
	})
	_this.$reqHttp({
		url: '/baby/add',
		data: {
			nickName:_this.name,
			head:_this.headerImg,
			sex:_this.genderId,
			birthDate:_this.birthday,
			color:_this.color,
			height:_this.height,
			weight:_this.weight,
			hobby:_this.hobby,
			strongPoint:_this.strongPoint
		},
		success: (res) => {
			if(res.data.success){
				uni.hideLoading()
				_this.$message("添加成功")
				_this.$store.commit('SET_BABYID',res.data.data)
				uni.navigateBack({})
			}else{
				uni.hideLoading()
				_this.$message("添加失败")
			}
		}
	})
}

// 获取该家庭的剩余的宝宝的颜色
function getBabyColor(_this){
	_this.$reqHttp({
		url: '/baby/query-color',
		success: (res) => {
			if(res.data.success){
				_this.colorList = res.data.data
			}
		}
	})
}

// 修改宝宝信息
function update(_this){
	uni.showLoading({
		title:'修改中',
		mask:true
	})
	_this.$reqHttp({
		url: '/baby/update',
		data: {
			id:_this.babyId,
			nickName:_this.name,
			head:_this.headerImg,
			sex:_this.genderId,
			birthDate:_this.birthday,
			color:_this.color,
			height:_this.height,
			weight:_this.weight,
			hobby:_this.hobby,
			strongPoint:_this.strongPoint
		},
		success: (res) => {
			if(res.data.success){
				uni.hideLoading()
				_this.$message("修改成功")
				uni.navigateBack({})
			}else{
				uni.hideLoading()
				_this.$message("修改失败")
			}
		}
	})
}

export default {
	addBaby,
	update,
	getBabyColor
}