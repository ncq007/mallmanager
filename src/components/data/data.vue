<template>
  <el-card class="box-card">
    <my-bread lev1="数据统计" lev2="数据报表"></my-bread>
    <div id="main" style="width: 600px;height: 400px;margin-top: 10px;"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {

    }
  },
  mounted () {
    this.useEchart()
  },
  methods: {
    async useEchart () {
      let myChart = echarts.init(document.getElementById('main'))
      const res = await this.$http.get('reports/type/1')
      console.log('折线图', res)
      let option1 = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      }
      let option2 = res.data.data
      let option = { ...option1, ...option2 }
      myChart.setOption(option)
    }
  }
}
</script>

<style>
</style>
