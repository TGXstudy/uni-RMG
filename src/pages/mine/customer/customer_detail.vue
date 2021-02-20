<template>
	<view class="detail" v-html="content"></view>
</template>

<script>
export default {
	data() {
		return {
			id: '',
			content: '' ,//详细内容
			title:''
		};
	},
	onLoad(options) {
		this.id = options.id;
		this.title=options.title;
		this.question();
		uni.setNavigationBarTitle({
		　　title:this.title
		})
	},
	methods: {
		question() {
			this.$api
				.questionDetail({
					id: this.id
				})
				.then(res => {
					this.content = this.$mUtils.rplaceRichImg(res.data.content);
					console.log(res,'sdsdsd');
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
