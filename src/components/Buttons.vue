<template>
	<view class="btn" @tap="$emit('btnTap')">
		{{text}}
	</view>
</template>

<script>
	export default {
		name: 'btn',
		data(){
			return{
				
			}
		},
		props:{
			text:{
				type:String,
			}
		},
		methods:{

		}
	}
</script>

<style lang="scss" scoped>
.btn{
	margin-top: 120rpx;
	width: 702rpx;
	height: 88rpx;
	border-radius: 44rpx;
	background: #0067df;
	font-size: 32rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #ffffff;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>