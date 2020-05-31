<template>
  <el-alert
    title="上传电子书步骤"
    type="warning"
    description="上传电子书分为两步：上传电子书和新增电子书。首先需要上传epub电子书文件，服务器会对epub文件进行解析，解析成功后会将电子书的各字段填入表单，之后我们只需要手动点击新增电子书即可完成电子书的保存。"
  ></el-alert>
</template>
<style lang="scss" scope>
.el-alert__title {
  font-size: 16px;
}
.el-alert .el-alert__description {
  font-size: 16px;
}
.el-alert {
  margin-bottom: 20px;
}
</style>
