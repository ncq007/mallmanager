<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread lev1="权限管理" lev2="角色列表"></my-bread>
    <br>
    <!-- 按钮 -->
    <el-button @click="show_dialog_add" style="margin-bottom: 20px">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="role_list" style="width: 100%">
      <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <span v-if="scope.row.children.length === 0">无权限</span>
          <el-row v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag @close="handleClose(scope.row, item1)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag
                    @close="handleClose(scope.row, item2)"
                    type="success"
                    closable
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="handleClose(scope.row, item3)"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    type="warning"
                    closable
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName" width="180"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="show_dialog_edit(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            plain
          ></el-button>
          <el-button type="success" icon="el-icon-setting" circle plain></el-button>
          <el-button
            @click="del_role(scope.row.id)"
            type="danger"
            icon="el-icon-delete"
            circle
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 --编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisible_edit">
      <el-form :model="form_edit" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="form_edit.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form_edit.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_edit = false">取 消</el-button>
        <el-button type="primary" @click="edit_role(form_edit.roleId)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框 --添加角色 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible_add">
      <el-form :model="form_add" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="form_add.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form_add.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_add = false">取 消</el-button>
        <el-button type="primary" @click="add_role">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      role_list: [],
      form_edit: {
        roleName: '',
        roleDesc: ''
      },
      form_add: {
        roleName: '',
        roleDesc: ''
      },
      dialogFormVisible_edit: false,
      dialogFormVisible_add: false
    }
  },
  created() {
    this.get_role_list()
  },
  methods: {
    //关闭标签 -- 发送请求
    async handleClose(role, tag) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${tag.id}`)
      // console.log(res)
      const { msg, status } = res.data.meta
      if (status === 200) {
        role.children = res.data.data
        this.$message.success(msg)
      }else {this.$message.warning("设置权限失败！！！")}
      // 想尝试在前端处理数据。3层嵌套数组有点麻烦。
      // for (let item1 of role) {
      //   if (item1 === tag) {
      //     console.log(role)
      //     console.log(role.children)
      //     // role.splice(role.indexOf(tag), 1)
      //   }
      // }
      // for (let i = 0; i < role.length; i++) {
      //   for (let item2 of role[i].children) {
      //     if (item2 === tag) {
      //       role[i].children.splice(i, 1)
      //       role.splice(role.indexOf(role[i]), 0, role[i])
      //     }
      //   }
      // }
    },
    // 删除角色 -- 发送请求
    del_role(rid) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const res = await this.$http.delete(`roles/${rid}`)
          this.get_role_list()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加角色 -- 发送请求
    async add_role() {
      const res = await this.$http.post('roles', this.form_add)
      // console.log(res)
      this.dialogFormVisible_add = false
      Object.assign(this.$data.form_add, this.$options.data().form_add)
      this.get_role_list()
    },
    // 显示对话框 -- 添加角色
    show_dialog_add() {
      this.dialogFormVisible_add = true
    },
    // 编辑角色 -- 发送请求
    async edit_role(rid) {
      const res = await this.$http.put(`roles/${rid}`, this.form_edit)
      // console.log(res)
      const { msg, status } = res.data.meta
      this.dialogFormVisible_edit = false
      if (status === 200) {
        this.get_role_list()
        this.$message.success('修改成功')
      }
    },
    // 显示对话框 -- 编辑角色
    show_dialog_edit(role) {
      this.dialogFormVisible_edit = true
      this.form_edit.roleName = role.roleName
      this.form_edit.roleDesc = role.roleDesc
      this.form_edit.roleId = role.id
    },
    async get_role_list() {
      const res = await this.$http.get('roles')
      // console.log(res)
      this.role_list = res.data.data
      // console.log(this.role_list)
    }
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
