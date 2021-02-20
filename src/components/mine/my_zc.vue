<template>
	<view class="wallet">
		<view class="box">
			<view class="left">
				<view class="top">{{item.status}}</view>
				<view class="bottom">{{item.create_time}}</view>
			</view>
			<view class="right">￥{{item.amount}}</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		item: {
			type: Object
		}
	},
	filters:{
	
	}
};
</script>

<style lang="scss" scoped>
.wallet {
	.box {
		height: 62px;
		background: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #fafafa;
		.left {
			.top {
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
				margin-bottom: 5px;
			}
			.bottom {
				font-size: 12px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
			}
		}
		.right {
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
		}
	}
}
</style>
