<template>
    <view class="container">
        <view class="attention">
            <image :src="'/index/report.png' | imgUrl" mode="" class="img">
                注意 </image
            ><br />
            <view class="atten_content"
                >如故意虚假举报，会被封号处理<br />如对方暂时未接电话，这属于正常情况，请换个时间段打电话，或者发短信</view
            >
        </view>
        <view class="bottom">
            <view class="report_content">
                <view class="title">
                    举报内容
                </view>
                <view class="report_list">
                    <view
                        v-for="(item, index) in contentList"
                        :key="index"
                        class="report_item"
                        :class="{ active_report: activeIndex == index }"
                        @click="selectType(index, item.id)"
                    >
                        {{ item.content }}</view
                    >
                </view>
            </view>
            <view class="">
                <view class="title">
                    详细说明
                </view>
                <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                    v-model="reportData.content"
                ></textarea>
            </view>
            <view class="title"> 联系电话：{{ phone }} </view>
            <view class="submit_btn" @click="submit">
                提交
            </view>
        </view>
        <UniPopup ref="reportModal" class="report_modal">
            <view class="modal_content">
                <image
                    :src="'/index/attention.png' | imgUrl"
                    mode=""
                    class="img"
                ></image>
                <view class="">
                    您的举报信息已提交，平台会尽快处理
                </view>
                <view @click="cancel" class="modal_btn">确定</view>
            </view>
        </UniPopup>
    </view>
</template>

<script>
import UniPopup from "@/components/common/UniPopup.vue";
import HandleBtn from "@/components/common/handleBtn.vue";

export default {
    components: {
        UniPopup,
        HandleBtn,
    },
    data() {
        return {
            attention:
                "如故意虚假举报，会被封号处理,如对方暂时未接电话，这属于正常情况，请换个时间段打电话，或者发短信",
            contentList: [],
            activeIndex: null,
            phone: "",
            reportData: {
                work_id: "",
                report_id: "",
                content: "",
            },
        };
    },
    onLoad(options) {
        this.reportData.work_id = options.id;
    },
    onShow() {
        this.getReportContent();
        this.getOnlinePhone();
    },
    methods: {
        getReportContent() {
            this.$api.reportContent().then((res) => {
                if (res.code == 200) {
                    this.contentList = res.data;
                } else {
                    this.$mUtils.toast(res.msg);
                }
            });
        },
        getOnlinePhone() {
            this.$api.userInfo().then((res) => {
                if (res.code == 200) {
                    this.phone = res.data.mobile;
                } else {
                    this.$mUtils.toast(res.msg);
                }
            });
        },
        cancel() {
            this.$refs.reportModal.close();
            this.$mRouter.back();
        },
        selectType(index, id) {
            this.activeIndex = index;
            this.reportData.report_id = id;
        },
        submit() {
            if(!this.reportData.report_id) return  this.$mUtils.toast("请选择举报内容");
            if(!this.reportData.content) return  this.$mUtils.toast("请填写详细说明");
            this.$api.reportCompany(this.reportData).then((res) => {
                if (res.code == 200) {
                    this.$refs.reportModal.open();
                } else {
                    this.$mUtils.toast(res.msg);
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    color: #333333;
    background-color: #fff;
    .img,
    img {
        vertical-align: middle;
        margin-right: 8rpx;
    }
    .title {
        font-size: 32rpx;
        font-weight: 600;
        margin-bottom: 24rpx;
    }
    textarea {
        width: 100%;
        height: 300rpx;
        background: #f9f9f9;
        border-radius: 16rpx;
        padding: 24rpx;
        box-sizing: border-box;
        margin-bottom: 40rpx;
    }
    .attention {
        font-size: 26rpx;
        color: #eb664e;
        width: 100%;
        height: 200rpx;
        background: #fffaf9;
        padding: 24rpx;
        box-sizing: border-box;
        margin-bottom: 80rpx;
        .atten_content {
            margin-top: 10rpx;
        }
        .img {
            width: 32rpx;
            height: 32rpx;
        }
    }
    .bottom {
        padding: 24rpx;
        box-sizing: border-box;

        .report_list {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 40rpx;
            .report_item {
                height: 64rpx;
                padding: 0 32rpx;
                border-radius: 32rpx;
                font-size: 28rpx;
                margin-right: 40rpx;
                background-color: #f9f9f9;
                line-height: 64rpx;
                margin-bottom: 40rpx;
                &:nth-child(3n) {
                    margin-right: 0;
                }
            }
            .active_report {
                background-color: #eb664e;
                color: #fff;
            }
        }
        .submit_btn {
            width: 100%;
            height: 88rpx;
            background: #0067df;
            border-radius: 44rpx;
            color: #fff;
            font-size: 32rpx;
            text-align: center;
            line-height: 88rpx;
            margin-top: 60rpx;
        }
    }
    .report_modal {
        text-align: center;
        font-size: 28rpx;
        .modal_content {
            padding-top: 32rpx;
            .img {
                width: 156rpx;
                height: 148rpx;
            }
            .modal_btn {
                text-align: center;
                width: 216rpx;
                height: 64rpx;
                border-radius: 35rpx;
                line-height: 64rpx;
                margin: 32rpx auto;
                background-color: #0067df;
                color: #fff;
            }
        }
    }
}
</style>
