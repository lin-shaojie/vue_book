<template>
  <div style="display:inline-block;" class="exportExcel">
    <label class="radio-label" style="padding-left:0;">Filename: </label>
    <el-input v-model="filename" placeholder="请输入导出的文件名(默认为excel-list)" style="width:345px;" prefix-icon="el-icon-document" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    filename: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>