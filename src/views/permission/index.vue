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
            <el-button type="text" @click="editorPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPrevious(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-dialog :title="`${title}权限`" :visible="isShowDialog" width="800px" @close="close">
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
        <el-button @click="close">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import ToolBar from '@/components/ToolBar/index.vue'
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permisson'
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
  computed: {
    title() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    // 初始化的时候获取全部的列表数据
    this.getPermissionList()
  },
  methods: {
    // 获取权限点击事件
    async editorPermission(id) {
      // 获取当前点击权限的详情
      const res = await getPermissionDetail(id)
      // 覆盖formData 表单就可以重显
      this.formData = res
      // 展示弹层
      this.isShowDialog = true
    },
    // 删除权限
    async delPrevious(id) {
      // 删除之前先提示用户
      await this.$confirm('确认删除')
      // 点击确认删除之后再执行删除的操作
      await delPermission(id)
      // 删除成功后 通知用户
      this.$message.success('删除成功')
      // 删除成功后 重新获取列表数据
      this.getPermissionList()
    },
    // 点击确认
    async btnok() {
      this.$refs.perRef.validate()
      try {
        if (this.formData.id) {
        // 编辑
          await updatePermission(this.formData)
        } else {
        // 新增
          await addPermission(this.formData)
        }
        this.$message.success(`${this.title}权限成功`)
        this.close()
        await this.getPermissionList()
      } catch (e) {
        console.log(e)
        this.$message.error('修改失败')
      }
    },
    // 点击取消
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
    // 获取全部数据
    async getPermissionList() {
      const res = await getPermissionList()
      // console.log(res)
      this.list = transListToTree(res, '0')
    }
  }
}
</script>

<style></style>
