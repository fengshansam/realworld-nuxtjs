<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link class="nav-link"
                exact
                :class="{
                  active: tab === 'Your_Feed'
                }" 
                :to="{
                  name: 'home',
                  query: {
                    tab: 'Your_Feed'
                  }
                  }">Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" 
                :class="{
                  active: tab === 'Global_Feed'
                }" 
                exact
                :to="{
                  name: 'home',
                  query: {
                    tab: 'Global_Feed'
                  }
                  }">Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-if="tag">
                <nuxt-link class="nav-link" 
                :class="{
                  active: tab === 'Tag'
                }" 
                :to="{
                  name: 'home',
                  query: {
                    tab: 'Tag'
                  }
                  }">#{{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>
          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link class="author" :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }"
                >{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.updatedAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right" :class="{'active': article.favorited }" @click="onFavorite(article)" :disabled='article.favoritedDisabled'>
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="{name: 'article', params: { slug: article.slug }}" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <nav>
            <ul class="pagination">
              <li class="page-item" v-for="item in pageTatol" :key="item" :class="{'active': item === page}">
                <nuxt-link class="page-link" :to="{
                  name: 'home', 
                  query: {
                      page: item, 
                      tag: $route.query.tag,
                      tab
                    }
                  }"
                  >{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link href="" class="tag-pill tag-default" :to="{name: 'home', query: {tag: item, tab: 'Tag' }}" v-for="item in tags" :key="item">{{ item }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, getFeedArticle, addFavorite, deleteFavorite } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'
export default {
  name: "HomeIndex",
  async asyncData ({query, store}) {
    console.log(store.state)
    const page = Number.parseInt(query.page || 1)
    const limit = 2
    const { tag } = query
    const loadArticle = store.state.user && query.tab === 'Your_Feed' ? getFeedArticle : getArticle
    const [articleRes, tagRes] = await Promise.all([
      loadArticle({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ])
    const { articles,  articlesCount } = articleRes.data
    articles.forEach(item => {
      item.favoritedDisabled = false
    })
    const { tags } = tagRes.data
    return {
      articles,
      articlesCount,
      limit,
      page,
      tags,
      tag,
      tab: query.tab || 'Global_Feed'
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    ...mapState(['user']),
    pageTatol () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async onFavorite(article) {
      article.favoritedDisabled = true
      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        await addFavorite(article.slug)
        article.favoritesCount += 1
        article.favorited = true
      }
      article.favoritedDisabled = false
    }
  }
};
</script>

<style></style>
