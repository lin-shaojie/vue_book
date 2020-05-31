<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="15">
        <el-col :span="4">
          <el-input
            v-model="listQuery.title"
            placeholder="请输入书名"
            clearable
            @keyup.enter.native="handlerFliter"
            @clear="handlerFliter"
            @blur="handlerFliter"
          />
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="listQuery.author"
            placeholder="请输入作者"
            clearable
            @keyup.enter.native="handlerFliter"
            @clear="handlerFliter"
            @blur="handlerFliter"
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="listQuery.category"
            placeholder="请选择分类"
            clearable
            @change="handlerFliter"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.category"
              :label="item.categoryText+'('+item.num+')'"
              :value="item.categoryText"
            />
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="handlerFliter" v-waves>查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-upload" v-waves @click="handlerCreate">新增</el-button>
        </el-col>
        <el-col :span="2">
          <el-checkbox
            size="medium"
            label="显示封面"
            v-model="showCover"
            @change="changeShowCover()"
            style="padding-top:10px;"
          />
        </el-col>
      </el-row>
    </div>

    <div class="exportExcel">
      <el-row :gutter="15">
        <el-col :span="24">
          <FilenameOption v-model="filename" />
          <BookTypeOption v-model="bookType" />
          <el-button
            :loading="downloadLoading"
            style="margin:0 0 20px 20px;"
            type="primary"
            icon="el-icon-document"
            @click="handleDownload"
          >Export Excel</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      :default-sort="defaultSort"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80px" />
      <el-table-column label="书名" prop="title" align="center" width="180px">
        <template slot-scope="{row:{titleWrapper}}">
          <span v-html="titleWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="作者" prop="author" align="center" width="100px">
        <template slot-scope="{row:{authorWrapper}}">
          <span v-html="authorWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="出版社" prop="publisher" align="center" width="180px" />
      <el-table-column label="语言" prop="language" align="center" />
      <el-table-column label="分类" prop="categoryText" align="center" width="100px" />
      <el-table-column v-if="showCover" label="封面" align="center" width="150px">
        <template slot-scope="{row:{cover}}">
          <el-image class="preview-img" :src="cover" :preview-src-list="srcList"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="文件名" prop="fileName" align="center" width="100px" />
      <el-table-column label="上传人" prop="createUser" align="center" width="100px">
        <template slot-scope="{row:{createUser}}">
          <span>{{createUser | valueFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" prop="createDt" align="center" width="100px">
        <template slot-scope="{row:{createDt}}">
          <span>{{createDt | timeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件路径" prop="filePath" align="center" width="100px">
        <template slot-scope="{row:{filePath}}">
          <span>{{filePath | valueFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面路径" prop="coverPath" align="center" width="100px">
        <template slot-scope="{row:{coverPath}}">
          <span>{{coverPath | valueFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="100px">
        <template slot-scope="{row:{fileName}}">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(fileName)" />
          <el-button
            type="text"
            icon="el-icon-delete"
            style="color:red;"
            @click="handleDelete(fileName)"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      v-show="total>0"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="refresh"
    />

    <back-to-top
      :custom-style="myBackToTopStyle"
      :visibility-height="300"
      :back-position="50"
      transition-name="fade"
    />
  </div>
</template>

<script>
import { getCategory, listBook, deleteBook } from '../../api/book'
import Pagination from '../../components/Pagination'
import HeaderSearch from '../../components/HeaderSearch'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '../../utils'
import BackToTop from '../../components/BackToTop'
// 以下为导出excle插件
import FilenameOption from './components/FilenameOption'
import BookTypeOption from './components/BookTypeOption'

export default {
  data() {
    return {
      myBackToTopStyle: {
        'z-index': 999,
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1' // 按钮的背景颜色 The background color of the button
      },
      tableKey: 0,
      listQuery: {},
      showCover: true,
      categoryList: [],
      list: [],
      listLoading: false,
      total: 0,
      defaultSort: {},
      // 以下为excel导出文件插件
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  methods: {
    parseQuery() {
      const query = Object.assign({}, this.$route.query)
      let sort = '-id'
      const listQuery = {
        page: 1,
        pageSize: 15,
        sort
      }
      if (query) {
        query.page && (query.page = +query.page)
        query.pageSize && (query.pageSize = +query.pageSize)
        query.sort && (sort = query.sort)
      }
      const sortSymbol = sort[0]
      const sortColumn = sort.slice(1, sort.length)
      this.defaultSort = {
        prop: sortColumn,
        order: sortSymbol === '+' ? 'ascending' : 'descending'
      }
      this.listQuery = { ...listQuery, ...query }
    },
    refresh() {
      this.$router.push({
        url: '/book/list',
        query: this.listQuery
      })
    },
    handlerFliter(value) {
      // this.getList()
      this.listQuery.page = 1
      this.refresh()
    },
    // 获取分类列表
    getCategoryList() {
      getCategory().then(res => {
        this.categoryList = res.data
      })
    },
    // 新增电子书按钮
    handlerCreate() {
      this.$router.push('/book/create')
    },
    wrapperKeyWord(k, v) {
      function highlight(value) {
        return `<span style='color:red;'>${value}</span>`
      }
      if (!this.listQuery[k]) {
        // 不存在查询关键字
        return v
      } else {
        return v.replace(new RegExp(this.listQuery[k], 'ig'), v => {
          return highlight(v)
        })
      }
    },
    // 获取电子书列表信息
    getList() {
      this.listLoading = true
      listBook(this.listQuery).then(response => {
        const { list, count, page, pageSize } = response.data
        this.list = list
        this.total = count
        this.listLoading = false
        this.list.forEach(book => {
          book.titleWrapper = this.wrapperKeyWord('title', book.title)
          book.authorWrapper = this.wrapperKeyWord('author', book.author)
        })
      })
    },
    changeShowCover(data) {
      // this.showCover = value
    },
    // 当表格的排序条件发生变化的时候会触发该事件
    sortChange(data) {
      const { prop, order } = data
      this.sortBy(prop, order)
    },
    sortBy(prop, order) {
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handlerFliter()
    },
    handleUpdate(fileName) {
      this.$router.push(`/book/edit/${fileName}`)
      console.log('handleUpdate', fileName)
    },
    // 电子书的删除
    handleDelete(fileName) {
      this.$confirm('此操作将永久删除该电子书,请问是否继续？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBook(fileName).then(res => {
          this.$notify({
            title: '成功',
            message: res.msg || '删除电子书成功！',
            type: 'success',
            duration: 2000
          })
          this.handlerFliter()
        })
      })
    },
    // 以下为excel导出插件

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Id', '书名', '作者', '出版社', '语言','分类','封面','文件名','上传人','上传时间','文件路径','封面路径']
        const filterVal = ['id', 'title', 'author', 'publisher', 'language','categoryText','cover','fileName','createUser','createDt','filePath','coverPath',]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  },
  mounted() {
    this.getCategoryList()
    this.getList()
  },
  computed: {
    srcList() {
      var arr = new Array()
      let cover = this.list.forEach(item => {
        arr.push(item.cover)
      })
      return arr
    }
  },
  created() {
    this.parseQuery()
  },
  components: {
    Pagination,
    HeaderSearch,
    BackToTop,
    FilenameOption,
    BookTypeOption
  },
  directives: {
    waves
  },
  filters: {
    valueFilter(value) {
      return value ? value : '无'
    },
    timeFilter(time) {
      return time ? parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}') : '无'
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path == from.path) {
      // 说明为同个路径
      const newQuery = Object.assign({}, JSON.stringify(to.query))
      const oldQuery = Object.assign({}, JSON.stringify(from.query))
      if (newQuery !== oldQuery) {
        this.getList()
      }
    }
    next()
  }
}
</script>
<style lang="scss" scoped>
.preview-img {
  width: 120px;
  height: 180px;
}

.exportExcel {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  font-weight: 700;
}
</style>