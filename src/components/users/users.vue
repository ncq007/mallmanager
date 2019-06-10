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
        <el-input placeholder="请输入内容" v-model="input5" class="input-with-select" clearable @clear="handle_claer">
          <el-button slot="append" icon="el-icon-search" @click="search_users"></el-button>
        </el-input>
        <el-button type="success" plain>添加用户</el-button>
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
            @change="handle_switch"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain circle></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain circle></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain circle></el-button>
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
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      input5: '',
      page_num: 1,
      page_size: 2,
      users_total: 0,
      users_list: []
    }
  },

  created () {
    this.get_users_list()
  },

  methods: {
    handle_claer () {
      this.get_users_list()
    },
    search_users () {
      this.get_users_list()
    },
    handleSizeChange (val) {
      this.page_size = val
      this.page_num = 1
      this.get_users_list()
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.page_num = val
      this.get_users_list()
      console.log(`当前页: ${val}`)
    },
    async get_users_list () {
      const AUTH_TOKEN = sessionStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.input5}&pagenum=${this.page_num}&pagesize=${
          this.page_size
        }`
      )
      console.log(res)
      // const status = res.data.meta.status
      // const msg = res.data.meta.msg
      const {
        meta: { msg, status },
        data: { total, users }
      } = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.users_total = total
        this.users_list = users
      } else {
        this.$message.warning(msg)
      }
    },
    handle_switch () {
      this.flag = !this.flag
      this.$message.success('设置状态成功')
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
