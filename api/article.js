import {request} from "../plugins/request.js";

export const getArticle = (params) => {
  return request({
    method: 'GET',
    url: '/articles',
    params
  })
}

export const getFeedArticle = (params) => {
  return request({
    method: 'GET',
    url: '/articles/feed',
    params
  })
}
export const addFavorite = (slug) => {
  return request({
    method: 'POST',
    url: `/articles/${slug}/favorite`
  })
}
export const deleteFavorite = (slug) => {
  return request({
    method: 'DELETE',
    url: `/articles/${slug}/favorite`
  })
}

export const getArticleDetail = (slug) => {
  return request({
    method: 'GET',
    url: `/articles/${slug}`
  })
}

export const getComments = (slug) => {
  return request({
    method: 'GET',
    url: `/articles/${slug}/comments`
  })
}