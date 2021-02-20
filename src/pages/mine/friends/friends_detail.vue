<template>
	<view class="detail">
		<view class="top">
			<image class="friends" src="../../../static/imgs/mine/friends_banner.png" mode=""></image>
			<view class="banner">
				<view class="first">
					<image class="user" :src="xfxx.avatar" mode=""></image>
					<text>{{xfxx.user_nickname}}</text>
				</view>
				<view class="second">
					<text>共消费 ￥{{xfxx.consume}}</text>
					<text>总收益 ￥{{xfxx.total_profit}}</text>
				</view>
			</view>
		</view>
		<view class="check_time">
			<view class="banner">
				<view class="title">选择查询时间</view>
				<view class="nav">
					<view class="left">
						<picker class="picker" mode="date" :value="date" @change="bindDateChange">
							<view class="date">{{ date }}</view>
						</picker>
						<view class="gang">-</view>
						<picker class="picker" mode="date" :value="date1" @change="bindDateChange1">
							<view class="date">{{ date1 }}</view>
						</picker>
					</view>
					<view class="right" @tap="cx()">查询</view>
				</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="list">
			<view class="banner">
				<view class="title">
					<view>时间</view>
					<view>消费</view>
					<view>收益</view>
				</view>
				<view class="nav">
					<view class="box"  v-for="(item,index) in xf_list" :key="index" >
						<view>{{item.create_time}}</view>
						<view class="jg">￥{{item.order_amount}}</view>
						<view class="jg">￥{{item.amount}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			date: '',
			date1: '',
			id: '',
			xfxx:{},
			xf_list:[]
		};
	},
	onLoad(options) {
		let date = new Date();
		let today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		this.date = today;
		this.date1 = today;
		this.id = options.id;
		this.cx();
	},
	methods: {
		cx() {
			this.$api
				.friendConsume({
					user_id: this.id,
					page: 1,
					pageSize: 100,
					start: this.date,
					end: this.date1
				})
				.then(res => {
					console.log(res,'好友吗明细')
					this.xfxx=res.data;
					this.xf_list = res.data.data;
				});
		},
		bindDateChange: function(e) {
			this.date = e.target.value;
			console.log(this.date)
		},
		bindDateChange1: function(e) {
			this.date1 = e.target.value;
			console.log(this.date1)
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		}
	}
};
</script>

<style lang="scss" scoped>
.detail {
	background: #f9f9f9;
	width: 100%;
	.list {
		margin-top: 10px;
		width: 100%;
		background-color: #ffffff;
		.banner {
			width: 95%;
			margin: 0 auto;
			.title {
				width: 100%;
				height: 40px;
				display: flex;
				justify-content: space-around;
				align-items: center;
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
				border-bottom: 1px solid #fafafa;
			}
			.nav {
				width: 100%;
				.box {
					width: 100%;
					height: 60px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
					.jg {
						margin-right: 50px;
					}
				}
			}
		}
	}
	.check_time {
		background-color: #ffffff;
		height: 130px;
		.banner {
			width: 95%;
			margin: 0 auto;
			padding-top: 20px;
			.nav {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 30px;
				margin-bottom: 10px;
				font-size: 14px;
				color: #333333;
				.gang {
					margin-right: 30px;
				}
				.left {
					display: flex;
					picker {
						margin-right: 30px;
					}
				}
				.right {
					font-size: 14px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #0067df;
					margin-right: 20px;
				}
			}
			.title {
				font-size: 16px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #333333;
			}
		}
	}
	.top {
		height: 130px;
		width: 100%;
		position: relative;
		// background-image: url(../../../static/mine/friends_banner.png);
		background-size: 100% 100%;
		.friends {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.banner {
			width: 100%;
			margin: 0 auto;

			.first {
				position: absolute;
				z-index: 999;
				display: flex;
				align-items: center;
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #ffffff;
				padding: 10px;
				.user {
					width: 40px;
					height: 40px;
					margin-right: 10px;
					border-radius: 50%;
				}
			}
			.second {
				z-index: 999;
				width: 100%;
				height: 50px;
				background: #005ecc;
				position: absolute;
				bottom: 0;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				text {
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #ffffff;
					margin-right: 20px;
				}
			}
		}
	}
}
</style>
