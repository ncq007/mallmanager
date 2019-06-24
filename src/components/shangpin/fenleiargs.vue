<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread lev1="商品管理" lev2="分类参数"></my-bread>
    <el-alert title="注意:只允许为第三级分类设置参数" class="alert" type="warning" show-icon></el-alert>
    <el-form>
      <el-form-item label="请选择商品分类">
        {{value}}
        <el-cascader
          :show-all-levels="false"
          v-model="value"
          :options="options"
          :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children' }"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <el-button @click="show_dialog_dt_args" type="primary" size="medium">设置动态参数</el-button>
        <el-table :data="tableData_dt" style="width: 100%">
          <el-table-column type="expand" label="#">
            <template slot-scope="scope">
              <el-tag
                :key="tag"
                v-for="(tag, index) in scope.row.arr_attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row, index)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                :ref="scope.row.attr_id"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
              >+ 新增标签</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" size="small"></el-button>
              <el-button
                @click="del_dt_args(scope.row)"
                icon="el-icon-delete"
                size="small"
                type="danger"
                plain
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-button type="primary" size="medium">设置静态参数</el-button>
        <el-table :data="tableData_jt" style="width: 100%" height="330px">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" size="small"></el-button>
              <el-button icon="el-icon-delete" size="small" type="danger" plain></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 对话框 --设置动态参数 -->
    <el-dialog title="设置动态参数" :visible.sync="dialogFormVisible_dt_args">
      <el-form :model="form_dt_args" label-width="100px">
        <el-form-item label="参数名称">
          <el-input v-model="form_dt_args.attr_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="form_dt_args.attr_vals" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_dt_args = false">取 消</el-button>
        <el-button type="primary" @click="add_dt_args">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      value: [],
      options: [],
      activeName: '1',
      tableData_dt: [],
      tableData_jt: [],
      // inputVisible: false,
      arr_ref: [],
      dialogFormVisible_dt_args: false,
      form_dt_args: {
        attr_name: '',
        attr_vals: '',
        attr_sel: 'many'
      }
    }
  },

  created() {
    this.get_goods_cate()
  },
  methods: {
    // 设置动态参数，发送请求
    async add_dt_args() {
      const res = await this.$http.post(
        `categories/${this.value[2]}/attributes`,
        this.form_dt_args
      )
      console.log(res)
      this.dialogFormVisible_dt_args = false
      const { msg, status } = res.data.meta
      if (status === 201) {
        this.$message.success(msg)
        this.get_dt_args()
        Object.assign(
          this.$data.form_dt_args,
          this.$options.data().form_dt_args
        )
      } else {
        this.$message.warning(msg)
      }
    },
    // 删除动态参数， 发送请求
    del_dt_args(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(
            `categories/${row.cat_id}/attributes/${row.attr_id}`
          )
          const { msg, status } = res.data.meta
          if (status === 200) {
            this.get_dt_args()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message.warning('删除失败！！！')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 显示对话框 -- 设置动态参数
    show_dialog_dt_args() {
      this.dialogFormVisible_dt_args = true
    },
    // 展开列表相关：
    async handleClose(row, index) {
      console.log(row)
      row.arr_attr_vals.splice(index, 1)
      row.attr_vals = row.arr_attr_vals.join(',')
      const res = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        row
      )
      // console.log(res)
      const { msg, status } = res.data.meta
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.warning('删除失败！！！')
      }
    },

    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs[row.attr_id].$refs.input.focus()
      })
    },

    async handleInputConfirm(row) {
      let inputValue = row.inputValue.trim()
      if (inputValue && row.arr_attr_vals.indexOf(inputValue) === -1) {
        row.arr_attr_vals.push(inputValue)
        row.attr_vals = row.arr_attr_vals.join(',')
      } else if (row.arr_attr_vals.indexOf(inputValue) !== -1) {
        this.$message.warning('已存在的参数，请重新输入！！！')
        return
      } else {
        return
      }
      row.inputVisible = false
      row.inputValue = ''
      const res = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        row
      )
      console.log(res)
      const { msg, status } = res.data.meta
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.warning('添加失败！！！')
      }
    },
    // 获取动态参数列表数据：
    async get_dt_args() {
      const res_dt = await this.$http({
        url: `categories/${this.value[2]}/attributes`,
        type: 'get',
        params: { sel: 'many' }
      })
      this.tableData_dt = res_dt.data.data
      console.log(this.tableData_dt)
      this.tableData_dt.forEach(item => {
        let arr = item.attr_vals.split(',')
        this.$set(item, 'arr_attr_vals', arr)
        this.$set(item, 'inputValue', '')
        this.$set(item, 'inputVisible', false)
      })
    },
    // 获取静态参数列表数据：
    async get_jt_args() {
      const res_jt = await this.$http({
        url: `categories/${this.value[2]}/attributes`,
        type: 'get',
        params: { sel: 'only' }
      })
      this.tableData_jt = res_jt.data.data
      // console.log(this.tableData_jt)
    },
    // 切换标签触发的事件
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    // 改变级联选择器的选项触发的方法：
    handleChange() {
      if (this.value.length === 3) {
        this.get_dt_args()
        this.get_jt_args()
      }
    },

    // 获取三级分类数据的请求：
    async get_goods_cate() {
      // const res = await this.$http({
      //   url: 'categories',
      //   type: 'get',
      //   params: { type: 3 }
      // })
      // const res = await this.$http.get('categories',{type:3})
      const res = await this.$http.get('categories?type=3')
      // console.log(res)
      this.options = res.data.data
    }
  }
}
</script>

<style>
.alert {
  margin: 20px 0;
}
.input-new-tag {
  width: 80px;
}
</style>
