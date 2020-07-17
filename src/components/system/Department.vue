<template>
    <div>
      <!--面包屑导航区-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-table :data="departmentList" border style="width: 100%">
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="phone" label="联系电话" width="180">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'Department',
  data () {
    return {
      departmentList: [{}]
    }
  },
  mounted () {
    this.getDepartmentList()
  },
  methods: {
    async getDepartmentList () {
      const { data: res } = await this.$http.get('sys/department')
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      console.log(res)
      this.departmentList = res.data
    }
  }
}
</script>

<style scoped>

</style>
