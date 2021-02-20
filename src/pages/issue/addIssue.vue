<template>
    <view class="container">
        <view class="top_part" @click="goSelectPosition">
            <view class="title">
                {{ authorStatus == 1 ? "招工职位" : "找活职位" }}
            </view>
            <view class="select_option">
                {{ positionName }}
            </view>
            <image :src="'/issue/next.png' | imgUrl" class="next_icon"></image>
        </view>
        <view
            class="top_part"
            v-if="authorStatus == 1"
            @click="goSelectLocation"
        >
            <view class="title">
                工作地点
            </view>
            <view class="select_option">
                {{ publishData.address || "请选择" }}
            </view>
            <image :src="'/issue/next.png' | imgUrl" class="next_icon"></image>
        </view>
        <view class="one_part">
            <view class="title">
                {{ authorStatus == 1 ? "薪资说明" : "收费说明" }}
            </view>
            <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                v-model="publishData.charge"
            ></textarea>
        </view>
        <view class="one_part">
            <view class="title">
                {{ authorStatus == 1 ? "工种要求" : "个人简介" }}
            </view>
            <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                v-model="publishData.content"
            ></textarea>
        </view>
        <view class="one_part">
            <view class="second_title">
                图片（选填最多9张）
            </view>
            <view class="imgs_part">
                <image
                    :src="'/issue/upload.png' | imgUrl"
                    class="upload_img"
                    @click="imgUpload"
                    v-if="isShowImgUpload"
                ></image>
                <view
                    class="img_list"
                    v-for="(item, index) in publishData.img_url"
                    :key="index"
                >
                    <image
                        :src="'/issue/delete.png' | imgUrl"
                        class="close_icon"
                        @click="delImage(item, index)"
                    ></image>

                    <img :src="qiniuimgUrl+item" mode="" class="upload_img" />
                </view>
            </view>
        </view>
        <view class="one_part">
            <view class="second_title">
                视频（选填最大50M,最多两个）
            </view>
            <view class="imgs_part">
                <image
                    :src="'/issue/upload.png' | imgUrl"
                    class="upload_img"
                    @click="videoUpload"
                    v-if="isShowVideoUpload"
                ></image>
                <view
                    class="img_list"
                    v-for="(item, index) in publishData.video_url"
                    :key="index"
                >
                    <image
                        :src="'/issue/delete.png' | imgUrl"
                        class="close_icon"
                        @click="delVideo(item, index)"
                    ></image>
                    <video :src="qiniuimgUrl+item" class="upload_img"></video>
                </view>
            </view>
        </view>
        <view @click="submitIssue" class="btn">确定发布</view>
    </view>
</template>

<script>
import HandleBtn from "@/components/common/handleBtn.vue";
export default {
    components: {
        HandleBtn,
    },
    computed: {
        /**认证类型状态（0,未认证，1企业认证，2个人认证） */
        authorStatus() {
            return this.$store.state.userAuthentication;
        },
    },
    data() {
        return {
            publishData: {
                category_level_1: "",
                category_level_2: "",
                charge: "",
                content: "",
                img_url: [],
                video_url: [],
                type: 2, //类型（1找活，2招工）
                address: "",
                longitude: "",
                latitude: "",
            },
            positionName: "",
            qiniuimgUrl: "https://qiniu.renmingong.com/",
            isShowImgUpload: true,
            isShowVideoUpload: true,
            qiniuToken: "",
        };
    },
    onLoad(options) {
        this.publishData.category_level_1 = options.category_level_1;
        this.publishData.category_level_2 = options.category_level_2;
        this.positionName = options.secondName || "请选择";
    },
    onShow() {
        this.$store.dispatch("fetchUser");
        this.setTitle();
        this.getToken();
    },
    methods: {
        //删除视频
        delVideo(item, idx) {
            this.publishData.video_url.splice(idx, 1);
            this.isShowVideoUpload = this.publishData.video_url.length < 2;
        },
        //删除图片
        delImage(item, idx) {
            this.publishData.img_url.splice(idx, 1);
            this.isShowImgUpload = this.publishData.img_url.length < 9;
        },
        async getToken() {
            let { data } = await this.$api.qiNiu();
            this.qiniuToken = data;
        },
        //七牛云上传
        qiniuUpload(tempFilePaths, type) {
            for (let file of tempFilePaths) {
                uni.uploadFile({
                    url: "https://up-z2.qiniup.com",
                    filePath: file,
                    name: "file",
                    formData: {
                        key: type + "-" + Math.ceil(Math.random() * 999999),
                        token: this.qiniuToken,
                    },
                    success: (uploadFileRes) => {
                        if (type == "img") {
                            this.publishData.img_url.push(
                                JSON.parse(uploadFileRes.data).key
                            );
                            this.isShowImgUpload =
                                this.publishData.img_url.length < 9;
                        } else if (type == "video") {
                            this.publishData.video_url.push(
                                JSON.parse(uploadFileRes.data).key
                            );
                            this.isShowVideoUpload =
                                this.publishData.video_url.length < 2;
                        }
                    },
                });
            }
        },
        //图片上传
        imgUpload() {
            uni.chooseImage({
                success: (res) => {
                    this.qiniuUpload(res.tempFilePaths, "img");
                },
            });
        },
        // 视频上传
        videoUpload() {
            uni.chooseVideo({
                sourceType: ["album"],
                success: (res) => {
                    this.qiniuUpload([res.tempFilePath], "video");
                },
            });
        },
        //选择地址
        goSelectLocation() {
            uni.chooseLocation({
                success: (res) => {
                    console.log(res, "res");
                    this.publishData.longitude = res.longitude;
                    this.publishData.latitude = res.latitude;
                    this.publishData.address = res.address;
                },
            });
        },
        setTitle() {
            return uni.setNavigationBarTitle({
                title: this.$store.getters.issueTitle,
            });
        },
        goSelectPosition() {
            this.$mRouter.push({
                route: this.$mRoutesConfig.selectPosition,
                query: { from: "publish" },
            });
        },
        submitIssue() {
            if (this.positionName == "请选择")
                return this.$mUtils.toast(
                    `${
                        this.authorStatus == 1 ? "招工职位" : "找活职位"
                    }不能为空`
                );
            if (this.authorStatus == 1 && !this.publishData.address)
                return this.$mUtils.toast(`工作地点不能为空`);
            if (!this.publishData.charge)
                return this.$mUtils.toast(
                    `${
                        this.authorStatus == 1 ? "薪资说明" : "收费说明"
                    }不能为空`
                );
            if (!this.publishData.content)
                return this.$mUtils.toast(
                    `${
                        this.authorStatus == 1 ? "工种要求" : "个人简介"
                    }不能为空`
                );
            this.publishData.type = this.authorStatus == 1 ? 2 : 1;
            this.$api
                .publishWork(this.publishData)
                .then((res) => {
                    this.$mUtils.toast("添加成功");
                    setTimeout(() => {
                        this.$mRouter.switchTab({
                            route: this.$mRoutesConfig.issue,
                        });
                    }, 2000);
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    font-size: 28rpx;
    padding: 24rpx;
    box-sizing: border-box;
    background-color: #fff;
    .title {
        color: #333333;
        font-weight: 400;
        margin-bottom: 12rpx;
    }
    .second_title {
        color: #999999;
        margin-bottom: 24rpx;
    }
    textarea {
        width: 100%;
        height: 300rpx;
        background: #f9f9f9;
        border-radius: 16rpx;
        padding: 20rpx;
        box-sizing: border-box;
        font-size: 28rpx;
    }
    .select_option {
        color: #666666;
        margin-left: 48rpx;
        width: 490rpx;
    }
    .top_part {
        display: flex;
        position: relative;
        margin-bottom: 78rpx;
        align-items: center;
        .title {
            margin-bottom: 0px;
        }
        .next_icon {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 32rpx;
            height: 32rpx;
        }
    }
    .one_part {
        margin-bottom: 80rpx;
        .imgs_part {
            display: flex;
            flex-wrap: wrap;
            .upload_img {
                margin-right: 20rpx;
                margin-top: 20rpx;
            }
            .img_list {
                position: relative;
                .close_icon {
                    width: 32rpx;
                    height: 32rpx;
                    position: absolute;
                    right: 0rpx;
                    top: 0rpx;
                }
            }
        }
    }
    .upload_img {
        width: 180rpx;
        height: 180rpx;
    }
    .btn {
        margin: 40rpx auto;
        width: 100%;
        height: 88rpx;
        background: #0067df;
        border-radius: 44rpx;
        line-height: 88rpx;
        text-align: center;
        color: #fff;
    }
}
</style>
