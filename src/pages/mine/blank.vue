<template>
	<view class="">
		<view class="">
			 <web-view  :src="url"></web-view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				url:''
			}
		},
		onLoad(options) {
			this.url= `https://uri.amap.com/marker?position=${options.longitude},${options.latitude}&name=${
				options.address
			}&coordinate=gaode&callnative=1`
			console.log(this.url)
		}
	}
</script>

<style scoped>

</style>