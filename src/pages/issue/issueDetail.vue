<template>
    <view class="container">
        <view class="video_ad_part">
            <video :src="videoAdUrl" class=""></video>
        </view>

        <view class="person_info">
            <img :src="detailData.avatar" alt="" class="avatar" />
            <view class="name">{{ detailData.user_nickname }}</view>
            <view class="content blank">
                <view class="content_item">
                    <view class="content_title">
                        {{ detailData.type == 2 ? "在线时间" : "在线时间" }}
                    </view>
                    <view class="content_desc">{{
                        detailData.create_time || ""
                    }}</view>
                </view>
                <view class="content_item">
                    <view class="content_title">
                        {{ detailData.type == 2 ? "招聘工种" : "工种" }}
                    </view>
                    <view class="content_desc"
                        >{{ detailData.category_level_1 || "" }}-{{
                            detailData.category_level_2 || ""
                        }}</view
                    >
                </view>
                <view class="content_item" v-if="detailData.type == 2">
                    <view class="content_title">
                        老板位置
                    </view>
                    <view class="content_desc">{{
                        detailData.company_address
                    }}</view>
                    <image
                        :src="'/index/address.png' | imgUrl"
                        mode=""
                        class="addr_img"
                        @click="goBossAddress"
                    ></image>
                </view>

                <view class="content_item" v-if="isFromIndex">
                    <view class="content_title">
                        距离
                    </view>
                    <view class="content_desc">
                        {{ detailData.distance || "" }}km
                    </view>
                </view>
                <view class="content_item">
                    <view class="content_title">
                        {{ detailData.type == 2 ? "工种要求" : "个人简介" }}
                    </view>
                    <view class="content_desc">{{ detailData.content }}</view>
                </view>
                <view class="content_item">
                    <view class="content_title">
                        {{ detailData.type == 2 ? "薪资说明" : "费用说明" }}
                    </view>
                    <view class="content_desc">{{ detailData.charge }}</view>
                </view>
                <view class="content_item">
                    <view class="content_title">
                        {{ detailData.type == 2 ? "工作地址" : "所在地址" }}
                    </view>
                    <view class="content_desc">{{ detailData.address }}</view>
                    <image
                        :src="'/index/address.png' | imgUrl"
                        mode=""
                        class="addr_img"
                        @click="goAddress"
                    ></image>
                </view>
            </view>
            <view
                class="img_part"
                v-if="detailData.img_url && detailData.img_url.length > 0"
            >
                <view class="img_title">
                    <image :src="'/index/image.png' | imgUrl" class="img"
                        >图片</image
                    >
                </view>
                <view class="imgs">
                    <view
                        class="imgs_desc"
                        v-for="(item, index) in detailData.img_url"
                        :key="index"
                        @click="previewImg(item)"
                    >
                        <img :src="item" />
                    </view>
                </view>
            </view>
            <view
                class="video_part img_part"
                v-if="detailData.video_url && detailData.video_url.length > 0"
            >
                <view class="img_title">
                    <image :src="'/index/video_icon.png' | imgUrl" class="img"
                        >视频</image
                    >
                </view>
                <view class="">
                    <view
                        class=""
                        v-for="(item, index) in detailData.video_url"
                        :key="index"
                    >
                        <video :src="item"></video>
                    </view>
                </view>
            </view>
            <view
                class="img_part"
                v-if="
                    isFromIndex && detailData.more && detailData.more.length > 0
                "
            >
                <view class="img_title">
                    <image :src="'/index/msg.png' | imgUrl" class="img"
                        >更多信息</image
                    >
                </view>
                <view
                    class="more_list"
                    v-for="(item, index) in detailData.more"
                    :key="index"
                    @click="goWorkDetail(item.id, item.price)"
                >
                    <img :src="item.avatar" alt="" class="avartar" />
                    <view class="">
                        <view class="name">
                            {{ item.user_nickname }}
                        </view>
                        <view class="position_part" v-if="detailData.type == 2">
                            <image
                                :src="'/issue/addr.png' | imgUrl"
                                class="img"
                                >{{ item.address }}</image
                            >
                        </view>
                        <view class="position_part">
                            <image
                                :src="'/issue/pay_money.png' | imgUrl"
                                class="img"
                                >{{ item.charge }}</image
                            >
                        </view>
                        <view class="position_part">
                            <image
                                :src="'/issue/position.png' | imgUrl"
                                class="img"
                                >{{ item.category_level_1 }}-{{
                                    item.category_level_2
                                }}</image
                            >
                        </view>
                    </view>
                </view>
            </view>
            <view class="report_part">
                <view
                    class="see_company"
                    @click="goCompanyInfo(detailData.company_id)"
                    v-if="isFromIndex && detailData.type == 2"
                >
                    查看企业详情
                </view>
                <view class="" v-else> </view>
                <view
                    class="report"
                    @click="goReport(detailData.id)"
                    v-if="isFromIndex"
                >
                    <image :src="'/index/report.png' | imgUrl" class="img"
                        >举报</image
                    >
                </view>
            </view>
            <view class="edit_tips">
                <br />
                <view class="" v-html="tips"> </view>
            </view>
            <view class="contant_part" v-if="isFromIndex" @click="phoneContant">
                <image :src="'/index/phone.png' | imgUrl" class="img"
                    >电话联系</image
                >
            </view>
        </view>
        <!-- 付费弹窗 -->
        <PayModal
            ref="payModal"
            :value="phonePrice"
            :work_id="detailData.id"
            :user_id="detailData.user_id"
            :mobile="detailData.mobile"
        ></PayModal>
        <UniPopup ref="previewImgs" class="preview_part">
            <img :src="currentImg" class="preview_img" />
        </UniPopup>
    </view>
</template>

<script>
import PayModal from "@/components/payModal/payModal.vue";
import UniPopup from "@/components/common/UniPopup.vue";
export default {
    components: {
        PayModal,
        UniPopup,
    },
    data() {
        return {
            detailData: {},
            detailId: "",
            videoAdUrl: "",
            tips: "",
            longitude: "",
            latitude: "",
            isFromIndex: "",
            phonePrice: "",
            currentImg: "",
        };
    },
    onLoad(options) {
        this.detailId = options.id;
        this.isFromIndex = options.from == "home";
        this.latitude = options.latitude;
        this.longitude = options.longitude;
        this.phonePrice = options.price || "";
    },
    async onShow() {
        this.$store.dispatch("fetchUser");
        await this.getPublishDetail(this.detailId);
        this.getTips();
    },
    methods: {
        async getTips() {
            let { data } = await this.$api.tips();
            this.tips = this.$mUtils.rplaceRichImg(data.content);
        },
        getVideoAd() {
            this.$api
                .videoAd({ type: this.detailData.type == 1 ? 4 : 3 })
                .then((res) => {
                    this.videoAdUrl = res.data.url;
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        getPublishDetail(id) {
            this.$api
                .publishDetail({
                    id: id,
                    longitude: this.longitude,
                    latitude: this.latitude,
                })
                .then((res) => {
                    this.detailData = res.data;
                    this.getVideoAd();
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        goReport(id) {
            this.$mRouter.push({
                route: this.$mRoutesConfig.report,
                query: { id: id },
            });
        },
        goCompanyInfo(companyId) {
            this.$mRouter.push({
                route: this.$mRoutesConfig.companyInfo,
                query: { companyId: companyId },
            });
        },
        goAddress() {
            // #ifdef MP-WEIXIN
            this.wxdh(
                this.detailData.longitude,
                this.detailData.latitude,
                this.detailData.address
            );
            //#endif
            //#ifdef H5
            this.dh(
                this.detailData.longitude,
                this.detailData.latitude,
                this.detailData.address
            );
            //#endif
        },
        goBossAddress() {
            // #ifdef MP-WEIXIN
            this.wxdh(
                this.detailData.company_longitude,
                this.detailData.company_latitude,
                this.detailData.company_address
            );
            //#endif
            //#ifdef H5
            this.dh(
                this.detailData.company_longitude,
                this.detailData.company_latitude,
                this.detailData.company_address
            );
            //#endif
        },
        //微信导航
        wxdh(longitude, latitude, address) {
            uni.openLocation({
                latitude: Number(latitude),
                longitude: Number(longitude),
                address: address,
                success: (res) => {
                    console.log(res, "res");
                },
            });
        },
        //导航
        dh(longitude, latitude, address) {
            window.location.href = `https://uri.amap.com/marker?position=${longitude},${latitude}&name=${address}&coordinate=gaode&callnative=1`;
        },
        // 电话联系
        phoneContant() {
            this.$refs.payModal.open();
        },
        goWorkDetail(id, price) {
            this.$mRouter.push({
                route: this.$mRoutesConfig.issueDetail,
                query: {
                    id: id,
                    from: "home",
                    longitude: this.$store.state.currentLocation.longitude,
                    latitude: this.$store.state.currentLocation.latitude,
                    price: price,
                },
            });
        },
        // 预览图片
        previewImg(url) {
            this.currentImg = url;
            this.$refs.previewImgs.open();
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    box-sizing: border-box;
    font-size: 28rpx;
    color: #333333;
    .preview_part {
        .uni-popup__wrapper-box {
            width: 600rpx !important;
            height: 600rpx !important;
            img {
                width: 600rpx !important;
                height: 600rpx !important;
            }
        }
    }

    .img,
    img {
        vertical-align: middle;
        margin-right: 8rpx;
    }
    .blank::after {
        content: "";
        display: block;
        width: calc(100% + 48rpx);
        height: 20rpx;
        background-color: #f9f9f9;
        margin-left: -24rpx;
    }
    .video_ad_part {
        width: 100%;
        height: 700rpx;
        background-color: #0067df;
        padding: 60rpx 24rpx 0;
        box-sizing: border-box;
        video {
            width: 100%;
            height: 394rpx;
        }
    }
    .person_info {
        text-align: center;
        margin-bottom: 48rpx;
        background-color: #fff;
        margin-top: -90rpx;
        border-radius: 16rpx 16rpx 0 0;
        padding: 0 24rpx;
        box-sizing: border-box;
        .avatar {
            width: 120rpx;
            height: 120rpx;
            border-radius: 50%;
            margin-top: -8%;
        }
        .name {
            font-size: 36rpx;
            font-weight: 600;
        }
        .content {
            .content_item {
                margin-bottom: 32rpx;
                display: flex;
                position: relative;
                .content_title {
                    color: #999999;
                    margin-right: 24rpx;
                    width: 115rpx;
                    text-align: right;
                }
                .content_desc {
                    width: 420rpx;
                    text-align: left;
                }
                .addr_img {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 32rpx;
                    height: 32rpx;
                }
            }
        }
        .img_part {
            text-align: left;
            margin-top: 48rpx;
            .img_title {
                font-size: 32rpx;
                font-weight: 600;
                margin-bottom: 24rpx;
                .img {
                    width: 48rpx;
                    height: 48rpx;
                }
            }
            .imgs {
                display: flex;
                white-space: nowrap;
                overflow-x: auto;
                .imgs_desc {
                    width: 180rpx;
                    height: 180rpx;
                    border-radius: 8rpx;
                    margin-right: 32rpx;
                    img {
                        width: 180rpx;
                        height: 180rpx;
                    }
                }
            }
            .more_list {
                box-shadow: 0px 4rpx 20rpx 0px rgba(0, 0, 0, 0.04);
                border-radius: 16rpx;
                margin-bottom: 40rpx;
                display: flex;
                padding: 24rpx;
                .avartar {
                    width: 60rpx;
                    height: 60rpx;
                }
                .name {
                    font-size: 28rpx;
                    margin-bottom: 24rpx;
                }
                .position_part {
                    font-size: 24rpx;
                    color: #666666;
                    margin-bottom: 16rpx;
                    .img {
                        width: 28rpx;
                        height: 28rpx;
                        margin-right: 6rpx;
                    }
                }
            }
        }
        .video_part {
            video {
                width: 100%;
                height: 394rpx;
                border-radius: 16rpx;
            }
        }
        .report_part {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 40rpx;
            color: #0067df;
            margin-bottom: 80rpx;
            font-size: 24rpx;
            .see_company {
                width: 192rpx;
                height: 64rpx;
                background: #ffffff;
                border-radius: 32rpx;
                border: 2rpx solid #0067df;
                line-height: 64rpx;
                text-align: center;
            }
            .report {
                color: #eb664e;
                font-size: 28rpx;
                .img {
                    width: 32rpx;
                    height: 32rpx;
                }
            }
        }
        .edit_tips {
            color: #999999;
            text-align: left;
            margin-bottom: 80rpx;
        }
        .contant_part {
            width: 100%;

            height: 88rpx;
            background: #0067df;
            border-radius: 44rpx;
            color: #fff;
            font-size: 32rpx;
            text-align: center;
            line-height: 88rpx;
            .img {
                width: 28rpx;
                height: 28rpx;
            }
        }
    }
}
</style>
