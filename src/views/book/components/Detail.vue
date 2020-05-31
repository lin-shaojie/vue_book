<template>
  <el-form ref="postForm" :model="postForm" label-position="right" :rules="rules">
    <sticky :class-name="'sub-navbar '">
      <el-button v-if="!isEdit" @click.prevent.stop="showGuide" type="primary">显示帮助</el-button>
      <el-button
      class="submit-btn"
        v-loading="loading"
        @click="submitForm"
        type="success"
        style="margin-left:15px;"
      >{{isEdit?'编辑电子书':'新增电子书'}}</el-button>
    </sticky>
    <div class="detail-container">
      <warning />
      <el-row>
        <el-col :span="24">
          <!-- 上传控件 -->
          <ebook-upload
            :file-list="fileList"
            :disabled="isEdit"
            @onSuccess="onUploadSuccess"
            @onRemove="onUploadRemove"
          />
        </el-col>
        <el-col :span="24">
          <!-- 表单组件 -->
          <el-form-item prop="title">
            <Mdinput v-model="postForm.title" :maxlength="100" name="name" required>书名</Mdinput>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" class="form-item-author" >
          <el-form-item label="作者：" label-width="85px" prop="author">
            <el-input v-model="postForm.author" placeholder="作者"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出版社：" label-width="85px" prop="publisher">
            <el-input v-model="postForm.publisher" placeholder="出版社"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="语言：" label-width="85px" prop="language">
            <el-input v-model="postForm.language" placeholder="语言"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="根文件：" label-width="85px" prop="rootFile">
            <el-input v-model="postForm.rootFile" placeholder="根文件" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="文件路径：" label-width="85px" prop="filePath">
            <!-- 保存到服务端的路径，用于存储到数据库 -->
            <el-input v-model="postForm.filePath" placeholder="文件路径" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="解压路径：" label-width="85px" prop="unzipPath">
            <el-input v-model="postForm.unzipPath" placeholder="解压路径" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="封面路径：" label-width="85px" prop="coverPath">
            <!-- 保存到服务端的路径，用于存储到数据库 -->
            <el-input v-model="postForm.coverPath" placeholder="封面路径" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件名称：" label-width="85px" prop="originalName">
            <el-input v-model="postForm.originalName" placeholder="文件名称" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="封面：" label-width="85px" prop="cover">
            <!-- <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
              <img :src="postForm.cover" class="preview-img" alt />
            </a>-->
            <el-image
              v-if="postForm.cover"
              class="preview-img"
              :src="postForm.cover"
              :preview-src-list="srcList"
            ></el-image>
            <span v-else>无</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label-width="85px" label="目录：">
            <div
              v-if="postForm.contentsTree && postForm.contentsTree.length > 0"
              class="contents-wrapper"
            >
              <el-tree :data="contentsTree" @node-click="onContentClick"></el-tree>
            </div>
            <span v-else>无</span>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import Sticky from '@/components/Sticky/index.vue'
import Warning from './Warning'
import EbookUpload from '../../../components/EBookUpload'
import Mdinput from '../../../components/MDinput'
import { createBook, getBook, updataBook } from '../../../api/book'
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import steps from './step.js'
const defaultForm = {
  title: '',
  author: '',
  publisher: '',
  language: '',
  rootFile: '',
  filePath: '',
  unzipPath: '',
  coverPath: '',
  fileName: '',
  cover: '',
  originalName: ''
}
export default {
  created() {
    // 电子书查阅功能，通过获取路由的参数进行查询
    if (this.isEdit) {
      // 编辑模式下
      const fileName = this.$route.params.fileName
      this.getBookData(fileName)
    }
  },
  mounted() {
    this.driver = new Driver({
      nextBtnText: '下一个',
      prevBtnText: '上一个',
      closeBtnText: '关闭',
      doneBtnText: '完成'
    })
  },
  data() {
    // 印射
    const fields = {
      title: '标题',
      author: '作者',
      publisher: '出版社',
      language: '语言'
    }
    const validateRequire = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(`${fields[rule.field]}为必填项！`))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      postForm: {},
      fileList: [],
      contentsTree: [],
      // 表单自定义验证规则
      rules: {
        title: [
          {
            validator: validateRequire
          }
        ],
        author: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }]
      }
    }
  },
  methods: {
    setData(data) {
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        filePath,
        unzipPath,
        coverPath,
        fileName,
        cover,
        originalName,
        contents,
        contentsTree
      } = data
      this.postForm = {
        ...this.postForm,
        title,
        author,
        publisher,
        language,
        rootFile,
        filePath,
        unzipPath,
        coverPath,
        fileName,
        cover,
        originalName,
        contents,
        contentsTree
      }
      this.contentsTree = contentsTree
      this.fileList = [{ name: originalName || fileName }]
    },
    setDefault() {
      // this.postForm = Object.assign({}, defaultForm)
      this.contentsTree = []
      this.fileList = []
      this.$refs.postForm.resetFields()
    },
    onContentClick(data) {
      window.open(data.text)
    },
    onUploadSuccess(file) {
      this.setData(file)
      // console.log('onUploadSuccess', file)
    },
    onUploadRemove() {
      console.log('onUploadRemove')
      this.setDefault()
    },
    submitForm() {
      const onSuccess = res => {
        const { msg } = res
        this.$notify({
          title: '操作成功',
          message: msg,
          type: 'success',
          duration: 5000
        })
        this.loading = false
      }
      if (!this.loading) {
        this.loading = true
        this.$refs.postForm.validate((valid, fields) => {
          if (valid) {
            // 验证通过
            const book = Object.assign({}, this.postForm) // 浅拷贝
            delete book.contentsTree
            if (!this.isEdit) {
              // 创建图书,调用上传接口
              createBook(book)
                .then(res => {
                  onSuccess(res)
                  this.setDefault()
                })
                .catch(e => {
                  this.loading = false
                })
            } else {
              // 编辑图书状态
              updataBook(book)
                .then(res => {
                  onSuccess(res)
                })
                .catch(e => {
                  this.loading = false
                })
            }
          } else {
            // 验证失败
            const message = fields[Object.keys(fields)[0]][0].message
            this.$message.error(message)
            this.loading = false
          }
        })
      }
    },
    showGuide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    },
    getBookData(fileName) {
      getBook(fileName).then(res => {
        this.setData(res.data)
      })
    }
  },
  components: {
    Sticky,
    Warning,
    EbookUpload,
    Mdinput
  },

  props: {
    isEdit: Boolean
  },
  computed: {
    srcList() {
      var arr = new Array()
      arr.push(this.postForm.cover)
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>

.detail-container {
  padding: 30px 50px 20px;
  .preview-img {
    width: 270px;
    height: 270px;
  }
}
.el-input {
  width: 90%;
}
</style>
