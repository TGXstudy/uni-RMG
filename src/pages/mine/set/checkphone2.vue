<template>
	<view class="phone">
		<view class="banner">
			<view class="title1">修改手机号</view>
			<view class="title2">请添加您要更换的手机号，并完成验证</view>
			<view class="getphone"><input type="number"  v-model="phone" placeholder="请输入手机号" value="" /></view>
			<view class="yzm">
				<view class="left"><input type="number" v-model="yzm" placeholder="请输入验证码" value="" /></view>
				<view class="right"><verify-code class="yzm" :mob="phone" :type="'phone'"></verify-code></view>
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
			phone:"",
			yzm:'',
			oldphone:''
		};
	},
	onLoad() {
		this.getinfo();
	},
	methods:{
		getinfo() {
			this.$api.userInfo().then(res => {
				this.oldphone = res.data.mobile;
				console.log(res);
			});
		},
		sure(){
			if (this.phone == '') {
				this.$mUtils.toast('手机号不能为空');
				return;
			}
			if (this.yzm == '') {
				this.$mUtils.toast('验证码不能为空');
				return;
			}
			let data = {
				new_mobile: this.phone || '',
				new_sms_code: this.yzm || '',
				mobile: this.oldphone || ''
			};
			this.$api.editMobile(data).then(res => {
				if (res.code == 200) {
					this.$mUtils.toast(res.msg);
					this.$mUtils.timeout(() => {
					this.$mRouter.push({
						route: this.$mRoutesConfig.set
					});
					});
				} else {
					this.$mUtils.toast(res.msg);
				}
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
		button{
			margin: 0 auto;
			margin-top: 120rpx;
			width: 100%;
			height: 88rpx;
			border-radius: 44rpx;
			background: #0067DF;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
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
			margin-top: 20PX;
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
