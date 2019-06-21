<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread lev1="商品管理" lev2="商品列表"></my-bread>
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
          <el-button slot="append" icon="el-icon-search" @click="search_goods"></el-button>
        </el-input>
        <el-button type="success" @click="to_add_router" plain>添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="goods_list" style="width: 100%" height="410">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
      <el-table-column prop="goods_number" label="商品数量" width="100"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
      <el-table-column label="创建日期" width="100">
        <template slot-scope="scope">{{scope.row.add_time | format_data('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column label="修改日期" width="100">
        <template slot-scope="scope">{{scope.row.upd_time | format_data('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="show_dialog_good(scope.row)"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            circle
          ></el-button>
          <el-button
            @click="del_goods(scope.row.goods_id)"
            type="danger"
            icon="el-icon-delete"
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
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="goods_total"
    ></el-pagination>

    <!-- 对话框 -- 修改商品 -->
    <el-dialog title="修改商品" :visible.sync="dialogFormVisible_edit">
      <el-form :model="form_edit" label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="form_edit.goods_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="form_edit.goods_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="form_edit.goods_number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form_edit.goods_weight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-cascader
            v-model="value"
            :options="options"
            :props="default_props"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_edit = false">取 消</el-button>
        <el-button type="primary" @click="edit_good(form_edit.goods_id)">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      goods_list: [],
      search_value: '',
      page_num: 1,
      page_size: 10,
      goods_total: 0,
      form_edit: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: '',
        goods_id: -1
      },
      dialogFormVisible_edit: false,
      value: [],
      options: [],
      default_props: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  },
  created() {
    this.get_goods_list()
  },
  methods: {
    // 选择商品分类
    handleChange() {
      this.form_edit.goods_cat = this.value.join(',')
      console.log(this.form_edit.goods_cat)
    },
    // 跳转到添加商品路由组件
    to_add_router() {
      this.$router.push({ name: 'addgoods' })
    },
    // 清空搜素框 - 页面重新加载
    handle_claer() {
      this.get_goods_list()
    },
    // 搜索商品
    search_goods() {
      this.get_goods_list()
    },
    // 删除商品 -- 发送请求
    del_goods(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      })
        .then(async () => {
          const res = await this.$http.delete(`goods/${id}`)
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
            this.get_goods_list()
          }
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          })
        })
    },
    // 编辑商品 -- 发送请求
    async edit_good(goodID) {
      const res = await this.$http.put(`goods/${goodID}`, {
        goods_name: this.form_edit.goods_name,
        goods_price: this.form_edit.goods_price,
        goods_number: this.form_edit.goods_number,
        goods_weight: this.form_edit.goods_weight,
        goods_cat: this.form_edit.goods_cat,
        goods_introduce: '',
        pics: [],
        attrs: []
      })
      this.dialogFormVisible_edit = false
      const { msg, status } = res.data.meta
      if (status === 200) {
        this.$message.success(msg)
        this.get_goods_list()
      } else {
        this.$message.warning(msg)
      }
    },
    // 编辑商品 -- 显示对话框
    async show_dialog_good(good) {
      const res = await this.$http({
        url: 'categories',
        type: 'get',
        params: { type: 3 }
      })
      // console.log(res)
      this.options = res.data.data
      console.log(good)
      const { goods_id } = good
      this.dialogFormVisible_edit = true
      if (this.form_edit.goods_id === goods_id) return
      this.form_edit.goods_name = good.goods_name
      this.form_edit.goods_price = good.goods_price
      this.form_edit.goods_number = good.goods_number
      this.form_edit.goods_weight = good.goods_weight

      this.form_edit.goods_id = goods_id
    },
    handleSizeChange(val) {
      this.page_size = val
      this.page_num = 1
      this.get_goods_list()
      console.log(`每页 ${val} 条`)
    },
    // 跳转到第几页
    handleCurrentChange(val) {
      this.page_num = val
      this.get_goods_list()
      console.log(`当前页: ${val}`)
    },
    async get_goods_list() {
      const res = await this.$http({
        url: 'goods',
        type: 'get',
        params: {
          query: this.search_value,
          pagenum: this.page_num,
          pagesize: this.page_size
        }
      })
      // console.log(res)
      const { msg, status } = res.data.meta
      const { goods, total } = res.data.data
      this.goods_total = total
      if (status === 200) this.goods_list = goods
      else this.$message.warning('获取商品失败！！！')
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
