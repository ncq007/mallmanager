<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="formData.password"></el-input>
      </el-form-item>
      <el-button @click="handleLogin" class="login-button" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      const res = await this.$http.post('login', this.formData)
      console.log(res)
      const {
        data,
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        console.log(data)
        const token = data.token
        console.log(token)
        sessionStorage.setItem('token', token)
        const username = this.formData.username
        sessionStorage.setItem('username', JSON.stringify(username))
        this.$message.success(msg)
        this.$router.push({ name: 'home' })
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-form .login-button {
  width: 100%;
}
</style>
