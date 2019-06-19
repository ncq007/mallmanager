<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread lev1="商品管理" lev2="商品列表"></my-bread>
    <!-- 提示信息 -->
    <el-alert title="添加商品信息" type="success" class="alert" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="+active" finish-status="success" space="50%" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品描述"></el-step>
    </el-steps>
    <!-- 左则步骤条 -- 放在form表单里面-->
    <el-form
      label-position="top"
      label-width="80px"
      :model="form_data"
      style="height: 450px;overflow:auto;"
    >
      <el-tabs @tab-click="change_tab()" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form_data.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form_data.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form_data.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form_data.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            {{value}}
            <el-cascader
              clearable
              v-model="value"
              :options="options"
              :props="default_props"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item v-for="item in arr_params_dy" :key="item.id" :label="item.attr_name">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                v-for="(item1, index) in item.attr_vals_"
                :key="index"
                :label="item1"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item2.attr_name" v-for="item2 in arr_params_jt" :key="item2.id">
            <el-input v-model="item2.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品描述">
          <el-form-item label="商品图片">
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </el-form-item>
          <el-form-item label="商品介绍">
            <quill-editor v-model="form_data.goods_introduce"></quill-editor>
          </el-form-item>
          <el-form-item>
            <el-button @click="add_goods" type="success" class="tijiao" plain>提 交</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      // 请求头
      headers: { Authorization: sessionStorage.getItem('token') },
      active: '1',
      form_data: {
        goods_name: '',
        goods_cat: '1,3,6',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      form_edit: {},
      // 1，2,3级id的数组
      value: [1, 3, 6],
      options: [],
      default_props: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数
      arr_params_dy: [],
      // 静态参数
      arr_params_jt: [],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created() {
    this.get_goods_cate()
  },
  methods: {
    // 添加商品 -- 提交 -- 发送请求
    async add_goods() {
      let arr1 = this.arr_params_dy.map(item1 => {
        return {attr_id: item1.attr_id, attr_value: item1.attr_vals}
      })
      let arr2 = this.arr_params_jt.map(item2 => {
        return {attr_id: item2.attr_id, attr_value: item2.attr_vals}
      })
      this.form_data.attrs = [...arr1, ...arr2]
      console.log(this.form_data)
      const res = await this.$http.post('goods', this.form_data)
      console.log(res)
      this.$router.push({name:'goods'})
      this.get_goods_cate()
    },
    // 上传图片
    handlePictureCardPreview(file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    handleRemove(file) {
      // console.log(file)
      // 图片路径 file.response.data.tmp_path
      let index = this.form_data.pics.indexOf({
        pic: file.response.data.tmp_path
      })
      this.form_data.pics.splice(index, 1)
      // console.log(this.form_data.pics)
    },
    handleSuccess(file) {
      // console.log(file)
      this.form_data.pics.push({ pic: file.data.tmp_path })
      // console.log(this.form_data.pics)
    },
    // 切换tab
    async change_tab() {
      if (this.value.length === 3) {
        if (this.active === '2') {
          const res_dt = await this.$http({
            url: `categories/${this.value[2]}/attributes`,
            type: 'get',
            params: { sel: 'many' }
          })
          // console.log(res)
          this.arr_params_dy = res_dt.data.data
          // console.log(this.arr_params_dy)
          this.arr_params_dy.forEach(item => {
            item.attr_vals = item.attr_vals.trim().split(',')
            item.attr_vals_ = item.attr_vals
            // item.attr_vals.forEach(item1 => {
            //   this.form_data.attrs.push({
            //     attr_id: item.attr_id,
            //     attr_value: item1
            //   })
            // })
          })
        } else if (this.active === '3') {
          const res_jt = await this.$http({
            url: `categories/${this.value[2]}/attributes`,
            type: 'get',
            params: { sel: 'only' }
          })
          this.arr_params_jt = res_jt.data.data
          // console.log(this.arr_params_jt)
          // this.arr_params_jt.forEach(item2 => {
          //   this.form_data.attrs.push({
          //     attr_id: item2.attr_id,
          //     attr_value: item2.attr_vals
          //   })
          // })
        }
      } else {
        this.$message.warning('请先选择3级分类')
      }
    },
    // 选择商品分类
    handleChange() {
      this.form_data.goods_cat = this.value.join(',')
    },
    // 获取商品分类数据列表
    async get_goods_cate() {
      const res = await this.$http({
        url: 'categories',
        type: 'get',
        params: { type: 3 }
      })
      // console.log(res)
      this.options = res.data.data
    }
  }
}
</script>

<style>
.alert {
  margin-top: 20px;
  margin-bottom: 10px;
}
.ql-editor {
  min-height: 400px;
}
.tijiao {
  display: block;
  margin: 0 auto;
}
</style>