<template>
	<view class="company">
		<!-- 模块一 -->
		<view class="first">
			<view class="banner">
				<view class="two font_auth_size">
					企业名称
					<text class="gs">{{ rzxq.company_name }}</text>
				</view>
				<view class="three ">
					<view class="top font_auth_size">企业logo</view>
					<view class="bottom"><image @tap="ck(rzxq.logo_url)" :src="rzxq.logo_url" mode=""></image></view>
				</view>
				<view class="four">
					<view class="four_left font_auth_size">企业地址</view>
					<view class="four_right font_auth_size fn_cl_333333">{{ rzxq.province_id }}{{ rzxq.city_id }}{{ rzxq.region_id }}</view>
				</view>
				<view class="two font_auth_size">
					详细地址
					<text class="gs">{{ rzxq.address }}</text>
				</view>
			</view>
		</view>
		<!-- 模块二 -->
		<view class="second">
			<view class="banner">
				<view class="two font_auth_size">
					负责人
					<text class="gs fn_cl_333333 margin_left_20">{{ rzxq.name }}</text>
				</view>
				<view class="three">
					<view class="top font_auth_size">身份证</view>
					<view class="bottom">
						<image @tap="ck(rzxx.id_positive)" :src="rzxq.id_positive" mode=""></image>
						<image @tap="ck(rzxx.id_back)" :src="rzxq.id_back" mode=""></image>
					</view>
				</view>
				<view class="four font_auth_size">
					身份证号
					<text class="gs fn_cl_333333 margin_left_20">{{ rzxq.id_code }}</text>
				</view>
			</view>
		</view>
		<!-- 模块三 -->
		<view class="third">
			<view class="banner">
				<view class="three">
					<view class="top font_auth_size">营业执照</view>
					<view class="bottom"><image @tap="ck(rzxq.business)" :src="rzxq.business" mode=""></image></view>
				</view>
				<view class="four">
					<view class="top font_auth_size margin-bottom-20">企业简介</view>
					<text class="fn_cl_333333 font_auth_size">{{ rzxq.content }}</text>
				</view>
				<view class="three">
					<view class="bottom"><image @tap="getImgIndex(index)" v-for="(item, index) in rzxq.image_url" :key="index" :src="item" mode=""></image></view>
				</view>
				<!-- 视频 -->
				<view class="video"><video v-for="(item, index) in rzxq.video_url" :key="index" id="myVideo" :src="item" controls></video></view>
				<view class="five font_auth_size margin-bottom-20">
					<view class="title">备注:</view>
					<view class="nav">
						<view class="">1、你的认证已通过平台审核；</view>
						<view class="">2、所发内容需保证真实有效，无违规内容；如有违规平台将进行封号处理</view>
					</view>
				</view>
				<view class="qd base_center" @tap="$mUtils.goPage('company_auth')">重新认证</view>
			</view>
		</view>
		<!-- 按钮 -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			defaultRegionCode: '440113',
			region: [],
			rzxq: {},
			gg: ''
		};
	},
	onLoad() {
		this.rz();
		this.getgg();
	},
	methods: {
		getImgIndex(index) {
			//准备一个装图片路径的  数组imgs
			let imgs = this.rzxq.image_url.map(item => {
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
					type: 1
				})
				.then(res => {
					this.gg = res.data.url;
				});
		},
		rz() {
			this.$api.certificationDetail().then(res => {
				console.log(res);
				this.rzxq = res.data;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.company {
	background: #f9f9f9;
	width: 100%;
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

				video {
					width: 100%;
					height: 394rpx;
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
		margin-top: 10px;
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
		margin-top: 20px;
		.banner {
			width: 95%;
			margin: 0 auto;
			padding-top: 10px;
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
				.gs {
					margin-left: 10px;
					font-size: 14px;
					color: #333333;
				}
			}
			.three {
				border-bottom: 1px solid #fafafa;
				padding-bottom: 10px;
				margin-bottom: 10px;
				image {
					margin-top: 5px;
					width: 90px;
					height: 90px;
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
