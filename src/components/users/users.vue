<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="search">
      <el-col>
        <el-input
          placeholder="请输入内容"
          v-model="search_value"
          class="input-with-select"
          clearable
          @clear="handle_claer"
        >
          <el-button slot="append" icon="el-icon-search" @click="search_users"></el-button>
        </el-input>
        <el-button type="success" @click="show_add_dialog" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="users_list" style="width: 100%">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="创建日期">
        <template slot-scope="scope">{{scope.row.create_time | format_data('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="handle_switch(scope.row.id, scope.row.mg_state)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="show_edit_dialog(scope.row)"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            circle
          ></el-button>
          <el-button
            @click="del_user(scope.row.id)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            circle
          ></el-button>
          <el-button
            @click="show_role_dialog(scope.row)"
            type="success"
            icon="el-icon-user"
            size="mini"
            plain
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page_num"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="users_total"
    ></el-pagination>

    <!-- 对话框  添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible_add">
      <el-form :model="form" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_add = false">取 消</el-button>
        <el-button type="primary" @click="add_user">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框  编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible_edit">
      <el-form :model="form_edit" label-width="100px">
        <el-form-item label="用户名">
          <el-input disabled v-model="form_edit.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form_edit.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form_edit.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_edit = false">取 消</el-button>
        <el-button type="primary" @click="edit_user">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisible_role">
      <el-form :model="form_role" label-width="100px">
        <el-form-item label="用户名">{{form_role.username}}</el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form_role.rid" placeholder="请选择">
            <!-- <el-option label="区域一" value="shanghai"></el-option> -->
            <el-option
              v-for="item in roles_list"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_role = false">取 消</el-button>
        <el-button type="primary" @click="assign_role(form_role.id, form_role.rid)">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>


<script>
export default {
  data() {
    return {
      search_value: '',
      page_num: 1,
      page_size: 8,
      users_total: 0,
      users_list: [],
      dialogFormVisible_add: false,
      dialogFormVisible_edit: false,
      dialogFormVisible_role: false,
      form: {},
      form_edit: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      form_role: {
        username: '',
        id: '',
        rid: ''
      },
      roles_list: []
    }
  },

  created() {
    this.get_users_list()
  },

  methods: {
    // 分配角色 -- 发送请求
    async assign_role(id, rid) {
      const res = await this.$http.put(`users/${id}/role`, { rid })
      console.log(res)
      this.dialogFormVisible_role = false
      const { msg, status } = res.data.meta
      if (status === 200) this.$message.success(msg)
    },
    // 显示对话框 -- 分配角色
    async show_role_dialog(user) {
      // 获取所有角色列表 -- 发送请求
      const res = await this.$http.get('roles')
      const res_rid = await this.$http.get(`users/${user.id}`)
      // console.log(res)
      // console.log(res_rid)
      // this.form_role.id = res_rid.data.data.id
      // this.form_role.rid = res_rid.data.data.rid
      this.roles_list = res.data.data
      this.form_role = res_rid.data.data
      // console.log(this.roles_list)
      const { msg, status } = res.data.meta
      if (status === 200) {
        this.dialogFormVisible_role = true
        this.form_role.username = user.username
      } else {
        this.$message.warning(msg)
      }
    },
    // 编辑用户 -- 发送请求
    async edit_user() {
      const res = await this.$http.put(`users/${this.form_edit.id}`, {
        email: this.form_edit.email,
        mobile: this.form_edit.mobile
      })
      const { msg, status } = res.data.meta
      if (status === 200) {
        this.$message.success(msg)
        this.dialogFormVisible_edit = false
        this.get_users_list()
      }
    },
    // 显示对话框 -- 编辑用户
    show_edit_dialog(user) {
      this.dialogFormVisible_edit = true
      if (this.form_edit.id !== user.id) {
        this.form_edit.username = user.username
        this.form_edit.email = user.email
        this.form_edit.mobile = user.mobile
        this.form_edit.id = user.id
        // this.form_edit = user
      }
    },
    // 删除用户 -- 发送请求
    del_user(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${id}`)
          // console.log(res)
          const { msg, status } = res.data.meta
          if (status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 当删除到用户后，当前页面没有用户数据时，自动跳转到前一页
            if ((this.users_total - 1) % this.page_size === 0) {
              this.page_num -= 1
            }
            this.get_users_list()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加用户 -- 发送请求
    async add_user() {
      const res = await this.$http.post('users', this.form)
      // console.log(res)
      const { msg, status } = res.data.meta
      // console.log(status)
      // console.log(this.users_total, this.page_num, this.page_size)
      if (status === 201) {
        this.dialogFormVisible_add = false
        this.$message.success(msg)
        // 添加用户后，页面自动跳转到新添加用户所在的页面。
        const current_page = Math.ceil((this.users_total + 1) / this.page_size)
        // console.log(`current_page=${current_page}, 总条数=${this.users_total}`)
        this.handleCurrentChange(current_page)
        this.form = {}
      } else {
        this.$message.warning(msg)
      }
    },
    // 显示对话框 -- 添加用户
    show_add_dialog() {
      this.dialogFormVisible_add = true
    },
    // 清除搜索输入框内容时，页面重新加载
    handle_claer() {
      this.get_users_list()
    },
    // 根据搜索输入框内容，发送请求查询
    search_users() {
      this.get_users_list()
    },
    // 切换每页显示的条数
    handleSizeChange(val) {
      this.page_size = val
      this.page_num = 1
      this.get_users_list()
      console.log(`每页 ${val} 条`)
    },
    // 跳转到第几页
    handleCurrentChange(val) {
      this.page_num = val
      this.get_users_list()
      console.log(`当前页: ${val}`)
    },
    // 请求用户列表数据
    async get_users_list() {      
      const res = await this.$http.get(
        `users?query=${this.search_value}&pagenum=${this.page_num}&pagesize=${
          this.page_size
        }`
      )
      // console.log(res)
      const {
        meta: { msg, status },
        data: { total, users }
      } = res.data
      if (status === 200) {
        // this.$message.success(msg)
        this.users_total = total
        this.users_list = users
      } else {
        this.$message.warning(msg)
      }
    },
    // 设置状态
    async handle_switch(userId, userType) {
      const res = await this.$http.put(`users/${userId}/state/${userType}`)
      // console.log(res)
      const { msg, status } = res.data.meta
      let type = 'warning'
      if (status === 200) {
        // this.$message.success(msg)
        type = 'success'
      }
      this.$message[type](msg)
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.search {
  margin-top: 20px;
}
.input-with-select {
  width: 300px;
}
</style>
