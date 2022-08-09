<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span>共50条记录</span>
        </template>
        <template #after>
          <el-button size="mini" type="primary" @click="$router.push('/import')">导入</el-button>
          <el-button size="mini" type="danger" @click="exportToExcel">导出</el-button>
          <el-button size="mini" type="warning" @click="isShowAddDept=true">新增员工</el-button>
        </template>
      </ToolBar>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像">
            <template v-slot="{row}">
              <el-row type="flex" justify="center">
                <el-avatar
                  style="width:80px;height:80px"
                  :src="row.staffPhoto"
                  @click.native="isShowCode(row.staffPhoto)"
                />
                <!-- 图片加载不出来的时候会展示插槽里面的内容 -->
              <!-- <img src="@/assets/common/bigUserHeader.png" alt=""> -->
              </el-row>
            </template>

          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            :formatter="formatter"
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="">
            <template v-slot="scope">
              {{ scope.row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="showDialog(row.id)">角色</el-button>
              <el-button :disabled="checkPermission('DELETE_USER')" type="text" size="small" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            :page-size="page.size"
            :current-page.sync="page.page"
            :total="page.total"
            layout="prev, pager, next"
            @current-change="getEmpList"
          />
        </el-row>
      </el-card>
    </div>
    <add-employee :is-show-add-dept.sync="isShowAddDept" />
    <el-dialog title="二维码展示" :visible.sync="showAvatar">
      <el-row type="flex" justify="center">
        <canvas ref="canvas" />
      </el-row>
    </el-dialog>
    <AssignRole ref="roleRef" :current="current" :is-show.sync="isShow" />
  </div>
</template>

<script>
import { mixins } from '@/utils/mixins'
import { getEmployeeList, delEmployee } from '@/api/employees'
import Employees from '@/api/constant/employees'
import Qrcode from 'qrcode'
import addEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import AssignRole from './components/assign-role.vue'
// import TooBar from '@/components/TooBar/index.vue'
export default {
  components: { addEmployee, AssignRole },
  mixins: [mixins],
  // components: { TooBar }
  data() {
    return {
      current: null,
      isShowAddDept: false,
      showAvatar: false,
      isShow: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      }
    }
  },
  created() {
    this.getEmpList()
  },
  methods: {
    async showDialog(id) {
      this.current = id
      // console.log(111)
      this.isShow = true
      await this.$refs.roleRef.getUserDetailById(id)
    },
    async exportToExcel() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const { export_json_to_excel } = await import(/* webpackChunkName:'Export2Excel'*/ '@/utils/Export2Excel')
      // console.log(res)
      // 获取到所有的员工数据
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      const resData = this.formatterData(rows, headers)
      console.log(resData)
      // console.log(rows)
      export_json_to_excel({
        header: Object.keys(headers), // 表头 必填
        data: resData, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
      // console.log(Object.keys(headers))
    },
    formatterData(rows, headers) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          // console.log(key)
          // console.log(item)
          if (['timeOfEntry', 'timeOfEntry'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          if (headers[key] === 'formOfEmployment') {
            return Employees.hireType.find(child => +child.id === item[headers[key]])?.value || '未知'
          }
          return item[headers[key]]
        })
      })
    },
    async getEmpList() {
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
    },
    // 分页效果
    // changePage(page) {
    //   this.page.page = page
    //   this.getEmpList()
    // },
    formatter(row, column, cellValue) {
      // console.log(row)
      // console.log(column)
      // console.log(cellValue)
      const currentData = Employees.hireType.find(
        (item) => item.id === cellValue
      )?.value
      return currentData || '未知'
    },
    // 点击删除员工信息
    async del(id) {
      try {
        // 删除操作
        await this.$confirm('是否删除？')
        // 请求接口
        await delEmployee(id)
        this.$message.success('删除成功')
        // 重新获取数据
        await this.getEmpList()
      } catch (e) {
        console.log(e)
      }
    },
    isShowCode(url) {
      // console.log(url)
      this.showAvatar = true
      this.$nextTick(() => {
        Qrcode.toCanvas(this.$refs.canvas, url)
      })
    }

  }
}
</script>

<style></style>
