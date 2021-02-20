<template>
	<view class="phone">
		<view class="banner">
			<view class="title1">修改支付密码</view>
			<view class="title2">请使用超过6位的数字设置密码</view>
			<view class="getphone">{{phone}}</view>
			<view class="yzm">
				<view class="left"><input type="number" v-model="yzm" placeholder="请输入验证码" value="" /></view>
				<view class="right"><verify-code class="yzm" :mob="phone" :type="'pay'"></verify-code></view>
			</view>
			<view class="yzm">
				<view class="left"><input type="number" v-model="pwd" placeholder="请设置新密码" value="" /></view>
			</view>
			<view class="yzm">
				<view class="left"><input type="number" v-model="pwdagain" placeholder="请确认密码" value="" /></view>
			</view>
			<button @tap="bc()">保存</button>
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
		};
	},
	onLoad() {
		this.getinfo()
	},
	methods: {
		getinfo(){
			this.$api.userInfo().then(res=>{
				this.phone=res.data.mobile
				console.log(res,'返回')
			})
		},
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
			}
			this.$api.payPwd(data).then(res => {
				if (res.code == 200) {
					this.$mUtils.toast(res.msg);
					this.$mUtils.timeout(() => {
						this.$mRouter.back();
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
	}
	input::-moz-input-placeholder {
		color: #ccc;
	}
	input::-ms-input-placeholder {
		color: #ccc;
	}
	width: 100%;
	.banner {
		width: 85%;
		margin: 0 auto;
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
			font-size: 36rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
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
