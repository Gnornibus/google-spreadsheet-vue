// 翻译 router.meta.title, 用于 sidebar 和 tagsview
export function generateTitle(title) {
  const hasKey = this.$te('router.' + title)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/common/lang/index.js
    const translatedTitle = this.$t('router.' + title)

    return translatedTitle
  }
  return title
}
