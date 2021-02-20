<template>
	<view class="apply">
		<view class="banner">
			<view class="one font_auth_size">
				<view class="aa margin-right-55">姓名</view>
				<input type="text" v-model="name" placeholder="请输入姓名" value="" />
			</view>
			<view class="one font_auth_size">
				联系电话
				<input type="number" v-model="phone" placeholder="请输入联系电话" />
			</view>
			<!-- 代理选择 -->
			<view class="four">
				<view class="four_left font_auth_size">代理等级</view>
				<view class="four_right font_auth_size">
					<picker @change="bindPickerChange" :value="index" :range="array">
						<view class="uni-input">{{ array[index] }}</view>
					</picker>
				</view>
				<image :src="'/mine/jt.png' | _imgUrl" mode=""></image>
			</view>
			<!-- 区域选择 -->
			<view class="four" v-if="index == 0">
				<view class="four_left font_auth_size">代理区域</view>
				<view class="four_right font_auth_size">
					<pick-regions3 class="nrr" :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
						<span class="djj" v-if="!regionName">请选择</span>
						<span>{{ regionName }}</span>
					</pick-regions3>
				</view>
				<image :src="'/mine/jt.png' | _imgUrl" mode=""></image>
			</view>
			<view class="four" v-if="index == 1">
				<view class="four_left font_auth_size">代理区域</view>
				<view class="four_right font_auth_size">
					<pickRegions2 class="nrr" :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
						<span class="djj" v-if="!regionName">请选择</span>
						<span>{{ regionName }}</span>
					</pickRegions2>
				</view>
				<image :src="'/mine/jt.png' | _imgUrl" mode=""></image>
			</view>
			<view class="four" v-if="index == 2">
				<view class="four_left font_auth_size">代理区域</view>
				<view class="four_right font_auth_size">
					<pickRegions class="nrr" :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
						<span class="djj" v-if="!regionName">请选择</span>
						<span>{{ regionName }}</span>
					</pickRegions>
				</view>
				<image :src="'/mine/jt.png' | _imgUrl" mode=""></image>
			</view>
			<!-- 备注 -->
			<view class="five">
				<view class="top font_auth_size">备注</view>
				<textarea value="" v-model="bz" class="font_auth_size" placeholder="请输入备注内容" />
			</view>
			<button class="zf" @tap="sure()">确定</button>
		</view>
	</view>
</template>

<script>
import pickRegions from '@/components/pick-regions/pick-regions.vue';
import pickRegions2 from '@/components/pick-regions/pick-regions2.vue';
import pickRegions3 from '@/components/pick-regions/pick-regions3.vue';
export default {
	components: {
		pickRegions,
		pickRegions2,
		pickRegions3
	},
	data() {
		return {
			name: '', //名字
			phone: '', //电话
			bz: '', //备注
			defaultRegionCode: '440113',
			region: [],
			index: 0,
			array: ['省', '市', '区县'],
			province_id: '', //省code
			city_id: '', //市code
			region_id: '', //县code
			level: '1' //代理等级
		};
	},
	computed: {
		regionName() {
			// 转为字符串
			return this.region.map(item => item.name).join(' ');
		}
	},
	methods: {
		//合伙人选择
		bindPickerChange: function(e) {
			console.log('picker发送选择改变，携带值为', e.target.value);
			this.index = e.target.value;
			this.level = e.target.value + 1;
			console.log(this.level, 'sd');
		},
		handleGetRegion(region) {
			this.region = region;
			if (region.length == 1) {
				this.province_id = this.region[0].code + '0000';
			} else if (region.length == 2) {
				this.city_id = this.region[1].code + '00';
			} else if (region.length == 3) {
				this.region_id = this.region[2].code;
			}
			console.log('regionregionregion', region);
		},
		sure() {
			var that = this;
			if (this.name == '') {
				this.$mUtils.toast('用户名不能为空');
				return;
			}
			if (this.phone == '') {
				this.$mUtils.toast('联系电话不能为空');
				return;
			}
			if (this.region == '') {
				this.$mUtils.toast('代理区域不能为空');
				return;
			}
			if (this.bz == '') {
				this.$mUtils.toast('备注内容不能为空');
				return;
			}
			if (this.level == 1) {
				this.province_id = this.region[0].code + '0000';
				console.log('省');
			} else if (this.level == 2) {
				this.province_id = this.region[0].code + '0000';
				this.city_id = this.region[1].code + '00';
				console.log('市');
			} else if (this.level == 3) {
				this.province_id = this.region[0].code + '0000';
				this.city_id = this.region[1].code + '00';
				this.region_id = this.region[2].code;
				console.log('区');
			}
			let data = {
				name: this.name || '',
				mobile: this.phone || '',
				level: this.level || '',
				province_id: this.province_id || '',
				city_id: this.city_id || '',
				region_id: this.region_id || '',
				remark: this.bz || ''
			};
			console.log(data);
			this.$api.applyAgent(data).then(res => {
				console.log(res);
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
		}
	}
};
</script>

<style lang="scss" scoped>
.apply {
	width: 100%;
	padding-top: 20px;
	.banner {
		width: 95%;
		margin: 0 auto;
		.one {
			width: 100%;
			display: flex;
			border-bottom: 1px solid #fafafa;
			padding-bottom: 10px;
			margin-bottom: 10px;
			input {
				width: 60%;
				margin-left: 10px;
				font-size: 14px;
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
		.five {
			border-bottom: 1px solid #fafafa;
			padding-bottom: 10px;
			margin-bottom: 10px;

			textarea {
				padding-top: 5px;
				width: 100%;
				height: 150px;
				background: #f9f9f9;
				border-radius: 8px;
				margin-top: 10px;
			}
		}
		.zf {
			margin-top: 30px;
			color: #ffffff;
			width: 100%;
			height: 44px;
			background: #0067df;
			border-radius: 22px;
			font-size: 32rpx;
		}
	}
}
</style>
