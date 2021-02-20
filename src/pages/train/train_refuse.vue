<template>
	<view class="audit">
		<image :src="'/mine/auth/audit_refuse.png' | imgUrl"  mode=""></image>
		<text class="gs fn_cl_333333 ">审核未通过</text>
		<text class="nav">{{reson}}</text>
		<button class="base_center" @tap="$mUtils.goPage('apply_train')">重新申请</button>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				 reson:''
			}
		},
		onLoad() {
			this.xq()
		},
		methods:{
			xq(){
				this.$api.organDetail().then(res=>{
					this.reson=res.data.reason;
				})
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
	button{
		margin-top: 20px;
		width: 128px;
		height: 40px;
		background: #FFFFFF;
		border-radius: 20px;
		border: 1px solid #CDE4FF;
		
		font-size: 14px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #0067DF;
	}
	.gs{
		font-size: 14px;
		margin-top: 20px;
	}
	.nav{
		width: 80%;
		margin: 0 auto;
		margin-top: 20px;
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		color: #999999;
		text-align: center;
	}
	image{
		width: 64px;
		height: 64px;
	}
}
</style>