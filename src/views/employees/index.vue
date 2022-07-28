<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span>共50条记录</span>
        </template>
        <template #after>
          <el-button size="mini" type="primary">导入</el-button>
          <el-button size="mini" type="danger">导出</el-button>
          <el-button size="mini" type="warning">新增员工</el-button>
        </template>
      </ToolBar>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column :formatter="formatter" label="聘用形式" sortable="" prop="formOfEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry" />
          <el-table-column label="账户状态" sortable="" prop="enableState" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination :page-size="page.size" :current-page.sync="page.page" :total="page.total" layout="prev, pager, next" @current-change="getEmpList" />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'
import Employees from '@/api/constant/employees'
// import TooBar from '@/components/TooBar/index.vue'
export default {
  // components: { TooBar }
  data() {
    return {
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
      const currentData = Employees.hireType.find(item => item.id === cellValue)?.value
      return currentData || '未知'
    }
  }
}

</script>

<style></style>
