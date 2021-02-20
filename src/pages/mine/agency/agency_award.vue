<template>
	<view class="hy">
		<view class="top">
			<image :src="'/mine/friends_banner.png' | _imgUrl"  mode=""></image>
			<view class="left">
				<p class="one">{{userinfo.agent_level | status}}</p>
				<p class="two">{{dlxx.area}}</p>
			</view>
			<view class="middle">
				<p class="one">{{dlxx.total_profit}}</p>
				<p class="two">总收益(元)</p>
			</view>
		</view>
		<view class="bottom11">
			<view class="navv">
				<view class="box fn-sz-14 fn_cl_999">
					<view class="left">
						<image src="" mode=""></image>
						<span class="name">用户</span>
					</view>
					<view class="middle">
						<p class="middle_top"><span class="xf">消费</span></p>
					</view>
					<view class="right"><p class="right_top">收益</p></view>
				</view>
				<view class="box2 fn-sz-14 " v-for="(item,index) in rewardlist" :key="index">
					<view class="first">
						<view class="left">
							<image :src="item.avatar" mode=""></image>
							<span class="name">{{item.user_nickname}}</span>
						</view>
						<view class="middle">
							<p class="middle_top"><span class="xf">￥{{item.order_amount}}</span></p>
						</view>
						<view class="right"><p class="right_top">￥{{item.amount}}</p></view>
					</view>
					<view class="second">
						{{item.create_time}}
					</view>
				</view>
			</view>
		</view>
		<no-more class="width-100-per" :visible="nomore"></no-more>
		<load-more class="width-100-per" :visible="loading"></load-more>
	</view>
</template>
<script>
	import noMore from '@/components/index/NoMore.vue';
	import loadMore from '@/components/index/LoadMore.vue';
export default {
	components: {
		noMore,
		loadMore
	},
	data() {
		return {
			dlxx:{},//代理信息
			rewardlist:[],//收益列表
			userinfo: {},
			page: 1,
			nomore: true,
			loading: false,
		};
	},
	onReachBottom() {
		if (this.nomore) return;
		console.log('上拉加载更多....');
		this.page++;
		this.geyxx();
	},
	onLoad() {
		this.geyxx()
		this.getinfo()
	},
	methods: {
		getinfo() {
			this.$api.userInfo().then(res => {
				this.userinfo = res.data;
				console.log(this.userinfo,'userinfo')
			});
		},
		geyxx(){
			this.$api.agentReward({
				page: this.page,
				limit: 10
			}).then(res=>{
				if (res.code == 200) {
					if (this.page == 1) {
						this.rewardlist=res.data.data;
						this.dlxx=res.data;
					} else {
						this.rewardlist = this.rewardlist.concat(res.data.data);
					}
					this.nomore = res.data.last_page <= this.page;
				} else {
					console.log('获取拼团商品', res);
				}
				console.log(res,'收益信息')
			})
		}
	},
	filters:{
		status(item){
			if(item==1){
				return '省代理'
			}
			if(item==2){
				return '市代理'
			}
			if(item==3){
				return '区代理'
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.cur-title {
	.one {
		color: #fa5d09 !important;
	}
	.two {
		color: #fa5d09 !important;
	}
}
.hy {
	width: 100%;
	display: flex;
	flex-direction: column;
	background-color: #fff;
	.bottom11 {
		padding: 10px;
		display: flex;
		flex-direction: column;
		.box {
			width: 100%;
			height: 62px;
			display: flex;
			align-items: center;
			border-bottom: 1px solid #fafafa;
			.left {
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					margin-right: 10px;
					width: 30px;
					height: 30px;
				}
			}
			.middle {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				margin-left: 30px;
				height: 70px;
				margin-left: auto;
				.middle_top {
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				.bottom {
					font-size: 24upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
					padding: 0;
				}
			}
			.right {
				display: flex;
				flex-direction: column;
				margin-left: auto;
				height: 70px;
				justify-content: space-around;
			}
		}
		.box2 {
			width: 100%;
			height: 92px;
			background: #F6FAFF;
			border-radius: 0px 0px 8px 8px;
			margin-top: 10px;
			.first{
				display: flex;
				align-items: center;
				border-bottom: 1px solid #EBF4FF;
				padding-left: 10px;
				padding-right: 10px;
				span{
					color: #56687D;
				}
				p{
					color: #56687D;
				}
				.left {
					display: flex;
					justify-content: center;
					align-items: center;
					image {
						margin-right: 10px;
						width: 30px;
						height: 30px;
						border-radius: 50%;
					}
				}
				.middle {
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					margin-left: 30px;
					height: 60px;
					margin-left: auto;
					.middle_top {
						display: flex;
						flex-direction: column;
						align-items: center;
					}
					.bottom {
						font-size: 24upx;
						font-family: PingFang SC;
						font-weight: 400;
						padding: 0;
					}
				}
				.right {
					display: flex;
					flex-direction: column;
					margin-left: auto;
					height: 60px;
					justify-content: space-around;
				}
			}
			.second{
				width: 100%;
				display: flex;
				justify-content: flex-end;
				font-size: 12px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #A3BBD7;
				margin-top: 10px;
				padding-right: 10px;
			}

		}
	}
	.tab {
		width: 95%;
		margin: 0 auto;
		margin-top: -10px;
		height: 100px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 2px 12px 16px 0px rgba(245, 245, 245, 0.4);
		border-radius: 10px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.left {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			height: 60px;

			border-right: 1px solid rgba(229, 229, 229, 1);
			.one {
				font-size: 30upx;
				font-family: DIN;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.two {
				font-size: 26upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
			}
		}
		.middle {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			height: 60px;

			border-right: 1px solid rgba(229, 229, 229, 1);
			.one {
				font-size: 30upx;
				font-family: DIN;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.two {
				font-size: 26upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
			}
		}
		.right {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			height: 60px;
			.one {
				font-size: 30upx;
				font-family: DIN;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.two {
				font-size: 26upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
			}
		}
	}
	.top {
		width: 100%;
		height: 150px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: relative;
		image {
			width: 100%;
			height: 150px;
			position: absolute;
			top: 0;
			left: 0;
		}
		.left {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			height: 60px;
			z-index: 99;
			.one {
				font-size: 42upx;
				font-family: DIN;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
			}
			.two {
				font-size: 26upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(255, 247, 241, 1);
			}
		}
		.middle {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			height: 60px;
			z-index: 99;
			.one {
				font-size: 38upx;
				font-family: DIN;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
			}
			.two {
				font-size: 26upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(255, 247, 241, 1);
			}
		}
	}
}
</style>
