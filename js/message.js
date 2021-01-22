// 提示
function message(content){
	uni.showToast({
		icon:'none',
	    title: content,
	    duration: 3000
	});
}

export default{
	message
}