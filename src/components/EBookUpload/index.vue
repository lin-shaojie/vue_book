<template>
  <div class="upload-container">
    <el-upload
      class="upload-demo"
      drag
      show-file-list
      accept="application/epub+zip"
      :action="action"
      multiple
      :limit="1"
      :headers="headers"
      :before-upload="beforUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-exceed="onExceed"
      :disabled="disabled"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" v-if="fileList.length===0" ref="msg">
        将电子书拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__text" v-else>图书已上传</div>
      <div class="el-upload__tip" slot="tip">只能上传epu文件，且文件数最多不能超过1个。</div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '../../utils/auth'
export default {
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    beforUpload(file) {
      // 上传之前调用
      this.$emit('beforeUpload', file)
    },
    onSuccess(response, file) {
      // console.log('response', response)
      // console.log('file',file)
      const { code, msg,data } = response
      if (code === 0) {
        this.$message({
          message: msg,
          type: 'success'
        })
        this.$emit('onSuccess', data)

      } else {
        this.$message({
          message: msg,
          type: 'error'
        })
        this.$emit('onError', file)
      }
    },
    onError(err) {
      const errMsg = err.message && JSON.parse(err.message)
      console.log(errMsg)
      this.$message({
        type: 'error',
        message:
          (errMsg.msg && `上传失败，失败原因：${errMsg.msg}`) || '上传失败'
      })
      this.$emit('onError', err)
    },
    onRemove() {
      this.$message({
        message: '删除电子书成功！',
        type: 'success'
      })
      this.$emit('onRemove')
    },
    onExceed() {
      //  文件超出个数限制时的钩子
      this.$message({
        message: '每次只能上传一本电子书',
        type: 'warning'
      })
    }
  },
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/book/upload`
    }
  },
  computed: {
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  width: 100%;
}
</style>
