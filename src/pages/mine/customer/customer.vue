<template>
	<view class="set">
		<view class="banner">
			<view class="one" @tap="$mUtils.goPage('question')">
				<view class="left">
					常见问题
				</view>
				<view class="right">
					<image :src="'/mine/jt.png' | _imgUrl"  mode="">
				</view>
			</view>
			<view class="one"  @tap="$mUtils.goPage('suggest')">
				<view class="left" >
					意见建议
				</view>
				<view class="right">
					<image :src="'/mine/jt.png' | _imgUrl"  mode="">
				</view>
			</view>
			<view class="one" @tap="$mUtils.goPage('about')">
				<view class="left">
					关于我们
				</view>
				<view class="right">
					<image :src="'/mine/jt.png' | _imgUrl"  mode="">
				</view>
			</view>
			<view class="one" @tap="$mUtils.goPage('service')">
				<view class="left">
					在线客服
				</view>
				<view class="right">
					<image :src="'/mine/jt.png' | _imgUrl"  mode="">
				</view>
			</view>
			<view class="kfdh" @tap="tel_phone()">
				<image :src="'/mine/phone.png' | _imgUrl"  mode="">
				<text>客服电话</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				kfxx: {}
			}
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
					phoneNumber: this.kfxx.customer_service,
					//仅为示例
				});
			}
		}
	}
</script>

<style  lang="scss" scoped>
.set{
	width: 100%;
	.banner{
		width: 95%;
		margin: 0 auto;
		position: relative;
		.kfdh{
			position: fixed;
			bottom: 20px;
			margin-top: 120rpx;
			width: 702rpx;
			height: 88rpx;
			border-radius: 44rpx;
			background: #0067DF;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
			image{
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
			}
		}
		.one{
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #FAFAFA;
			.left{
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
			}
			.right{
				image{
					width: 32rpx;
					height: 32rpx;
				}
			}
		}
	}
}
</style>