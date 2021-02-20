<template>
	<view class="vip">
		<view class="banner">
			<image :src="'/mine/vip.png' | _imgUrl" mode=""></image>
			<p>￥{{price}}</p>
		</view>
		<view class="title">会员权利介绍</view>
		<view class="nav font_auth_size" v-html="content">
			
		</view>
		<view class="ty " @tap="doAgree">
			<image :src="(isAgree ? '/mine/auth/checked.png' : '/mine/auth/unchecked.png') | _imgUrl" mode=""></image>
			阅读并同意
			<text @tap.stop="$mUtils.goPage('vip_aggrement')">《会员入住协议》</text>
		</view>
		<view class="bottom" @tap="gobuy()">
			<p>￥{{price}}</p>
			<image :src="'/mine/vip_button.png' | _imgUrl" mode=""></image>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isAgree: false,
			price:'',
			content:''
		};
	},
	onLoad() {
		this.get()
		this.hyql()
	},
	methods: {
		hyql(){
			this.$api
				.vipPower()
				.then(res => {
					this.content = this.$mUtils.rplaceRichImg(res.data.content);
					console.log(res,'sdsdsd');
				});
		},
		get(){
			this.$api.payData().then(res=>{
				this.price=res.data.vip
			})
		},
		doAgree() {
			this.isAgree = !this.isAgree;
		},
		gobuy() {
			if (!this.isAgree) {
				this.$mUtils.toast('请阅读并同意会员入住协议');
				return;
			}
			this.$mRouter.push({
				route: this.$mRoutesConfig.buy_vip
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.vip {
	background: linear-gradient(360deg, rgba(255, 244, 216, 0) 0%, #fde4af 100%);
	padding: 10px;
	.ty {
		width: 100%;
		height: 30px;
		margin: 0 auto;
		margin-top: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #999999;
		font-size: 12px;
		text {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #0067df !important;
		}
		image {
			width: 16px;
			height: 16px;
			margin-right: 10px;
		}
	}
	.bottom {
		width: 100%;
		height: 44px;
		position: relative;
		margin-top: 50px;
		display: flex;
		align-items: center;
		p {
			z-index: 99999;
			font-size: 24px;
			font-family: DINAlternate-Bold, DINAlternate;
			color: #333333;
			position: absolute;
			left: 20px;
		}
		image {
			width: 100%;
			height: 44px;
		}
	}
	.nav {
		background: #ffffff;
		border-radius: 8px;
		padding: 10px;
		display: flex;
		flex-wrap: wrap;
	}
	.title {
		font-size: 16px;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #333333;
		margin-top: 20px;
		margin-bottom: 10px;
	}
	.banner {
		width: 100%;
		position: relative;
		height: 130px;
		p {
			z-index: 99;
			font-size: 24px;
			font-family: DINAlternate-Bold, DINAlternate;
			color: #e7bf7f;
			position: absolute;
			right: 20px;
			bottom: 30px;
		}
		image {
			position: absolute;
			z-index: 11;
			width: 100%;
			height: 130px;
		}
	}
}
</style>
