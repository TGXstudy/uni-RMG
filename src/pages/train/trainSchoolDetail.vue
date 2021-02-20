<template>
    <view class="container" v-cloak>
        <view class="top_part"> </view>
        <view class="school_info">
            <img :src="detailData.logo_url" alt="" class="school_img" />
            <view class="">
                <view class="school_name title"
                    >{{ detailData.name || "" }}
                </view>
                <view class="second_title">
                    <image
                        :src="'/issue/addr.png' | imgUrl"
                        mode=""
                        class="img"
                        >{{ detailData.allAddress || "" }}</image
                    >
                </view>
                <view class="second_title">
                    <image
                        :src="'/issue/phone.png' | imgUrl"
                        mode=""
                        class="img"
                        >{{ detailData.mobile || "" }}</image
                    >
                </view>
            </view>
        </view>
        <view class="school_bottom">
            <view class="title_part">
                <view
                    class="title title_margin "
                    :class="{ active_title: activeIndex == 0 }"
                    @click="switchTab(0)"
                >
                    课程</view
                >
                <view
                    class="title"
                    :class="{ active_title: activeIndex == 1 }"
                    @click="switchTab(1)"
                    >机构简介
                </view>
            </view>
            <view
                class="school_class_list"
                v-if="activeIndex == 0 && courseList.length > 0"
            >
                <view
                    v-for="(item, index) in courseList"
                    :key="index"
                    class="class_item"
                    @click="goClassDetail(item.id)"
                >
                    <img :src="item.img" alt="" />
                    <view class="">
                        <view class="title class_name">
                            {{ item.name }}
                        </view>
                        <view class="second_title">
                            {{ item.organ_name }}
                        </view>
                        <view class="class_money"> ￥{{ item.amount }} </view>
                    </view>
                    <view class="btn">立即报名</view>
                </view>
            </view>
            <view
                style="margin:20rpx 0"
                v-else-if="activeIndex == 1 && detailData.introduction"
                v-html="detailData.introduction"
            >
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
        </view>
    </view>
</template>

<script>
import HandleBtn from "@/components/common/handleBtn.vue";
import noMore from "@/components/index/NoMore.vue";
import loadMore from "@/components/index/LoadMore.vue";
export default {
    components: {
        HandleBtn,
        noMore,
        loadMore,
    },
    data() {
        return {
            activeIndex: 0,
            residenceId: "",
            detailData: {},
            courseData: {
                limit: 10,
                page: 1,
                id: "",
            },
            courseList: [],
            nomore: false,
            loading: false,
        };
    },
    onLoad(options) {
        this.residenceId = options.residenceId;
        this.getResidenceDetail();
        this.getCourseList();
    },
    async onPullDownRefresh() {
        this.courseData.page == 1;
        await this.getCourseList();
        uni.stopPullDownRefresh();
    },
    onReachBottom() {
        if (this.nomore) return;
        this.courseData.page++;
        this.getCourseList();
    },
    methods: {
        //获取培训机构课程列表
        getCourseList() {
            this.courseData.id = this.residenceId;
            this.$api
                .courseList(this.courseData)
                .then((res) => {
                    if (this.courseData.page == 1) {
                        this.courseList = res.data.data;
                    } else {
                        this.courseList = this.courseList.concat(res.data.data);
                    }
                    this.nomore =
                        Math.ceil(res.data.total / 10) == this.courseData.page;
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        //获取培训机构详情
        getResidenceDetail() {
            this.$api
                .residenceDetail({ id: this.residenceId })
                .then((res) => {
                    this.detailData = res.data;
                    this.detailData.introduction = this.$mUtils.rplaceRichImg(
                        this.detailData.introduction
                    );
                    this.detailData.allAddress =
                        this.detailData.province +
                        this.detailData.city +
                        this.detailData.region +
                        this.detailData.address;
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        switchTab(index) {
            this.activeIndex = index;
            this.activeIndex == 0 ? this.getCourseList() : "";
        },
        goClassDetail(id) {
            this.$mRouter.push({
                route: this.$mRoutesConfig.classDetail,
                query: { id: id },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    font-size: 28rpx;
    color: #333333;
    .top_part {
        width: 100%;
        height: 250rpx;
        background-color: #0067df;
        border-radius: 0 0 8% 8%;
    }
    .title {
        font-size: 28rpx;
        font-weight: 600;
    }
    .second_title {
        font-size: 24rpx;
        color: #666666;
        .img {
            width: 32rpx;
            height: 32rpx;
        }
    }
    .img,
    img {
        vertical-align: middle;
        margin-right: 8rpx;
    }
    .school_info {
        width: 702rpx;
        margin: 0 auto;
        padding: 32rpx 12rpx;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        border-radius: 16rpx;
        margin-top: -150rpx;
        .school_img {
            width: 120rpx;
            height: 120rpx;
            border-radius: 8rpx;
            margin-right: 12rpx;
        }
        .school_name {
            margin-bottom: 24rpx;
        }
    }
    .school_bottom {
        padding: 24rpx;
        box-sizing: border-box;
        margin-top: 64rpx;
        .title_part {
            display: flex;
            .title_margin {
                margin-right: 80rpx;
            }
            .active_title {
                color: #0067df;
            }
        }
        .school_class_list {
            .class_item {
                display: flex;
                position: relative;
                padding: 32rpx 0;
                border-bottom: 1rpx solid #f5f5f5;
                img {
                    width: 252rpx;
                    height: 140rpx;
                    margin-right: 12rpx;
                }
                .class_money {
                    color: #eb664e;
                    font-size: 28rpx;
                    margin-top: 8rpx;
                }
                .btn {
                    width: 144rpx;
                    height: 48rpx;
                    line-height: 48rpx;
                    font-size: 24rpx;
                    position: absolute;
                    right: 0;
                    top: 78rpx;
                    background: #0067df;
                    text-align: center;
                    color: #fff;
                    border-radius: 48rpx;
                }
                .class_name {
                    margin-bottom: 16rpx;
                }
            }
        }
    }
}
</style>
