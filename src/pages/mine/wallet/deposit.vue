<template>
	<view class="recharge">
		<view class="banner">
			<view class="title1">提现金额</view>
			<view class="input">
				<text>￥</text>
				<input type="digit" v-model="tx" value="" />
			</view>
			<view class="jl">
				<text>可提现金额￥{{ yue }}</text>
			</view>
			<view class="title2">提现至</view>
			<view class="box">
				<view class="left">
					<image :src="'/mine/weixin.png' | _imgUrl" mode=""></image>
					<p>微信</p>
				</view>
				<view class="right"><image :src="'/mine/auth/checked.png' | _imgUrl" mode=""></image></view>
			</view>
			<button class="zf" @tap="txx()">确定提现</button>
		</view>
	</view>
</template>

<script>
import config from '@/config/index.config.js';
export default {
	data() {
		return {
			yue: '',
			tx: '',
			userinfo: {},
			open: ''
		};
	},
	onLoad() {
		this.wallet();
		this.getinfo();
	},
	methods: {
		wallet() {
			this.$api
				.myWallet({
					page: this.page,
					limit: 10
				})
				.then(res => {
					this.yue = res.data.balance;
				});
		},
		txx() {
			if (this.tx == '') {
				this.$mUtils.toast('提现余额不能为空');
				return;
			}

			// #ifdef MP-WEIXIN

			this.$api
				.applyCash({
					amount: this.tx,
					open_id: this.open
				})
				.then(res => {
					if (res.code == 200) {
						this.$mUtils.toast(res.msg);
						this.$mUtils.timeout(() => {
							this.$mRouter.back();
						});
					} else {
						this.$mUtils.toast(res.msg);
					}
				});

			// #endif

			// #ifdef H5

			if (this.$mUtils.checkIsWx()) {
				this.$api
					.applyCash({
						amount: this.tx,
						open_id: this.open
					})
					.then(res => {
						if (res.code == 200) {
							this.$mUtils.toast(res.msg);
							this.$mUtils.timeout(() => {
								this.$mRouter.back();
							});
						} else {
							this.$mUtils.toast(res.msg);
						}
					});
			} else {
				this.$mUtils.toast('请在微信中申请提现');
			}

			// #endif
		},
		getinfo() {
			var that = this;
			this.$api.userInfo().then(res => {
				console.log(res);
				that.userinfo = res.data;
				// #ifdef H5
				that.open = res.data.public_openid;
				// #endif

				// #ifdef MP-WEIXIN
				that.open = res.data.openid;
				// #endif
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.recharge {
	width: 100%;
	.banner {
		width: 95%;
		margin: 0 auto;
		.zf {
			margin-top: 30px;
			color: #ffffff;
			width: 100%;
			height: 44px;
			background: #0067df;
			border-radius: 22px;
			font-size: 16px;
		}
		.box {
			width: 100%;
			height: 50px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #fafafa;
			margin-top: 10px;
			padding-bottom: 10px;
			.left {
				display: flex;
				p {
					margin-left: 10px;
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
				}
				image {
					width: 24px;
					height: 24px;
				}
			}
			.right {
				image {
					width: 16px;
					height: 16px;
				}
			}
		}
		.title2 {
			margin-top: 60px;
			font-size: 16px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
		}
		.title1 {
			font-size: 16px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			margin-top: 20px;
		}
		.input {
			margin-top: 40px;
			display: flex;
			padding-bottom: 5px;
			border-bottom: 1px solid #fafafa;
			text {
				font-size: 18px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #333333;
			}
		}
		.jl {
			display: flex;
			align-items: center;
			margin-top: 5px;
			text {
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
			}
			image {
				width: 24px;
				height: 24px;
			}
		}
	}
}
</style>
