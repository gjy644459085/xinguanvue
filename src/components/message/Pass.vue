<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>消息设置</el-breadcrumb-item>
      <el-breadcrumb-item>审批管理</el-breadcrumb-item>
      <el-breadcrumb-item>已审批</el-breadcrumb-item>
    </el-breadcrumb>
      <el-card>
        <el-table :data="passList" border style="width: 100%">
          <el-table-column type="index" label="编号" align="center"></el-table-column>
          <el-table-column prop="title" label="标题" align="center">
          </el-table-column>
          <el-table-column prop="name" label="审批发起人"  align="center" >
          </el-table-column>
          <el-table-column prop="reason" label="申请原因"  align="center">
          </el-table-column>
          <el-table-column  label="状态"   align="center">
            <template slot-scope="scope">
              <el-tag type="success">{{ scope.row.valuename }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ctime" label="申请日期"  align="center">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
              <el-button type="warning" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'Pass',
  data () {
    return {
      passList: [{}]
    }
  },
  mounted () {
    this.getPassList()
  },
  methods: {
    async getPassList () {
      const { data: res } = await this.$http.get('sys/approve/pass')
      // eslint-disable-next-line eqeqeq
      if (res.code != 200) {
        return this.$message.error(res.msg)
      }
      this.passList = res.data.result
    }
  }
}
</script>

<style scoped>

</style>
