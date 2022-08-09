<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="mini">
        <el-option v-for="item in yearList" :key="item" :label="`${item}年`" :value="item" />
      </el-select>
      <el-select v-model="currentMouth" size="mini" style="margin-left:20px">
        <el-option v-for="i in 12" :key="i" :label="`${i}月`" :value="i" />
      </el-select>
    </el-row>
    <el-calendar v-model="value" />
  </div>
</template>

<script>
export default {
  name: 'WorkCalendar',
  props: {
    currerntDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      // value: new Date(),
      currentYear: null,
      currentMouth: null,
      yearList: [] // 存储的年份下拉列表
    }
  },
  computed: {
    value: {
      get() {
        return new Date(this.currentYear, this.currentMouth - 1)
      },
      set(value) {
        this.currentYear = value.getFullYear()
        this.currentMouth = value.getMonth() + 1
      }
    }
  },
  created() {
    // 获取默认选中的月份
    this.currentMouth = this.currerntDate.getMonth() + 1
    // 获取默认选中的年份
    this.currentYear = this.currerntDate.getFullYear()

    this.yearList = Array.from(Array(11), (item, index) => {
      // console.log(item)
      return this.currentYear + index - 5
    })
    // console.log(this.yearList)
  }
}
</script>

<style>
.el-calendar__header{
  display: none;
}
</style>
