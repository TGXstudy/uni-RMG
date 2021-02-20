import config from "@/config/index.config.js"

export const imgUrl = url => {
	return "../../static/imgs" + url
	 //return config.imgUrl + url;
}
export const _imgUrl = url => {
	// return config.imgUrl + url;
	return "../../../static/imgs" + url
}
