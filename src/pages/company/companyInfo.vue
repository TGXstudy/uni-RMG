<template>
    <view class="container" v-cloak>
        <view class="person_info">
            <view class="content blank img_part">
                <view class="img_title">
                    <image :src="'/index/company.png' | imgUrl" class="img"
                        >公司介绍</image
                    >
                </view>
                <img :src="companyInfo.logo_url" alt="" class="company_img" />
                <view class="content_item">
                    <view class="content_title">
                        公司名称
                    </view>
                    <view class="content_desc">{{
                        companyInfo.company_name
                    }}</view>
                </view>
                <view class="content_item">
                    <view class="content_title">
                        公司简介
                    </view>
                    <view class="content_desc">{{ companyInfo.content }}</view>
                </view>
                <view class="content_item">
                    <view class="content_title">
                        所在地址
                    </view>
                    <view class="content_desc">{{
                        companyInfo.all_address
                    }}</view>
                    <image
                        :src="'/index/address.png' | imgUrl"
                        class="addr_img"
                        @click="goAddress"
                    ></image>
                </view>
            </view>
            <view class="img_part">
                <view class="img_title">
                    <image :src="'/index/image.png' | imgUrl" class="img"
                        >图片</image
                    >
                </view>
                <view class="imgs">
                    <view
                        class="imgs_desc"
                        v-for="(item, index) in companyInfo.image_url"
                        :key="index"
                        @click="previewImg(item)"
                    >
                        <img :src="item" />
                    </view>
                </view>
            </view>
            <view class="video_part img_part">
                <view class="img_title">
                    <image :src="'/index/video_icon.png' | imgUrl" class="img"
                        >视频</image
                    >
                </view>
                <view
                    class=""
                    v-for="(item, index) in companyInfo.video_url"
                    :key="index"
                >
                    <video :src="item"></video>
                </view>
            </view>
        </view>
        <UniPopup ref="previewImgs" class="preview_part">
            <img :src="currentImg" class="preview_img" />
        </UniPopup>
    </view>
</template>

<script>
import UniPopup from "@/components/common/UniPopup.vue";
export default {
    components: {
        UniPopup,
    },
    data() {
        return {
            imgs: [],
            companyId: "",
            companyInfo: {},
            currentImg: "",
        };
    },
    onLoad(options) {
        this.companyId = options.companyId;
    },
    onShow() {
        this.getCompanyDetail();
    },
    methods: {
        getCompanyDetail() {
            this.$api
                .companyDetail({ id: this.companyId })
                .then((res) => {
                    this.companyInfo = res.data;
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        // 预览图片
        previewImg(url) {
            this.currentImg = url;
            this.$refs.previewImgs.open();
        },
        goAddress() {
            // #ifdef MP-WEIXIN
            this.wxdh(this.companyInfo);
            //#endif
            //#ifdef H5
            this.dh(this.companyInfo);
            //#endif
        },
        //微信导航
        wxdh(item) {
            uni.openLocation({
                latitude: Number(item.latitude),
                longitude: Number(item.longitude),
                address: item.all_address,
                success: (res) => {
                    console.log(res, "res");
                },
            });
        },
        //导航
        dh(item) {
            window.location.href = `https://uri.amap.com/marker?position=${item.longitude},${item.latitude}&name=${item.all_address}&coordinate=gaode&callnative=1`;
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
    .person_info {
        text-align: center;
        margin-bottom: 48rpx;
        background-color: #fff;
        border-radius: 16rpx 16rpx 0 0;
        padding: 0 24rpx;
        box-sizing: border-box;
        margin-top: 40rpx;
        .company_img {
            width: 120rpx;
            height: 120rpx;
            border-radius: 8px;
            margin: 30rpx 0;
        }
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
                    width: 16px;
                    height: 16px;
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
                    width: 24px;
                    height: 24px;
                }
            }
            .imgs {
                display: flex;
                white-space: nowrap;
                overflow-x: auto;
                .imgs_desc {
                    width: 180rpx;
                    border-radius: 8rpx;
                    margin-right: 32rpx;
                    img {
                        width: 180rpx;
                        height: 180rpx;
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
    }
}
</style>
