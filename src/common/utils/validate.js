/**
 * 判断给定的路径是否是外部链接，以"http:", "https:", "mailto:", "tel:"开头的都被视为外部链接
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 判断给定的用户名是否为预定义的有效用户名。在这个例子中，有效的用户名是"admin"或"editor"
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 判断给定的字符串是否为有效的URL。这里使用了一个正则表达式，用于匹配常见的URL格式，包括协议、域名、端口和路径等
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return reg.test(url)
}

/**
 * 判断给定的字符串是否全是小写字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

/**
 * 判断给定的字符串是否全是大写字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

/**
 * 判断给定的字符串是否全是大写字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}

/**
 * 判断给定的字符串是否为有效的电子邮件地址。这里使用了一个正则表达式，用于匹配常见的电子邮件地址格式
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(email)
}

/**
 * 判断给定的参数是否为字符串类型
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
    return typeof str === 'string' || str instanceof String;

}

/**
 * 判断给定的参数是否为数组类型。这里通过检查Array.isArray函数是否存在，如果不存在则使用Object.prototype.toString方法进行判断
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
    if (typeof Array.isArray === 'undefined') {
        return Object.prototype.toString.call(arg) === '[object Array]'
    }
    return Array.isArray(arg)
}

/**
 * 验证账号信息
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function validAccount(rule, value, callback) {
    // 如果为空值，就抛出错误
    if (value === '') {
        return callback(new Error('请输入账号'));
    } else {
        if (value.length > 64) {
            return callback(new Error('账号超长，请修改'));
        } else if (/[\u4E00-\u9FA5]/g.test(value)) {
            return callback(new Error('账号禁止输入中文'));
        } else {
            return callback();
        }
    }
}

/**
 * 密码的规则校验
 * @param rule
 * @param value
 * @param callback
 */
export function validPassword(rule, value, callback) {
    if (value === '') {
        callback(new Error('请输入密码!'));
    } else {
        callback();
    }
}

/**
 * 验证码的规则校验
 * @param rule 规则
 * @param value 值
 * @param callback 校验
 * @returns {*}
 */
export function validCheckCode(rule, value, callback) {
    if (value === '') {
        return callback(new Error('请输入验证码'));
    } else {
        return callback();
    }
}

/**
 * 验证名字信息
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function validateName(rule, value, callback) {
    // 如果为空值，就抛出错误
    if (value === '') {
        return callback(new Error('请输入账号姓名'));
    } else {
        if (value.length > 25) {
            return callback(new Error('账号姓名超长，请修改'));
        } else {
            return callback();
        }
    }
}

/**
 * 验证输入框
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function validateInput(rule, value, callback) {
    // 如果为空值，就抛出错误
    if (value === '' || value === undefined) {
        return callback(new Error('请输入'));
    } else {
        return callback();
    }
}

/**
 * 验证密码框
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function validatePassword(rule, value, callback) {
    // 如果为空值，就抛出错误
    if (value === '' || value === undefined) {
        return callback(new Error('请输入'));
    } else {
        return callback();
    }
}

/**
 * 验证文本框
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function validateTextarea(rule, value, callback) {
    // 如果为空值，就抛出错误
    if (value === '' || value === undefined) {
        return callback(new Error('请输入'));
    } else {
        return callback();
    }
}

/**
 * 验证选择按钮
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function validateSwitch(rule, value, callback) {
    // 如果为空值，就抛出错误
    if (value === '' || value === undefined) {
        return callback(new Error('请选择'));
    } else {
        return callback();
    }
}

/**
 * 验证日期类型
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function validateDate(rule, value, callback) {
    // 如果为空值，就抛出错误
    if (value === '' || value === undefined) {
        return callback(new Error('请选择日期'));
    } else {
        return callback();
    }
}

/**
 * 验证日期类型
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function validateDatetime(rule, value, callback) {
    // 如果为空值，就抛出错误
    if (value === '' || value === undefined) {
        return callback(new Error('请选择日期'));
    } else {
        return callback();
    }
}

/**
 * 验证下拉框
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function validateSelect(rule, value, callback) {
    // 如果为空值，就抛出错误
    if (value === '' || value === undefined) {
        return callback(new Error('请选择下拉框选项'));
    } else {
        return callback();
    }
}

/**
 * 验证多选框
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function validateCheckbox(rule, value, callback) {
    // 如果为空值，就抛出错误
    if (value === '' || value === undefined) {
        return callback(new Error('请选择选项'));
    } else {
        return callback();
    }
}

/**
 * 验证单选框
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function validateRadio(rule, value, callback) {
    // 如果为空值，就抛出错误
    if (value === '' || value === undefined) {
        return callback(new Error('请选择'));
    } else {
        return callback();
    }
}

/**
 * 验证默认
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function validateDefault(rule, value, callback) {
    // 如果为空值，就抛出错误
    if (value === '' || value === undefined) {
        return callback(new Error('请输入'));
    } else {
        return callback();
    }
}

// 将图片转化为Base64
export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// 验证手机号
export function validateMobile(rule, value, callback) {
    // 如果为空值，就抛出错误
    if (!value) {
        callback(new Error('请输入电话号码'));
    } else {
        // 正则判断手机号格式的格式，正则判断失败抛出错误，否则直接callback()
        if (!/^1[2-9]\d{9}$/.test(value)) {
            callback(new Error("手机号格式不正确!"));
        } else {
            callback();
        }
    }
}

// 上传图片，并验证信息，返回基础信息
export function uploadImageFile(file) {
    return new Promise((async (resolve, reject) => {
        let fileData = {
            name: "", uploadType: "", base64String: "", userId: "",
        };
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJpgOrPng) {
            this.$message({message: '只可以上传jpg或者png格式图片!', type: 'error'});
            reject(isJpgOrPng);
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            this.$message({message: '图片大小必须小于2M!', type: 'error'});
            reject(isLt2M);
        }
        if (isJpgOrPng && isLt2M) {
            fileData.name = file.name;
            fileData.uploadType = file.type;
            fileData.base64String = await getBase64(file);
            fileData.userId = this.$store.state.user.userInfo.userId;
            resolve(fileData)
        }
    }))
}

// 上传音乐，并验证信息，返回基础信息
export function uploadVoiceFile(file) {
    return new Promise((async (resolve, reject) => {
        let voiceData = {
            fileSize: "", fileType: "", voiceName: "", userId: "",
        }
        const isMp3 = file.type === 'audio/mpeg';
        if (!isMp3) {
            this.$message({message: '只可以上传MP3格式音乐!', type: 'error'});
            reject(isMp3);
        }
        const isLt15M = file.size / 1024 / 1024 < 15;
        if (!isLt15M) {
            this.$message({message: '音乐大小必须小于15M!', type: 'error'});
            reject(isLt15M);
        }
        if (isMp3 && isLt15M) {
            voiceData.voiceName = file.name;
            voiceData.fileType = file.type;
            voiceData.fileSize = isLt15M;
            voiceData.userId = this.$store.state.user.userInfo.userId;
            resolve(voiceData)
        }
    }))
}

// 上传音乐，并验证信息，返回基础信息
export function uploadVideoFile(file) {
    return new Promise((async (resolve, reject) => {
        let videoData = {
            videoSize: "", videoType: "", videoName: "", userId: "",
        }
        const isVideo = file.type === 'video/mp4';
        if (!isVideo) {
            this.$message({message: '只可以上传mp4短视频!', type: 'error'});
            reject(isVideo);
        }
        const isLt30M = file.size / 1024 / 1024 < 30;
        if (!isLt30M) {
            this.$message({message: '视频大小必须小于30M!', type: 'error'});
            reject(isLt30M);
        }
        if (isVideo && isLt30M) {
            videoData.videoName = file.name;
            videoData.fileType = file.type;
            videoData.fileSize = isLt30M;
            videoData.userId = this.$store.state.user.userInfo.userId;
            resolve(videoData)
        }
    }))
}

// 上传音乐，并验证信息，返回基础信息
export function setObjValueNull(obj) {
    return Object.keys(obj).forEach(key => obj[key] = '');
}

// 格式化时间
export function formatDate(date) {
    const pad = (num) => (num < 10 ? '0' + num : num);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
