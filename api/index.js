import {request} from "../plugins/request.js";

export const login = (data) => {
  return request({
    method: 'POST',
    url: '/users/login',
    data: data
  })
}
export const register = (data) => {
  return request({
    method: 'POST',
    url: '/users',
    data: data
  })
}