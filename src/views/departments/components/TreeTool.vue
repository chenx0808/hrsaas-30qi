<template>
  <el-row style="width: 100%" type="flex" justify="space-between">
    <el-col>
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeData.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="clickItem">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉菜单 -->
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  name: 'TreeTool',
  props: {
    treeData: {
      type: Object,
      default() { return {} }
    },
    isRoot: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    async clickItem(type) {
      console.log(type)
      // 判断点击删除按钮
      if (type === 'add') {
        // 添加逻辑
        this.$emit('handelAddDepet', this.treeData)
      } else if (type === 'edit') {
        // 编辑逻辑
        this.$emit('handelEditDepet', this.treeData)
      } else {
        // 删除逻辑
        await this.$confirm('确认删除？')
        await delDepartments(this.treeData.id)
        // console.log('点击了确认')
        this.$message.success('删除成功')
        this.$emit('getDepatments')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
