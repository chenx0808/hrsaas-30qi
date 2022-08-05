<template>
  <div>
    <el-card class="content">
      <el-tabs>
        <el-tab-pane label="登录用户设置">
          <el-form ref="fromRef" class="from" :model="fromData" :rules="rulse" label-width="120px">
            <el-form-item label="姓名" prop="username">
              <el-input v-model="fromData.username" style="width:400px" />
            </el-form-item>

            <el-form-item label="密码" prop="password2">
              <el-input v-model="fromData.password2" style="width:400px" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="updataUserInfo">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情">
          <!-- 动态组件 通过is属性指定展示的组件 -->
          <component :is="Userinfo" />
        </el-tab-pane>
        <el-tab-pane label="岗位信息">
          <component :is="Jobinfo" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import Userinfo from '@/views/employees/components/user-info.vue'
import Jobinfo from '@/views/employees/components/job-info.vue'
export default {
  components: {
    Userinfo,
    Jobinfo
  },
  data() {
    return {
      Userinfo: 'Userinfo',
      Jobinfo: 'Jobinfo',
      fromData: {
        username: '',
        password2: ''
      },
      rulse: {
        username: [
          {
            required: true,
            trigger: 'blur',
            message: '姓名不能为空'
          }
        ],
        password2: [
          {
            required: true,
            trigger: 'blur',
            message: '密码不能为空'
          },
          {
            min: 6,
            max: 16,
            message: '密码长度6-16位', trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    // 获取用户信息
    this.getUserInfo()
    // console.log(this.$route.params.id)
  },
  methods: {
    async getUserInfo() {
      // 获取用户信息的时候需要用户id
      this.fromData = await getUserDetailById(this.$route.params.id)
      // console.log(res)
    },
    async updataUserInfo() {
      await this.$refs.fromRef.validate()
      try {
        await saveUserDetailById({
          ...this.fromData,
          password: this.fromData.password2
        })
        this.$message.success('更新成功')
      } catch (e) {
        this.$message.error(e.message || '更新失败')
      }
    }
  }

}
</script>

<style scoped lang="scss">
.content{
  margin: 20px;
  .from{
    margin-left: 100px;
    margin-top: 20px;
  }
}
</style>
