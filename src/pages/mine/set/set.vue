<template>
	<view class="set">
		<view class="banner">
			<view class="one" @tap="$mUtils.goPage('set_info')">
				<view class="left">
					个人资料
				</view>
				<view class="right">
					<image :src="'/mine/jt.png' | _imgUrl"  mode="">
				</view>
			</view>
			<view class="one"  @tap="$mUtils.goPage('checkphone1')">
				<view class="left" >
					修改手机号
				</view>
				<view class="right">
					<image :src="'/mine/jt.png' | _imgUrl"  mode="">
				</view>
			</view>
			<view class="one" @tap="$mUtils.goPage('check_pay')">
				<view class="left">
					修改支付密码
				</view>
				<view class="right">
					<image :src="'/mine/jt.png' | _imgUrl"  mode="">
				</view>
			</view>
			<view class="one" @tap="$mUtils.goPage('check_login')">
				<view class="left">
					修改登录密码
				</view>
				<view class="right">
					<image :src="'/mine/jt.png' | _imgUrl"  mode="">
				</view>
			</view>
			<button  @tap="showAction()">退出登录</button>
		</view>
	</view>
</template>

<script>
	import config from "@/config/index.config.js"
	export default {
		data(){
			return{
				
			}
		},
		methods:{
						//退出账号
						showAction(type) {
							console.log(config.imgUrl+'/#/pages/login/login')
							var a=config.imgUrl+'/#/pages/login/login';
							let that = this;
							uni.showModal({
								title: '提示',
								content: '是否退出登录?',
								success: function(res) {
									if (res.confirm) {
										try {
											uni.clearStorageSync();
										} catch (e) {
											console.log('错误')
										}
										
										// #ifdef H5
										
										
										if(that.$mUtils.checkIsWx()){
											
										that.$mUtils.toast('已退出登录');
										that.$store.commit('SET_TOKEN','');
										that.$mUtils.timeout(() => {
											that.$mRouter.reLaunch({
												route: that.$mRoutesConfig.gzh_login
											});
										},2000);
										}else{
											
											that.$mUtils.toast('已退出登录');
											that.$mUtils.timeout(() => {
												that.$mRouter.reLaunch({
													route: that.$mRoutesConfig.login
												});
												//window.location.href = a
											});
										}
										
										// #endif
										
										// #ifdef MP-WEIXIN
										that.$mUtils.toast('已退出登录');
										that.$mUtils.timeout(() => {
											that.$mRouter.reLaunch({
												route: that.$mRoutesConfig.gzh_login
											});
										});
										
										// #endif
										
										console.log('用户点击确定');
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						},
		}
	}
</script>

<style  lang="scss" scoped>
.set{
	width: 100%;
	.banner{
		width: 95%;
		margin: 0 auto;
		button{
			margin-top: 120rpx;
			width: 702rpx;
			height: 88rpx;
			border-radius: 44rpx;
			border: 2rpx solid #EEEEEE;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
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