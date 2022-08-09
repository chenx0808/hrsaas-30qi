<template>
  <el-dropdown @command="clickItem">
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="'zh'=== $i18n.locale" command="zh">中文</el-dropdown-item>
        <el-dropdown-item :disabled="'en'=== $i18n.locale" command="en">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'Lang',
  methods: {
    clickItem(lan) {
      this.$message.success('切换语言成功')
      Cookies.set('lang', lan)
      // console.log(lan)
      this.$i18n.locale = lan
    }
  }

}
</script>

<style>

</style>
