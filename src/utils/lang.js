import Vue from 'vue' // 引入Vue
import VueI18n from 'vue-i18n' // 引入国际化的包
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import Cookies from 'js-cookie'
Vue.use(VueI18n) // 全局注册国际化包
import enElement from './en'
import zhElement from './zh'

const messages = {
  en: {
    // message: 'hello',
    ...enLocale, // 或者用 Object.assign({ message: 'hello' }, enLocale)
    ...enElement
  },
  zh: {
    // message: '你好',
    ...zhLocale, // 或者用 Object.assign({ message: '你好' }, zhLocale)
    ...zhElement
  }
}

const i18n = new VueI18n({
  locale: Cookies.get('lang') || 'zh', // set locale
  messages // set locale messages
})

export default i18n
