<template>
	<view class="suggest">
		<view class="banner">
			<textarea v-model="suggest" value="" placeholder="请输入您的意见建议的内容" />
			<Buttons @btnTap="serviceBtnTap" :text="'保存'"></Buttons>
		</view>
	</view>
</template>

<script>
import Buttons from '@/components/Buttons.vue';
export default {
	components: {
		Buttons
	},
	data() {
		return {
			suggest:''
		};
	},
	methods: {
		serviceBtnTap() {
			
			if(this.suggest.length<10){
				this.$mUtils.toast('内容不少于10字');
				return
			}
			
			this.$api.suggest({
				content:this.suggest
			}).then(res => {
				if (res.code == 200) {
					this.$mUtils.toast(res.msg);
					this.$mUtils.timeout(() => {
						this.$mRouter.back();
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
.suggest {
	width: 100%;
	.banner {
		width: 95%;
		margin: 0 auto;
		padding-top: 10px;
		button {
			margin-top: 120rpx;
			width: 702rpx;
			height: 88rpx;
			border-radius: 44rpx;
			background: #0067df;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #ffffff;
		}
		textarea {
			width: 100%;
			height: 300rpx;
			background: #f9f9f9;
			border-radius: 16rpx;
			padding: 10px;
		}
	}
}
</style>
