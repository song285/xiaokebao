// 产品反馈
function feedback(_this){
	if(!_this.text){
		_this.$message("请填写反馈内容")
		_this.isclick = false
		return
	}
	
	if(_this.text.length > 100){
		_this.$message("提交失败，最多100字")
		_this.isclick = false
		return
	}
	
	_this.$reqHttp({
		url: '/product-feedback/add',
		data: {
			remark:_this.text
		},
		success: (res) => {
			if(res.data.success){
				_this.$message("提交成功！")
				setTimeout(()=>{
					uni.navigateBack({})
				},1000)
			}else{
				_this.isclick = false
				_this.$message("提交失败,请稍后再试")
			}
		}
	})
}

export default{
	feedback
}