import request from '@/utils/request'

// 创建电子书接口
export function createBook(book) {
  return request({
    url: '/book/create',
    method: 'post',
    data: book
  })
}

// 修改电子书信息接口
export function updataBook(book) {
  return request({
    url: '/book/update',
    method: 'post',
    data: book
  })
}

// 获取电子书信息接口
export function getBook(fileName) {
  return request({
    url: '/book/get',
    method: 'get',
    params: { fileName }
  })
}

// 获取电子书分类
export function getCategory() {
  return request({
    url: '/book/category',
    method: 'get'
  })
}
// 获取电子书列表信息
export function listBook(params) {
  return request({
    url: '/book/list',
    method: 'get',
    params
  })
}

export function deleteBook(fileName) {
  return request({
    url: '/book/delete',
    method: 'get',
    params: { fileName }
  })
}

export function bookHome() {
  return request({
    url: '/book/home',
    method: 'get'
  })
}
