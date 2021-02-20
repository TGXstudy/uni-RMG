<template>
	<view class="company">
		<!-- 模块一 -->
		<view class="first">
			<view class="banner">
				<view class="four">
					<view class="four_left font_auth_size">姓名</view>
					<text class="gs fn_cl_333333 margin_left_50 fn-sz-14">{{ rzxx.name }}</text>
				</view>
				<view class="three">
					<view class="three_left font_auth_size">性别</view>
					<text class="gs fn_cl_333333 margin_left_40 fn-sz-14">{{ rzxx.sex }}</text>
				</view>
				<view class="birth">
					<view class="three_left font_auth_size">出生年月</view>
					<text class="gs fn_cl_333333 margin_left_20 fn-sz-14">{{ rzxx.birthday }}</text>
				</view>
				<view class="four">
					<view class="four_left font_auth_size">所在地址</view>
					<text class="gs fn_cl_333333 margin_left_20 fn-sz-14">{{ rzxx.province_id }}{{ rzxx.city_id }}{{ rzxx.region_id }}</text>
				</view>
				<view class="four">
					<view class="four_left font_auth_size">详细地址</view>
					<text class="gs fn_cl_333333 margin_left_20 fn-sz-14">{{ rzxx.address }}</text>
				</view>
			</view>
		</view>
		<!-- 模块二 -->
		<view class="second">
			<view class="banner">
				<view class="three">
					<view class="top font_auth_size">身份证</view>
					<view class="bottom">
						<image @tap="ck(rzxx.id_positive)" :src="rzxx.id_positive" mode=""></image>
						<image @tap="ck(rzxx.id_back)" :src="rzxx.id_back" mode=""></image>
					</view>
				</view>
				<view class="four font_auth_size">
					<view class="top font_auth_size">身份证号</view>
					<text class="gs fn_cl_333333 margin_left_20 fn-sz-14">{{ rzxx.id_code }}</text>
				</view>
			</view>
		</view>
		<!-- 模块三 -->
		<view class="third">
			<view class="banner">
				<view class="four">
					<view class="top font_auth_size margin-bottom-20">个人简介</view>
					<text class="fn_cl_333333 font_auth_size">{{ rzxx.content }}</text>
				</view>
				<view class="three">
					<view class="bottom"><image @tap="getImgIndex(index)" v-for="(item, index) in rzxx.image_url" :src="item" mode="" :key="index"></image></view>
				</view>
				<!-- <view class="video">
					<video
						id="myVideo"
						:src="gg"
						controls
					></video>
				</view> -->
				<view class="five font_auth_size margin-bottom-20">
					<view class="title">备注:</view>
					<view class="nav">
						<view class="">1、你的认证已通过平台审核；</view>
						<view class="">2、所发内容需保证真实有效，无违规内容；如有违规平台将进行封号处理</view>
					</view>
				</view>
				<view class="qd base_center" @tap="$mUtils.goPage('person_auth')">重新认证</view>
			</view>
		</view>
	</view>
</template>

<script>
import timeSelector from '@/components/wing-time-selector/wing-time-selector.vue';
import pickRegions from '@/components/pick-regions/pick-regions.vue';

export default {
	data() {
		return {
			defaultRegionCode: '440113',
			region: [],
			timekey: '',
			rzxx: {},
			gg: ''
		};
	},
	onLoad() {
		this.getxx();
		this.getgg();
	},
	methods: {
		getImgIndex(index) {
			//准备一个装图片路径的  数组imgs
			let imgs = this.rzxx.image_url.map(item => {
				//只返回图片路径
				return item;
			});
			// console.log(imgs);
			//调用预览图片的方法
			uni.previewImage({
				urls: imgs,
				current: index
			});
		},

		ck(item) {
			uni.previewImage({
				urls: [item],
				current: 0
			});
		},
		getgg() {
			this.$api
				.video({
					type: 2
				})
				.then(res => {
					this.gg = res.data.url;
				});
		},
		getxx() {
			this.$api.certificationDetail().then(res => {
				console.log(res);
				this.rzxx = res.data;
			});
		},
		handleGetRegion(region) {
			this.region = region;
			console.log('regionregionregion', region);
		},
		btnConfirm(e) {
			this.timekey = e.key;
			console.log(e);
		},
		btnCancel() {
			console.log('取消');
		}
	},
	computed: {
		regionName() {
			// 转为字符串
			return this.region.map(item => item.name).join(' ');
		}
	},
	components: {
		pickRegions,
		timeSelector
	}
};
</script>

<style lang="scss" scoped>
.company {
	background: #f9f9f9;
	width: 100%;
	.forth {
		padding-top: 30px;
		padding-bottom: 50px;
		width: 100%;
		background-color: #ffffff;
		.banner {
			width: 95%;
			margin: 0 auto;
			padding-top: 10px;
			display: flex;
			justify-content: flex-end;
			.qx {
				width: 127px;
				height: 44px;
				background: #ffffff;
				border-radius: 22px;
				border: 1px solid #f9f9f9;
				font-size: 16px;
				font-family: PingFangSC-Regular, PingFang SC;
				color: #666666;
			}
			.qd {
				margin-left: 10px;
				width: 127px;
				height: 44px;
				background: #0067df;
				border-radius: 22px;
				border: 1px solid #f9f9f9;
				font-size: 16px;
				font-family: PingFangSC-Regular, PingFang SC;
				color: #ffffff;
			}
		}
	}
	.third {
		width: 100%;
		background-color: #ffffff;
		margin-top: 10px;
		.banner {
			width: 95%;
			margin: 0 auto;
			padding-top: 10px;
			.video {
				margin-top: 10px;
				width: 100%;
				height: 394rpx;
				video {
					width: 100%;
					height: 100%;
				}
			}
			.qd {
				margin-left: auto;
				width: 127px;
				height: 44px;
				background: #0067df;
				border-radius: 22px;
				border: 1px solid #f9f9f9;
				font-size: 16px;
				font-family: PingFangSC-Regular, PingFang SC;
				color: #ffffff;
				margin-top: 30px;
				margin-bottom: 50px;
			}
			.three {
				border-bottom: 1px solid #fafafa;
				padding-bottom: 10px;
				.bottom {
					width: 100%;
					display: flex;
					flex-wrap: wrap;
					image {
						margin-top: 5px;
						width: 90px;
						height: 90px;
						margin-right: 25px;
					}
				}
			}
			.four {
				border-bottom: 1px solid #fafafa;
				padding-bottom: 10px;
				textarea {
					padding-top: 5px;
					width: 100%;
					height: 150px;
					background: #f9f9f9;
					border-radius: 8px;
				}
			}
		}
	}
	.second {
		width: 100%;
		background-color: #ffffff;
		.banner {
			width: 95%;
			margin: 0 auto;
			padding-top: 10px;
			.two {
				display: flex;
				border-bottom: 1px solid #fafafa;
				padding-bottom: 10px;
				margin-bottom: 10px;
				input {
					margin-left: 10px;
					font-size: 14px;
				}
			}
			.four {
				display: flex;
				padding-bottom: 10px;
				margin-bottom: 10px;
				input {
					margin-left: 10px;
					font-size: 14px;
				}
			}
			.three {
				width: 100%;
				border-bottom: 1px solid #fafafa;
				padding-bottom: 10px;
				margin-bottom: 10px;
				.bottom {
					margin-top: 10px;
					width: 100%;
					display: flex;
					justify-content: space-between;
					image {
						width: 165px;
						height: 120px;
					}
				}
			}
		}
	}

	.first {
		width: 100%;
		background-color: #ffffff;
		margin-top: 10px;
		.banner {
			width: 95%;
			margin: 0 auto;
			padding-top: 10px;
			.bottomm {
				margin-bottom: 0 !important;
			}
			.one {
				width: 100%;
				height: 180px;
				margin-bottom: 10px;
			}
			.two {
				display: flex;
				border-bottom: 1px solid #fafafa;
				padding-bottom: 10px;
				margin-bottom: 10px;
				input {
					margin-left: 20px;
					font-size: 14px;
				}
			}
			.three {
				display: flex;
				border-bottom: 1px solid #fafafa;
				padding-bottom: 10px;
				margin-bottom: 10px;
				.three_left {
					margin-right: 10px;
				}
				.three_right {
					display: flex;
					.box {
						display: flex;
						align-items: center;
						font-size: 14px;
						font-family: PingFangSC-Regular, PingFang SC;
						color: #666666;
						margin-left: 60px;
						image {
							width: 16px;
							height: 16px;
						}
					}
				}
			}
			.birth {
				width: 100%;
				display: flex;
				align-items: center;
				border-bottom: 1px solid #fafafa;
				padding-bottom: 10px;
				margin-bottom: 10px;
				.three_right {
					width: 70%;
					margin-left: 8px;
				}
				image {
					margin-left: auto;
					width: 16px;
					height: 16px;
				}
			}
			.four {
				width: 100%;
				border-bottom: 1px solid #fafafa;
				padding-bottom: 10px;
				margin-bottom: 10px;
				display: flex;
				align-items: center;
				.four_right {
					width: 76%;
					margin-left: 10px;
				}
				image {
					margin-left: auto;
					width: 16px;
					height: 16px;
				}
			}
		}
	}
}
</style>
