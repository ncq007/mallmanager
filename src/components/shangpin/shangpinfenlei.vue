<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread lev1="商品管理" lev2="商品分类"></my-bread>
    <!-- 添加按钮 -->
    <el-button type="success" plain class="button">添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="goods_cat" style="width: 100%">
      <el-table-column label="分类名称" width="180">
        <template slot-scope="scope">
          <el-tree :data="[scope.row]" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </template>
      </el-table-column>
      <el-table-column label="级别" width="180">
        <template slot-scope="scope">{{level[scope.row.cat_level]}}</template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted">无效</span>
          <span v-else>有效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page_num"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="cat_total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      defaultProps: {
        label: 'cat_name',
        children: 'children'
      },
      level: ['一级', '二级', '三级'],
      goods_cat: [],
      page_num: 1,
      page_size: 5,
      cat_total: 0
    }
  },
  created() {
    this.get_goods_cat()
  },
  methods: {
    handleNodeClick() {},
    // 每页显示的条数
    handleSizeChange(val) {
      this.page_size = val
      this.page_num = 1
      this.get_goods_cat()
      console.log(`每页 ${val} 条`)
    },
    // 跳转到第几页
    handleCurrentChange(val) {
      this.page_num = val
      this.get_goods_cat()
      console.log(`当前页: ${val}`)
    },
    async get_goods_cat() {
      const res = await this.$http({
        url: 'categories',
        type: 'get',
        params: {
          pagenum: this.page_num,
          pagesize: this.page_size
        }
      })
      // console.log(res)
      const { msg, status } = res.data.meta
      const { result, total } = res.data.data
      this.goods_cat = result
      console.log(this.goods_cat)
      this.cat_total = total
    }
  }
}
</script>

<style>
.button {
  margin: 20px 0;
}
</style>
