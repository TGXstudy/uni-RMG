<template>
	<view class="wallet">
		<view class="banner">
			<view class="top">
				<image :src="'/mine/wallet.png' | _imgUrl" mode=""></image>
				<view class="one">{{ balance }}</view>
				<view class="two">余额(元)</view>
				<view class="three">
					<view class="cz" @tap="$mUtils.goPage('recharge')">充值</view>
					<view class="tx" @tap="$mUtils.goPage('deposit')">提现</view>
				</view>
			</view>
			<view class="topp">
				<view class="titles" :class="[currenStatus == item.status ? 'cur-title' : '']" @tap="changeStatus(item)" v-for="(item, index) in statusList" :key="index">
					{{ item.ext }}
				</view>
			</view>
			<wallet v-if="currenStatus == 0" v-for="(item, idx) in orderList" :key="idx" :item="item"></wallet>
			<zc v-if="currenStatus == 1" v-for="(item, idx) in orderList" :key="idx" :item="item"></zc>

			<!-- <no-more v-if="currenStatus == 0" class="width-100-per" :visible="nomore"></no-more>
			<load-more v-if="currenStatus == 0" class="width-100-per" :visible="loading"></load-more>
			
			<no-more v-if="currenStatus == 1" class="width-100-per" :visible="nomore"></no-more>
			<load-more v-if="currenStatus == 1" class="width-100-per" :visible="loading"></load-more> -->
		</view>
	</view>
</template>

<script>
import wallet from '@/components/mine/my_wallet.vue';
import zc from '@/components/mine/my_zc.vue';
import noMore from '@/components/index/NoMore.vue';
import loadMore from '@/components/index/LoadMore.vue';
export default {
	components: {
		wallet,
		zc,
		noMore,
		loadMore
	},
	data() {
		return {
			nomore: true,
			loading: false,
			currenStatus: 0, //分类
			page1: 1,
			page2: 1,
			orderList: [], //列表
			nomore: true,
			loading: false,
			balance: '', //余额
			statusList: [
				{
					status: 0,
					ext: '收支明细'
				},
				{
					status: 1,
					ext: '提现记录'
				}
			]
		};
	},
	onReachBottom() {
		if (this.currenStatus == 0) {
			if (this.nomore) return;
			console.log('上拉加载更多....');
			this.page1++;
			this.getfriends();
		} else if (this.currenStatus == 1) {
			if (this.nomore) return;
			console.log('上拉加载更多....');
			this.page2++;
			this.tx();
		}
	},
	onShow() {
		this.currenStatus = 0;
		this.getfriends();
		//this.tx()
	},
	methods: {
		tx() {
			this.$api
				.cashRecord({
					page: this.page2,
					limit: 10
				})
				.then(res => {
					console.log(res, 'sfg');
					if (res.code == 200) {
						if (this.page2 == 1) {
							this.orderList = res.data.data;
						} else {
							this.orderList = this.orderList.concat(res.data.data);
						}
						this.nomore = res.data.last_page <= this.page2;
					} else {
						console.log('获取拼团商品', res);
					}
					//this.orderList=res.data.data;
				});
		},
		getfriends() {
			this.$api
				.myWallet({
					page: this.page1,
					limit: 10
				})
				.then(res => {
					//console.log(res, 'sfg');
					if (res.code == 200) {
						if (this.page1 == 1) {
							this.orderList = res.data.data;
							this.balance = res.data.balance;
						} else {
							this.orderList = this.orderList.concat(res.data.data);
						}
						this.nomore = res.data.last_page <= this.page1;
					} else {
						console.log('获取拼团商品', res);
					}
					//this.orderList=res.data.data;
				});
		},
		changeStatus(item) {
			this.currenStatus = item.status;
			if (item.status == 0) {
				console.log(11);
				this.getfriends();
			} else if (item.status == 1) {
				console.log(22);
				this.tx();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.wallet {
	width: 100%;
	.banner {
		width: 95%;
		margin: 0 auto;
		.cur-title {
			border-bottom: 5upx solid #014fc9;
		}
		.topp {
			background-color: #ffffff;
			.titles {
				padding-bottom: 10px;
				font-size: 30upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #333333;
			}

			height: 70px;
			display: flex;
			justify-content: space-around;
			align-items: center;
		}
		.top {
			width: 100%;
			height: 130px;
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			.one {
				font-size: 24px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #ffffff;
				margin-top: 20px;
			}
			.two {
				font-size: 12px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #ffffff;
				margin-top: 10px;
			}
			.three {
				display: flex;
				font-size: 12px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #ffffff;
				margin-top: 10px;
				view {
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.cz {
					width: 56px;
					height: 24px;
					background: #0041a7;
					border-radius: 17px;
					margin-right: 20px;
				}
				.tx {
					width: 56px;
					height: 24px;
					background: #014fc9;
					border-radius: 17px;
				}
			}
			image {
				width: 100%;
				height: 130px;
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
			}
		}
	}
}
</style>
