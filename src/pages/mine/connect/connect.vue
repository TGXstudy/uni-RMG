<template>
	<view class="connect">
		<view class="banner">
			<view class="title">
				<view :class="type==0?'active':''" @tap="type=0">我联系的</view>
				<view :class="type==1?'active':''" @tap="type=1">联系过我的</view>
			</view>
			<!-- 我联系的 -->
			<view class="nav" v-if="type==0">
				<view class="box" v-for="(item,index) in myconnectlist" :key="index">
					<view class="top">
						<view class="first">
							<image  :src="item.avatar"   mode=""></image>
							<text>{{item.user_nickname}}</text>
						</view>
						<view class="second">
							<image  :src="'/mine/connect_loaction.png' | _imgUrl"   mode="">
							<text>{{item.address}}</text>
						</view>
						<view class="second">
							<image  :src="'/mine/connect_distance.png' | _imgUrl"   mode="">
							<text>{{item.distance}}</text>
						</view>
						<view class="second">
							<image  :src="'/mine/connect_jb.png' | _imgUrl"   mode="">
							<text>{{item.charge}}</text>
						</view>
						<view class="third">
							<image  :src="'/mine/connect_type.png' | _imgUrl"   mode="">
							<text>{{item.category_level_1}}{{item.category_level_2}}</text>
						</view>
					</view>
					<view class="bottom">
						<view class="btn" @tap="ck(item)">查看详情</view>
					</view>
				</view>
			</view>
			<!-- 联系过我的 -->
			<view class="nav" v-if="type==1">
				<view class="box" v-for="(item,index) in connectmylist" :key="index" >
					<view class="top">
						<view class="first">
							<image  :src="item.avatar"   mode=""></image>
							<text>{{item.user_nickname}}</text>
						</view>
						<view class="second">
							<image  :src="'/mine/connect_loaction.png' | _imgUrl"   mode="">
							<text>{{item.address}}</text>
						</view>
						<view class="second">
							<image  :src="'/mine/connect_distance.png' | _imgUrl"   mode="">
							<text>{{item.distance}}</text>
						</view>
						<view class="second">
							<image  :src="'/mine/connect_time.png' | _imgUrl"   mode="">
							<text>{{item.create_time}}</text>
						</view>
					</view>
					<view class="bottom">
						<!-- #ifdef MP-WEIXIN -->
						<view class="btn2" @tap="wxdh(item)">导航</view>
						<!-- #endif -->
						 <!-- #ifdef H5 -->
						<view class="btn2" @tap="dh(item)">导航</view>
						<!-- #endif -->
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
			type:0,
			myconnectlist:[],
			connectmylist:[],
			longitude:"",//经度
			latitude:"",//纬度
			page:1
		};
	},
	onLoad() {
		this.longitude=this.$store.getters.getCurrentLocation.longitude;
		this.latitude=this.$store.getters.getCurrentLocation.latitude;
		console.log(this.$store.getters.getCurrentLocation,'longitude')
		this.myconnect()
		this.connectmy()
	},
	methods:{
		//查看详情
		ck(item){
			this.$mRouter.push({
			     route: this.$mRoutesConfig.issueDetail,
			     query: { id:item.work_id},
			});
		},
		//微信导航
		wxdh(item){
			uni.openLocation({
			    latitude: Number(item.latitude),
			    longitude: Number(item.longitude),
			    address: item.address,
			    success: (res) => {
			        console.log(res, "res");
			    },
			});
			// this.$mRouter.push({
			// 	route:this.$mRoutesConfig.blank,
			// 	query:{longitude:item.longitude,latitude:item.latitude,address:item.address}
			// })
		},
		//导航
		dh(item){
			window.location.href = `https://uri.amap.com/marker?position=${item.longitude},${item.latitude}&name=${
				item.address
			}&coordinate=gaode&callnative=1`;
		},
		myconnect(){
			this.$api.myContact({
				page:this.page,
				limit:10,
				longitude:this.longitude,
				latitude:this.latitude
			}).then(res=>{
				this.myconnectlist=res.data.data
				console.log(res,'我联系的')
			})
		},
		connectmy(){
			this.$api.contactMe({
				page:this.page,
				limit:10,
				longitude:this.longitude,
				latitude:this.latitude
			}).then(res=>{
				this.connectmylist=res.data.data
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.connect {
	width: 100%;
	.banner{
		width: 95%;
		margin: 0 auto;
		.nav{
			.box{
				background: #FFFFFF;
				box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.04);
				border-radius: 8px;
				padding: 10px;
				.top{
					border-bottom: 1px solid #fafafa;
					padding-bottom: 20px;
					.first{
						display: flex;
						align-items: center;
						text{
							margin-left: 10px;
							font-size: 14px;
							color: #333333;
						}
						image{
							width: 30px;
							height: 30px;
						}
					}
					.second{
						display: flex;
						align-items: center;
						margin-left: 40px;
						margin-top: 5px;
						image{
							width: 16px;
							height: 16px;
						}
						text{
							
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							margin-left: 2px;
							font-size: 12px;
							color: #666666;
						}
					}
					.third{
						display: flex;
						align-items: center;
						margin-left: 40px;
						margin-top: 5px;
						image{
							width: 16px;
							height: 16px;
						}
						text{
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							margin-left: 2px;
							font-size: 12px;
							color: #666666;
						}
					}
				}
				.bottom{
					display: flex;
					justify-content: flex-end;
					margin-top: 10px;
					.btn{
						width: 80px;
						height: 32px;
						background: #FFFFFF;
						border-radius: 16px;
						border: 1px solid #EEEEEE;
						font-size: 12px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #666666;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					.btn2{
						width: 80px;
						height: 32px;
						background: #FFFFFF;
						border-radius: 16px;
						border: 1px solid #0067DF;
						font-size: 12px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #0067DF;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}
		.title{
			width: 60%;
			margin:  0 auto;
			height: 50px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.active{
				color: #0067DF;
				border-bottom: 2px solid #0067DF;
			}
			view{
				display: flex;
				justify-content: center;
				align-items: center;
				height: 50px;
				font-size: 14px;
				color: #333333;
				
			}
		}
	}
}
</style>
