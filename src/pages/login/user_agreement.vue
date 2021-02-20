<template>
	<view class="detail" v-html="content"></view>
</template>

<script>
export default {
	data() {
		return {
			id: '',
			content: '' //详细内容
		};
	},
	onLoad() {
		this.question();
	},
	methods: {
		question() {
			this.$api
				.registerMessage()
				.then(res => {
					this.content = this.$mUtils.rplaceRichImg(res.data.content);
					console.log(res,'dsds');
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.detail {
	width: 100%;
}
</style>
