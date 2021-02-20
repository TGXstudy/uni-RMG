<template>
    <view class="container">
        <view class="banner_part">
            <swiper class="banner_swiper" autoplay>
                <swiper-item v-for="(item, index) in bannerList" :key="index">
                    <img
                        :src="item.img"
                        alt=""
                        @click="goSchoolDetail(item.param)"
                    />
                </swiper-item>
            </swiper>
        </view>
        <view class="train_part">
            <view class="train_title_part">
                <view
                    class="train_title"
                    :class="{ active_title: acriveIndex == 0 }"
                    @click="switchTitle(0)"
                >
                    培训机构
                </view>
                <view
                    class="train_title"
                    :class="{ active_title: acriveIndex == 1 }"
                    @click="switchTitle(1)"
                >
                    我的课程
                </view>
            </view>
            <view class="train_list">
                <view
                    class=""
                    v-if="acriveIndex == 0 && residenceList.length > 0"
                >
                    <view
                        v-for="(item, index) in residenceList"
                        :key="index"
                        class="train_item"
                        @click="goSchoolDetail(item.id)"
                    >
                        <img :src="item.logo_url" alt="" class="train_img" />
                        <view class="">
                            <view class="train_name">{{ item.name }} </view>
                            <view class="train_addr"> {{item.province}}{{item.city}}{{item.region}}{{ item.address }}</view>
                        </view>
                    </view>
                </view>
                <view
                    class=""
                    v-else-if="acriveIndex == 1 && myCourseList.length > 0"
                >
                    <view
                        v-for="(item, index) in myCourseList"
                        :key="index"
                        class="train_item"
                        @click="goClassDetail(item.id)"
                    >
                        <img :src="item.img" alt="" class="class_img" />
                        <view class="">
                            <view class="train_name"
                                >{{ item.course_name }}
                            </view>
                            <view class="train_addr">
                                {{ item.organ_name }}</view
                            >
                            <view class="calss_money">
                                ￥{{ item.amount }}
                            </view>
                        </view>
                    </view>
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
    </view>
</template>

<script>
import noMore from "@/components/index/NoMore.vue";
import loadMore from "@/components/index/LoadMore.vue";
export default {
    components: {
        noMore,
        loadMore,
    },
    data() {
        return {
            bannerList: [],
            residenceList: [],
            myCourseList: [],
            acriveIndex: 0,
            residenceData: {
                limit: 10,
                page: 1,
            },
            myCourseData: {
                limit: 10,
                page: 1,
            },
            nomore: true,
            loading: false,
        };
    },
    onLoad() {
        this.getBannerList();
        this.getResidenceList();
    },
    async onPullDownRefresh() {
        this.residenceData.page == 1;
        await this.getResidenceList();
        uni.stopPullDownRefresh();
    },
    onReachBottom() {
        if (this.nomore) return;
        this.residenceData.page++;
        this.getResidenceList();
    },
    methods: {
        //获取我的课程列表
        getMyCourseList() {
            this.myCourseList=[]
            this.$api
                .myCourseList(this.myCourseData)
                .then((res) => {
                    if (this.myCourseList.page == 1) {
                        this.myCourseList = res.data.data;
                    } else {
                        this.myCourseList = this.myCourseList.concat(
                            res.data.data
                        );
                    }
                    this.nomore =
                        Math.ceil(res.data.total / 10) ==
                        this.myCourseList.page;
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },

        //获取培训机构列表
        getResidenceList() {
            this.$api
                .residenceList(this.residenceData)
                .then((res) => {
                    if (this.residenceData.page == 1) {
                        this.residenceList = res.data.data;
                    } else {
                        this.residenceList = this.residenceList.concat(
                            res.data.data
                        );
                    }
                    this.nomore =
                        Math.ceil(res.data.total / 10) ==
                        this.residenceData.page;
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        getBannerList() {
            this.$api
                .trainBanner()
                .then((res) => {
                    this.bannerList = res.data;
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        switchTitle(index) {
            this.acriveIndex = index;
            index == 0 ? this.getResidenceList() : this.getMyCourseList();
        },
        goSchoolDetail(id) {
            if(id==0) return;
            this.$mRouter.push({
                route: this.$mRoutesConfig.trainSchoolDetail,
                query: { residenceId: id },
            });
        },
        goClassDetail(id) {
            this.$mRouter.push({
                route: this.$mRoutesConfig.classDetail,
                query: { id: id, from: "myCourse" },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    padding: 24rpx;
    box-sizing: border-box;
    .banner_part {
        margin-bottom: 48rpx;
        height: 320rpx;
        .banner_swiper {
            img {
                width: 100%;
                height: 100%;
                border-radius: 16rpx;
            }
        }
    }
    .train_part {
        margin-bottom: 22rpx;
        .train_title_part {
            display: flex;
            justify-content: space-around;
            text-align: center;
            font-size: 32rpx;
            font-weight: 600;
            .train_title {
                width: 50%;
            }
            .active_title {
                color: #0067df;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                &::after {
                    content: "";
                    display: block;
                    width: 52rpx;
                    height: 6rpx;
                    background-color: #0067df;
                    border-radius: 6rpx;
                    margin-top: 8rpx;
                }
            }
        }
    }
    .train_list {
        .train_item {
            padding: 32rpx 0;
            border-bottom: 1rpx solid #f5f5f5;
            display: flex;
            align-items: center;
            &:last-child {
                border-bottom: none;
            }
            .train_img {
                width: 120rpx;
                height: 120rpx;
                margin-right: 12rpx;
            }
            .class_img {
                width: 252rpx;
                height: 140rpx;
                margin-right: 12rpx;
            }
            .train_name {
                font-size: 28rpx;
                font-weight: bold;
                margin-bottom: 16rpx;
            }
            .train_addr {
                font-size: 24rpx;
                color: #666666;
            }
            .calss_money {
                color: #eb664e;
                font-size: 28rpx;
            }
        }
    }
}
</style>
