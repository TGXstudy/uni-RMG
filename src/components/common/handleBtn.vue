<template>
    <view class="btn" @click="handleBtn($event)">
        <slot/>
    </view>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {};
    },
    methods: {
        handleBtn(ev){
            this.$emit("click",ev)
        }
    },
};
</script>

<style scoped>
.btn{
    width: 100%;
    height: 88rpx;
    margin:0 auto;
    background-color: #0067DF;
    color:#fff ;
    line-height: 88rpx;
    text-align: center;
    border-radius: 44rpx;
}
</style>
