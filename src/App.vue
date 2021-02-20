<script>
	export default {
		onLaunch: function () {
			console.log('App Launch')
		},
		onShow: function () {
			// // #ifdef H5
			//  this.isGzh()
			// // #endif
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		},
		methods: {
			isGzh() {
				console.log(12345,this.$mUtils.checkIsWx())
				let isWeixin = this.$mUtils.checkIsWx();
				if (isWeixin==false) {
					console.log(1111)
					
					uni.reLaunch({
						url: '/pages/index/isgzh'
					});
				} else {
					//console.log()
				}
			}
		}
	}
</script>

<style lang="scss">

	@import "./common/css/common.css";
	@import "./common/css/base.scss";
</style>
