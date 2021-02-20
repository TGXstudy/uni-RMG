<template>
	<view class="audit">
		<image :src="'/mine/auth/auth_agree.png' | imgUrl" mode=""></image>
		<text class="gs fn_cl_333333 ">审核已通过</text>
		<text class="nav">
			你可进入PC端后台
			<navigator url="../about/about?n=cth">{{url}}</navigator>
			进行编辑机构课程
		</text>
		<text class="nav">账号：手机号 初始密码：123456</text>
	</view>
</template>

<script>
export default {
	data() {
		return {
			url: ''
		};
	},
	onLoad() {
		this.px_detail();
	},
	methods: {
		px_detail() {
			this.$api.organDetail().then(res => {
				this.url = res.data.url;
			});
		}
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

		color: #666666;
		text-align: center;
	}
	image {
		width: 64px;
		height: 64px;
	}
}
</style>
