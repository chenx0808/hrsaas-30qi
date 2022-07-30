<template>
  <div>
    <UploadExcel :on-success="onSuccess" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/setting'
import UploadExcel from '@/components/UploadExcel/index.vue'
const userRelations = {
  '入职日期': 'timeOfEntry',
  '手机号': 'mobile',
  '姓名': 'username',
  '转正日期': 'correctionTime',
  '工号': 'workNumber'
}
export default {
  components: { UploadExcel },
  methods: {
    async onSuccess({ results }) {
      // excel里面的内容
      // console.log(args)
      // console.log(results)
      const resArr = results.map((item) => {
        // console.log(item)
        const obj = {}
        // console.log(obj)
        for (const key in item) {
          // console.log(key)
          // console.log(item)
          if (['timeOfEntry', 'correctionTime'].includes(userRelations[key])) {
            obj[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
            console.log(item[key])
          } else {
            obj[userRelations[key]] = item[key]
          }
          // console.log(obj[userRelations[key]])
          // console.log(item[key])
        }
        return obj
      })
      await importEmployee(resArr)
      // console.log(resArr)
      this.$message.success('成功了')
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
