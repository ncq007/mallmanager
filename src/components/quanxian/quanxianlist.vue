<template>
  <el-card class="box-card" style="height:100%">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>-->
    <!-- 使用封装的自定义组件 -->
    <my-bread lev1="权限管理" lev2="权限列表"></my-bread>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" height=430>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.get_rights_list()
  },
  methods: {
    async get_rights_list() {
      const res = await this.$http.get('rights/list')
      // console.log(res)
      const {msg, status} = res.data.meta
      if (status === 200) {
        this.tableData = res.data.data
      }
    }
  }
}
</script>

<style>
</style>
