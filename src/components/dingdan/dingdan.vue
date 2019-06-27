<template>
  <div>
    <!-- 面包屑 -->
    <my-bread lev1="订单管理" lev2="订单列表"></my-bread>
    <el-card class="box-card">
      <!-- 列表 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#" width="100"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100" align="center"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay==='0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template
            slot-scope="scope"
          >{{scope.row.create_time | format_data('YYYY-MM-DD HH:mm:ss')}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="show_dialog_edit"
              type="primary"
              icon="el-icon-edit"
              plain
              size="small"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page_num"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="orders_total"
    ></el-pagination>

    <!-- 对话框 -- 修改订单 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible_edit">
      <el-form :model="form_edit" label-width="100px">
        <el-form-item label="省市区/县">
          <el-cascader
            v-model="value"
            :options="orders_list"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form_edit.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_edit = false">取 消</el-button>
        <el-button type="primary" @click="edit_orders()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orders_list from '@/components/dingdan/city_data2017_element.js'
export default {
  data() {
    return {
      tableData: [],
      page_num: 1,
      page_size: 10,
      orders_total: 0,
      dialogFormVisible_edit: false,
      form_edit: {},
      orders_list: [],
      value: []
    }
  },
  created() {
    this.get_orders_list()
  },
  methods: {
    // 切换省市触发的方法
    handleChange() {

    },
    // 发送请求  -- 修改订单地址
    async edit_orders() {
      this.form_edit = {}
    },
    // 显示对话框 -- 修改订单地址
    show_dialog_edit() {
      this.orders_list = orders_list
      this.dialogFormVisible_edit = true
    },
    // 请求接口，得到订单列表
    async get_orders_list() {
      const res = await this.$http({
        url: '/orders',
        type: 'get',
        params: {
          query: '',
          pagenum: this.page_num,
          pagesize: this.page_size,
          user_id: '',
          pay_status: '',
          is_send: '',
          order_fapiao_title: '',
          order_fapiao_company: '',
          order_fapiao_content: '',
          consignee_addr: ''
        }
      })
      console.log(res)
      const {
        meta: { status },
        data: { goods, total }
      } = res.data
      if (status === 200) {
        this.tableData = goods
        this.orders_total = total
      }
    },
    // 每页显示几条
    handleSizeChange(val) {
      this.page_size = val
      this.page_num = 1
      this.get_orders_list()
      console.log(`每页 ${val} 条`)
    },
    // 跳转到第几页
    handleCurrentChange(val) {
      this.page_num = val
      this.get_orders_list()
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style>
.box-card {
  margin-top: 20px;
}
.el-card__body {
  padding: 0;
}
</style>
