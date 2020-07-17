<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>消息设置</el-breadcrumb-item>
    <el-breadcrumb-item>催办消息</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-table :data="urgeList" border  >
      <el-table-column type="index" label="编号" align="center" width="100"></el-table-column>
      <el-table-column prop="alertsname" label="标题" align="center" >
      </el-table-column>
      <el-table-column prop="people" label="告警对象" align="center" >
      </el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center">
      </el-table-column>
      <el-table-column prop="alertsmessage" label="告警内容" align="center">
      </el-table-column>
      <el-table-column prop="alertslevel" label="告警级别" align="center">
      </el-table-column>
      <el-table-column prop="valuename" label="状态" align="center">
      </el-table-column>
      <el-table-column prop="alertsnumber" label="已告警次数" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button @click="openUrge(scope.row)" type="primary" size="small">提醒处理</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
export default {
  name: 'Urge',
  data () {
    return {
      urgeList: []
    }
  },
  mounted () {
    this.getUrgeList()
  },
  methods: {
    async getUrgeList () {
      const { data: res } = await this.$http.get('sys/alerts/log')
      // eslint-disable-next-line eqeqeq
      if (res.code != 200) {
        return this.$message.error(res.msg)
      }
      console.log(res)
      this.urgeList = res.data.result
    },
    async  openUrge (urgeInfo) {
      console.log(urgeInfo)
      const { data: res } = await this.$http.post('sys/alerts/log/' + urgeInfo.phone + '/' + urgeInfo.alertsmessage
      )
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
    }
  }
}
</script>

<style scoped>

</style>
