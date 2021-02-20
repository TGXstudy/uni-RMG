<template>
	<view class="info">
		<view class="banner">
			<view class="one">
				<view class="banner">
					<view class="tx" @click="addImg()">
						<image v-if="!newurl" :src="userinfo.avatar" mode=""></image>
						<image v-if="newurl" :src="imgUrl + newurl" mode=""></image>
						<text>更换头像</text>
					</view>
					<view class="name">
						<text class="">昵称</text>
						<input type="text" v-model="name" placeholder="请输入昵称" value="" />
					</view>
					<view class="name2">
						<text class="">推荐人</text>
						<input type="text" v-bind:disabled="disabled" v-model="tjr" placeholder="请输入推荐人" value="" />
					</view>
				</view>
			</view>
			<view class="two">
				<view class="banner">
					<view class="name2">
						<text class="">推荐码</text>
						<text class="">{{ userinfo.invite_code }}</text>
					</view>
					<view class="name2">
						<text class="">账号ID</text>
						<text class="">{{ userinfo.id }}</text>
					</view>
				</view>
			</view>
			<button @tap="bc()">保存</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			disabled: false, //输入框禁用
			imgUrl: 'https://qiniu.renmingong.com/',
			userinfo: {},
			name: '',
			tjr: '',
			data: {
				ser_content: '',
				ser_img: []
			},
			newurl: ''
		};
	},
	onLoad() {
		this.getinfo();
	},
	methods: {
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
							//that.userinfo.avatar=that.imgUrl + JSON.parse(uploadFileRes.data).key;
							that.newurl = JSON.parse(uploadFileRes.data).key;
							console.log(that.newurl);
						}
					});
				}
			});
		},
		addImg: async function() {
			var that = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				success: data => {
					console.log(data.tempFilePaths[0], 'release');
					that.urlTobase64(data.tempFilePaths[0], 'release');
				}
			});
		},
		getinfo() {
			this.$api.userInfo().then(res => {
				this.userinfo = res.data;
				this.compressPath = res.data.avatar;
				this.name = res.data.user_nickname;
				this.tjr = res.data.recommend || '';
				this.$mUtils.timeout(res => {
					if (this.tjr) {
						this.disabled = true;
					} else {
						this.disabled = false;
					}
				});
			});
		},
		bc() {
			if (!this.newurl) {
				this.newurl = this.userinfo.avatar;
			} else {
				this.newurl = this.newurl;
			}
			this.$api
				.editUser({
					avatar: this.newurl,
					nick_name: this.name,
					code: this.tjr
				})
				.then(res => {
					console.log(res);
					if (res.code == 200) {
						this.$mUtils.toast(res.msg);
						this.$mUtils.timeout(() => {
							this.$mRouter.back();
						});
					} else {
						this.$mUtils.toast(res.msg);
					}
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.info {
	width: 100%;
	background: #f9f9f9;
	input::-webkit-input-placeholder {
		color: #ccc;
	}
	input::-moz-input-placeholder {
		color: #ccc;
	}
	input::-ms-input-placeholder {
		color: #ccc;
	}
	button {
		margin-top: 120rpx;
		width: 702rpx;
		height: 88rpx;
		border-radius: 44rpx;
		background: #0067df;
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #ffffff;
	}
	.two {
		margin-top: 20px;
		background-color: #fff;
		width: 100%;
		.banner {
			width: 95%;
			margin: 0 auto;
			.name2 {
				width: 100%;
				height: 100rpx;
				display: flex;
				align-items: center;
				border-bottom: 1px solid #fafafa;
				text {
					font-size: 28rpx;
					margin-right: 30rpx;
				}
				input {
					font-size: 28rpx;
				}
			}
		}
	}
	.one {
		background-color: #fff;
		width: 100%;
		.banner {
			width: 95%;
			margin: 0 auto;
			.tx {
				text {
					margin-top: 20rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #666666;
				}
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				width: 100%;
				height: 300rpx;
				image {
					border-radius: 50%;
					width: 140rpx;
					height: 140rpx;
				}
			}
			.name {
				width: 100%;
				height: 100rpx;
				display: flex;
				align-items: center;
				border-bottom: 1px solid #fafafa;
				text {
					font-size: 28rpx;
					margin-right: 60rpx;
				}
				input {
					font-size: 28rpx;
				}
			}
			.name2 {
				width: 100%;
				height: 100rpx;
				display: flex;
				align-items: center;
				border-bottom: 1px solid #fafafa;
				text {
					font-size: 28rpx;
					margin-right: 30rpx;
				}
				input {
					font-size: 28rpx;
				}
			}
		}
	}
}
</style>
