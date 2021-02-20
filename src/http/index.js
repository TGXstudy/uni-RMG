import $mUtils from "@/common/js/utils.js"
import $store from "@/store/index.js"
import $mConfig from "@/config/index.config.js"
import JSEncrypt from 'jsencrypt';
import {
	jsEncryptKey
} from "@/common/js/jsEncryptKey.js"
const http = {};
let ajaxTimes = 0; //请求次数
let encrypt = new JSEncrypt(), //请求加密
	decrypt = new JSEncrypt() //返回解密
http.post = (url, params = {}) => {
	// eslint-disable-next-line no-undef
	encrypt.setPublicKey(jsEncryptKey.ENCRYPT_PUBLIC_KEY) // 公钥
	decrypt.setPrivateKey(jsEncryptKey.DECRYPT_PRIVATE_KEY) //私钥
	let userAgent = process.env.VUE_APP_PLATFORM,
		dataObj = params || {},
		encrypted = encrypt.encryptUnicodeLong(JSON.stringify(dataObj))
	console.log($mConfig.baseUrl + url + '加密前请求数据===============》', dataObj)
	let opt = {
		url: $mConfig.baseUrl + url,
		data: {
			'data': encrypted
		},
		method: "POST",
		header: {
			"Device-Type": process.env.UNI_PLATFORM === "mp-weixin" ? 'wxapp' : 'wap',
			"X-Requested-With": "XMLHttpRequest",
			"Content-Type": 'application/x-www-form-urlencoded',
			Authorization: $store.getters.getToken
		},
		dataType: "json"
	}
	//接口请求
	ajaxTimes++;
	// eslint-disable-next-line no-undef
	uni.showLoading({
		mask: true,
		title: "请稍候..."
	})

	return new Promise((reslove, reject) => {
		// eslint-disable-next-line no-undef
		uni.request(opt)
			.then(res => {
				console.log($mConfig.baseUrl + url + "请求返回数据=========121231231312》", res[1])
				let response = res[1].data
				if (response.hasOwnProperty('data')) {
					if (response.data instanceof Object) {
						response.data = JSON.parse(decrypt.decryptUnicodeLong(JSON.stringify(response.data)))
						console.log($mConfig.baseUrl + url + "请求返回数据解密data==============>", response.data)
					} else {
						response.data = JSON.parse(decrypt.decryptUnicodeLong(response.data))
						console.log($mConfig.baseUrl + url + "请求返回数据解密data==============>", response.data)
					}
				}
				//根据响应code,做处理
				if (response.code == 1003 || response.code == 1002) {
					// #ifdef MP-WEIXIN
					$mUtils.toast("登录失效，请重新登录")
					$mUtils.timeout(() => {
						$mUtils.goPage("gzh_login")
					})
					
					// #endif
					
					
					// #ifdef H5
					if($mUtils.checkIsWx()){
						$mUtils.toast("登录失效，请重新登录")
						$mUtils.timeout(() => {
							$mUtils.goPage("gzh_login")
						})
					}else{
						$mUtils.toast("登录失效，请重新登录")
						$mUtils.timeout(() => {
							$mUtils.goPage("login")
						})
					}
					
					// #endif
					
				} else {
					reslove(response)
				}
			})
			.catch(err => {
				reject(err)
			})
			.finally(() => {
				ajaxTimes--;
				if (ajaxTimes === 0) {
					uni.hideLoading();
				}
			})
	})
}
http.upload = (url, filePath, filename, hideLoading) => {
	//接口请求
	if (!hideLoading) {
		// eslint-disable-next-line no-undef
		uni.showLoading({
			mask: true,
			title: "请稍候..."
		})
	}
	return new Promise((reslove, reject) => {
		// eslint-disable-next-line no-undef
		uni.uploadFile({
			url: $mConfig.baseUrl + url, //仅为示例，非真实的接口地址
			filePath: filePath,
			name: filename,
			header: {
				Authorization: $store.state.TOKEN
			},
			success: function (res) {
				// eslint-disable-next-line no-undef
				!hideLoading && uni.hideLoading()
				reslove(res)
			},
			fail: function (error) {
				reject(error)
			}
		})
	}).catch(err => {
		if (!hideLoading) {
			$mUtils.toast("网络不给力，请稍后再试~")
			// eslint-disable-next-line no-undef
			uni.hideLoading()
		}
		throw err
	})
}

export default http