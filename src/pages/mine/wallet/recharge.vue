<template>
	<view class="recharge">
		<view class="banner">
			<view class="title1">充值金额</view>
			<view class="input">
				<text>￥</text>
				<input type="digit" v-model="cz" value="" />
			</view>
			<view class="jl">
				<image :src="'/mine/jb.png' | _imgUrl" mode=""></image>
				<text>充值给与{{ price }}%的奖励</text>
			</view>
			<view class="title2">充值方式</view>
			<view class="box" @tap="payway = '2'">
				<view class="left">
					<image :src="'/mine/weixin.png' | _imgUrl" mode=""></image>
					<p>微信支付</p>
				</view>
				<view class="right"><image :src="(payway == '2' ? '/mine/auth/checked.png' : '/mine/auth/unchecked.png') | _imgUrl"></image></view>
			</view>
			<!-- #ifdef H5 -->
			<view class="box" @tap="payway = '1'" v-if="!$mUtils.checkIsWx()">
				<view class="left">
					<image :src="'/mine/zfb.png' | _imgUrl" mode=""></image>
					<p>支付宝</p>
				</view>
				<view class="right"><image :src="(payway == '1' ? '/mine/auth/checked.png' : '/mine/auth/unchecked.png') | _imgUrl"></image></view>
				<!-- #endif -->
			</view>
			<button class="zf" @tap="sure()">确定充值</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cz: '', //余额充值
			price: '', //奖励比列
			payway: '2' //支付方式
		};
	},
	onLoad() {
		this.get();
	},
	methods: {
		gzhPay(payRes) {
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest',
				{
					appId: payRes.data.appid, //公众号名称，由商户传入
					timeStamp: payRes.data.time_stamp, //时间戳，自1970年以来的秒数
					nonceStr: payRes.data.nonce_str, //随机串
					package: payRes.data.package,
					signType: payRes.data.sign_type, //微信签名方式：
					paySign: payRes.data.sign //微信签名
				},
				function(res) {
					if (res.err_msg == 'get_brand_wcpay_request:ok') {
						that.$mUtils.toast('支付成功');
					} else {
						that.$mUtils.toast('支付失败');
					}
				}
			);
		},
		get() {
			this.$api.payData().then(res => {
				this.price = res.data.balance;
			});
		},
		sure() {
			var that = this;
			if (this.cz == '') {
				this.$mUtils.toast('充值余额不能为空');
				return;
			}
			//微信支付
			if (this.payway == '2') {
				// #ifdef H5
				
				if(this.$mUtils.checkIsWx()){
					console.log('公众号支付');
					this.$api
						.rechargeBalance({
							balance: this.cz,
							type: '2',
							client: 'public'
						})
						.then(res => {
							that.gzhPay(res);
							console.log(res);
						});
				}else{
					this.$mUtils.toast("微信h5支付暂未开通")
					
				}
				// #endif
				// #ifdef MP-WEIXIN
				this.$api
					.rechargeBalance({
						balance: this.cz,
						type: '2',
						client: 'applets'
					})
					.then(res => {
						console.log(res);
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: res.data.timeStamp,
							// String 微信小程序必填 时间戳从1970年1月1日至今的秒数，即当前的时间。 微信小程序
							nonceStr: res.data.nonceStr,
							// String 微信小程序必填 随机字符串，长度为32个字符以下。 微信小程序
							package: res.data.package,
							// String 微信小程序必填 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx。 微信小程序
							signType: res.data.signType, // String 微信小程序必填 签名算法，暂支持 MD5。 微信小程序
							paySign: res.data.paySign, //
							success(res) {
								console.log('微信小程序支付', res);
								if (res.errMsg === 'requestPayment:ok') {
									that.$mUtils.toast('支付成功');
									that.$mRouter.back();
								} else {
								}
							},
							fail(res) {
								that.$mUtils.toast('支付失败');
								console.log('微信小程序支付 failfailfail', res);
							}
						});
					});
				// #endif
			} else if (this.payway == '1') {
				this.$api
					.rechargeBalance({
						balance: this.cz,
						type: '1',
						client: 'h5'
					})
					.then(res => {
						console.log(res);
						const div = document.createElement('div');
						/* 此处form就是后台返回接收到的数据 */
						div.innerHTML = res.data;
						document.body.appendChild(div);
						document.forms[0].submit();
					});
			}
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
				display: flex;
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
