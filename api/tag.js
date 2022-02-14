import {request} from "../plugins/request.js";
// 获取标签
export const getTags = () => {
  return request({
    method: 'GET',
    url: '/tags'
  })
}