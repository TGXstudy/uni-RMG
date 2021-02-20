<template>
	<view class="message">
		<view class="banner">
			<view class="box" v-for="(item,index) in orderList" :key="index">
				<view class="top">
					<view class="left">
						<image :src="'/mine/message.png' | _imgUrl" mode=""></image>
						<text>系统消息</text>
					</view>
					<view class="right">{{item.create_time}}</view>
				</view>
				<view class="bottom">
					{{item | content}}
				</view>
			</view>
			<no-more class="width-100-per" :visible="nomore"></no-more>
			<load-more class="width-100-per" :visible="loading"></load-more>
		</view>
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
			page: 1,
			orderList: [], //列表
			nomore: true,
			loading: false
		};
	},
	onLoad() {
		this.msg();
	},
	onReachBottom() {
		if (this.nomore) return;
		console.log('上拉加载更多....');
		this.page++;
		this.msg();
	},
	methods: {
		msg() {
			this.$api
				.notice({
					page: this.page,
					limit: 10
				})
				.then(res => {
					console.log(res, 'sfg');
					if (res.code == 200) {
						if (this.page == 1) {
							this.orderList = res.data.data;
						} else {
							this.orderList = this.orderList.concat(res.data.data);
						}
						this.nomore = res.data.last_page <= this.page;
					} else {
						console.log('获取拼团商品', res);
					}
					//this.orderList=res.data.data;
				});
		}
	},
	filters:{
		content(values){
			if(values.notice_type=='查看'){
				return  "刚有附近用户 " + values.user_nickname + " " + values.notice_type + values.category_level_1 + "-" + values.category_level_2 + values.type + "信息;立即查看"
			}else{
				return  "刚有用户 " + values.user_nickname + " " + values.notice_type + values.category_level_1 + "-" + values.category_level_2 + values.type + "信息;"
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.message {
	width: 100%;
	.banner {
		width: 95%;
		margin: 0 auto;

		.box {
			background: #ffffff;
			width: 100%;
			padding-top: 20px;
			padding-bottom: 20px;
			border-bottom: 1px solid #fafafa;
			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 48rpx;
				.left {
					display: flex;
					align-items: center;

					text {
						font-size: 28rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #333333;
						margin-left: 5px;
					}
					image {
						width: 48rpx;
						height: 48rpx;
					}
				}
				.right {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
				}
			}
			.bottom {
				margin-top: 5rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
			}
		}
	}
}
</style>
