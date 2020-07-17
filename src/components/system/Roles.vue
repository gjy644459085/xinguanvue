<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入角色名称" v-model="queryInfo.roleName">
            <el-button slot="append" icon="el-icon-search" @click="getRoleList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" style="width: 100%" stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row v-for="(i1,li) in props.row.children" :class="['vcenter',li === 0 ? 'bdtop':'']" :key="li">
              <el-col :span="4">
                <el-tag closable @close="delRights(props.row,i1)">{{i1.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="24">
                <el-row v-for="i2 in i1.children" :class="['vcenter','bdbottom']" :key="i2.id">
                  <el-col :span="8">
                    <el-tag closable type="success" @close="delRights(props.row,i2)">{{i2.name}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="24" class="vcenter">
                    <el-tag closable type="warning" @close="delRights(props.row,i3)" v-for="i3 in i2.children"
                            :key="i3.id">
                      {{i3.name}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ props.row }}</pre>-->
          </template>
        </el-table-column>
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="name" label="角色名称" width="300"></el-table-column>
        <el-table-column prop="remark" label="角色描述" width="300"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button @click="openEditRole(scope.row)" type="text" icon="el-icon-edit" size="small">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" @click="delRoleById(scope.row.id)" size="small">删除</el-button>
            <el-button type="text" icon="el-icon-setting" size="small" @click="openAssignRight(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.page"
                     :page-sizes="[5, 10, 15, 30]"
                     :page-size="queryInfo.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="closeAdd">
      <el-form :model="addForm" status-icon :rules="rulesAdd" ref="ruleFormAdd" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input  v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole()">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" @close="closeEdit">
      <el-form :model="editForm" status-icon :rules="rulesAdd" ref="ruleFormEdit" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input  v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRole()">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="rightDialogVisible" width="55%" @close="closeRight">
      <el-tree :data="rights" show-checkbox default-expand-all node-key="id" ref="tree"
               :default-checked-keys="keys" highlight-current :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="rightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="assignRight()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  mounted () {
    this.getRoleList()
    this.getRights()
  },
  methods: {
    delRoleById (roleId) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('sys/role/' + roleId)
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        await this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {

      })
    },
    editRole () {
      this.$refs.ruleFormEdit.validate(async (valid) => {
        if (valid === true) {
          const { data: res } = await this.$http.put('sys/role', this.editForm)
          if (res.code !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.getRoleList()
          this.$message.success(res.msg)
          this.editDialogVisible = false
        }
      })
    },
    openEditRole (role) {
      this.editForm = role
      this.editDialogVisible = true
    },
    closeEdit () {
      this.$refs.ruleFormEdit.resetFields()
    },
    addRole () {
      this.$refs.ruleFormAdd.validate(async (valid) => {
        if (valid === true) {
          const { data: res } = await this.$http.post('sys/role', this.addForm)
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.getRoleList()
          this.$message.success(res.msg)
          this.addDialogVisible = false
        }
      })
    },
    closeAdd () {
      this.$refs.ruleFormAdd.resetFields()
    },
    async assignRight () {
      const rights = [...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()]
      const roleId = this.roleId
      const roleRes = rights.map(resId => {
        return {
          roleId, resId
        }
      })
      const { data: res } = await this.$http.put('sys/roleRes/' + roleId, roleRes)
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.getRoleList()
      this.$message.success(res.msg)
      this.rightDialogVisible = false
    },
    async getRights () {
      const { data: res } = await this.$http.get('sys/res')
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.rights = res.data
    },
    closeRight () {
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
      })
    },
    openAssignRight (role) {
      this.rightDialogVisible = true
      const arr = []
      this.roleId = role.id
      role.children.forEach(item => this.leafkey(item, arr))
      this.keys = arr
    },
    leafkey (right, arr) {
      if (right.children.length === 0) {
        arr.push(right.id)
      }
      right.children.forEach(item => this.leafkey(item, arr))
    },
    async delRights (role, rights) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const arr = []
        this.findChildId(rights, arr)
        const { data: res } = await this.$http.delete('sys/roleRes/' + role.id + '/' + arr.join(','))
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.getRoleList()
        this.$message.success(res.msg)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
      })
    },
    findChildId (right, arr) {
      if (right.children.length !== 0) {
        right.children.forEach(item => this.findChildId(item, arr))
      }
      arr.push(right.id)
    },
    async getRoleList () {
      const { data: res } = await this.$http.get('sys/role', { params: this.queryInfo })
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.roleList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.queryInfo.size = val
      this.getRoleList()
    },
    handleCurrentChange (val) {
      this.queryInfo.page = val
      this.getRoleList()
    }
  },
  data () {
    return {
      editForm: {},
      addForm: {
        name: ''
      },
      roleId: '',
      keys: [],
      roleList: [{}],
      editDialogVisible: false,
      addDialogVisible: false,
      rightDialogVisible: false,
      rights: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rulesAdd: {
        name: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur'
          }
        ],
        remark: [
          {
            required: true,
            message: '请输入职责描述',
            trigger: 'blur'
          }
        ]
      },
      queryInfo: {
        roleName: '',
        page: 1,
        size: 10
      },
      total: 0
    }
  }
}
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }
</style>
