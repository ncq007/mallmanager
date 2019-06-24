<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread lev1="商品管理" lev2="商品分类"></my-bread>
    <!-- 添加按钮 -->
    <el-button @click="show_dialog_add" type="success" plain class="button">添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="goods_cat" style="width: 100%">
      <el-tree-grid
        label="分类名称"
        prop="cat_name"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childK
        ey="children"
      ></el-tree-grid>
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
          <el-button
            @click="show_dialog_edit(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            plain
          ></el-button>
          <el-button
            @click="del_goods_cat(scope.row.cat_id)"
            type="danger"
            icon="el-icon-delete"
            circle
            plain
          ></el-button>
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

    <!-- 对话框 -- 添加商品分类 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogFormVisible_add">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="100px">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" label-width="100px">
          {{value}}
          <el-cascader
            clearable
            v-model="value"
            :options="options"
            :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children', checkStrictly:true }"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_add = false">取 消</el-button>
        <el-button type="primary" @click="add_goods_cat">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框 -- 修改商品分类 -->
    <el-dialog title="修改商品分类" :visible.sync="dialogFormVisible_edit">
      <el-form :model="form_edit">
        <el-form-item label="分类名称" label-width="100px">
          <el-input v-model="form_edit.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_edit = false">取 消</el-button>
        <el-button type="primary" @click="edit_goods_cat(form_edit.cat_id)">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import ElTreeGrid from 'element-tree-grid'

export default {
  components: {
    ElTreeGrid
  },
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
      cat_total: 0,
      dialogFormVisible_add: false,
      dialogFormVisible_edit: false,
      form: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      form_edit: {
        cat_name: '',
        cat_id: ''
      },
      options: [],
      options_: [],
      value: ''
    }
  },
  created() {
    this.get_goods_cat()
  },
  methods: {
    // 编辑商品分类 -- 发送请求
    async edit_goods_cat(id) {
      const res = await this.$http.put(`categories/${id}`, {
        cat_name: this.form_edit.cat_name
      })
      // console.log(res)
      this.dialogFormVisible_edit = false
      const { msg, status } = res.data.meta
      if (status === 200) {
        this.$message.success(msg)
        this.get_goods_cat()
      }
    },

    // 编辑商品分类 -- 显示对话框
    show_dialog_edit(row) {
      this.dialogFormVisible_edit = true
      this.form_edit.cat_name = row.cat_name
      this.form_edit.cat_id = row.cat_id
    },

    // 删除商品分类 -- 发送请求
    del_goods_cat(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      })
        .then(async () => {
          const res = await this.$http.delete(`categories/${id}`)
          // console.log(res)
          const { msg, status } = res.data.meta
          if (status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 当删除到用户后，当前页面没有用户数据时，自动跳转到前一页
            if ((this.cat_total - 1) % this.page_size === 0) {
              this.page_num -= 1
            }
            this.get_goods_cat()
          }
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          })
        })
    },

    // 发送请求 -- 添加商品分类
    async add_goods_cat() {
      switch (this.value.length) {
        case 0:
          this.form.cat_pid = 0
          this.form.cat_level = 0
          // console.log(this.options.indexOf(this.form.cat_name))
          for (let item of this.options) {
            if (item.cat_name === this.form.cat_name) {
              this.$message.warning('已存在的一级分类！！！')
              return
            }
          }
          break
        case 1:
          this.form.cat_pid = this.value[0]
          this.form.cat_level = 1
          for (let item of this.options) {
            if (
              item.cat_id === this.value[0] &&
              item.hasOwnProperty('children')
            ) {
              for (let item1 of item.children) {
                if (item1.cat_name === this.form.cat_name) {
                  this.$message.warning('已存在的二级分类！！！')
                  return
                }
              }
            }
          }
          break
        default:
          this.form.cat_pid = this.value[1]
          this.form.cat_level = 2
          for (let item of this.options_) {
            if (item.cat_id === this.value[0]) {
              for (let item1 of item.children) {
                if (
                  item1.cat_id === this.value[1] &&
                  item1.hasOwnProperty('children')
                ) {
                  for (let item2 of item1.children) {
                    if (item2.cat_name === this.form.cat_name) {
                      this.$message.warning('已存在的三级级分类！！！')
                      return
                    }
                  }
                }
              }
            }
          }
      }
      const res = await this.$http.post('categories', this.form)
      // console.log(res)
      this.dialogFormVisible_add = false
      const { msg, status } = res.data.meta
      if (status === 201) {
        this.$message.success(msg)
        this.get_goods_cat()
      }
    },

    // 显示对话框 -- 添加商品分类
    async show_dialog_add() {
      this.dialogFormVisible_add = true
      const res = await this.$http.get('categories?type=2')
      this.options = res.data.data
      const res1 = await this.$http.get('categories?type=3')
      this.options_ = res1.data.data
      console.log(this.options_)
    },
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
