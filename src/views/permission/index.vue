<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右按钮 -->
      <ToolBar>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="permisson('0',1)">添加权限</el-button>
        </template>
      </ToolBar>

      <!-- 表格 -->
      <el-table :data="list" border row-key="id">
        <el-table-column align="center" label="序号" type="index" width="70px" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type===1" type="text" @click="permisson(row.id,2)">添加</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-dialog title="新增权限" :visible="isShowDialog" width="800px" @close="close">
      <el-form ref="perRef" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>

        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>

        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>

        <el-form-item label="是否开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>

      </el-form>
      <el-row type="flex" justify="end">
        <el-button type="primary" @click="btnok">确定</el-button>
        <el-button>取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import ToolBar from '@/components/ToolBar/index.vue'
import { getPermissionList, addPermission } from '@/api/permisson'
import { transListToTree } from '@/utils'
export default {
  components: { ToolBar },
  data() {
    return {
      list: [],
      isShowDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          {
            required: true,
            message: '权限名称不能为空',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '权限标识不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async btnok() {
      this.$refs.perRef.validate()
      try {
        if (this.formData.id) {
        // 编辑
        } else {
        // 新增
          await addPermission(this.formData)
        }
        this.$message.success('添加权限成功')
        this.close()
        await this.getPermissionList()
      } catch (e) {
        console.log(e)
        this.$message.error('修改失败')
      }
    },
    close() {
      this.$refs.perRef.resetFields()
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.isShowDialog = false
    },
    permisson(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.isShowDialog = true
    },
    async getPermissionList() {
      const res = await getPermissionList()
      // console.log(res)
      this.list = transListToTree(res, '0')
    }
  }
}
</script>

<style></style>
