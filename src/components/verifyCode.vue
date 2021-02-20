<template>
	<view class="verify-component">
		<button size="mini" class="verify" shape="circle" :plain="true" :disabled="disabled"
			:class="mob.length == 11?'light':''" @click="getVerify">{{verifyText}}
			<view class="wz" v-if="disabled==true">
				{{verifyText2}}
			</view>
		</button>
	</view>
</template>
<script>
	import tuiButton from "@/components/button"
	export default {
		name: 'verifyCode',
		components: {
			tuiButton
		},
		props: {
			mob: {
				type: String
			},
			type: {
				type: [Number, String]
			}
		},
		data() {
			return {
				verifyText: '获取验证码',
				verifyText2:'',
				disabled: false,
			}
		},
		methods: {
			getVerify() {
				if (this.mob.length < 11) {
					this.$mUtils.toast('请输入手机号')
					return
				}
				if (!this.$regs.isPhone.test(this.mob)) {
					this.$mUtils.toast('手机格式不正确')
					return
				}
				this.disabled = true
				this.verifyText = '请稍候...'
				this.verifyText2=''
				this.$api.sendCode({
					type: this.type,
					mobile: this.mob
				}).then(res => {
					console.log(res)
					if (res.code == 200) {
						this.countDown(60)
					} else {
						this.disabled = false
						this.verifyText = '获取验证码'
						this.$mUtils.toast(res.msg)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			countDown(seconds) {
				this.verifyText = `已发送`
				var auth_timetimer = setInterval(() => {
					if (seconds > 0) {
						this.disabled = true
						this.verifyText = `${seconds}s`
						this.verifyText2='后可重新发送'
							--seconds
					} else {
						this.verifyText = '重新获取'
						this.disabled = false
						clearInterval(auth_timetimer)
					}
				}, 1000);
			}
		},
		created() {}
	}
</script>
<style lang="scss">
	.verify-component {
		display: flex;
		justify-content: flex-end;
		.verify {
			color: #0067DF !important;
			font-size: 26upx;
			border:none
		}
	}
	uni-button {

		&.verify {
			display: flex;
			color:#0067DF !important;
			padding: 0;
			height: 48upx;
			line-height: 48upx;
			font-size: 26upx;
			box-sizing: border-box;
			background: transparent;
			border: none;
			.wz{
				color: #333333;
			}
			&.light {
				color: #0067DF !important;

				
			}

		}
	}

	tui-button {
		&.verify {
			height: 48upx;

			button {
				width: 156upx !important;
				height: 100% !important;
				line-height: 44upx !important;
				font-size: 24upx !important;
				padding: 0;
				border-radius: 24upx !important;
				color: #B5B5B5;
			}

			&.light {
				button {
					background: transparent;
				}
			}
		}

	}

	.btn-gradual-disabled {
		color: #999 !important;
	}
</style>