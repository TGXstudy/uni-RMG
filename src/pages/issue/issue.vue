<template>
    <view class="container">
        <view class="send_issue" @click="goAddIssue"
            >{{ authorStatus == 1 ? "发布招工" : "发布找活" }}
        </view>
        <view class="list_container" v-if="issueList.length > 0">
            <SlideDelete
                class="list_item"
                v-for="(item, index) in issueList"
                :key="index"
                @deleteItem="deleteIssue(item.id)"
            >
                <view class="list_left clearfix">
                    <view class="avartar">
                        <img :src="item.avatar" alt="" />{{
                            item.user_nickname
                        }}
                    </view>
                    <view class="position_part" v-if="authorStatus == 1">
                        <image
                            :src="'/issue/addr.png' | imgUrl"
                            mode=""
                            class="img"
                            >{{ item.address }}</image
                        >
                    </view>
                    <view class="position_part">
                        <image
                            :src="'/issue/pay_money.png' | imgUrl"
                            mode=""
                            class="img"
                            >{{ item.charge }}</image
                        >
                    </view>
                    <view class="position_part">
                        <image
                            :src="'/issue/position.png' | imgUrl"
                            mode=""
                            class="img"
                            >{{ item.content }}</image
                        >
                    </view>
                    <view class="">
                        <view class="list_status await" v-if="item.status == 0"
                            >待审核</view
                        >
                        <view class="list_status pass" v-if="item.status == 1"
                            >审核通过</view
                        >
                        <view
                            class="list_status no_pass"
                            v-if="item.status == 2"
                            >审核未通过</view
                        >
                    </view>
                    <view class="blank"> </view>
                    <view class="list_detail">
                        <view
                            class="detail_btn b_btn"
                            @click="goWorkDetail(item.id)"
                            >查看详情</view
                        >
                        <view
                            class="go_btn b_btn"
                            v-if="
                                authorStatus == 2 &&
                                    item.work_status == 1 &&
                                    item.status == 1
                            "
                            @click="updateWorkStatus(item.id, 2)"
                            >停止找活</view
                        >
                        <view
                            class="go_btn b_btn"
                            v-if="
                                authorStatus == 2 &&
                                    item.work_status == 2 &&
                                    item.status == 1
                            "
                            @click="updateWorkStatus(item.id, 1)"
                            >继续找活</view
                        >
                        <view
                            class="go_btn b_btn"
                            v-if="
                                authorStatus == 1 &&
                                    item.work_status == 1 &&
                                    item.status == 1
                            "
                            @click="updateWorkStatus(item.id, 2)"
                            >停止招聘</view
                        >
                        <view
                            class="go_btn b_btn"
                            v-if="
                                authorStatus == 1 &&
                                    item.work_status == 2 &&
                                    item.status == 1
                            "
                            @click="updateWorkStatus(item.id, 1)"
                            >继续招聘</view
                        >
                    </view>
                </view>
            </SlideDelete>
        </view>
        <view class="no_data" v-else>
            <image
                :src="'/index/no_data.png' | imgUrl"
                mode=""
                class="img"
            ></image>
            <view class="">
                暂无相关数据
            </view>
        </view>
        <no-more class="width-100-per" :visible="nomore"></no-more>
        <load-more class="width-100-per" :visible="loading"></load-more>
        <UniPopup ref="authorInfo">
            <view class="modal_part">
                <view class="">
                    当前用户暂未认证，请前往用户中心进行认证
                </view>
                <view class="btns">
                    <view class="btn" @click="cancelModal">
                        取消
                    </view>
                    <view class="btn confirm_btn" @click="confirmModal">
                        确定
                    </view>
                </view>
            </view>
        </UniPopup>
    </view>
</template>

<script>
import HandleBtn from "@/components/common/handleBtn.vue";
import noMore from "@/components/index/NoMore.vue";
import loadMore from "@/components/index/LoadMore.vue";
import UniPopup from "@/components/common/UniPopup.vue";
import SlideDelete from "@/components/SlideDelete.vue";
export default {
    components: {
        HandleBtn,
        noMore,
        loadMore,
        UniPopup,
        SlideDelete,
    },
    computed: {
        /**认证类型状态（0,未认证，1企业认证，2个人认证） */
        authorStatus() {
            return this.$store.state.userAuthentication;
        },
    },
    watch: {
        authorStatus(newVal, oldVal) {
            if (newVal == 0) {
                this.$refs.authorInfo.open();
            }
        },
    },
    data() {
        return {
            issueList: [],
            publishData: {
                limit: 10,
                page: 1,
            },
            nomore: false,
            loading: false,
        };
    },
    async onPullDownRefresh() {
        this.publishData.page == 1;
        await this.getMyPublishList();
        uni.stopPullDownRefresh();
    },
    onReachBottom() {
        if (this.nomore) return;
        this.publishData.page++;
        this.getMyPublishList();
    },
    onShow() {
        this.$store.dispatch("fetchUser");
        this.getMyPublishList();
    },
    methods: {
        // 更新发布状态
        async updateWorkStatus(id, status) {
            try {
                await this.$api.workStatus({ id: id, status: status });
                this.getMyPublishList();
                this.$mUtils.toast("修改成功");
            } catch (e) {
                this.$mUtils.toast(e.msg);
            }
        },
        // 删除
        deleteIssue(item) {
            this.$api
                .deletePublish({ id: item })
                .then((res) => {
                    this.getMyPublishList();
                    this.$mUtils.toast(res.msg);
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        confirmModal() {
            this.$refs.authorInfo.close();
            this.$mRouter.push({ route: this.$mRoutesConfig.user_auth });
        },
        cancelModal() {
            this.$refs.authorInfo.close();
        },
        getMyPublishList() {
            this.$api
                .myPublish(this.publishData)
                .then((res) => {
                    if (this.publishData.page == 1) {
                        this.issueList = res.data.data;
                    } else {
                        this.issueList = this.issueList.concat(res.data.data);
                    }
                    this.nomore =
                        Math.ceil(res.data.total / 10) == this.publishData.page;
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        goAddIssue() {
            this.$mRouter.push({ route: this.$mRoutesConfig.addIssue });
        },
        goWorkDetail(id) {
            this.$mRouter.push({
                route: this.$mRoutesConfig.issueDetail,
                query: { id: id },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    padding: 24rpx;
    box-sizing: border-box;
    font-size: 28rpx;
    .send_issue {
        text-align: right;
        margin-bottom: 20rpx;
    }

    .list_item {
        display: flex;
        .list_left {
            width: 702rpx;
            background: #ffffff;
            box-shadow: 0px 4rpx 20rpx 0px rgba(0, 0, 0, 0.04);
            border-radius: 16rpx;
            margin-right: 40rpx;
            padding: 24rpx;
            box-sizing: border-box;
            position: relative;
            margin-bottom: 40rpx;
            flex-shrink: 0;
            overflow: auto;

            .img,
            img {
                vertical-align: middle;
                margin-right: 8rpx;
            }
            .avartar {
                margin-bottom: 16rpx;
                img {
                    width: 60rpx;
                    height: 60rpx;
                    border-radius: 50%;
                    margin-right: 12rpx;
                }
            }
            .position_part {
                font-size: 24rpx;
                color: #666666;
                margin-bottom: 12rpx;
                margin-left: 70rpx;
                .img {
                    width: 28rpx;
                    height: 28rpx;
                }
            }
            .blank {
                width: calc(100% + 48rpx);
                margin-left: -24rpx;
                height: 1rpx;
                background-color: #f5f5f5;
                margin-top: 24rpx;
            }
            .list_status {
                position: absolute;
                top: 32rpx;
                right: 24rpx;
            }
            .await {
                color: #ffb30d;
            }
            .pass {
                color: #0067df;
            }
            .no_pass {
                color: #eb664e;
            }

            .list_detail {
                display: flex;
                position: absolute;
                right: 24rpx;
                bottom: 24rpx;
                font-size: 24rpx;
                .b_btn {
                    background: #ffffff;
                    border-radius: 32rpx;
                    margin-top: 18rpx;
                    width: 160rpx;
                    height: 64rpx;
                    line-height: 64rpx;
                    text-align: center;
                }
                .detail_btn {
                    border: 2rpx solid #eeeeee;
                    color: #666666;
                    margin-right: 16rpx;
                }
                .go_btn {
                    border: 2rpx solid #0067df;
                    color: #0067df;
                }
            }
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: block;
            height: 90rpx;
        }
        .list_right {
            width: 100rpx;
            height: 100rpx;
            background: #eb664e;
            border-radius: 50%;
            color: #fff;
            line-height: 100rpx;
            margin-top: 96rpx;
        }
    }
    .modal_part {
        padding: 50rpx;
        box-sizing: border-box;
        font-size: 28rpx;
        .btns {
            display: flex;
            justify-content: space-around;
            margin-top: 40rpx;
            .btn {
                width: 160rpx;
                height: 64rpx;
                background: #ffffff;
                border-radius: 32rpx;
                border: 2rpx solid #eeeeee;
                text-align: center;
                line-height: 64rpx;
            }
            .confirm_btn {
                border: 2rpx solid #0067df;
                color: #0067df;
            }
        }
    }
}
</style>
