<template>
	<view class="company">
		<!-- 模块一 -->
		<view class="first">
			<view class="banner">
				<view class="one"><video id="myVideo" :src="gg" controls></video></view>
				<view class="two font_auth_size">
					姓名
					<input type="text" v-model="name" placeholder="请输入姓名" value="" />
				</view>
				<view class="three">
					<view class="three_left font_auth_size">性别</view>
					<view class="three_right">
						<view class="box">
							<label class="radio" @click="redio(0)">
								<radio style="transform:scale(0.8)" value="r1" :checked="xz === 0" />
								男
							</label>
						</view>
						<view class="box">
							<label class="radio" @click="redio(1)">
								<radio style="transform:scale(0.8)" value="r1" :checked="xz === 1" />
								女
							</label>
						</view>
					</view>
				</view>
				<view class="birth">
					<view class="three_left font_auth_size">出生年月</view>
					<view class="three_right font_auth_size">
						<timeSelector showType="date" beginDate="1970-01-01" endDate="2030-12-31" beginTime="06:00:00" endTime="23:59:59" @btnConfirm="btnConfirm">
							{{ timekey != '' ? timekey : '请选择' }}
						</timeSelector>
					</view>
					<image :src="'/mine/jt.png' | _imgUrl" mode=""></image>
				</view>
				<view class="four">
					<view class="four_left font_auth_size">所在地址</view>
					<view class="four_right font_auth_size">
						<pick-regions class="nrr" :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
							<span class="djj" v-if="!regionName">请选择</span>
							<span>{{ regionName }}</span>
						</pick-regions>
					</view>
					<image :src="'/mine/jt.png' | _imgUrl" mode=""></image>
				</view>
				<view class="two font_auth_size bottomm">
					详细地址
					<input type="text" v-model="address" placeholder="请输入详细地址" value="" />
				</view>
			</view>
		</view>
		<!-- 模块二 -->
		<view class="second">
			<view class="banner">
				<view class="three">
					<view class="top font_auth_size">身份证</view>
					<view class="bottom">
						<image v-if="id_positive.length < 1" @click="id1_sc()" :src="'/mine/auth/sfz2.png' | _imgUrl" mode=""></image>
						<image v-else @click="id1_sc()" :src="imgUrl+id_positive" mode=""></image>
						<image v-if="id_back.length < 1" @click="id2_sc()" :src="'/mine/auth/sfz1.png' | _imgUrl" mode=""></image>
						<image v-else @click="id2_sc()" :src="imgUrl+id_back" mode=""></image>
					</view>
				</view>
				<view class="four font_auth_size">
					身份证号
					<input type="text" v-model="id_code" placeholder="请输入身份证号码" />
				</view>
			</view>
		</view>
		<!-- 模块三 -->
		<view class="third">
			<view class="banner">
				<view class="four">
					<view class="top font_auth_size">个人简介</view>
					<textarea value="" v-model="content" class="font_auth_size" placeholder="请输入企业简介" />
				</view>
				<view class="three">
					<view class="top font_auth_size">图片（选填最多9张）</view>
					<view class="tp_sc">
						<image @tap="img_sc()" :src="'/mine/auth/upload.png' | _imgUrl" mode=""></image>
						<view class="imglist" v-for="(item, index) in image_url" :key="item">
							<image @tap="delImage(item, index)" class="close" :src="'/mine/auth/close.png' | _imgUrl" mode=""></image>
							<image :src="imgUrl+item" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="forth">
			<view class="banner">
				<view class="qx base_center" @tap="qx()">取消</view>
				<view class="qd base_center" @tap="sure()">确定</view>
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
			imgUrl: 'https://qiniu.renmingong.com/',
			defaultRegionCode: '440113',
			region: [],
			timekey: '',
			gg: '',
			xz: 0,
			name: '', //姓名
			sex: '', //性别
			birthday: '', //生日
			province_id: '', //省
			city_id: '', //市
			region_id: '', //区
			address: '', //详细地址
			id_positive: '', //身份证正面
			id_back: '', //身份证反面
			id_code: '', //身份证号码
			content: '', //公司简介
			image_url: [] ,//图片
			max:0,
		};
	},
	onLoad() {
		this.getgg();
		this.sex = '男';
	},
	methods: {
		qx(){
			 this.$mRouter.back();
		},
		//删除图片
		delImage(item, idx) {
			this.image_url.splice(idx, 1);
		},
		//图片上传
		img_sc() {
			let that = this;
			uni.chooseImage({
				success: chooseImageRes => {
					const tempFilePaths = chooseImageRes.tempFilePaths;
					console.log(tempFilePaths.length,'tempFilePaths')
					if(tempFilePaths.length>9){
						this.$mUtils.toast('最多上传9张!');
						return
					}
					for (let i = 0; i < tempFilePaths.length; i++) {
						this.max+=1;
						if(this.max>9){
							this.$mUtils.toast('最多上传9张!');
							return
						}
						this.$api.qiNiu().then(res => {
							if (res.code == 200) {
								uni.uploadFile({
									url: 'https://up-z2.qiniup.com',
									filePath: tempFilePaths[i],
									name: 'file',
									formData: {
										key: 'imgs' + '-' + Math.ceil(Math.random() * 999999),
										token: res.data
									},
									success: uploadFileRes => {
										that.image_url.push(JSON.parse(uploadFileRes.data).key);
									
									}
								});
							}
						});
					}
				}
			});
		},
		//身份证正面上传
		id1_sc() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				success: data => {
					this.urlTobase64(data.tempFilePaths[0], 'id1');
				}
			});
		},
		//身份证反面
		id2_sc() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				success: data => {
					this.urlTobase64(data.tempFilePaths[0], 'id2');
				}
			});
		},
		urlTobase64(url, type) {
			var that = this;
			this.$api.qiNiu().then(res => {
				if (res.code == 200) {
					uni.uploadFile({
						url: 'https://up-z2.qiniup.com',
						filePath: url,
						name: 'file',
						formData: {
							key: type + '-' + Math.ceil(Math.random() * 999999),
							token: res.data
						},
						success: uploadFileRes => {
							if (type == 'id1') {
								that.id_positive = JSON.parse(uploadFileRes.data).key;
							} else if (type == 'id2') {
								that.id_back =  JSON.parse(uploadFileRes.data).key;
							} else if (type == 'yyzz') {
								that.business =  JSON.parse(uploadFileRes.data).key;
							}
						}
					});
				}
			});
		},
		sure() {
			var that=this;
			if (this.company_name == '') {
				this.$mUtils.toast('公司名不能为空');
				return;
			}
			if (this.address == '') {
				this.$mUtils.toast('详细地址不能为空');
				return;
			}
			if (this.region == '') {
				this.$mUtils.toast('所在地址不能为空');
				return;
			}
			if (this.id_code == '') {
				this.$mUtils.toast('身份证号不能为空');
				return;
			}
			let data = {
				name: this.name,
				sex: this.sex,
				birthday: this.birthday,
				province_id: this.province_id,
				city_id: this.city_id,
				region_id: this.region_id,
				address: this.address,
				id_positive: this.id_positive,
				id_back: this.id_back,
				id_code: this.id_code,
				content: this.content,
				image_url: this.image_url
			};

			this.$api.personalCertification(data).then(res => {
				if (res.code == 200) {
					that.$mUtils.toast(res.msg);
					that.$mUtils.timeout(() => {
						that.$mRouter.switchTab({
							route: that.$mRoutesConfig.mine
						});
					});
				} else {
					that.$mUtils.toast(res.msg);
				}
			});
		},
		redio(e) {
			this.xz = e;
			if (this.xz == 0) {
				this.sex = '男';
			} else {
				this.sex = '女';
			}
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
		handleGetRegion(region) {
			this.region = region;
			this.province_id = this.region[0].code + '0000';
			this.city_id = this.region[1].code + '00';
			this.region_id = this.region[2].code;
			console.log('regionregionregion', region);
		},
		btnConfirm(e) {
			this.timekey = e.key;
			this.birthday = e.value;
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

			.three {
				border-bottom: 1px solid #fafafa;
				padding-bottom: 10px;
				image {
					width: 200upx;
					height: 200upx;
				}
				.tp_sc {
					display: flex;
					margin-top: 10px;
					flex-wrap: wrap;

					.imglist {
						position: relative;
						image {
							width: 200upx;
							height: 200upx;
						}
						.close {
							position: absolute;
							right: 5px;
							top: 5px;
							width: 30upx;
							height: 30upx;
							z-index: 9999;
						}
					}
				}
			}
			.four {
				border-bottom: 1px solid #fafafa;
				padding-bottom: 10px;
				margin-bottom: 10px;
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
		margin-top: 20px;
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
				video {
					width: 100%;
					height: 100%;
				}
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
					margin-right: 20px;
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
				justify-content: space-around;
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
