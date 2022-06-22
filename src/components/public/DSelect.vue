<template>
  <el-select
    clearable
    v-model="currentValue"
    :multiple="multiple"
    :allow-create="allowCreate"
    filterable
    :placeholder="placeholder"
    v-load="more"
    @focus="more"
    @change="changeEnv"
    :style="'width: ' + width"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
      <slot v-bind:item="item"></slot>
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    value: '',
    placeholder: { type: String, default: '' },
    url: { type: String },
    allowCreate: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    width: { type: String, default: '100%' }
  },
  directives: {
    load: {
      bind (el, binding) {
        el.querySelector('.el-select-dropdown__wrap').addEventListener(
          'scroll',
          function () {
            if (this.scrollHeight - this.scrollTop - this.clientHeight <= 50) {
              binding.value()
            }
          }
        )
      }
    }
  },
  data () {
    return {
      currentValue: '',
      options: [],
      page: 0,
      total: 1
    }
  },
  methods: {
    changeEnv () {
      this.$emit('input', this.currentValue)
      this.$emit('change')
    },
    async more () {
      if (this.page < this.total) {
        this.page++
        let res = await this.$http.get(this.url, { page: this.page })
        if (this.options.length === 0) {
          this.options = res.results || res.data
          this.total = res.total || Math.ceil(res.count / 10)
        } else {
          this.options = [
            ...this.options,
            ...Array.from(res.results || res.data)
          ]
        }
      }
    }
  },
  watch: {
    //   currentValue: function (v, o) {
    //     this.$emit('input', v)
    //   }
    value: function (v, o) {
      this.currentValue = v
    }
  }
}
</script>
