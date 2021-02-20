<template>
	<view class="set">
		<view class="banner">
			<view class="one" v-for="(item,index) in xxlist" :key="index" @tap="detail(item.id,item.title)">
				<view class="left">
					{{item.title}}
				</view>
				<view class="right">
					<image :src="'/mine/jt.png' | _imgUrl"  mode="">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				xxlist:[]
			}
		},
		onLoad() {
			this.question()
		},
		methods:{
			question(){
				this.$api.question({
					page:1,
					limit:100
				}).then(res=>{
					console.log(res)
					this.xxlist=res.data.data
				})
			},
			detail(e,e2){
				this.$mRouter.push({
					route:this.$mRoutesConfig.customer_detail,
					query:{id:e,title:e2}
				})
			}
		}
	}
</script>

<style  lang="scss" scoped>
.set{
	width: 100%;
	.banner{
		width: 95%;
		margin: 0 auto;
		position: relative;
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