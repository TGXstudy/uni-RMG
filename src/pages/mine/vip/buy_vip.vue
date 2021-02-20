<template>
	<view class="buyvip">
		<view class="top">
			<p>￥{{ price }}</p>
			<text class="font_auth_size">需支付</text>
		</view>
		<view class="bottom">
			<view class="banner">
				<view class="title">支付方式</view>
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
				</view>
				<!-- #endif -->

				<view class="box" @tap="payway = '3'">
					<view class="left">
						<image :src="'/mine/my_wallet.png' | _imgUrl" mode=""></image>
						<p>余额支付</p>
					</view>
					<view class="right"><image :src="(payway == '3' ? '/mine/auth/checked.png' : '/mine/auth/unchecked.png') | _imgUrl" mode=""></image></view>
				</view>
				<view class="nav font_auth_size">
					<br />
					<view class="" v-html="tips"></view>
				</view>
				<button class="zf" @tap="doPay()">去支付</button>
				<pwd-input ref="pwdPopup" @confirmPay="confirmPay"></pwd-input>
			</view>
		</view>
	</view>
</template>

<script>
import pwdInput from '@/components/PwdInput.vue';
export default {
	components: {
		pwdInput
	},
	data() {
		return {
			payway: '2', //支付方式
			price: '',
			tips: ''
		};
	},
	onLoad() {
		this.get();
		this.getTips();
	},
	methods: {
		async getTips() {
			let { data } = await this.$api.tips();
			this.tips = this.$mUtils.rplaceRichImg(data.content);
		},
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
				this.price = res.data.vip;
			});
		},
		// 余额支付
		accoutPay(pwd) {
			this.$api
				.vipPay({
					type: '3',
					client: 'applets',
					pay_pwd: pwd
				})
				.then(res => {
					console.log(res);
					if (res.code == 200) {
						this.$mUtils.toast(res.msg);
						this.$mUtils.timeout(() => {
							this.$mRouter.back();
						});
					} else {
						this.$mUtils.toast(res.msg);
					}
				});
		},
		confirmPay(pwd) {
			console.log('支付密码确认', pwd);
			this.$refs.pwdPopup.close();
			//余额支付，钱包支付 accoutPay
			this.accoutPay(pwd);
		},
		doPay() {
			var that = this;

			//微信支付
			if (this.payway == '2') {
				// #ifdef H5
				if(this.$mUtils.checkIsWx()){
					console.log('公众号支付');
					this.$api
						.vipPay({
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
					.vipPay({
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
			} else if (this.payway == '3') {
				//余额支付
				this.inputPayPwd();
			} else if (this.payway == '1') {
				this.$api
					.vipPay({
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
		},
		//输入支付密码
		inputPayPwd() {
			this.$refs.pwdPopup.open();
		}
	}
};
</script>

<style lang="scss" scoped>
.buyvip {
	width: 100%;
	padding-top: 0;
	background: #f9f9f9;
	.top {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #ffffff;
		height: 120px;
		margin-top: 30px;
		p {
			margin-bottom: 5px;
			font-size: 20px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #0067df;
		}
	}
	.bottom {
		width: 100%;
		background-color: #ffffff;
		margin-top: 10px;
		padding-top: 20px;
		.banner {
			width: 95%;
			margin: 0 auto;
			.title {
				font-size: 16px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #333333;
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
			.nav {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				margin-top: 30px;
			}
			.zf {
				margin-top: 30px;
				color: #ffffff;
				width: 100%;
				height: 44px;
				background: #0067df;
				border-radius: 22px;
				font-size: 16px;
			}
		}
	}
}
</style>
