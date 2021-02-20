<template>
	<view class="company">
		<!-- 模块一 -->
		<view class="first">
			<view class="banner">
				<view class="one">
					<video   id="myVideo" :src="gg" controls ></video>
				</view>
				<view class="two font_auth_size">
					企业名称
					<input type="text" v-model="company_name" placeholder="请输入企业名称" />
				</view>
				<view class="three ">
					<view class="top font_auth_size">企业logo</view>
					<view class="bottom" @click="logo_sc()">
						<image v-if="logo_url" :src="imgUrl+logo_url" mode=""></image>
						<image v-if="logo_url.length < 1" :src="'/mine/auth/upload.png' | _imgUrl" mode=""></image>
					</view>
				</view>
				<view class="four">
					<view class="four_left font_auth_size">企业地址</view>
					<view class="four_right font_auth_size">
						<pick-regions class="nrr" :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
							<span class="djj" v-if="!regionName">请选择</span>
							<span>{{ regionName }}</span>
						</pick-regions>
					</view>
					<image :src="'/mine/jt.png' | _imgUrl" mode=""></image>
				</view>
				<view class="two font_auth_size">
					详细地址
					<input type="text" v-model="address" placeholder="请输入详细地址" />
				</view>
			</view>
		</view>
		<!-- 模块二 -->
		<view class="second">
			<view class="banner">
				<view class="two font_auth_size">
					负责人
					<input type="text" v-model="name" placeholder="请输入负责人姓名" />
				</view>
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
				<view class="three">
					<view class="top font_auth_size">营业执照</view>
					<view class="bottom">
						<image v-if="business.length < 1" @click="yyzz_sc()" :src="'/mine/auth/upload.png' | _imgUrl" mode=""></image>
						<image v-else @click="yyzz_sc()" :src="imgUrl+business" mode=""></image>
					</view>
				</view>
				<view class="four">
					<view class="top font_auth_size">企业简介</view>
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
				<view class="three" >
					<view class="top font_auth_size">视频（选填最大50M，最多两个）</view>
					<view class="tp_sc">
						<image @tap="sc_video()" :src="'/mine/auth/upload.png' | _imgUrl" mode=""></image>
						<view class="imglist" v-for="(item, index) in video_url" :key="item">
							<image @tap="delivdeo(item, index)" class="close" :src="'/mine/auth/close.png' | _imgUrl" mode=""></image>
							<video :src="imgUrl+item"  :key="index" controls></video>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="forth">
			<view class="banner">
				<view class="qx base_center" @tap="qx()">取消</view>
				<view @tap="sure()" class="qd base_center">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
import pickRegions from '@/components/pick-regions/pick-regions.vue';
export default {
	components: {
		pickRegions
	},
	data() {
		return {
			imgUrl: 'https://qiniu.renmingong.com/',
			defaultRegionCode: '440113',
			region: [],
			company_name: '', //公司名称
			logo_url: '', //logo路径
			province_id: '', //省code
			city_id: '', //市code
			region_id: '', //区code
			address: '', //详细地址
			name: '', //负责人姓名
			id_positive: '', //身份证正面
			id_back: '', //身份证反面
			id_code: '', //身份证号码
			business: '', //营业执照
			content: '', //公司简介
			image_url: [], //图片url
			video_url: [], //视频url
			gg:"",
			max:0,
		};
	},
	onLoad() {
		this.getgg()
	},
	methods: {
		qx(){
			 this.$mRouter.back();
		},
		getgg(){
			this.$api.video({
				type:1
			}).then(res=>{
				this.gg=res.data.url
				console.log(res,'gg')
			})
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
							if (type == 'video') {
								if(that.video_url.length>1){
									that.$mUtils.toast('最多上传2个视频!');
									return
								}
								console.log(that.video_url.length,'sdsdsdsdsdsd')
								that.video_url.push(JSON.parse(uploadFileRes.data).key);
							} else if (type == 'logo') {
								that.logo_url = JSON.parse(uploadFileRes.data).key;
								
							} else if (type == 'id1') {
								that.id_positive = JSON.parse(uploadFileRes.data).key;
							} else if (type == 'id2') {
								that.id_back =  JSON.parse(uploadFileRes.data).key;
							} else if (type == 'yyzz') {
								that.business = JSON.parse(uploadFileRes.data).key;
							}
						}
					});
				}
			});
		},
		//删除图片
		delImage(item, idx) {
			this.image_url.splice(idx, 1);
		},
		//删除视频
		delivdeo(item, idx){
			this.video_url.splice(idx, 1);
		},
		//图片上传
		img_sc() {
			let that=this;
			uni.chooseImage({
				success: chooseImageRes => {
					const tempFilePaths = chooseImageRes.tempFilePaths;
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
										console.log(this.image_url,'image_url')
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
		//营业执照上传
		yyzz_sc() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				success: data => {
					this.urlTobase64(data.tempFilePaths[0], 'yyzz');
				}
			});
		},
		//企业logo
		logo_sc() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				success: data => {
					this.urlTobase64(data.tempFilePaths[0], 'logo');
				}
			});
		},
		//视频上传
		sc_video() {
			let that = this;
			uni.chooseVideo({
				count: 1,
				sourceType: ['album'],
				success: function(res) {
					self.src = res.tempFilePath;
					that.urlTobase64(res.tempFilePath, 'video');
				}
			});
		},
		sure() {
			var that=this;
			if (this.company_name == '') {
				this.$mUtils.toast('公司名不能为空');
				return;
			}
			if (this.name == '') {
				this.$mUtils.toast('负责人姓名不能为空');
				return;
			}
			if (this.region == '') {
				this.$mUtils.toast('企业地址不能为空');
				return;
			}
			if (this.id_code == '') {
				this.$mUtils.toast('身份证号不能为空');
				return;
			}
			let data = {
				company_name: this.company_name,
				logo_url: this.logo_url,
				province_id:this.province_id,
				city_id:this.city_id,
				region_id: this.region_id,
				address: this.address,
				name: this.name,
				id_positive: this.id_positive,
				id_back: this.id_back,
				id_code: this.id_code,
				business: this.business,
				content: this.content,
				image_url: this.image_url,
				video_url: this.video_url
			};
			this.$api.companyCertification(data).then(res => {
				console.log(res);
				if (res.code == 200) {
					that.$mUtils.toast(res.msg);
					that.$mUtils.timeout(() => {
						that.$mUtils.timeout(() => {
							that.$mRouter.switchTab({
								route: that.$mRoutesConfig.mine
							});
						});
					});
				} else {
					that.$mUtils.toast(res.msg);
				}
			});
		},
		handleGetRegion(region) {
			this.region = region;
			this.province_id=this.region[0].code+'0000';
			this.city_id=this.region[1].code+'00';
			this.region_id = this.region[2].code;
			console.log('regionregionregion', region);
		}
	},
	computed: {
		regionName() {
			// 转为字符串
			return this.region.map(item => item.name).join(' ');
		}
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
				video {
					margin-top: 5px;
					width: 90px;
					height: 90px;
				}
				image {
					width: 200upx;
					height: 200upx;
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
					width: 65%;
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
					margin-left: 10px;
					font-size: 14px;
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
