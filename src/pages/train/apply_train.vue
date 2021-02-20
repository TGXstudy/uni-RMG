<template>
	<view class="company">
		<!-- 模块一 -->
		<view class="first">
			<view class="banner">
				<view class="two font_auth_size">
					机构名称
					<input type="text" v-model="name" placeholder="请输入机构名称"  />
				</view>
				<view class="three ">
					<view class="top font_auth_size">
						机构logo
					</view>
					<view class="bottom" @click="logo_sc()">
						<image v-if="logo_url" :src="logo_url" mode=""></image>
						<image v-if="logo_url.length < 1" :src="'/mine/auth/upload.png' | imgUrl" mode=""></image>
					</view>
				</view>
				<view class="four">
					<view class="four_left font_auth_size">
						企业地址
					</view>
					<view class="four_right font_auth_size">
						<pick-regions class="nrr" :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
							<span class='djj' v-if="!regionName">请选择</span>
							<span>{{regionName}} </span>
						</pick-regions>
					</view>
					<image :src="'/mine/jt.png' | _imgUrl"  mode=""></image>
				</view>
				<view class="two font_auth_size">
					详细地址
					<input type="text" v-model="address" placeholder="请输入详细地址"   />
				</view>
				<view class="two font_auth_size">
					联系电话
					<input type="text" v-model="mobile" placeholder="请输入联系电话"  />
				</view>
			</view>
		</view>
		<!-- 模块二 -->
		<view class="second">
			<view class="banner">
				<view class="two font_auth_size">
					负责人
					<input type="text" v-model="legal_name" placeholder="请输入负责人（法人）姓名"  />
				</view>
				<view class="three">
					<view class="top font_auth_size">
						负责人身份证
					</view>
					<view class="bottom">
						<image v-if="id_positive.length < 1" @click="id1_sc()" :src="'/mine/auth/sfz2.png' | imgUrl" mode=""></image>
						<image v-else @click="id1_sc()" :src="id_positive" mode=""></image>
						<image v-if="id_back.length < 1" @click="id2_sc()" :src="'/mine/auth/sfz1.png' | imgUrl" mode=""></image>
						<image v-else @click="id2_sc()" :src="id_back" mode=""></image>
					</view>
				</view>
				<view class="four font_auth_size">
					身份证号
					<input type="text" v-model="id_code" placeholder="请输入身份证号码"   />
				</view>
			</view>
		</view>
		<!-- 模块三 -->
		<view class="third">
			<view class="banner">
				<view class="three">
					<view class="top font_auth_size">
						营业执照
					</view>
					<view class="bottom">
						<image v-if="business.length < 1" @click="yyzz_sc()" :src="'/mine/auth/upload.png' | imgUrl" mode=""></image>
						<image v-else @click="yyzz_sc()" :src="business" mode=""></image>
					</view>
				</view>
				<view class="four">
					<view class="top font_auth_size">
						申请说明
					</view>
					<textarea value="" v-model="remark" class="font_auth_size" placeholder="请输入申请说明" />
				</view>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="forth">
			<view class="banner">
				<view class="qx base_center">
					取消
				</view>
				<view @tap="sure()"  class="qd base_center">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import pickRegions from '@/components/pick-regions/pick-regions.vue'
export default {
	components: {
		pickRegions
	},
	data() {
		return {
			imgUrl: 'http://qnb9280ta.hn-bkt.clouddn.com/',
			defaultRegionCode: '440113',
			region: [],
			name:'',//机构名称
			logo_url:'',//logo路径
			province_id:'',//省code
			city_id:'',//市code
			region_id:'',//区code
			address:'',//详细地址
			mobile:'',//联系电话
			id_positive:'',//身份证正面
			id_back:'',//身份证反面
			id_code:'',//身份证号码
			business:'',//营业执照
			legal_name:'',//法人姓名
			remark:''//申请说明
			
		};
	},
	methods:{
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
							 if (type == 'logo') {
								that.logo_url = that.imgUrl + JSON.parse(uploadFileRes.data).key;
								
							} else if (type == 'id1') {
								that.id_positive = that.imgUrl + JSON.parse(uploadFileRes.data).key;
							} else if (type == 'id2') {
								that.id_back = that.imgUrl + JSON.parse(uploadFileRes.data).key;
							} else if (type == 'yyzz') {
								that.business = that.imgUrl + JSON.parse(uploadFileRes.data).key;
							}
						}
					});
				}
			});
		},
		sure(){
			var that=this;
			if (this.legal_name == '') {
				this.$mUtils.toast('法人姓名不能为空');
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
				legal_name: this.legal_name,
				logo_url: this.logo_url,
				region_id: this.region_id,
				address: this.address,
				name: this.name,
				id_positive:this.id_positive,
				id_back: this.id_back,
				id_code: this.id_code,
				business: this.business,
				mobile:this.mobile,
				remark:this.remark
			};
			this.$api.organApply(data).then(res => {
				console.log(res);
				if (res.code == 200) {
					this.$mUtils.toast(res.msg);
					this.$mUtils.timeout(() => {
						that.$mRouter.switchTab({
							route: that.$mRoutesConfig.mine
						});
					});
				} else {
					this.$mUtils.toast(res.msg);
				}
			});
		},
		handleGetRegion(region) {
			this.region = region
			this.region_id = this.region[0].code;
			console.log('regionregionregion', region)
		},
	},
	computed: {
		regionName() {
			// 转为字符串
			return this.region.map(item => item.name).join(' ')
		}
	},
};
</script>

<style lang="scss" scoped>
.company {
	background: #f9f9f9;
	width: 100%;
	.forth{
		padding-top: 30px;
		padding-bottom: 50px;
		width: 100%;
		background-color: #ffffff;
		.banner{
			width: 95%;
			margin: 0 auto;
			padding-top: 10px;
			display: flex;
			justify-content: flex-end;
			.qx{
				width: 127px;
				height: 44px;
				background: #FFFFFF;
				border-radius: 22px;
				border: 1px solid #F9F9F9;
				font-size: 16px;
				font-family: PingFangSC-Regular, PingFang SC;
				color: #666666;
			}
			.qd{
				margin-left: 10px;
				width: 127px;
				height: 44px;
				background: #0067DF;
				border-radius: 22px;
				border: 1px solid #F9F9F9;
				font-size: 16px;
				font-family: PingFangSC-Regular, PingFang SC;
				color: #FFFFFF;
			}
		}
	}
	.third{
		width: 100%;
		background-color: #ffffff;
		margin-top: 10px;
		.banner{
			width: 95%;
			margin: 0 auto;
			padding-top: 10px;
			
			.three{
				border-bottom: 1px solid #FAFAFA;
				padding-bottom: 10px;
				image{
					margin-top: 5px;
					width: 90px;
					height: 90px;
				}
			}
			.four{
				margin-top: 10px;
				border-bottom: 1px solid #FAFAFA;
				padding-bottom: 10px;
				textarea{
					padding-top: 5px;
					width: 100%;
					height: 150px;
					background: #F9F9F9;
					border-radius: 8px;
				}
			}
		}
	}	
	.second{
		width: 100%;
		background-color: #ffffff;
		margin-top: 10px;
		.banner{
			width: 95%;
			margin: 0 auto;
			padding-top: 10px;
			.two {
				display: flex;
				border-bottom: 1px solid #FAFAFA;
				padding-bottom: 10px;
				margin-bottom: 10px;
				input {
					width: 60%;
					margin-left: 10px;
					font-size: 14px;
				}
			}
			.four{
				display: flex;
				padding-bottom: 10px;
				margin-bottom: 10px;
				input {
					width: 60%;
					margin-left: 10px;
					font-size: 14px;
				}
			}
			.three{
				width: 100%;
				border-bottom: 1px solid #FAFAFA;
				padding-bottom: 10px;
				margin-bottom: 10px;
				.bottom{
					margin-top: 10px;
					width: 100%;
					display: flex;
					justify-content: space-between;
					image{
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
				video{
					width: 100%;
					height: 100%;
				}
			}
			.two {
				display: flex;
				border-bottom: 1px solid #FAFAFA;
				padding-bottom: 10px;
				margin-bottom: 10px;
				input {
					margin-left: 10px;
					font-size: 14px;
				}
			}
			.three{
				border-bottom: 1px solid #FAFAFA;
				padding-bottom: 10px;
				margin-bottom: 10px;
				image{
					margin-top: 5px;
					width: 90px;
					height: 90px;
				}
			}
			.four{
				width: 100%;
				border-bottom: 1px solid #FAFAFA;
				padding-bottom: 10px;
				margin-bottom: 10px;
				display: flex;
				align-items: center;
				.four_right{
					width: 76%;
					margin-left: 10px;
				}
				image{
					margin-left: auto;
					width: 16px;
					height: 16px;
				}
			}
		}
	}
}
</style>
