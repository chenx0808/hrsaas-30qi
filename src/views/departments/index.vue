<template>
  <div class="dashboard-container">
    <el-card class="tree-card">
      <!-- 用了一个行列布局 -->
      <tree-tool :tree-data="company" />
    </el-card>
    <el-tree default-expand-all :data="departs" :props="defaultProps">
      <template v-slot="{data}">
        <tree-tool :is-root="false" :tree-data="data" @getDepatments="getDepatments" />
      </template>
    </el-tree>

  </div>
</template>

<script>
import { transListToTree } from '@/utils/index'
import { getDepartments } from '@/api/departments'
import TreeTool from './components/TreeTool.vue'
export default {
  components: { TreeTool },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      departs: [
        { name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' }
    }
  },
  created() {
    this.getDepatments()
  },
  methods: {
    async getDepatments() {
      const res = await getDepartments()
      // 替换公司数据
      this.company = {
        name: res.companyName,
        manager: res.companyManager || '管理员'
      }
      // 替换部门数据
      this.departs = transListToTree(res.depts, '')
    }
  }
}
</script>

<style scope lang='scss'>
.dashboard-container{
width: 900px;
height: 476px;
// background-color: pink;
margin: 50px auto;
.tree-card {
  font-size:14px;
}
.el-card__body{
  // background-color: #99ccff;
}
}
</style>
