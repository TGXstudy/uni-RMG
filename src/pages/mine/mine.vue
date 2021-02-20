<template>
	<view class="mine">
		<!-- 头部 -->
		<view class="header" @tap="$mUtils.goPage('set_info')">
			<view class="left">
				<view class="one"><image :src="userinfo.avatar" mode=""></image></view>
				<view class="two">
					<p>{{ userinfo.user_nickname == '' ? userinfo.mobile : userinfo.user_nickname }}</p>
					<text>ID:{{ userinfo.id }}</text>
				</view>
				<view class="three">
					<image v-if="userinfo.user_authentication == 1 " :src="'/mine/qyrz.png' | imgUrl" mode=""></image>
					<image v-if="userinfo.user_authentication == 2 " :src="'/mine/grrz.png' | imgUrl" mode=""></image>
				</view>
			</view>
			<view class="right"><image :src="'/mine/jt.png' | imgUrl" mode=""></image></view>
		</view>
		<!-- vip -->
		<view class="vip">
			<view class="banner">
				<image v-if="userinfo.vip_status == 0" :src="'/mine/buy_vip.png' | imgUrl" mode=""></image>
				<image v-if="userinfo.vip_status == 1" :src="'/mine/buy_vip2.png' | imgUrl" mode=""></image>
				<button v-if="userinfo.vip_status == 0" @tap="$mUtils.goPage('vip')">购买会员</button>
				<button v-if="userinfo.vip_status == 1" @tap="$mUtils.goPage('vip')">续费会员</button>
			</view>
		</view>
		<!-- list -->
		<view class="list">
			<view class="banner">
				<view class="box" @tap="yhrz()">
					<image :src="'/mine/mine_auth.png' | imgUrl" mode=""></image>
					<p>用户认证</p>
				</view>
				<view class="box" @tap="$mUtils.goPage('wallet')">
					<image :src="'/mine/mine_wallet.png' | imgUrl" mode=""></image>
					<p>我的钱包</p>
				</view>
				<view class="box" @tap="qydl()">
					<image :src="'/mine/mine_region.png' | imgUrl" mode=""></image>
					<p>区域代理</p>
				</view>
				<view class="box" @tap="pxjj()">
					<image :src="'/mine/mine_train.png' | imgUrl" mode=""></image>
					<p>培训机构</p>
				</view>
				<view class="box" @tap="$mUtils.goPage('code')">
					<image :src="'/mine/mine_tj.png' | imgUrl" mode=""></image>
					<p>推荐码</p>
				</view>
				<view class="box" @tap="$mUtils.goPage('myfriends')">
					<image :src="'/mine/mine_friend.png' | imgUrl" mode=""></image>
					<p>我的好友</p>
				</view>
				<view class="box" @tap="$mUtils.goPage('insurance')">
					<image :src="'/mine/mine_bx.png' | imgUrl" mode=""></image>
					<p>购买保险</p>
				</view>
				<view class="box" @tap="fb()">
					<image :src="'/mine/mine_fb.png' | imgUrl" mode=""></image>
					<p>发布</p>
				</view>
			</view>
		</view>
		<!-- bottom -->
		<view class="bottom">
			<view class="banner">
				<view class="box" @tap="$mUtils.goPage('connect')">
					<view class="left">
						<image :src="'/mine/lxjl.png' | imgUrl" mode=""></image>
						<p>联系记录</p>
					</view>
					<view class="right"><image :src="'/mine/jt.png' | imgUrl" mode=""></image></view>
				</view>
				<view class="box" @tap="$mUtils.goPage('message')">
					<view class="left">
						<image :src="'/mine/xtxx.png' | imgUrl" mode=""></image>
						<p>系统消息</p>
					</view>
					<view class="right"><image :src="'/mine/jt.png' | imgUrl" mode=""></image></view>
				</view>
				<view class="box" @tap="$mUtils.goPage('customer')">
					<view class="left">
						<image :src="'/mine/kfzx.png' | imgUrl" mode=""></image>
						<p>客服中心</p>
					</view>
					<view class="right"><image :src="'/mine/jt.png' | imgUrl" mode=""></image></view>
				</view>
				<view class="box" @tap="$mUtils.goPage('set')">
					<view class="left">
						<image :src="'/mine/sz.png' | imgUrl" mode=""></image>
						<p>设置</p>
					</view>
					<view class="right"><image :src="'/mine/jt.png' | imgUrl" mode=""></image></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userinfo: {},
			rzxq: {},
			pxxq: {},
			rzstatus:'',
		};
	},
	 onShow() {
		 this.getinfo();
		 this.rz();
		 this.px_detail();
		 this.dlzt();
	},
	methods: {
		fb() {
			this.$mRouter.switchTab({
				route: this.$mRoutesConfig.issue
			});
		},
		//区域代理
		qydl(){
			if(this.rzstatus==0){
				this.$mRouter.push({
					route: this.$mRoutesConfig.audit,
				});
			}else if(this.rzstatus==1){
				this.$mRouter.push({
					route: this.$mRoutesConfig.agency_award
				});
			}else if(this.rzstatus==2){
				this.$mRouter.push({
					route: this.$mRoutesConfig.agency_refuse
				});
			}else if(this.rzstatus==3){
				this.$mRouter.push({
					route: this.$mRoutesConfig.apply_agency
				});
			}
		},
		//培训机构
		pxjj() {
			if (this.pxxq == null) {
				this.$mRouter.push({
					route: this.$mRoutesConfig.apply_train
				});
			} else if (this.pxxq.status == 0) {
				this.$mRouter.push({
					route: this.$mRoutesConfig.train_audit,
				});
			} else if (this.pxxq.status == 1) {
				this.$mRouter.push({
					route: this.$mRoutesConfig.train_agree
				});
			} else if (this.pxxq.status == 2) {
				this.$mRouter.push({
					route: this.$mRoutesConfig.train_refuse
				});
			}else if(this.pxxq.status == 3){
				this.$mRouter.push({
					route: this.$mRoutesConfig.apply_train
				});
			}
		},
		//用户认证
		yhrz() {
			if (this.userinfo.user_authentication == 0) {
				this.$mRouter.push({
					route: this.$mRoutesConfig.user_auth
				});
			} else if (this.rzxq.status == 0) {
				this.$mRouter.push({
					route: this.$mRoutesConfig.audit
				});
			} else if (this.rzxq.status == 2) {
				this.$mRouter.push({
					route: this.$mRoutesConfig.audit_refuse
				});
			} else if (this.userinfo.user_authentication == 1 && this.rzxq.status == 1) {
				this.$mRouter.push({
					route: this.$mRoutesConfig.company_agree
				});
			} else if (this.userinfo.user_authentication == 2 && this.rzxq.status == 1) {
				this.$mRouter.push({
					route: this.$mRoutesConfig.person_agree
				});
			}
		},
		getinfo() {
			this.$api.userInfo().then(res => {
				this.userinfo = res.data;
			});
		},
		//培训详情
		px_detail() {
			this.$api.organDetail().then(res => {
				this.pxxq = res.data;
			});
		},
		//认证详情
		rz() {
			this.$api.certificationDetail().then(res => {
				this.rzxq = res.data;
			});
		},
		//认证状态
		dlzt(){
			this.$api.agencyStatus().then(res => {
				this.rzstatus=res.data.status;
				console.log(res,'ressss')
				//this.rzxq = res.data;
			});
		}
	}
};
</script>

<style lang="scss">
.mine {
	background: #ffffff;
	width: 100%;
	padding-top: 30px;
	.bottom {
		width: 100%;
		display: flex;
		flex-direction: column;
		margin-top: 20px;
		margin-bottom: 20px;
		.banner {
			width: 95%;
			margin: 0 auto;
			.box {
				width: 100%;
				height: 45px;
				border-bottom: 1px solid #fafafa;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left {
					display: flex;
					image {
						width: 20px;
						height: 20px;
					}
					p {
						margin-left: 10px;
						font-size: 14px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #333333;
					}
				}
				.right {
					image {
						width: 16px;
						height: 16px;
					}
				}
			}
		}
	}
	.list {
		width: 100%;
		margin-top: 20px;
		.banner {
			width: 100%;
			margin: 0 auto;
			display: flex;
			flex-wrap: wrap;
			.box {
				margin-top: 15px;
				width: 25%;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;
				image {
					width: 32px;
					height: 32px;
				}
				p {
					margin-top: 5px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					font-size: 12px;
					color: #666666;
				}
			}
		}
	}
	.vip {
		width: 100%;
		height: 160rpx;
		margin-top: 20px;
		.banner {
			width: 95%;
			height: 160rpx;
			margin: 0 auto;
			position: relative;
			button {
				position: absolute;
				right: 10px;
				top: 30%;
				width: 77px;
				height: 24px;
				background: #ffb30d;
				border-radius: 15px;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #ffffff;
				font-size: 12px;
			}
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.header {
		margin-top: 10px;
		width: 95%;
		height: 70px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
			display: flex;
			.one {
				margin-left: 10px;
				margin-right: 20px;
				image {
					border-radius: 50%;
					width: 70px;
					height: 70px;
				}
			}
			.two {
				margin-right: 20px;
				margin-top: 10px;
				p {
					font-size: 18px;
					color: #333333;
				}
				text {
					font-size: 12px;
					color: #666666;
				}
			}
			.three {
				margin-top: 10px;
				image {
					width: 59px;
					height: 16px;
				}
			}
		}
		.right {
			image {
				width: 16px;
				height: 16px;
			}
		}
	}
}
</style>
