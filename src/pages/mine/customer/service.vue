<template>
	<view class="service">
		<view class="banner">
			<view class="top">
				<view class="one">
					<image :src="'/mine/mine_weixin.png' | _imgUrl" mode=""></image>
					<text>平台客服微信:{{ kfxx.weixin }}</text>
				</view>
				<view class="one">
					<image :src="'/mine/mine_phone2.png' | _imgUrl" mode=""></image>
					<text>平台客服电话:{{ kfxx.customer_service }}</text>
				</view>
			</view>
			<view class="bottom" @tap="tel_phone()">
				<image :src="'/mine/mine_phone1.png' | _imgUrl" mode=""></image>
				<text>直接拨打客服电话</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			kfxx: {}
		};
	},
	onLoad() {
		this.kf();
	},
	methods: {
		kf() {
			this.$api.customer().then(res => {
				this.kfxx = res.data;
				console.log(res);
			});
		},
		tel_phone() {
			uni.makePhoneCall({
				phoneNumber: this.kfxx.customer_service
				//仅为示例
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.service {
	width: 100%;
	.banner {
		width: 95%;
		margin: 0 auto;
		padding-top: 30px;
		.top {
			width: 100%;
			height: 300rpx;
			background: #0a6ee3;
			border-radius: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;
			.one {
				margin-top: 30px;
				display: flex;
				align-items: center;
				text {
					font-size: 32rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #ffffff;
				}
				image {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}
		.bottom {
			width: 622rpx;
			height: 88rpx;
			background: #e5f1ff;
			border-radius: 44rpx;
			margin: 0 auto;
			top: -20px;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			text {
				font-size: 32rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #0067df;
			}
			image {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}
}
</style>
