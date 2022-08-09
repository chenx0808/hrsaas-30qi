<template>
  <div class="conster">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色管理" name="first">
          <el-button size="small" icon="el-icon-plus" type="primary" @click="isShowAddDept=true">新增角色</el-button>
          <el-table
            :data="list"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              prop="date"
              label="序号"
              width="180"
            />
            <el-table-column
              prop="name"
              label="角色名称"
              width="180"
            />
            <el-table-column
              prop="description"
              label="描述"
            />

            <el-table-column
              prop="address"
              label="操作"
            >
              <template v-slot="{row}">
                <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                <el-button size="small" type="primary" @click="edit(row.id)">编辑</el-button>
                <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row
            type="flex"
            justify="center"
            style="padding-top:  10px"
          >
            <el-pagination
              :total="total"
              :page-size="page.pagesize"
              :current-page="page.page"
              background
              layout="prev, pager, next"
              @current-change="changePage"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
          />
          <el-form label-width="120px" style="margin-top:20px">
            <el-form-item label="公司名称">
              <el-input v-model="formData.name" disabled style="width:50%" />
            </el-form-item>
          </el-form>

          <el-form label-width="120px">
            <el-form-item label="公司地址">
              <el-input v-model="formData.companyAddress" disabled style="width:50%" />
            </el-form-item>
          </el-form>

          <el-form label-width="120px">
            <el-form-item label="邮箱">
              <el-input v-model="formData.mailbox" disabled style="width:50%" />
            </el-form-item>
          </el-form>

          <el-form label-width="120px">
            <el-form-item label="备注">
              <el-input v-model="formData.remarks" type="textarea" disabled style="width:50%" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog :title="`${ruleFormData.id?'编辑角色':'新增角色'}`" :visible.sync="isShowAddDept">
      <el-form ref="roleForm" label-width="120px" :model="ruleFormData" :rules="roleRules" @close="close">
        <el-form-item label="角色" prop="name">
          <el-input v-model="ruleFormData.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="ruleFormData.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="btnok">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog title="分配权限" :visible="isShowDialog" @close="btnPermCancel">
      <el-tree
        ref="checkedKeys"
        :default-checked-keys="checkedKeys"
        default-expand-all
        check-strictly
        show-checkbox
        :props="props"
        :data="permissionList"
        node-key="id"
      />
      <template #footer>
        <el-button @click="btnPermCancel">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { transListToTree } from '@/utils'
import { assignPerm } from '@/api/setting'
export default {
  name: 'Setting',
  data() {
    return {
      props: {
        label: 'name'
      }, // 树形结构的名字
      checkedKeys: [], // 储存默认选中节点的id
      isShowDialog: false, // 分配权限的弹出层
      permissionList: '', // 树形结构的数据
      ruleFormData: {
        name: '',
        description: ''
      },
      roleRules: {
        name: [{
          required: true,
          message: '角色名称不能为空'
        }]
      },
      isShowAddDept: false, // 编辑或者新增的弹出层
      formData: {},
      activeName: 'first',
      list: [], // 承接数组
      total: 0,
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10
      },
      rowid: null // 点击角色的id
    }
  },
  created() {
    this.getRoleList()
    this.getCompeanyInfo()
  },
  methods: {
    // 点击了确认
    async submit() {
      // 获取修改后的树形选中的节点
      const checkedKeys = this.$refs.checkedKeys.getCheckedKeys()
      await assignPerm({
        id: this.rowid, // 当前点击的角色id
        permIds: checkedKeys // 修改之后的权限列表
      })
      this.$message.success('分配权限成功')
      this.btnPermCancel()
    },
    // 弹出层关闭
    btnPermCancel() {
      this.isShowDialog = false
      // 树形结构选中的清空
      this.checkedKeys = []
    },
    // 点击分配权限
    async assignPerm(id) {
      // 当前点击的id
      // console.log(id)
      this.rowid = id
      // 从后端获取的扁平数组结构转化成树形结构
      // 所有的权限数据转化成树形  -->默认展示
      const res = transListToTree(await getPermissionList(), '0')
      this.permissionList = res

      // 处理当前觉得拥有的权限信息  默认选中
      // permIds 当前角色的权限的id数组
      const { permIds } = await getRoleDetail(id)
      // console.log(permIds)
      // 指定默认选中的节点
      this.checkedKeys = permIds
      // 弹出层
      this.isShowDialog = true
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.list = rows
      // console.log(rows)
      this.total = total
    },
    changePage(page) {
      this.page.page = page
      this.getRoleList()
    },
    // 获取数据
    async getCompeanyInfo() {
      this.formData = await getCompanyInfo(this.$store.getters.companyId)
      // console.log(this.formData)
    },
    async del(id) {
      await this.$confirm('是否删除')
      await deleteRole(id)
      const len = this.list.length
      if (len === 1 && this.page.page > 1) {
        this.page.page--
      }
      // 重新获取数据
      // 成功提示
      this.$message.success('删除成功')
      await this.getRoleList()
    },
    async edit(id) {
      this.isShowAddDept = true
      this.ruleFormData = await getRoleDetail(id)
    },
    close() {
      this.isShowAddDept = false
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.ruleFormData = {
        name: '',
        description: ''
      }
    },
    async btnok() {
      await this.$refs.roleForm.validate()
      if (this.ruleFormData.id) {
        await updateRole(this.ruleFormData)
      } else {
        await addRole(this.ruleFormData)
        this.close()
      }
      this.$message.success('操作成功')
      this.getRoleList()
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.conster{
  padding: 20px;
}
</style>
