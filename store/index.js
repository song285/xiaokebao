import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		footerClass:1,//底部导航
		origId:'',
		babyid:''
	},

	mutations: {
		choiceFooter(state,num){//切换底部导航
			state.footerClass = num
			console.log(">>>>now bar",num)
		},
		SET_ORIGID(state,origId){
			state.origId = origId
		},
		SET_BABYID(state,babyid){
			state.babyid = babyid
		}
	},
	actions: {}
})
export default store
