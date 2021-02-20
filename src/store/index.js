import Vue from 'vue'
import Vuex from 'vuex'
import API from "@/api/index.js";
import $mConfig from '@/config/index.config.js'
import $mRoutesConfig from '@/config/routes.config.js'
import $mRouter from '@/common/js/router.js'

Vue.use(Vuex)


const TOKEN = uni.getStorageSync("token") || "";
const CHILDCODE = uni.getStorageSync('childCode') || ''
const USERINFO = uni.getStorageSync("userinfo") || {}
const hasLogin = uni.getStorageSync("hasLogin") || false;
const INVCODE = uni.getStorageSync("invcode") || ''; //推荐码
const store = new Vuex.Store({
	state: {
		token: TOKEN,
		addressId: 0,
		hasLogin: hasLogin,
		childCode: CHILDCODE,
		userinfo: USERINFO,
		invcode: INVCODE,
		selectCategoryId: '',
		userAuthentication: "", //当前用户认证状态0,未认证，1企业认证，2个人认证
		currentLocation: {
			//当前定位地址
			latitude: "",
			longitude: "",
		},
		isShowHomeAd:true
	},
	getters: {
		getToken: state => {
			return state.token;
		},
		getAddressId(state) {
			return state.addressId;
		},
		hasLogin(state) {
			return state.hasLogin;
		},
		getChildCode(state) {
			return state.childCode
		},
		getUserinfo(state) {
			return state.userinfo
		},
		getInvcode(state) {
			return state.invcode
		},
		issueTitle(state) {
			return state.userAuthentication == 1 ? '发布招工' : '发布找活'
		},
		getCurrentLocation(state){
			return state.currentLocation;
		}

	},
	mutations: {
		SET_TOKEN(state, token) {
			state.token = token;
			uni.setStorageSync('token', token)
		},
		SET_ADDRESS(state, addressId) {
			state.addressId = addressId;
		},
		SET_HASLOGIN(state, hasLogin) {
			state.hasLogin = hasLogin;
			uni.setStorageSync("hasLogin", hasLogin)
		},
		SET_CHILDCODE(state, childCode) {
			state.childCode = childCode;
			uni.setStorageSync('childCode', childCode)
		},
		SET_USERINFO(state, userinfo) {
			state.userinfo = userinfo;
			uni.setStorageSync('userinfo', userinfo)
		},
		SET_INVCODE(state, invcode) {
			state.invcode = invcode;
			uni.setStorageSync('invcode', invcode)
		},
		SET_SELECTCATEGORYID(state, selectCategoryId) {
			state.selectCategoryId = selectCategoryId
		},
		setUserAuthentication(state, data) {
			state.userAuthentication = data;
		},
		updateCurrentLocation(state,data){
			state.currentLocation.latitude=data.latitude;
			state.currentLocation.longitude=data.longitude
		},
		updateHomeAd(state,data){
			state.isShowHomeAd=data;
		}

	},
	actions: {
		/**更新userAuthentication 数据 */
		async fetchUser(context) {
			API
				.userInfo()
				.then((res) => {
					;
					context.commit("setUserAuthentication", res.data.user_authentication)
				})
				.catch((e) => {
					console.debug("store:userAuthentication:fetchUser:catch:e=", e);
				});

		},
		setCurrentLocation(context,data){
			context.commit('updateCurrentLocation',data);
		}
	}
})

export default store