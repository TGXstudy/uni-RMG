<template>
	<view class="rzxx">
		<view class="banner">
			<view class="first" @tap="rz1()">
				<image :src="'/mine/auth/person_banner.png' | _imgUrl"  mode=""></image>
				<view class="left">
					<view class="one"><image :src="'/mine/auth/person.png' | _imgUrl"  mode=""></image></view>
					<view class="two">
						<p>个人认证</p>
						<text>我是技术工 要找活</text>
					</view>
				</view>
				<view class="right"><image :src="'/mine/auth/jt.png' | _imgUrl"  mode=""></image></view>
			</view>
			<view class="first" @tap="rz2()">
				<image :src="'/mine/auth/commpany.png' | _imgUrl"  mode=""></image>
				<view class="left">
					<view class="one"><image  :src="'/mine/auth/commpany_banner.png' | _imgUrl"  mode=""></image></view>
					<view class="two">
						<p>企业认证</p>
						<text>我是企业负责人 要招工</text>
					</view>
				</view>
				<view class="right"><image :src="'/mine/auth/jt.png' | _imgUrl" mode=""></image></view>
			</view>
		</view>

	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		rz1() {
			this.$mRouter.push({
				route: this.$mRoutesConfig.person_auth
			});
		},
		rz2() {
			this.$mRouter.push({
				route: this.$mRoutesConfig.company_auth
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.rzxx {
	width: 100%;
	.banner{
		width: 95%;
		margin: 0 auto;
		.first {
			width: 100%;
			height: 100px;
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20px;
			.left {
				margin-left: 10px;
				display: flex;
				.one {
					width: 50px;
					image {
						width: 50px;
						height: 50px;
					}
				}
				.two {
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					margin-left: 20px;
					p {
						font-size: 16px;
						font-family: PingFangSC-Semibold, PingFang SC;
						color: #ffffff;
					}
					text {
						margin-top: 10px;
						font-size: 12px;
						font-family: PingFangSC-Regular, PingFang SC;
						color: #ffffff;
					}
				}
			}
			.right {
				margin-right: 30px;
				image {
					width: 16px;
					height: 16px;
				}
			}
			image {
				z-index: -1;
				width: 100%;
				height: 100%;
				position: absolute;
			}
		}
		.second {
		}
	}

}
</style>
