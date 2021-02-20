import http from "@/http/index.js"

const api={}

/**首页 */
api.homeModalImg=(params)=>http.post('/api/base/index/adImg',params,false)//首页-弹窗广告
api.homeImgDetail=(params)=>http.post('/api/base/index/adContent',params,false)//首页-弹窗广告详情
api.homeWorkMessage=(params)=>http.post('/api/base/index/workMessage',params,false)//首页-工种信息
api.categoryTwo=(params)=>http.post('/api/base/index/categoryTwo',params,false)//首页-工种分类
api.moreCategory=(params)=>http.post('/api/base/index/category',params,false)//首页-更多工种
api.workDetail=(params)=>http.post('/api/base/index/workDetail',params,false)//首页-点击头像-更多信息弹窗
api.payData=(params)=>http.post('/api/base/member/payData',params,false)//首页-点击头像-获取付费金额
api.messagePay=(params)=>http.post('/api/base/index/messagePay',params,false)//首页-付费
api.mesContent=(params)=>http.post('/api/base/index/mesContent',params,false)//首页-信息服务协议
api.orderStatus=(params)=>http.post('/api/base/index/orderStatus',params,false)//首页-支付宝支付-查询订单状态


/**发布 */
api.myPublish=(params)=>http.post('/api/base/member/myPublish',params,false)//发布-我的发布列表
api.publishWork=(params)=>http.post('/api/base/member/publishWork',params,false)//发布-发布招工
api.publishDetail=(params)=>http.post('/api/base/member/publishDetail',params,false)//发布-信息详情
api.companyDetail=(params)=>http.post('/api/base/member/companyDetail',params,false)//发布-信息详情-企业详情
api.deletePublish=(params)=>http.post('/api/base/member/deletePublish',params,false)//发布-我的发布-删除
api.videoAd=(params)=>http.post('/api/base/index/video',params,false)//发布-发布详情-获取广告视频
api.workStatus=(params)=>http.post('/api/base/member/workStatus',params,false)//发布-修改发布状态
api.tips=(params)=>http.post('/api/base/member/tips',params,false)//发布-详情-温馨提示

/**培训 */
api.trainBanner=(params)=>http.post('/api/base/residence/banner',params,false)//培训-轮播图
api.residenceList=(params)=>http.post('/api/base/residence/residenceList',params,false)//培训-培训机构列表
api.myCourseList=(params)=>http.post('/api/base/residence/myCourse',params,false)//培训-我的课程列表
api.residenceDetail=(params)=>http.post('/api/base/residence/residenceDetail',params,false)//培训-培训机构详情
api.courseList=(params)=>http.post('/api/base/residence/courseList',params,false)//培训-培训机构详情--课程列表
// api.introduction=(params)=>http.post('/api/base/residence/introduction',params,false)//培训-培训机构详情--培训机构简介
api.courseDetail=(params)=>http.post('/api/base/residence/courseDetail',params,false)//培训-课程列表-课程详情
api.courseRegister=(params)=>http.post('/api/base/residence/courseRegister',params,false)//培训-课程列表-课程详情-课程报名
api.myCourseDetail=(params)=>http.post('/api/base/residence/myCourseDetail',params,false)//我的课程详情



api.reportContent=(params)=>http.post('/api/base/index/reportContent',params,false)//举报-内容列表
api.onlinePhone=(params)=>http.post('/api/base/member/customer',params,false)//举报-在线客服
api.reportCompany=(params)=>http.post('/api/base/index/report',params,false)//举报



api.video=(params)=>http.post('/api/base/index/video',params,false)//广告视频



/******************************************************tong*******************************************/
api.wxlogin=(params)=>http.post('/api/base/third/applets',params,false)  //小程序登录
api.official=(params)=>http.post('/api/base/third/official',params,false)  //公众号登录
api.upload_img=(params)=>http.post('/api/base/upload/base',params,false)  //图片上传接口
api.qiNiu=(params)=>http.post('/api/base/upload/qiNiu',params,false)  //获取七牛token

api.register=(params)=>http.post('/api/base/member/register',params,false)  //注册

api.registerMessage=(params)=>http.post('/api/base/member/registerMessage',params,false)  //用户信息协议

api.sendCode=(params)=>http.post('/api/base/member/sendCode',params,false)  //验证码

api.login=(params)=>http.post('/api/base/member/login',params,false)  //登录

api.forgetPwd=(params)=>http.post('/api/base/member/forgetPwd',params,false)  //忘记密码

api.userInfo=(params)=>http.post('/api/base/member/userInfo',params,false)  //用户信息

api.payPwd=(params)=>http.post('/api/base/member/payPwd',params,false)  //修改支付密码

api.checkMobileCode=(params)=>http.post('/api/base/member/checkMobileCode',params,false)  //修改手机号验证原手机验证码

api.editMobile=(params)=>http.post('/api/base/member/editMobile',params,false)  //修改手机号

api.recommendation=(params)=>http.post('/api/base/member/recommendation',params,false)  //推荐码


api.myFriends=(params)=>http.post('/api/base/member/myFriends',params,false)  //我的好友

api.friendConsume=(params)=>http.post('/api/base/member/friendConsume',params,false)  //我的好友明细

api.applyAgent=(params)=>http.post('/api/base/member/applyAgent',params,false)  //申请代理

api.agencyStatus=(params)=>http.post('/api/base/member/agencyStatus',params,false)  //代理状态

api.agentReward=(params)=>http.post('/api/base/member/agentReward',params,false)  //代理奖励

api.editUser=(params)=>http.post('/api/base/member/editUser',params,false)  //用户信息设置


api.question=(params)=>http.post('/api/base/member/question',params,false)  //常见问题

api.questionDetail=(params)=>http.post('/api/base/member/questionDetail',params,false)  //常见问题详情

api.aboutUs=(params)=>http.post('/api/base/member/aboutUs',params,false)  //关于我们

api.suggest=(params)=>http.post('/api/base/member/suggest',params,false)  //意见建议

api.customer=(params)=>http.post('/api/base/member/customer',params,false)  //在线客服


api.myWallet=(params)=>http.post('/api/base/member/myWallet',params,false)  //我的钱包

api.companyCertification=(params)=>http.post('/api/base/member/companyCertification',params,false)  //企业认证

api.personalCertification=(params)=>http.post('/api/base/member/personalCertification',params,false)  //个人认证

api.organApply=(params)=>http.post('/api/base/member/organApply',params,false)  //培训机构入驻

api.organDetail=(params)=>http.post('/api/base/member/organDetail',params,false)  //培训机构详情


api.certificationDetail=(params)=>http.post('/api/base/member/certificationDetail',params,false) //认证详情

api.editPwd=(params)=>http.post('/api/base/member/editPwd',params,false) //修改登录密码

api.notice=(params)=>http.post('/api/base/member/notice',params,false) //系统消息

api.myContact=(params)=>http.post('/api/base/member/myContact',params,false) //我联系的

api.contactMe=(params)=>http.post('/api/base/member/contactMe',params,false) //联系我的


api.vipPay=(params)=>http.post('/api/base/member/vipPay',params,false) //会员购买

api.vipAgreement=(params)=>http.post('/api/base/member/vipAgreement',params,false) //会员入驻协议

api.payData=(params)=>http.post('/api/base/member/payData',params,false) //获取支付数据

api.vipPower=(params)=>http.post('/api/base/member/vipPower',params,false) //会员权利

api.cashRecord=(params)=>http.post('/api/base/member/cashRecord',params,false) //提现记录

api.applyCash=(params)=>http.post('/api/base/member/applyCash',params,false) //申请提现

api.applyCash=(params)=>http.post('/api/base/member/applyCash',params,false) //申请提现

api.rechargeBalance=(params)=>http.post('/api/base/member/rechargeBalance',params,false) //余额充值

api.bindMobile=(params)=>http.post('/api/base/third/bindMobile',params,false) //bangd
export default api;