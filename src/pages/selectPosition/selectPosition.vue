<template>
    <view class="position_container">
        <view class="left_part">
            <view
                v-for="(item, index) in oneCategory"
                :key="index"
                class="left_item txt-line-1"
                :class="{ left_active: activeLeftIndex == index }"
                @click="clickLeft(index, item.id)"
            >
                {{ item.name }}
            </view>
        </view>
        <view class="right_part">
            <view
                v-for="(item, index) in twoCategory"
                :key="index"
                class="right_item"
                :class="{ right_active: activeRightIndex == index }"
                @click="clickRight(index, item.id)"
            >
                {{ item.name }}
            </view>
            <view class="bottom_btns">
                <HandleBtn class="b_btn cancel_btn" @click="cancel"
                    >取消</HandleBtn
                >
                <HandleBtn class="b_btn" @click="confirm">确定</HandleBtn>
            </view>
        </view>
    </view>
</template>

<script>
import HandleBtn from "@/components/common/handleBtn.vue";
export default {
    components: {
        HandleBtn,
    },
    data() {
        return {
            activeLeftIndex: 0,
            activeRightIndex: 0,
            oneCategory: [],
            twoCategory: [],
            fromUrl: "",
            selectCategorySecondId: "",
            selectCategoryFirstId: "",
        };
    },
    onLoad(options) {
        console.log(options, "daada");
        this.fromUrl = options.from;
        this.getCategory();
    },
    methods: {
        getCategory() {
            this.$api
                .moreCategory()
                .then((res) => {
                    this.oneCategory = res.data;
                    this.twoCategory = res.data[this.activeLeftIndex].children;
                    this.selectCategoryFirstId = this.oneCategory[this.activeLeftIndex].id
                    this.selectCategorySecondId = this.twoCategory[
                        this.activeRightIndex
                    ].id;
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        clickLeft(index, id) {
            this.activeLeftIndex = index;
            this.activeRightIndex = 0;
            this.selectCategoryFirstId = id;
            this.getCategory();
        },
        clickRight(index, id) {
            this.activeRightIndex = index;
            this.selectCategorySecondId = id;
        },
        cancel() {
            this.$mRouter.switchTab({
                route: this.fromUrl,
            });
        },
        confirm() {
            if (this.fromUrl == "index") {
                this.$mRouter.reLaunch({
                    route: this.$mRoutesConfig.index,
                });
                this.$store.commit(
                    "SET_SELECTCATEGORYID",
                    this.selectCategorySecondId
                );
            } else {
                this.$mRouter.redirectTo({
                    route: this.$mRoutesConfig.addIssue,
                    query: {
                        category_level_1: this.selectCategoryFirstId,
                        category_level_2: this.selectCategorySecondId,
                        secondName: this.oneCategory[this.activeLeftIndex].name + "-"+this.twoCategory[this.activeRightIndex].name
                    },
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.position_container {
    font-size: 28rpx;
    color: #333333;
    display: flex;
    align-items: flex-start;

    .left_part {
        width: 180rpx;
        height: 100vh;
        flex-shrink: 0;
        background-color: #f4f4f4;
        text-align: center;
        .left_item {
            width: 100%;
            height: 100rpx;
            line-height: 100rpx;
        }
        .left_active {
            color: #0067df;
            border-left: 4rpx solid #0067df;
            background-color: #fff;
            font-weight: 600;
            box-sizing: border-box;
        }
    }
    .right_part {
        padding: 34rpx 60rpx;
        display: flex;
        white-space: nowrap;
        flex-wrap: wrap;
        box-sizing: border-box;
        .right_item {
            margin-right: 40rpx;
            margin-bottom: 40rpx;
            min-width: 120rpx;
            &:nth-child(3n) {
                margin-right: 0;
            }
        }
        .right_active {
            color: #0067df;
            font-weight: 600;
        }
        .bottom_btns {
            display: flex;
            position: absolute;
            right: 24rpx;
            bottom: 40rpx;
            .b_btn {
                width: 200rpx;
                height: 88rpx;
                line-height: 88rpx;
                margin-right: 40rpx;
                font-size: 32rpx;
            }
            .cancel_btn {
                background: #fff;
                border: 2rpx solid #f9f9f9;
                color: #666666;
            }
            /* #ifdef MP-WEIXIN*/
            .cancel_btn /deep/ .btn {
                background: #fff;
                border: 2rpx solid #f9f9f9;
                color: #666666;
            }
            /* #endif*/
        }
    }
}
</style>
