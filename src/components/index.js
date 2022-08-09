import ToolBar from '@/components/ToolBar'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
import ThemePicker from '@/components/ThemePicker'
import Lang from '@/components/Lang'
export default {
  install(Vue) {
    Vue.component(ToolBar.name, ToolBar)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(ImageUpload.name, ImageUpload)
    Vue.component(ThemePicker.name, ThemePicker)
    Vue.component(Lang.name, Lang)
  }
}
