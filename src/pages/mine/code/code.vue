<template>
	<view class="code">
		<view class="top">
			<image class="bjt" :src="'/mine/mine_code.png' | _imgUrl" mode=""></image>
			<image class="codeimg" :src="code.qr_code" mode=""></image>
			<text>推荐码 {{ code.invite_code }}</text>
		</view>
		<view class="title">分享至</view>

		<view class="bottom" v-if="isweixin">
			<button class="box" @tap="lj()">
				<image :src="'/mine/wechat.png' | _imgUrl" mode=""></image>
				<text>微信</text>
			</button>
			<button class="box" @tap="lj()">
				<image :src="'/mine/pyq.png' | _imgUrl" mode=""></image>
				<text>朋友圈</text>
			</button>
		</view>
	</view>
</template>

<script>
import $mConfig from "@/config/index.config.js";
import JSEncrypt from "jsencrypt";
import { jsEncryptKey } from "@/common/js/jsEncryptKey.js";
let encrypt = new JSEncrypt(), //请求加密
    decrypt = new JSEncrypt(); //返回解密
encrypt.setPublicKey(jsEncryptKey.ENCRYPT_PUBLIC_KEY); // 公钥
decrypt.setPrivateKey(jsEncryptKey.DECRYPT_PRIVATE_KEY); //私钥
let dataObj = {},
    encrypted = encrypt.encryptUnicodeLong(JSON.stringify(dataObj));
export default {
    data() {
        return {
            code: {},
            route: "",
            token: "",
			isweixin:true
        };
    },
    onLoad(options) {
        for (var key in options) {
            this.token = JSON.parse(key).Authorization;
        }
        this.getcode();
        let pages = getCurrentPages();
        this.route = pages[pages.length - 1].route;
        console.log(this.route, "rpute");
		 //  #ifdef H5
		this.isweixin=this.$mUtils.checkIsWx()
		  // #endif
    },
    onShareTimeline(e) {
        console.log("分享", e);
        let query = {
            Authorization: this.$store.getters.getToken,
        };
        if (e.from == "menu") {
            return {
                title: "推荐码", //	String	是	分享标题
                path: this.route, //	String	是	页面 path ，必须是以 / 开头的完整路径。	QQ小程序不支持
                imageUrl: this.code.invite_code,
                query: JSON.stringify(query),
            };
        }
    },
    methods: {
        lj() {
            this.$mUtils.toast("请通过右上角链接分享");
        },
        getcode() {
			uni.showLoading({
				mask: true,
				title: "请稍候..."
			})
            // this.$api.recommendation().then((res) => {
            //     if (res.code == 200) {
            //         this.code = res.data;
            //     } else {
            //         this.$mUtils.toast(res.msg);
            //     }
            // });
            uni.request({
                url: $mConfig.baseUrl + "/api/base/member/recommendation",
                data: {
                    data: encrypted,
                },
                method: "POST",
                header: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: this.$store.getters.getToken || this.token,
                },
                dataType: "json",
                success: (res) => {
                    if (res.data.code == 200) {
                        this.code = JSON.parse(
                            decrypt.decryptUnicodeLong(JSON.stringify(res.data.data))
						);
						uni.hideLoading();
					    console.log(this.code,'thiscode')   
                    } else {
                        this.$mUtils.toast(res.msg);
                    }
                },
            });
        },
        //分享给好友
        onShareAppMessage(e) {
            console.log("分享", e);
            if (e.from == "menu") {
                return {
					title: "推荐码", //	String	是	分享标题
                };
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.code {
    width: 100%;
    padding: 10px;
    height: 667px;
    background: #0067df;
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
        margin: 0;
        padding: 0;
    }
    .bottom {
        margin-top: 16px;
        width: 80%;
        display: flex;
        justify-content: space-around;
        .box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
            }
            image {
                width: 32px;
                height: 32px;
            }
        }
    }
    .title {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
    }
    .top {
        width: 327px;
        height: 409px;
        margin: 10px auto;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        text {
            position: absolute;
            bottom: 50px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
        }
        .codeimg {
            z-index: 99;
            width: 200px;
            height: 200px;
            position: absolute;
            margin-top: 70px;
        }
        .bjt {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
