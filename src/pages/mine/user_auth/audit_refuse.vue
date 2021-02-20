<template>
	<view class="audit">
		<image :src="'/mine/auth/audit_refuse.png' | _imgUrl"  mode=""></image>
		<text class="gs fn_cl_333333 ">审核未通过</text>
		<text class="nav">你的认证已未通过，决绝理由：“{{rzxq.reason}}”；你可以重新申请</text>
		<button class="base_center" @tap="apply()">重新申请</button>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				userinfo:{},
				 rzxq:{}
			}
		},
		onLoad() {
			this.rz()
			this.getinfo()
		},
		methods:{
			apply(){
				if(this.userinfo.user_authentication==1&&this.rzxq.status==2){
					this.$mRouter.push({
						route:this.$mRoutesConfig.company_auth,
					})
				}else if(this.userinfo.user_authentication==2&&this.rzxq.status==2){
					this.$mRouter.push({
						route:this.$mRoutesConfig.person_auth,
					})
				}
			},
			rz(){
				this.$api.certificationDetail().then(res=>{
					this.rzxq=res.data
				})
			},
			getinfo(){
				this.$api.userInfo().then(res=>{
					this.userinfo=res.data
				})
			},
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