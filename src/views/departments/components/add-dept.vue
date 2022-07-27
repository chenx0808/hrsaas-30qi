<template>
  <div>
    <el-dialog :title="`${showTitle}部门【${currentNode.name}】`" :visible="isShowAddDept" @close="close">
      <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入部门编码" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <!-- <el-input v-model="formData.manager" /> -->
          <el-select v-model="formData.manager" placeholder="请选择" @focus="getEmployeeSimple">
            <el-option
              v-for="item in options"
              :key="item.value"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="formData.introduce" placeholder="请输入部门介绍" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="close">取 消</el-button>
          <el-button type="primary" size="small" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDept',
  props: {
    isShowAddDept: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkName = async(rule, value) => {
      // 1.获取所有部门数据
      const { depts } = await getDepartments()
      // console.log(depts)
      // 2:找出当前点击部门的子部门数据有什么特点？ pid===当前点击部门的id
      let currentChildren = null
      if (this.formData.id) {
        currentChildren = depts.filter((item) => { return item.pid === this.currentNode.pid && item.id !== this.currentNode.id })
      } else {
        // console.log(currentChildren)
        currentChildren = depts.filter((item) => { return item.pid === this.currentNode.id })
      }

      // 3:value值是否和筛选出来的数据结果里面的name值有重复
      const isRepeat = currentChildren.some((item) => item.name === value)
      if (isRepeat) {
        return Promise.reject('名字不能重复')
      }
    }
    const checkCode = async(rule, value) => {
      // 1.获取所有部门数据
      const { depts } = await getDepartments()
      // 2：检查编码是否重复
      const idRepeat = null
      if (this.formData.id) {
        depts.some((item) => item.code === value && item.id !== this.currentNode.id)
      } else {
        depts.some((item) => item.code === value)
      }
      // 3:value值是否和筛选出来的数据结果里面的code值有重复
      if (idRepeat) {
        return Promise.reject('部门编码不能重复')
      }
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '部门名称不能为空'
          },
          {
            min: 1,
            max: 50,
            message: '必须填1-50个字符'
          },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '部门编码不能为空'
          },
          {
            min: 1,
            max: 50,
            message: '必须填1-50个字符'
          },
          {
            validator: checkCode,
            trigger: 'blur'
          }
        ],
        manager: [
          {
            required: true,
            message: '部门负责人不能为空'
          }
        ],
        introduce: [
          {
            required: true,
            message: '部门介绍不能为空'
          },
          {
            min: 1,
            max: 300,
            message: '必须填1-300个字符'
          }
        ]
      },
      // 接收获取的员工简单列表的数据
      options: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  methods: {
    // 获取员工简单列表数据
    async getEmployeeSimple() {
      // 表单验证
      this.options = await getEmployeeSimple()
    },
    async getDetailById(id) {
      this.formData = await getDepartDetail(id)
    },
    // 点击确认添加数据
    async submit() {
      await this.$refs.form.validate()
      if (this.formData.id) {
        // 编辑场景
        await updateDepartments(this.formData)
      } else {
        // 新增场景
        await addDepartments({
          ...this.formData, // 把表单数据对象展开
          pid: this.currentNode.id
        })
      }

      this.$message.success(`${this.showTitle}成功`)
      this.$emit('addDepts')
      this.$emit('update:isShowAddDept', false)
      this.close()
    },
    close() {
      this.$refs.form.resetFields()
      this.$emit('update:isShowAddDept', false)
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    }
  }
}
</script>

<style></style>
