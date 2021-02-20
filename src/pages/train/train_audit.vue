<template>
	<view class="audit">
		<image :src="'/mine/auth/audit.png' | imgUrl" mode=""></image>
		<text class="gs fn_cl_333333 ">正在审核</text>
		<text class="nav">培训机构入驻申请已提交， 正在审核中，请等待</text>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>
.audit {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 70px;
	button {
		margin-top: 20px;
		width: 128px;
		height: 40px;
		background: #ffffff;
		border-radius: 20px;
		border: 1px solid #cde4ff;

		font-size: 14px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #0067df;
	}
	.gs {
		font-size: 14px;
		margin-top: 20px;
	}
	.nav {
		width: 80%;
		margin: 0 auto;
		margin-top: 20px;
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		color: #999999;
		text-align: center;
	}
	image {
		width: 64px;
		height: 64px;
	}
}
</style>
