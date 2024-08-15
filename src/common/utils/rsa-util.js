import JSEncrypt from 'jsencrypt'

/**
 * RSA加密固定值
 * @returns {string}
 */
export function setValRsa(value) {
    // 创建加密对象实例
    const encryptor = new JSEncrypt()
    //设置公钥
    encryptor.setPublicKey(process.env.VUE_APP_RSA_PUBLIC_KEY)
    return encryptor.encrypt(value)
}

/**
 * RSA加密对象
 * @returns {Object}
 */
export function setObjRsa(obj) {
    let objVal = JSON.parse(JSON.stringify(obj));
    for (const key in objVal) {
        // 将每个值进行加密处理
        objVal[key] = setValRsa(objVal[key])
    }
    return objVal;
}


