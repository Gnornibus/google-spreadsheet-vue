export default {
    unknown: "未知数据",
    // 性别
    sex: {
        0: "男",
        1: "女",
    },
    // 通用状态
    state: {
        0: "启用",
        1: "停用",
    },
    // 会员兑换码状态
    memberKey: {
        0: "已兑换",
        1: "待兑换",
    },
    // 营员状态
    camperState: {
        0: "未报名",
        1: "已报名",
        2: "已结营",
    },
    // 订单状态
    orderState: {
        0: "未支付",
        1: "已支付",
        2: "已取消",
    },
    // 营会状态
    termState: {
        0: "报名中",
        1: "待开营",
        2: "开营中",
        3: "已经营",
    },
    // 反馈状态
    feedbackState: {
        0: "未处理",
        1: "处理中",
        2: "已解决",
        3: "已关闭",
    },
    // 交易状态
    tradeStatus: {
        WAIT_BUYER_PAY: "等待买家付款",
        TRADE_SUCCESS: "交易成功",
        TRADE_CLOSED: "交易关闭",
        TRADE_FINISHED: "交易完成",
        TRADE_PENDING: "等待卖家收款",
        TRADE_FAILED: "交易失败",
    },
    // 反馈状态
    noticeState: {
        0: "启用",
        1: "停用",
    },
    // 反馈状态
    operation: {
        0: "待运行",
        1: "运行中",
    },
    // 付款方式
    alipayFundChannel: {
        COUPON: "支付宝红包",
        ALIPAYACCOUNT: "支付宝账户",
        PCREDIT: "花呗",
        POINT: "集分宝",
        DISCOUNT: "折扣券",
        MDISCOUNT: "商户优惠券",
        MCOUPON: "商户红包"
    },
    // 反馈类型
    feedbackType: {
        0: "系统Bug",
        1: "功能建议",
    },
    // 反馈类型
    noticeType: {
        0: "系统通知",
        1: "任务通知",
        2: "活动通知",
    },
    // 支付方式
    channel: {
        0: "现金",
        1: "支付宝",
        2: "微信",
    },
    // 反馈处理优先级
    priority: {
        0: "一级",
        1: "二级",
        2: "三级",
    },
    dict: {
        type: {
            0: '系统字典',
            1: '业务字典',
        }
    },
    banner: {
        type: {
            0: '用户轮播',
            1: '教练轮播',
        }
    },
    discounted: {
        0: '原价',
        1: '打折'
    },
    sport: {
        project: {
          class: {
              type: {
                  0: '学员分类',
                  1: '教练分类',
              }
          }
        },
        video: {
            type: {
                0: '用户视频',
                1: '教练视频'
            }
        }
    }
}
