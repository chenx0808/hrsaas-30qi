<template>
  <el-dialog title="编辑角色" :visible="isShow" @close="close">
    <el-checkbox-group v-model="rowIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>

    <template #footer>
      <el-button type="primary" @click="btnok">确认</el-button>
      <el-button>取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRow',
  props: {
    isShow: {
      type: Boolean,
      required: false
    },
    current: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rowIds: [],
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async btnok() {
      try {
        await assignRoles({
          id: this.current,
          roleIds: this.rowIds
        })
        this.$message.success('修改成功')
        this.close()
      } catch (e) {
        this.$message.error('修改失败')
        this.close()
      }
    },
    close() {
      this.rowIds = []
      this.$emit('update:isShow', false)
    },
    async getRoleList() {
      const { rows } = await getRoleList()
      // console.log(rows)
      this.list = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      // console.log(res)
      this.rowIds = roleIds
    }
  }
}
</script>

<style>

</style>
