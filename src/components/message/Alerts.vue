<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>消息设置</el-breadcrumb-item>
        <el-breadcrumb-item>消息告警</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-table :data="alertsList" border  >
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
          <el-table-column prop="remark" label="告警级别描述" align="center">
          </el-table-column>
          <el-table-column prop="isvaild" label="状态" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isopen" @change="updataUserState(scope.row)"></el-switch></template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button @click="openAlerts(scope.row)" type="primary" size="small">编辑</el-button>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-dialog title="编辑" :visible.sync="editDialogVisible" width="50%" >
        <el-form :model="editForm" status-icon :rules="rulesAdd" ref="ruleFormEdit" label-width="100px" class="demo-ruleForm">
          <el-form-item label="告警对象" >
            <el-select v-model="editForm.people"  placeholder="告警对象" @change="changeAlerts">
              <el-option  v-for="option in editOption" :key="option.id"  :label="option.username" :value="option.username" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="alertsmessage">
            <el-input v-model="editForm.phone" readonly></el-input>
          </el-form-item>
          <el-form-item label="告警内容" prop="alertsmessage">
            <el-input v-model="editForm.alertsmessage"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAlerts">确 定</el-button>
  </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Alerts',
  data () {
    return {
      editOption: { username: '' },
      alertsList: [],
      editDialogVisible: false,
      editForm: {},
      rulesAdd: {
        name: [
          {
            required: true,
            message: '请输入告警对象',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          }
        ],
        alertsmessage: [
          {
            required: true,
            message: '请输入告警内容',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.getAlertsList()
    this.getUserName()
  },
  methods: {
    async updataUserState (alertsInfo) {
      const { data: res } = await this.$http.put('sys/alerts/' + alertsInfo.id + '/' + alertsInfo.isopen)
      if (res.code !== 200) {
        alertsInfo.isopen = !alertsInfo.isopen
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
    },
    async  editAlerts () {
      this.$refs.ruleFormEdit.validate(async (valid) => {
        if (valid === true) {
          const { data: res } = await this.$http.put('sys/alerts', this.editForm)
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.$message.success(res.msg)
          this.editDialogVisible = false
        }
      })
    },
    async changeAlerts (val) {
      const { data: res } = await this.$http.get('sys/user?username=' + val)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.editForm.phone = res.data.result[0].phone
    },
    openAlerts (alerts) {
      this.editDialogVisible = true
      this.editForm = alerts
    },
    async getAlertsList () {
      const { data: res } = await this.$http.get('sys/alerts')
      // eslint-disable-next-line eqeqeq
      if (res.code != 200) {
        return this.$message.error(res.msg)
      }
      this.alertsList = res.data
    },
    async getUserName () {
      const { data: res } = await this.$http.get('sys/user/getUsername')
      // eslint-disable-next-line eqeqeq
      if (res.code != 200) {
        return this.$message.error(res.msg)
      }
      this.editOption = res.data
    }
  }
}
</script>
<style scoped>
  .el-table-column {
    text-align: center;
  }
</style>
