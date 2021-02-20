<template>
	<view class="phone">
		<view class="banner">
			<view class="title1">注册账号</view>
			<view class="title2">请使用手机号注册</view>
			<view class="getphone"><input type="number" v-model="phone" placeholder="请输入手机号" value="" /></view>
			<view class="yzm">
				<view class="left"><input type="number" v-model="yzm" placeholder="请输入验证码" value="" /></view>
				<view class="right"><verify-code class="yzm" :mob="phone" :type="'register'"></verify-code></view>
			</view>
			<view class="yzm"><input type="password" v-model="pwd" placeholder="请输入密码" value="" /></view>
			<view class="yzm"><input type="password" v-model="pwdagain" placeholder="请再次输入密码" value="" /></view>
			<view class="yzm"><input type="text" v-model="tjm" placeholder="请输入推荐人手机号或推荐码（选填）" value="" /></view>
			<button @tap="bc()">注册</button>
			<view class="agree">
				点击注册表示您同意
				<text @tap="$mUtils.goPage('user_agreement')">《用户协议》</text>
			</view>
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
			yzm: '',
			pwd: '',
			pwdagain: '',
			tjm: ''
		};
	},
	onLoad() {
		this.tjm = this.$route.query.invite_code;
	},
	methods: {
		bc() {
			if(this.phone==''){
				this.$mUtils.toast('手机号不能为空');
				return
			}
			if(this.yzm==''){
				this.$mUtils.toast('验证码不能为空');
				return
			}
			if(this.pwd==''){
				this.$mUtils.toast('密码不能为空');
				return
			}
			if(this.pwdagain==''){
				this.$mUtils.toast('确认密码不能为空');
				return
			}
			let data = {
				mobile: this.phone || '',
				password: this.pwd || '',
				repassword: this.pwdagain || '',
				sms_code: this.yzm || '',
				invite_code:this.tjm || ''
			}
			this.$api.register(data).then(res => {
				if (res.code == 200) {
					this.$mUtils.toast(res.msg);
					this.$mUtils.timeout(() => {
						this.$mUtils.goPage('login');
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
	input::-webkit-input-placeholder {
		color: #ccc;
		font-size: 28rpx;
	}
	input::-moz-input-placeholder {
		color: #ccc;
		font-size: 28rpx;
	}
	input::-ms-input-placeholder {
		color: #ccc;
		font-size: 28rpx;
	}
	.banner {
		width: 85%;
		margin: 0 auto;
		.agree {
			margin-top: 50px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			color: #999999;
			text {
				color: #0067df;
			}
		}
		button {
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
		}
		.getphone {
			display: flex;
			align-items: center;
			width: 100%;
			height: 120rpx;
			background: #ffffff;
			border-bottom: 1px solid #fafafa;
			margin-top: 20px;
		}
		.yzm {
			width: 100%;
			height: 120rpx;
			border-bottom: 1px solid #fafafa;
			display: flex;
			justify-content: space-between;
			align-items: center;
			input {
				width: 100%;
			}
		}
	}
}
</style>
