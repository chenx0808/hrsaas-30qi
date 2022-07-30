import ToolBar from '@/components/ToolBar'
import UploadExcel from '@/components/UploadExcel'

export default {
  install(Vue) {
    Vue.component(ToolBar.name, ToolBar)
    Vue.component(UploadExcel.name, UploadExcel)
  }
}
