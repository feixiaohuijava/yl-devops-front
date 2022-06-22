<template>
  <el-select
    v-model="currentValue"
    :placeholder="placeholder"
    :style="'width: ' + width"
    clearable
    @visible-change="onSelectChange($event)"
    @change="onChange"
  >
    <el-option
      v-for="(item, id) in optionsList"
      :key="id"
      :label="item.label"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    params: {},
    isRendering: { type: Boolean, default: false },
    placeholder: { type: String, default: '请选择内容' },
    url: { type: String },
    width: { type: String, default: '200px' },
    changList: { type: String, default: '' }
  },
  data () {
    return {
      currentValue: '',
      optionsList: []
    }
  },
  created () {
    if (this.isRendering) {
      this.onSelectChange()
    }
  },
  methods: {
    // 获取列表数据
    async onSelectChange (callback) {
      this.optionsList = []
      if (callback) {
        let res = await this.$http.get(this.url, this.params)
        this.optionsList = res.results
        if (this.changList === 'area' || this.changList === 'environment') {
          res.results.forEach((item, index) => {
            this.optionsList[index].label = item.name
          })
        } else if (this.changList === 'project') {
          res.results.forEach((item, index) => {
            this.optionsList[index].label = item.projectName
          })
        }
      }
    },
    // 传递value值
    onChange () {
      this.$emit('onValue', this.currentValue)
    }
  }
}
</script>
