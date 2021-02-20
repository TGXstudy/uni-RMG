<template>
	<!-- 登录 -->
	<view class="container">
		<view class="name fn-sz-30">人民工申请</view>
		<view class="fn-sz-30">获取你的昵称、头像、地区及性别</view>
		<!-- #ifdef H5 -->
		<button class="login-btn fn-sz-30 fn-cl-fff" open-type="getUserInfo" @click="doLogin1">登录</button>
		<!-- #endif -->

		<!-- #ifdef MP-WEIXIN -->
		<button class="login-btn fn-sz-30 fn-cl-fff" open-type="getUserInfo" @getuserinfo="userinfo()">登录</button>
		<!-- #endif -->
		
		<button class="login-btn2 fn-sz-30 fn-cl-fff" @tap="qx()">取消</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			code: ''
		};
	},
	onLoad() {
	
	},
	//微信授权登录 wxlogin
	methods: {
		qx(){
			this.$mUtils.goPage('index');
		},
		//微信登录
		userinfo() {
			// wx登录
			
			var that = this;
			wx.login({
				success(data) {
					console.log(data, 'data');
					
					if (data.code) {
						
						// 获取微信用户信息
						uni.getUserInfo({
							success: function(res) {
								
								console.log(res, 'assassa');
								that.$api
									.wxlogin({
										code: data.code,
									})
									.then(res => {
										console.log(res);
										if (res.code == 200) {
											that.$mUtils.toast(res.msg);
											that.$store.commit('SET_TOKEN', res.data);
											that.$store.commit('SET_HASLOGIN', true);
											that.$mUtils.timeout(() => {
												that.$mUtils.timeout(() => {
													that.$mUtils.goPage('index');
												});
											});
										} else if (res.code == 1005) {
											that.$mUtils.toast(res.msg);
											that.$mUtils.timeout(() => {
												that.$mRouter.push({
													route: that.$mRoutesConfig.bindTel,
													query: { id: res.data }
												});
											});
										}
									});
							},
							fail: res => {
								// 获取失败的去引导用户授权
								console.log(res);
							}
						});
					} else {
						console.log(res, 'fail');
					}
				}
			});
		},
		doLogin1() {
			// #ifdef H5
			//this.code = this.getQueryString('code');
			if (!this.code) {
				window.location.href =
					'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx38d5c1539049170f&redirect_uri=https://renmingong.batmp.com/web/&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
			} else {
				this.handleLogin(this.code);
			}
			// #endif
		},
		getQueryString(name) {
			//获取url参数
			var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			var r = window.location.search.substr(1).match(reg);
			if (r != null) {
				return unescape(r[2]);
			}
			return null;
		},
		//授权登录接口
		handleLogin(data) {
			var that = this;
			console.log(data, 'data');
			this.$api
				.official({
					code: data
				})
				.then(res => {
					console.log('授权登录接口', res);
					if (res.code == 200) {
						that.$mUtils.toast(res.msg);
						that.$store.commit('SET_TOKEN', res.data);
						that.$store.commit('SET_HASLOGIN', true);
						that.$mUtils.timeout(() => {
							that.$mUtils.timeout(() => {
								that.$mUtils.goPage('index');
							});
						});
					} else if (res.code == 1005) {
						that.$mUtils.toast(res.msg);
						that.$mUtils.timeout(() => {
							that.$mRouter.push({
								route: that.$mRoutesConfig.bindTel,
								query: { id: res.data }
							});
						});
					} else if (res.code == 210) {
						that.$mUtils.toast(res.msg);
						that.$mUtils.timeout(() => {
							that.$mRouter.reLaunch({
								route: that.$mRoutesConfig.login
							});
						});
					}
				});
		}
	}
};
</script>
<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.name {
		margin-bottom: 20upx;
	}
	.login-btn {
		margin-top: 40upx;
		//#ifdef MP-WEIXIN
		background-color: #45c4a2;
		//#endif
		//#ifdef H5
		background-color: #45c4a2;
		//#endif
		width: 560upx;
		height: 80upx;
		line-height: 80upx;
		border-radius: 40upx;
	}
	.login-btn2 {
		margin-top: 40upx;
		//#ifdef MP-WEIXIN
		background-color: #ccc;
		//#endif
		//#ifdef H5
		background-color: #ccc;
		//#endif
		width: 560upx;
		height: 80upx;
		line-height: 80upx;
		border-radius: 40upx;
	}
}
</style>
