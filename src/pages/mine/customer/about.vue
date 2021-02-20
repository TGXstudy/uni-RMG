<template>
	<view class="about">
		<view class="banner" v-html="content">
			关于我们
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				content: '' //详细内容
			};
		},
		onLoad(options) {
			this.id = options.id;
			this.question();
		},
		methods: {
			question() {
				this.$api
					.aboutUs()
					.then(res => {
						this.content = this.$mUtils.rplaceRichImg(res.data.content);
						console.log(res);
					});
			}
		}
	}
</script>

<style lang="scss" scoped>
.about{
	width: 100%;
	.banner{
		width: 95%;
		margin: 0 auto;
	}
}
</style>