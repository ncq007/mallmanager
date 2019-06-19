<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{lev1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{lev2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'my-bread',
  props: ['lev1', 'lev2']
}
</script>

<style>
</style>