<template>
	<view class="audit">
		<image :src="'/mine/auth/audit.png' | _imgUrl"  mode=""></image>
		<text class="gs fn_cl_333333 ">正在审核</text>
		<text class="nav">你的认证已提交，平台正在审核，请耐心等待</text>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				 
			}
		}
	}
</script>

<style lang="scss" scoped>
.audit{
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 70px;
	.gs{
		font-size: 14px;
		margin-top: 20px;
	}
	.nav{
		margin-top: 20px;
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		color: #999999;
	}
	image{
		width: 64px;
		height: 64px;
	}
}
</style>