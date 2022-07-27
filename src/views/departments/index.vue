<template>
  <div v-loading="loading" class="dashboard-container">
    <el-card class="tree-card">
      <!-- 用了一个行列布局 -->
      <tree-tool :tree-data="company" @handelAddDepet="handelAddDepet" />
    </el-card>
    <el-tree default-expand-all :data="departs" :props="defaultProps">
      <template v-slot="{data}">
        <tree-tool :is-root="false" :tree-data="data" @handelEditDepet="handelEditDepet" @getDepatments="getDepatments" @handelAddDepet="handelAddDepet" />
      </template>
    </el-tree>
    <!-- 添加部门组件 -->
    <add-dept ref="addDept" :is-show-add-dept.sync="isShowAddDept" :current-node="currentNode" @addDepts="getDepatments" />
    <!-- 添加部门弹出弹层 -->
  </div>
</template>

<script>
import { transListToTree } from '@/utils/index'
import { getDepartments } from '@/api/departments'
import TreeTool from './components/TreeTool.vue'
import AddDept from './components/add-dept.vue'
export default {
  components: { TreeTool, AddDept },
  data() {
    return {
      loading: false,
      currentNode: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isShowAddDept: false, // 控制弹层是否显示
      departs: [
        { name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人', id: '' }
    }
  },
  created() {
    this.getDepatments()
  },
  methods: {
    handelAddDepet(node) {
      // 展示弹层
      this.isShowAddDept = true
      // 记录当前节点
      this.currentNode = node
    },
    handelEditDepet(node) {
      // 展示弹层
      this.isShowAddDept = true
      // 记录当前节点
      this.currentNode = node
      // 调用获取详情的方法
      this.$refs.addDept.getDetailById(node.id)
    },
    async getDepatments() {
      this.loading = true
      try {
        const res = await getDepartments()
        // 替换公司数据
        this.company = {
          name: res.companyName,
          manager: res.companyManager || '管理员',
          id: ''
        }
        // 替换部门数据
        this.departs = transListToTree(res.depts, '')
        this.loading = false
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scope lang='scss'>
.dashboard-container{
width: 900px;
// height: 476px;
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
