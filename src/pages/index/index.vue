<template>
    <view class="container" @tap="closeDetailInfo">
        <view class="header">
            <image
                :src="'/index/message.png' | imgUrl"
                class="img"
                @click.stop="goSysMsg"
            ></image>
            <view class="mid_title"> 为人民服务 &nbsp;&nbsp;人民工</view>
        </view>
        <view class="middle_part">
            <view class="location">
                <view class="location_name one-line-txt">
                    <image
                        :src="'/index/location.png' | imgUrl"
                        class="location_icon img"
                    ></image>

                    <text>{{ currentCity }}</text>
                </view>
                <view class="location_right">
                    <view class="area_part">
                        <picker
                            @change="changeArea"
                            :value="areaIndex"
                            :range="areaData"
                            :range-key="'name'"
                        >
                            <view>{{ areaData[areaIndex].name }}</view>
                        </picker>
                        <image
                            :src="'/index/arrow.png' | imgUrl"
                            class="arrow_icon"
                        ></image>
                    </view>
                    <view class="area_part">
                        <picker
                            @change="changeInfo"
                            :value="infoIndex"
                            :range="infoData"
                            :range-key="'name'"
                        >
                            <view>{{ infoData[infoIndex].name }}</view>
                        </picker>
                        <image
                            :src="'/index/arrow.png' | imgUrl"
                            class="arrow_icon"
                        ></image>
                    </view>
                </view>
            </view>
            <view class="search_part">
                <image :src="'/index/search.png' | imgUrl" class="img"></image>
                <input
                    type="text"
                    placeholder="搜索对象工种"
                    placeholder-style="font-size:28rpx; color:#A3BBD7"
                    v-model="workMessageData.name"
                />
                <view class="search_right" @click.stop="search">搜索</view>
            </view>
            <view class="works">
                <view class="works_list">
                    <view
                        v-for="(item, index) in categoryTwoList"
                        :key="index"
                        class="work"
                        :class="{ active_work: activeWorkIndex == index }"
                        @click.stop="selectWork(index)"
                    >
                        {{ item.name }}
                    </view>
                </view>
                <view class="more_work" @click.stop="goSelectPosition">
                    更多工种
                </view>
            </view>
        </view>
        <view class="ad_modal" v-if="isShowAd">
            <img :src="adImg" alt="" class="modal_img" @click="goAdDetail" />
            <image
                mode=""
                :src="'/index/close_modal.png' | imgUrl"
                class="modal_close"
                @click.stop="closeAd"
            ></image>
        </view>
        <map
            id="myMap"
            style="width: 100%;"
            :latitude="currentCenterLogation.latitude"
            :longitude="currentCenterLogation.longitude"
            :markers="mapData.markers"
            :include-points="points"
            v-if="isShowMap"
            @markertap.stop="markerTap($event)"
            @regionchange.stop="regionChange($event)"
        >
        </map>
        <view class="detail_work_part" v-if="isShowDetailInfo">
            <view class="work_item">
                工种:{{ tapMarkData.category_level_2 }}
            </view>
            <view class="work_item"> 地址:{{ tapMarkData.address }} </view>
            <view class="work_item"> 距离:{{ tapMarkData.distance }}km </view>
            <view class="work_item">
                在线时间:{{ tapMarkData.last_login_time }}
            </view>
            <view class="work_item"> 费用说明:{{ tapMarkData.charge }} </view>
            <view class="work_btns work_item">
                <view
                    class=""
                    @click.stop="
                        goWorkDetail(tapMarkData.id, tapMarkData.price)
                    "
                >
                    查看详情 ></view
                >
                <view class="pay_money" @click.stop="pay">
                    付费{{ tapMarkData.price }}元</view
                >
            </view>
        </view>
        <!-- 付费弹窗 -->
        <PayModal
            ref="payModal"
            :value="tapMarkData.price"
            :work_id="tapMarkData.id"
            :user_id="tapMarkData.user_id"
            :mobile="tapMarkData.mobile"
        ></PayModal>
    </view>
</template>
<script>
import PayModal from "@/components/payModal/payModal.vue";
//#ifdef MP-WEIXIN
//引入高德地图
import aMap from "@/common/js/map/amap-wx.js";
//#endif
//#ifdef H5
import aMapH5 from "@/common/js/map/AMap.js";
//#endif
const WX_KEY = "5153fd7b69581e4cbfebd870df526b5f";
// const mapCtx = uni.createMapContext("myMap"); //创建初始地图
// const includePointsData = [];
export default {
    components: {
        PayModal,
    },
    computed: {
        isShowAd() {
            return this.$store.state.isShowHomeAd;
        },
    },
    data() {
        return {
            areaData: [
                { name: "5公里内", value: "5" },
                { name: "10公里内", value: "10" },
                { name: "20公里内", value: "20" },
                { name: "30公里内", value: "30" },
                { name: "50公里内", value: "50" },
            ],
            infoData: [
                { name: "招工信息", value: "2" },
                { name: "找活信息", value: "1" },
            ],
            areaIndex: 0,
            infoIndex: 0,
            activeWorkIndex: null,
            adImg: "",
            workMessageData: {
                type: 2, //种类1找活信息，2招工信息
                distance: "", //距离
                longitude: "", //定位经度
                latitude: "", //定位纬度
                category_id: "", //工种二级分类id
                name: "", //搜索内容
            },
            categoryTwoList: [],
            amapPlugin: null,
            currentCity: "",
            workData: "", //地图全部工种信息
            tapMarkData: {}, //当前marker点信息
            isShowMap: false,
            isShowDetailInfo: false,
            mapData: {
                markers: [],
            },
            //当前位置中心经纬度
            currentCenterLogation: {
                latitude: "",
                longitude: "",
            },
            points: [],
        };
    },
    async onLoad(options) {
        if (options.phone) {
            uni.makePhoneCall({
                phoneNumber: options.phone,
            });
        }
        //#ifdef MP-WEIXIN
        this.amapPlugin = new aMap.AMapWX({
            key: WX_KEY,
        });
        //获取当前定位
        await this.getMPCurLocation();
        //#endif
        // #ifdef  H5
        this.code = this.getQueryString("code");
        console.log(this.code);
        console.log(window.location.href);
        if (this.code) {
            this.handleLogin(this.code);
        }
        //获取当前定位
        await this.getCurLocation();
        // #endif
    },
    onShow() {
        if (this.$store.state.selectCategoryId) {
            this.workMessageData.category_id = this.$store.state.selectCategoryId;
        }
        this.getAdImg();
        this.getCategoryTwo();
    },
    methods: {
        getQueryString(name) {
            //获取url参数
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        //授权登录接口
        handleLogin(data) {
            var that = this;
            console.log(data, "data");
            this.$api
                .official({
                    code: data,
                })
                .then((res) => {
                    console.log("授权登录接口", res);
                    if (res.code == 200) {
                        that.$mUtils.toast(res.msg);
                        that.$store.commit("SET_TOKEN", res.data);
                        that.$store.commit("SET_HASLOGIN", true);
                    } else if (res.code == 1005) {
                        that.$mUtils.toast(res.msg);
                        that.$mUtils.timeout(() => {
                            that.$mRouter.push({
                                route: that.$mRoutesConfig.bindTel,
                                query: { id: res.data },
                            });
                        });
                    }
                });
        },
        //#ifdef H5
        //获取当前定位
        getCurLocation() {
            // console.log("获取当前定位H5")
            let that = this;
            aMapH5().then(
                (AMap) => {
                    AMap.plugin("AMap.Geolocation", function() {
                        let geoloc = new AMap.Geolocation({
                            // 是否使用高精度定位，默认：true
                            enableHighAccuracy: true,
                            // 设置定位超时时间，默认：无穷大
                            timeout: 10000,
                        });
                        geoloc.getCurrentPosition();
                        AMap.event.addListener(geoloc, "complete", onComplete);
                        AMap.event.addListener(geoloc, "error", onError);

                        function onComplete(data) {
                            let location = data.addressComponent;
                            //设置经纬度，
                            that.$store.dispatch("setCurrentLocation", {
                                latitude: data.position.lat,
                                longitude: data.position.lng,
                            });
                            that.currentCity =
                                location.province +
                                "" +
                                location.city +
                                "" +
                                location.district;
                            that.getWorkMessage();
                        }

                        function onError(data) {
                            // 定位出错
                            // alert("定位出错", data);
                            that.$mUtils.toast("GPS定位失败,切换为IP定位");
                            // 调用ip定位
                            that.getLocByIp();
                        }
                    });
                },
                (e) => {
                    console.log("地图加载失败", e);
                }
            );
        },
        // 调用ip定位
        getLocByIp() {
            alert("切换为IP定位");
            let that = this;
            aMapH5().then(
                (AMap) => {
                    AMap.plugin("AMap.CitySearch", function() {
                        var citySearch = new AMap.CitySearch();
                        citySearch.getLocalCity(function(status, result) {
                            if (status === "complete" && result.info === "OK") {
                                // 查询成功，result即为当前所在城市信息
                                let lnglat = result.rectangle
                                    .split(";")[0]
                                    .split(",");
                                that.$store.dispatch("setCurrentLocation", {
                                    latitude: lnglat[1],
                                    longitude: lnglat[0],
                                });
                                that.currentCity = result.city;
                                that.getWorkMessage();
                            }
                        });
                    });
                },
                (e) => {
                    console.log("地图加载失败", e);
                }
            );
        },

        //#endif
        //#ifdef MP-WEIXIN
        //获取当前定位
        getMPCurLocation() {
            console.log("获取当前定位MP");
            let that = this;
            uni.getLocation({
                type: "gcj02",
                success(res) {
                    that.$store.dispatch("setCurrentLocation", {
                        latitude: res.latitude,
                        longitude: res.longitude,
                    });
                    uni.request({
                        url:
                            "https://restapi.amap.com/v3/geocode/regeo?output=JSON&location=" +
                            res.longitude +
                            "," +
                            res.latitude +
                            `&key=${WX_KEY}`,
                        success: (res) => {
                            this.currentCity =
                                res.data.regeocode.addressComponent.province +
                                res.data.regeocode.addressComponent.city +
                                res.data.regeocode.addressComponent.district;
                        },
                        fail: (err) => {},
                    });
                    that.getCityByLoc(res.longitude, res.latitude);
                    that.getWorkMessage();
                },
                complete(res) {
                    console.log("获取当前定位complete", res);
                },
            });
        },

        //根据经纬度获取城市名
        getCityByLoc(longitude, latitude) {
            let that = this;
            that.amapPlugin.getRegeo({
                location: "" + longitude + "," + latitude + "", //location的格式为'经度,纬度'
                success: function(data) {
                    let lc = data[0].regeocodeData.addressComponent;
                    that.currentCity =
                        lc.province + "" + lc.city + "" + lc.district;
                },
                fail: function(info) {},
            });
        },
        //#endif
        search() {
            this.isShowMap = false;
            this.getWorkMessage();
        },
        //获取首页工种分类
        getCategoryTwo() {
            this.$api
                .categoryTwo()
                .then((res) => {
                    this.categoryTwoList = res.data;
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        //获取工种信息
        getWorkMessage() {
            this.workMessageData.distance = this.areaData[this.areaIndex].value;
            this.workMessageData.longitude = this.$store.getters.getCurrentLocation.longitude;
            this.workMessageData.latitude = this.$store.getters.getCurrentLocation.latitude;
            this.mapData.markers = [];
            this.points = [];
            this.$api
                .homeWorkMessage(this.workMessageData)
                .then((res) => {
                    this.workData = res.data;

                    for (let i in this.workData) {
                        this.mapData.markers[i] = {
                            id: this.workData[i].id,
                            latitude: this.workData[i].latitude, //纬度
                            longitude: this.workData[i].longitude, //经度
                            iconPath: this.workData[i].avatar, //显示的图标
                            title: this.workData[i].last_login_time, //标注点名
                            width: 32,
                            height: 32,
                            callout: {
                                //自定义标记点上方的气泡窗口 点击有效
                                content: this.workData[i].last_login_time, //文本
                                color: "#7C8DA0", //文字颜色
                                fontSize: 13, //文本大小
                                borderRadius: 19, //边框圆角
                                bgColor: "#FFFFFF", //背景颜色
                                display: "ALWAYS", //常显
                                padding: 8,
                            },
                        };
                        this.points.push({
                            latitude: this.workData[i].latitude,
                            longitude: this.workData[i].longitude,
                        });
                    }
                    console.log(this.mapData.markers, "this.mapData.markers");

                    console.log(this.points, "points");
                    if (
                        this.mapData.markers.length == 0 ||
                        this.points.length == 0
                    ) {
                        this.currentCenterLogation.longitude = this.$store.getters.getCurrentLocation.longitude;
                        this.currentCenterLogation.latitude = this.$store.getters.getCurrentLocation.latitude;
                        this.isShowMap = true;
                        return;
                    }
                    let lonMaxNum = Math.max.apply(
                        Math,
                        this.points.map((item) => item.longitude)
                    );
                    let lonMinNum = Math.min.apply(
                        Math,
                        this.points.map((item) => item.longitude)
                    );
                    let latMaxNum = Math.max.apply(
                        Math,
                        this.points.map((item) => item.latitude)
                    );
                    let latMinNum = Math.min.apply(
                        Math,
                        this.points.map((item) => item.latitude)
                    );
                    this.currentCenterLogation.longitude =
                        (lonMaxNum + lonMinNum) / 2;
                    this.currentCenterLogation.latitude =
                        (latMaxNum + latMinNum) / 2;

                    this.isShowMap = true;
                })
                .catch((err) => {
                    this.$mUtils.toast(err.msg);
                });
        },
        //点击地图标记点
        markerTap(e) {
            let id = e.detail.markerId;
            let data = this.mapData.markers.find((item) => item.id == id);
            this.currentCenterLogation.latitude = data.latitude;
            this.currentCenterLogation.longitude = data.longitude;
            this.getWorkDetail(id);
        },
        // 移动地图
        async regionChange(e) {
            console.log(e, "视野发生变化");
            this.isShowDetailInfo = false;
        },

        //获取信息详情
        async getWorkDetail(id) {
            let queryData = {
                id: id,
                longitude: this.workMessageData.longitude,
                latitude: this.workMessageData.latitude,
            };
            let { data } = await this.$api.workDetail(queryData);
            this.tapMarkData = data;
            this.isShowDetailInfo = true;
        },
        closeDetailInfo() {
            this.isShowDetailInfo = false;
        },
        //获取弹窗广告
        getAdImg() {
            this.$api.homeModalImg().then((res) => {
                this.adImg = res.data.img;
            });
        },
        goSelectPosition() {
            this.$mRouter.push({
                route: this.$mRoutesConfig.selectPosition,
                query: { from: "index" },
            });
        },
        pay() {
            this.$refs.payModal.open();
        },
        goInfo() {
            this.$mRouter.push({ route: this.$mRoutesConfig.issueDetail });
        },
        goAdDetail() {
            this.$mRouter.push({ route: this.$mRoutesConfig.adDetail });
        },
        closeAd() {
            this.$store.commit("updateHomeAd", false);
        },
        selectWork(index) {
            this.activeWorkIndex = index;
            this.workMessageData.category_id = this.categoryTwoList[index].id;
            this.isShowMap = false;
            this.getWorkMessage();
        },
        changeArea(e) {
            this.areaIndex = e.target.value;
            this.workMessageData.distance = this.areaData[this.areaIndex].value;
            this.isShowMap = false;
            this.getWorkMessage();
        },
        changeInfo(e) {
            this.infoIndex = e.target.value;
            this.workMessageData.type = this.infoData[this.infoIndex].value;
            this.isShowMap = false;
            this.getWorkMessage();
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
        goSysMsg() {
            this.$mRouter.push({
                route: this.$mRoutesConfig.message,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    font-size: 24rpx;
    color: #333333;
    #myMap {
        height: 100vh;
    }
    .header {
        width: 100%;
        height: 160rpx;
        padding: 64rpx 24rpx 0;
        background: #0067df;
        display: flex;
        align-items: center;
        font-size: 32rpx;
        color: #fff;
        font-weight: bold;
        box-sizing: border-box;
        position: relative;
        margin-bottom: 20rpx;
        .img {
            width: 48rpx;
            height: 48rpx;
        }
        .mid_title {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 15%);
        }
    }
    .middle_part {
        border-radius: 16rpx;
        margin-top: -20rpx;
        background-color: #fff;
        .location {
            display: flex;
            justify-content: space-between;
            padding: 16rpx 18rpx;
            box-sizing: border-box;
            img {
                vertical-align: middle;
            }
            .location_right {
                display: flex;
                .area_icon {
                    margin-right: 36rpx;
                }
                .area_part {
                    width: 140rpx;
                    display: flex;
                }
                .arrow_icon {
                    width: 32rpx;
                    height: 32rpx;
                }
            }
            .location_name {
                width: 300rpx;
                .img {
                    width: 32rpx;
                    height: 32rpx;
                }
            }
            .location_icon {
                margin-right: 10rpx;
                vertical-align: middle;
            }
        }
        .search_part {
            width: 702rpx;
            height: 80rpx;
            background: #f6faff;
            border-radius: 40rpx;
            margin: 0 auto;
            display: flex;
            align-items: center;
            padding-left: 12rpx;
            font-size: 28rpx;
            position: relative;
            input {
                font-size: 24rpx;
            }
            .img {
                width: 40rpx;
                height: 40rpx;
            }
            .search_right {
                width: 120rpx;
                height: 80rpx;
                line-height: 80rpx;
                text-align: center;
                background-color: #e5f1ff;
                color: #0067df;
                position: absolute;
                right: 0;
                bottom: 0;
                border-radius: 0 40rpx 40rpx 0;
            }
        }
        .works {
            display: flex;
            margin: 20rpx 0;
            font-size: 26rpx;
            .works_list {
                display: flex;
                white-space: nowrap;
                padding: 0 30rpx;
                width: 620rpx;
                overflow-x: auto;
                box-sizing: border-box;

                .work {
                    margin-right: 40rpx;
                }
                .active_work {
                    color: #0067df;
                }
            }
            .more_work {
                width: 130rpx;
                text-align: center;
                color: #0067df;
            }
        }
    }
    .ad_modal {
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 999;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .modal_img {
            width: 500rpx;
            height: 600rpx;
            border-radius: 16rpx;
        }
        .modal_close {
            width: 48rpx;
            height: 48rpx;
            margin-top: 80rpx;
        }
    }
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
                img {
                    vertical-align: middle;
                    margin-right: 16rpx;
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
    .detail_work_part {
        width: 230px;
        height: 197px;
        background: #0067df;
        border-radius: 8px;
        font-size: 12px;
        color: #ffffff;
        padding: 12px;
        box-sizing: border-box;
        position: fixed;
        top: 41%;
        left: 50%;
        transform: translateX(-50%);
        .work_item {
            margin-bottom: 8px;
        }
        .work_btns {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .pay_money {
                width: 83px;
                height: 32px;
                background: #ffffff;
                border-radius: 16px;
                text-align: center;
                line-height: 32px;
                font-size: 14px;
                color: #0067df;
                font-weight: 600;
            }
        }
    }
}
</style>
