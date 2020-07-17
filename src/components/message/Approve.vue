<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>消息设置</el-breadcrumb-item>
        <el-breadcrumb-item>审批管理</el-breadcrumb-item>
        <el-breadcrumb-item>待审批</el-breadcrumb-item>
      </el-breadcrumb>
        <el-card>
          <el-table :data="approveList" border style="width: 100%">
            <el-table-column type="index" label="编号" align="center"></el-table-column>
            <el-table-column prop="title" label="标题" align="center">
            </el-table-column>
            <el-table-column prop="name" label="审批发起人"  align="center" >
            </el-table-column>
            <el-table-column prop="reason" label="申请原因"  align="center">
            </el-table-column>
            <el-table-column label="状态"  align="center">
              <template slot-scope="scope">
                <el-tag type="warning">{{ scope.row.valuename }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="ctime" label="申请日期"  align="center">
            </el-table-column>
            <el-table-column fixed="right" label="操作"  align="center">
              <template slot-scope="scope">
                <el-button @click="passApprove(scope.row)" size="small" type="success">通过</el-button>
                <el-button type="warning" size="small" >驳回</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
  name: 'Approve',
  data () {
    return {
      approveList: [{}]
    }
  },
  mounted () {
    this.getApproveList()
  },
  methods: {
    async getApproveList () {
      const { data: res } = await this.$http.get('sys/approve')
      // eslint-disable-next-line eqeqeq
      if (res.code != 200) {
        return this.$message.error(res.msg)
      }
      this.approveList = res.data.result
    },
    async passApprove (approveInfo) {
      console.log(approveInfo)
      const { data: res } = await this.$http.put('sys/approve', approveInfo)
      // eslint-disable-next-line eqeqeq
      if (res.code != 200) {
        return this.$message.error(res.msg)
      }
      this.getApproveList()
      this.$message.success(res.msg)
    }
  }
}
</script>

<style scoped>

</style>
