<template>
    <view class="container" v-cloak>
        <img :src="currentData.img" alt="" class="banner" />
        <view class="class_desc">
            <view class="title name">
                {{ currentData.name }}
            </view>
            <view class="second_title second_name">
                {{ currentData.organ_name }}
            </view>
            <view class="class_money"> ￥ {{ currentData.amount }} </view>
            <view class="class_addr_part">
                <view class="second_title">
                    培训地址
                </view>
                <view class="addr">
                    {{ currentData.address }}
                </view>
                <image
                    :src="'/index/address.png' | imgUrl"
                    mode=""
                    class="addr_icon"
                    @click="goAddress"
                ></image>
            </view>
            <view class="class_addr_part">
                <view class="second_title">
                    培训时间
                </view>
                <view class="addr">
                    {{ currentData.start_time }}- {{ currentData.end_time }}
                </view>
            </view>
        </view>
        <view class="blank"> </view>

        <view class="class_detail">
            <image
                :src="'/issue/class.png' | imgUrl"
                mode=""
                class="img"
            ></image>
            <text class="title">课程详情</text>
            <view class="" v-html="currentData.detail"> </view>
        </view>
        <view class="blank"> </view>
        <view class="class_bottom">
            <image
                :src="'/issue/class_info.png' | imgUrl"
                mode=""
                class="img"
            ></image>
            <text class="title">报名资料</text>
            <view class="sign_data" v-if="isShowRegisterBtn">
                <view class="form_item">
                    <view class="second_title">
                        姓名
                    </view>
                    <input
                        type="text"
                        placeholder="请输入姓名"
                        placeholder-style="font-size:28rpx"
                        v-model="registerQueryData.name"
                    />
                </view>
                <view class="form_item">
                    <view class="second_title">
                        电话
                    </view>
                    <input
                        type="text"
                        placeholder="请输入联系电话"
                        v-model="registerQueryData.mobile"
                    />
                    <verify-code
                        class="code"
                        :mob="registerQueryData.mobile"
                        :type="'class'"
                        >获取验证码</verify-code
                    >
                </view>
                <view class="form_item">
                    <view class="second_title">
                        验证码
                    </view>
                    <input
                        type="text"
                        placeholder="请输入验证码"
                        v-model="registerQueryData.sms_code"
                    />
                </view>
                <view class="form_item">
                    <view class="second_title">
                        身份证
                    </view>
                    <input
                        type="text"
                        placeholder="请输入身份证号码"
                        v-model="registerQueryData.id_code"
                    />
                </view>
            </view>
            <view class="title" v-if="isShowRegisterBtn">
                课程费用：￥{{ currentData.amount }}
            </view>
            <view class="tips" v-if="isShowRegisterBtn">
                备注：<br />
                1、本平台所有课程有第三方机构提供；<br />
                2、平台所有课程为线下课程，报名后请联系培训机构，确定上课时间和地点
            </view>
            <HandleBtn @click="register" v-if="isShowRegisterBtn"
                >立即报名</HandleBtn
            >
            <view class="bottom_name" v-if="!isShowRegisterBtn">
                <view class="item">
                    <view class="title">
                        姓名
                    </view>
                    <view class="name"> {{ currentData.name }} </view>
                </view>
                <view class="item">
                    <view class="title">
                        电话
                    </view>
                    <view class="name"> {{ currentData.mobile }} </view>
                </view>
                <view class="item">
                    <view class="title">
                        身份证
                    </view>
                    <view class="name"> {{ currentData.id_code }} </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import HandleBtn from "@/components/common/handleBtn.vue";
import verifyCode from "@/components/verifyCode.vue";
import regs from "@/common/js/reg.js";
export default {
    components: {
        HandleBtn,
        verifyCode,
    },
    data() {
        return {
            registerQueryData: {
                name: "",
                mobile: "",
                id_code: "",
                organ_id: "", //培训机构id
                course_id: "", //课程id
                sms_code: "",
            },
            isShowRegisterBtn: true,
            currentData: {},
            id: "",
        };
    },
    onLoad(options) {
        this.id = options.id;
        this.isShowRegisterBtn = options.from != "myCourse";
    },
    onShow() {
        if (this.isShowRegisterBtn) {
            this.getCourseDetail(this.id);
        } else {
            this.getMyCourseDetail(this.id);
        }
    },
    methods: {
        getMyCourseDetail(id) {
            this.$api
                .myCourseDetail({ id: id })
                .then((res) => {
                    this.currentData = res.data;
                    this.currentData.detail = this.$mUtils.rplaceRichImg(
                        res.data.detail
                    );
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        getCourseDetail(id) {
            this.$api
                .courseDetail({ id: id })
                .then((res) => {
                    this.currentData = res.data;
                    this.currentData.detail = this.$mUtils.rplaceRichImg(
                        res.data.detail
                    );
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        async register() {
            this.registerQueryData.organ_id = this.currentData.organ_id;
            this.registerQueryData.course_id = this.currentData.id;
            if (!this.registerQueryData.name)
                return this.$mUtils.toast("请填写姓名");
            if (!this.registerQueryData.mobile)
                return this.$mUtils.toast("请填写电话");
            if (!this.registerQueryData.sms_code)
                return this.$mUtils.toast("请填写验证码");
            if (!this.registerQueryData.id_code)
                return this.$mUtils.toast("请填写身份证号");
            if (!regs.isIdCard.test(this.registerQueryData.id_code))
                return this.$mUtils.toast("请输入正确的身份证号");
            this.$mRouter.push({
                route: this.$mRoutesConfig.courseRegister,
                query: {
                    data: JSON.stringify(this.registerQueryData),
                    money: this.currentData.amount,
                },
            });
        },
        goAddress() {
            // #ifdef MP-WEIXIN
            this.wxdh(this.currentData);
            //#endif
            //#ifdef H5
            this.dh(this.currentData);
            //#endif
        },
        //微信导航
        wxdh(item) {
            uni.openLocation({
                latitude: Number(item.latitude),
                longitude: Number(item.longitude),
                address: item.address,
                success: (res) => {
                    console.log(res, "res");
                },
            });
        },
        //导航
        dh(item) {
            window.location.href = `https://uri.amap.com/marker?position=${item.longitude},${item.latitude}&name=${item.address}&coordinate=gaode&callnative=1`;
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    font-size: 28rpx;
    color: #333333;
    .banner {
        width: 100%;
        height: 420rpx;
        margin-bottom: 48rpx;
    }
    .title {
        font-size: 32rpx;
        font-weight: 600;
    }
    .second_title {
        color: #999999;
    }
    .blank {
        width: 100%;
        height: 20rpx;
        background-color: #f9f9f9;
    }
    .img,
    img {
        vertical-align: middle;
        margin-right: 8rpx;
    }
    .class_desc {
        padding: 0 24rpx 80rpx;
        box-sizing: border-box;
        .class_money {
            font-size: 36rpx;
            color: #eb664e;
            font-weight: 600;
        }
        .name {
            margin-bottom: 8rpx;
        }
        .second_name {
            margin-bottom: 12rpx;
        }
        .class_addr_part {
            display: flex;
            margin-top: 32rpx;
            position: relative;
            .addr {
                margin-left: 24rpx;
                width: 460rpx;
            }
            .addr_icon {
                position: absolute;
                right: 24rpx;
                bottom: 0;
                width: 32rpx;
                height: 32rpx;
            }
        }
    }
    .class_detail {
        padding: 48rpx 24rpx;
        box-sizing: border-box;
        .img {
            width: 48rpx;
            height: 48rpx;
        }
    }
    .class_bottom {
        padding: 48rpx 24rpx;
        box-sizing: border-box;
        .img {
            width: 48rpx;
            height: 48rpx;
        }
        .sign_data {
            margin-top: 26rpx;
            margin-bottom: 24rpx;
            .form_item {
                display: flex;
                align-items: center;
                padding: 30rpx 0;
                border-bottom: 1rpx solid #f5f5f5;
                position: relative;
                input {
                    font-size: 28rpx;
                    margin-left: 76rpx;
                }
                .code {
                    position: absolute;
                    right: 0;
                    color: #0067df;
                }
                .second_title {
                    width: 90rpx;
                }
            }
        }
        .tips {
            color: #999999;
            font-size: 24rpx;
            margin: 48rpx 0 182rpx;
        }
    }
    .bottom_name {
        font-size: 28rpx;
        color: #999999;
        margin: 30rpx 0 50rpx 0;
        .item {
            display: flex;
            padding: 30rpx 0;
            border-bottom: 1rpx solid #f5f5f5;
            .title {
                width: 130rpx;
            }
            .name {
                color: #333333;
            }
        }
    }
}
</style>
