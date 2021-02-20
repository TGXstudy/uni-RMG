<template>
    <view class="">
        <UniPopup type="bottom" ref="payModal" class="pay_popup">
            <view class="pay_modal">
                <view class="top_part">
                    <view class="message_money"> {{ value }}元一条 </view>
                    <view class=""> 拨打电话需支付信息服务费 </view>
                </view>

                <view class="blank"> </view>
                <view class="pay_type">
                    <view class="pay_title">
                        支付方式
                    </view>
                    <view
                        v-for="(item, index) in payType"
                        :key="index"
                        @click="selectPay(item.type)"
                        class="pay_item"
                    >
                        <view class="">
                            <image
                                :src="item.icon | imgUrl"
                                class="pay_icon"
                            ></image>
                            <text>{{ item.name }}</text>
                        </view>
                        <image
                            :src="
                                (payData.type == item.type
                                    ? '/index/selected.png'
                                    : '/index/no_select.png') | imgUrl
                            "
                            class="select_icon"
                        ></image>
                    </view>
                </view>
                <view class="tips">
                    <br />
                    <view class="" v-html="tips"> </view>
                    <view class="read_info" @click="agreeInfo">
                        <image
                            class="img"
                            :src="
                                (isAgreeInfo
                                    ? '/index/selected.png'
                                    : '/index/no_select.png') | imgUrl
                            "
                        ></image>
                        <text>阅读并同意</text>
                        <text class="btn tip_info" @click.stop="goInfoService"
                            >《信息服务协议》</text
                        >
                    </view>
                </view>

                <view class="btns">
                    <view class="btn pay_btn" @click="cancel">
                        取消
                    </view>
                    <view class="btn pay_btn active_btn" @click="goPay()">
                        去支付
                    </view>
                </view>
            </view>
        </UniPopup>
        <pwd-input ref="pwdPopup" @confirmPay="confirmPay"></pwd-input>
    </view>
</template>

<script>
import UniPopup from "@/components/common/UniPopup.vue";
import pwdInput from "@/components/PwdInput.vue";
export default {
    components: {
        UniPopup,
        pwdInput,
    },
    props: {
        value: {
            type: String,
            default: "",
        },
        work_id: {
            type: String,
            default: "",
        },
        user_id: {
            type: String,
            default: "",
        },
        mobile: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            payType: [
                { icon: "/index/weixin.png", name: "微信支付", type: 2 },
                { icon: "/index/money.png", name: "余额支付", type: 3 },
            ],
            isAgreeInfo: false,
            payData: {
                user_id: "", //信息弹窗接口返回的user_id
                work_id: "", //信息弹窗接口返回的id
                type: "", //支付方式 1支付宝，2微信，3余额
                pay_pwd: "", //支付密码，余额支付时必传
                client: "", //类型，微信支付时必传 app:app，applets:小程序,public:公众号
            },
            tips: "",
            resPayData: {},
        };
    },
    created() {
        this.getTips();
        // #ifdef H5
        if (!this.$mUtils.checkIsWx()) {
            this.payType.push({
                icon: "/index/alipay.png",
                name: "支付宝支付",
                type: 1,
            });
        }
        // #endif
    },
    methods: {
        async getTips() {
            let { data } = await this.$api.tips();
            this.tips = this.$mUtils.rplaceRichImg(data.content);
        },
        cancel() {
            this.$refs.payModal.close();
            this.payData.type = "";
            this.isAgreeInfo = false;
        },
        goInfoService() {
            this.$mRouter.push({ route: this.$mRoutesConfig.infoService });
        },
        agreeInfo() {
            this.isAgreeInfo = !this.isAgreeInfo;
        },
        selectPay(type) {
            this.payData.type = type;
        },
        open() {
            this.$refs.payModal.open();
        },
        goPay() {
            if (!this.payData.type) return this.$mUtils.toast("请选择支付方式");
            if (!this.isAgreeInfo)
                return this.$mUtils.toast("请同意信息服务协议");
            //微信支付
            if (this.payData.type == "2") {
                //  #ifdef H5
                if (this.$mUtils.checkIsWx()) {
                    // 微信浏览器-公众号支付
                    this.accoutPay("", "public").then((res) => {
                            this.gzhPay(res);
                    }).catch(err=>{
                        this.$mUtils.toast(err.msg);
                    });
                } else {
                    //其他浏览器—H5支付
                    this.$mUtils.toast("h5支付暂未开通");
                }
                // #endif
                //#ifdef MP-WEIXIN
                this.accoutPay("", "applets").then((res) => {
                        this.miniappPay(res);
                }).catch(err=>{
                    this.$mUtils.toast(err.msg);
                });
                //#endif
            } else if (this.payData.type == "3") {
                //余额支付
                this.inputPayPwd();
            } else if (this.payData.type == "1") {
                // 支付宝支付
                this.accoutPay("", "h5").then((res) => {
                        let div = document.createElement("div");
                        /* 此处form就是后台返回接收到的数据 */
                        div.innerHTML = res.data.form;
                        document.body.appendChild(div);
                        document.forms[0].submit();
                }).catch(err=>{
                      this.$mUtils.toast(err.msg);
                });
            }
        },
        //输入支付密码
        inputPayPwd() {
            this.$refs.pwdPopup.open();
        },
        confirmPay(pwd) {
            this.$refs.pwdPopup.close();
            //余额支付，钱包支付 accoutPay
            this.accoutPay(pwd, "")
                .then((res) => {
                    this.$mUtils.toast(res.msg);
                    setTimeout(() => {
                        uni.makePhoneCall({
                            phoneNumber: this.mobile,
                        });
                        this.$refs.pwdPopup.close();
                    }, 1000);
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        //支付
        accoutPay(pwd, client) {
            return new Promise((resolve, reject) => {
                this.payData.pay_pwd = pwd;
                this.payData.client = client;
                this.payData.user_id = this.user_id;
                this.payData.work_id = this.work_id;
                this.$api.messagePay(this.payData).then((res) => {
                    if (res.code == 200) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                });
            });
        },
        gzhPay(payRes) {
            let that = this;
            WeixinJSBridge.invoke(
                "getBrandWCPayRequest",
                {
                    appId: payRes.data.appid, //公众号名称，由商户传入
                    timeStamp: payRes.data.time_stamp, //时间戳，自1970年以来的秒数
                    nonceStr: payRes.data.nonce_str, //随机串
                    package: payRes.data.package,
                    signType: payRes.data.sign_type, //微信签名方式：
                    paySign: payRes.data.sign, //微信签名
                },
                function(res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        that.$mUtils.toast("支付成功");
                        setTimeout(() => {
                            uni.makePhoneCall({
                                phoneNumber: that.mobile,
                            });
                            that.$refs.pwdPopup.close();
                        }, 2000);
                    } else {
                        that.$mUtils.toast("支付失败");
                    }
                }
            );
        },
        //小程序支付
        miniappPay(res) {
            uni.requestPayment({
                provider: "wxpay",
                timeStamp: res.data.timeStamp,
                // String 微信小程序必填 时间戳从1970年1月1日至今的秒数，即当前的时间。 微信小程序
                nonceStr: res.data.nonceStr,
                // String 微信小程序必填 随机字符串，长度为32个字符以下。 微信小程序
                package: res.data.package,
                // String 微信小程序必填 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx。 微信小程序
                signType: res.data.signType, // String 微信小程序必填 签名算法，暂支持 MD5。 微信小程序
                paySign: res.data.paySign, //
                success: (res) => {
                    console.log("微信小程序支付", res);
                    if (res.errMsg === "requestPayment:ok") {
                        this.$mUtils.toast("支付成功");
                        setTimeout(() => {
                            uni.makePhoneCall({
                                phoneNumber: this.mobile,
                            });
                            this.$refs.pwdPopup.close();
                        }, 2000);
                    } else {
                    }
                },
                fail: (res) => {
                    this.$mUtils.toast("支付失败");
                    console.log("微信小程序支付 failfailfail", res);
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.pay_modal {
    font-size: 24rpx;
    color: #333333;
    .btn {
        cursor: pointer;
    }
    .top_part {
        text-align: center;
        margin-top: 80rpx;
        .message_money {
            font-size: 40rpx;
            font-weight: 600;
            color: #0067df;
            margin-bottom: 16rpx;
        }
    }

    .blank {
        width: 100%;
        height: 20rpx;
        background: #f9f9f9;
        margin-top: 80rpx;
    }
    .pay_type {
        padding: 48rpx 24rpx 0;
        box-sizing: border-box;
        .pay_title {
            font-size: 32rpx;
            font-weight: 600;
            color: #333333;
            margin-bottom: 32rpx;
        }
        .pay_item {
            padding: 26rpx 0;
            border-bottom: 1rpx solid #f5f5f5;
            display: flex;
            justify-content: space-between;
            .pay_icon {
                width: 48rpx;
                height: 48rpx;
                vertical-align: middle;
                margin-right: 16rpx;
            }
            .select_icon {
                width: 32rpx;
                height: 32rpx;
            }
        }
    }
    .tips {
        margin: 48rpx 24rpx 80rpx;
        color: #999999;
        .tip_info {
            color: #0067df;
        }
        .read_info {
            margin-top: 80rpx;
            text-align: center;
            .img {
                vertical-align: middle;
                margin-right: 16rpx;
                width: 32rpx;
                height: 32rpx;
            }
        }
    }
    .btns {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 80rpx;
        .pay_btn {
            width: 200rpx;
            height: 88rpx;
            background: #ffffff;
            border-radius: 44rpx;
            border: 2rpx solid #f9f9f9;
            margin-right: 40rpx;
            color: #666666;
            font-size: 32rpx;
            text-align: center;
            line-height: 88rpx;
        }
        .active_btn {
            background-color: #0067df;
            color: #fff;
        }
    }
}
</style>
