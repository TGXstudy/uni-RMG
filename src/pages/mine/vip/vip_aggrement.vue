<template>
	<view class="xy">
		<view class="banner">
			<view class="nav" v-html="content">
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				content:''
			}
		},
		onLoad() {
			this.xy()
		},
		methods:{
			xy(){
				this.$api
					.vipAgreement()
					.then(res => {
						this.content = this.$mUtils.rplaceRichImg(res.data.content);
						console.log(res,'sdsdsd');
					});
			}
		}
	}
</script>

<style lang="scss" scoped>
.xy{
	width: 100%;
	.banner{
		width: 95%;
		margin: 0 auto;
	}
}
</style>