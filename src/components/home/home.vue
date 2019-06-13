<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../../../static/logo.png" alt="无法加载图片">
          </div>
        </el-col>
        <el-col :span="18" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="2">
          <a class="login_out" href="#" @click.prevent="handle_longin_out">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu :router="true" :unique-opened="true" class="menu">
          <!-- 1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="users">
                <i class="el-icon-menu"></i>
                <span slot="title">用户列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="role">
                <i class="el-icon-menu"></i>
                <span slot="title">角色列表</span>
              </el-menu-item>
              <el-menu-item index="rights">
                <i class="el-icon-menu"></i>
                <span slot="title">权限列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="shangpinlist">
                <i class="el-icon-menu"></i>
                <span slot="title">商品列表</span>
              </el-menu-item>
              <el-menu-item index="fenleiargs">
                <i class="el-icon-menu"></i>
                <span slot="title">分类参数</span>
              </el-menu-item>
              <el-menu-item index="shangpinfenlei">
                <i class="el-icon-menu"></i>
                <span slot="title">商品分类</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="dingdan">
                <i class="el-icon-menu"></i>
                <span slot="title">订单列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="data">
                <i class="el-icon-menu"></i>
                <span slot="title">数据报表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  beforeCreate () {
    const token = sessionStorage.getItem('token')
    if (!token) {
      this.$message.warning('请先登录！')
      this.$router.push({ name: 'login' })
    }
  },
  methods: {
    handle_longin_out () {
      sessionStorage.clear()
      this.$message.warning('恭喜你, 退出成功。。。')
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
}
.middle {
  text-align: center;
  line-height: 60px;
  font-size: 30px;
  color: #fafafa;
}
.login_out {
  line-height: 60px;
  text-decoration: none;
  font-size: 25px;
  color: red;
}
#right {
  text-align: right;
}
</style>
