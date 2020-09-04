<template>
  <v-container
    id="register-account"
    class="justify-center mt-5"
    tag="section"
  >
    <v-row justify="center" no-gutters>
      <v-col cols=12 lg=9>
        <v-row>
          <v-col  cols=12 lg=8>
            <div
              v-if="current"
              class="help-content"
            > 
              <span v-html="current.content" />
            </div>
            <v-skeleton-loader
              v-else
              class="mx-auto"
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-col>
          <v-col cols=12 lg=4>
            <v-sheet 
              class="pa-1"
              outlined
              rounded
            >
              <v-card-title>
                RELATED ARTICLES
              </v-card-title>
              <v-card-text>
                <ul class="related-articles">
                  <li v-for="(item, i) in relatedArticles" :key="i">
                    <a @click="goto(item.id)" >{{ item.title}}</a>
                  </li>
                </ul>
              </v-card-text>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { HelpMixin } from './HelpMixin'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'HelpDetail',
  mixins: [HelpMixin],

  data ()  {
    return {
      current: null,
      relatedArticles: [],
    }
  },

  watch: {
    '$route.params.menuId' (val) {
      if (val) {
        this.buildRelatedArticles()
      }
    },
    menuItems: {
      handler (newVal) {
        if (newVal.length) {
          this.buildRelatedArticles()
        }
      },
      immediate: true
    }
  },

  methods: {
    buildRelatedArticles() {
      const id = this.$route.params.menuId
      const item = this.menuItems.filter(item => item.id == id)
      this.current = item[0] 
      if (this.current) {
        const items = [
          {
            text: 'Dashboard',
            disabled: false,
            to: 'Dashboard',
          },
          {
            text: 'Getting Started',
            disabled: true,
            to: 'Get Started',
          },
          {
            text: this.current.title,
            disabled: true,
            to: '',
          }
        ]
        this.setItems(items)
        this.relatedArticles = this.menuItems.filter(item => item.id != id)
      }
    }
  }
}
</script>