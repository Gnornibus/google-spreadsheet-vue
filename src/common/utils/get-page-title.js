import defaultSettings from '@/settings'
import i18n from '@/common/lang'

/**
 * 获取页面标签后缀
 * @type {string|string}
 */
const title = defaultSettings.htmlTitle || '系统'

export default function getPageTitle(key) {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${title}`
  }
  return `${title}`
}
