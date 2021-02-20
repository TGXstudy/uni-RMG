<template>
    <view class="container" v-html="content"> </view>
</template>

<script>
export default {
    onLoad(){
        this.getAdDetail()
    },
    data() {
        return {
            content: "",
        };
    },
    methods:{
        getAdDetail(){
            this.$api.homeImgDetail().then(res=>{
                 if (res.code == 200) {
                    this.content= this.$mUtils.rplaceRichImg(res.data.content);
				} else {
					this.$mUtils.toast(res.msg);
				}
            })
        }
    }
};
</script>


<style style="scss" scoped>
.container{
    padding:20rpx;
    box-sizing: border-box;
}
</style>
