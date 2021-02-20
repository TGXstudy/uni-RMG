<template>
	<view class="phone">
		<view class="banner">
			<view class="title1">绑定手机号</view>
			<view class="getphone"><input type="number" v-model="phone" placeholder="请输入手机号" value="" /></view>
			<view class="yzm">
				<view class="left"><input type="number" v-model="yzm" placeholder="请输入验证码" value="" /></view>
				<view class="right"><verify-code class="yzm" :mob="phone" :type="'third'"></verify-code></view>
			</view>
			<button @tap="sure()">确定</button>
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
			id: ''
		};
	},
	onLoad(options) {
		console.log(options);
		this.id = options.id;
	},
	methods: {
		sure() {
			var that = this;
			if (this.phone == '') {
				this.$mUtils.toast('手机号不能为空');
				return;
			}
			if (this.yzm == '') {
				this.$mUtils.toast('验证码不能为空');
				return;
			}
			let data = {
				id: this.id || '',
				mobile: this.phone || '',
				sms_code: this.yzm || ''
			};
			this.$api.bindMobile(data).then(res => {
				// #ifdef H5
				if (res.code == 200) {
					that.$mUtils.toast(res.msg);
					that.$mUtils.timeout(() => {
						that.$mUtils.timeout(() => {
							that.$mUtils.goPage('index');
						});
					});
				} else {
					that.$mUtils.toast(res.msg);
				}
				// #endif
				// #ifdef MP-WEIXIN
				if (res.code == 200) {
					that.$mUtils.toast(res.msg);
					that.$mUtils.timeout(() => {
						that.$mRouter.push({
							route: that.$mRoutesConfig.gzh_login
						});
					});
				} else {
					that.$mUtils.toast(res.msg);
				}
				// #endif
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
