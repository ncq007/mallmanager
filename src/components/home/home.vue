<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple" style="visibility:hidden;">
            <img src="../../../static/logo.png" alt="无法加载图片" />
          </div>
        </el-col>
        <el-col :span="14" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="4" class="middle">
          <span style="font-size:20px;color:black;">用户名：{{username}}</span>
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
          <el-submenu :index="''+(index+1)" v-for="(item, index) in menus" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="item1.path" v-for="item1 in item.children" :key="item1.id">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item1.authName}}</span>
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
  data () {
    return {
      num: 12,
      menus: [],
      username: ''
    }
  },
  beforeCreate () {
    const token = sessionStorage.getItem('token')
    if (!token) {
      this.$message.warning('请先登录！')
      this.$router.push({ name: 'login' })
    }
  },
  created () {
    this.get_menus()
  },
  methods: {
    // 获取导航菜单 -- 发送请求
    async get_menus () {
      const res = await this.$http.get('menus')
      // console.log(res)
      this.menus = res.data.data
      this.username = JSON.parse(sessionStorage.getItem('username'))
      // console.log(this.username)
    },
    // 退出登录
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
