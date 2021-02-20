<template>
	<view class="phone">
		<view class="banner">
			<view class="title1">登录账号</view>
			<view class="title2">
				还没有账号，去
				<text @tap="$mUtils.goPage('reg')">注册</text>
			</view>
			<view class="getphone"><input type="number" v-model="phone" placeholder="请输入手机号" value="" /></view>
			<view class="getphone"><input type="password" v-model="pwd" placeholder="请输入密码" value="" /></view>
			<view class="forget" @tap="$mUtils.goPage('forget')">忘记密码</view>
			<button class="btnn" @tap="login()">登录</button>

			
		<!-- 	<button open-type="getUserInfo" @getuserinfo="userinfo()" class="weixin">
				<text>第三方登录</text>
				<image :src="'/mine/weixin_login.png' | imgUrl" mode=""></image>
			</button> -->
		

			
			<!-- <view class="weixin" @tap="$mUtils.goPage('gzh_login')">
				<text>第三方登录</text>
				<image :src="'/mine/weixin_login.png' | imgUrl" mode=""></image>
			</view> -->
			
		</view>
	</view>
</template>

<script>
import verifyCode from '@/components/verifyCode.vue';
export default {
	components: {
		verifyCode
	},
	data() {
		return {
			phone: '',
			pwd: ''
		};
	},
	methods: {
		//微信登录
		userinfo() {
			// wx登录
			var that = this;
			wx.login({
				success(data) {
					console.log(data,'data');
					if (data.code) {
						// 获取微信用户信息
						uni.getUserInfo({
							success: function(res) {
								console.log(res, 'assassa');
								that.$api
									.wxlogin({
										code: data.code,
										rawData: res.rawData
									})
									.then(res => {
										console.log(res)
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
													query:{id:res.data}
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
						console.log(res,'fail')
					}
				}
			});
		},

		//直接登录
		login() {
			let that = this;
			if (this.phone == '') {
				this.$mUtils.toast('手机号不能为空');
				return;
			}
			if (this.pwd == '') {
				this.$mUtils.toast('密码不能为空');
				return;
			}
			let data = {
				mobile: this.phone || '',
				password: this.pwd || ''
			};
			this.$api.login(data).then(res => {
				if (res.code == 200) {
					this.$mUtils.toast(res.msg);
					this.$store.commit('SET_TOKEN', res.data);
					this.$store.commit('SET_HASLOGIN', true);
					this.$mUtils.timeout(() => {
						that.$mUtils.timeout(() => {
							that.$mUtils.goPage('index');
						});
					});
				} else {
					this.$mUtils.toast(res.msg);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.phone {
	width: 100%;
	input::-webkit-input-placeholder {
		color: #ccc;
	}
	input::-moz-input-placeholder {
		color: #ccc;
	}
	input::-ms-input-placeholder {
		color: #ccc;
	}
	.banner {
		width: 85%;
		margin: 0 auto;
		.weixin {
			margin-top: 300rpx;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			text {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
			}
			image {
				width: 80rpx;
				height: 80rpx;
				margin-top: 10px;
			}
		}
		.forget {
			margin-top: 20px;
			width: 100%;
			display: flex;
			justify-content: flex-end;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #cccccc;
		}
		.btnn {
			margin: 0 auto;
			margin-top: 120rpx;
			width: 100%;
			height: 88rpx;
			border-radius: 44rpx;
			background: #0067df;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #ffffff;
		}
		.title1 {
			font-size: 44rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
		}
		.title2 {
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
			margin-top: 10px;
			text {
				color: #0067df;
			}
		}
		.getphone {
			display: flex;
			align-items: center;
			width: 100%;
			height: 120rpx;
			background: #ffffff;
			border-bottom: 1px solid #fafafa;
			font-size: 36rpx;
			margin-top: 20px;
		}
		.yzm {
			width: 100%;
			height: 120rpx;
			border-bottom: 1px solid #fafafa;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
}
</style>
