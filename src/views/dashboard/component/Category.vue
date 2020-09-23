<template>
  <v-container
    :id="category"
    fluid
    tag="section"
  >
    <blockquote v-if="category == 'all'" class="blockquote">These are all the security questions in your organization.</blockquote>

    <v-card
      v-if="banner"
      outlined 
      class="banner-bg"
      :style="bannerClass"
    >
      <v-card-title class="mb-2">
        {{banner.title}}
      </v-card-title>
      <v-card-text>
        <span>
          {{banner.body}}
        </span>
      </v-card-text>
    </v-card>
    <v-card
      icon="mdi-security"
      title="Email Security"
      class="px-5 py-3"
      :ripple="ripple"
    >
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          class="mb-3"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-select
          v-if="isLevelVisible"
          v-model="filteredRisks"
          :items="riskItems"
          multiple
          class="max-100"
          label="Risk Level"
          chips
          deletable-chips
          @input="updateData"
        >
        </v-select>
      </v-card-title>
      <v-card-title>
        <v-select
          :loading="loading"
          v-if="category == 'all'"
          v-model="select"
          :items="categories"
          dense
          label="Select a category"
          multiple
          @input="updateData"
        >
          <template v-slot:prepend-item>
            <v-list-item
              ripple
              @click="toggleSelect"
            >
              <v-list-item-action>
                <v-icon :color="select.length > 0 ? 'indigo darken-4' : ''">{{ icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Select All</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>
        </v-select>
      </v-card-title> 
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="risks"
        item-key="id"
        :items-per-page="page"
        :search="search"
        single-expand
        calculate-widths
        show-expand
        :expanded.sync="expanded"
        @click:row="showDetails"
        @update:items-per-page="getPageNum"
      >
        <template v-slot:item.run_at="{ item }">
          <span>{{ formatDate(item.run_at) }}</span>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                small
                color="primary"
                v-on="on"
                @click.stop="showDetails(item)"
              >
                Details
              </v-btn>
            </template>
            <span>Show Details</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                small
                color="primary"
                v-on="on"
                @click.stop="showHistory(item)"
              >
                History
              </v-btn>
            </template>
            <span>Show History</span>
          </v-tooltip>
        </template>
        <template v-slot:item.answer="{ item }">
          <span v-html="highlightText(removeQuotes(item.answer))"></span>
        </template>
        <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
          <v-btn @click="expand(true)" v-if="item.canExpand && !isExpanded">Expand</v-btn>
          <v-btn @click="expand(false)" v-if="item.canExpand && isExpanded">close</v-btn>
        </template>
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length">
            <div
              v-if="details"
              class="px-4"
            >
              <question-detail :currentQuestion="currentQuestion"></question-detail>
            </div>
          </td>
        </template>
      </v-data-table>
    </v-card>

    <!-- history -->
    <answer-history :value.sync="dialog" :loading="loading" :history="history" :headers="headers" />
  </v-container>
</template>

<script>
  import { BASE_API, Get, Post } from '../../../api'
  import { formatDate, removeQuotes, highlightText } from '../../../util'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'CategoryRisk',

    components: {
      QuestionDetail: () => import('../component/QuestionDetail'),
      AnswerHistory: () => import('../component/AnswerHistory'),
    },

    data: () => ({
      loading: false,
      dialog: false,
      search: '',
      searchHistory: '',
      ripple: false,
      currentQuestion: '',
      details: false,
      detailsHistory: false,
      expanded: [],
      expandedHistory: [],
      select:[],
      categories: [],
      risks: [],
      history: [],
      filteredRisks:[], 
      risksOrigin: []
    }),

    computed: {
      ...mapState(['page', 'companyId', 'riskItems', 'tempRisk']),
      
      headers () {
        let headers = [
          {
            text: 'Question',
            value: 'description',
            width: 350
          },
          {
            text: 'Answer',
            value: 'answer',
            width: 300
          },
        ]
        if (this.category == 'all') {
          headers.push({
            text: 'Category',
            value: 'category',
            width: 200
          })
        }
        headers.push({
          text: 'Date',
          value: 'run_at',
        })
        headers.push({ text: 'Actions', value: 'action', sortable: false, align: 'center', width: 180 })
        return headers
      },
      isLevelVisible () {
        return !['critical', 'high', 'medium', 'low', 'informational'].includes(this.category)
      },
      bannerClass () {
        let color = ''
        let border = ''
        switch(this.category) {
          case 'critical':
            color = 'black'
            break
          case 'high':
            color = 'red'
            break
          case 'medium':
            color = 'orange'
            break
          case 'low':
            color = 'green'
            break
          case 'informational':
            color = 'gray'
            break
        }
        return {
          color,
          border: '1px dashed'
        }
      },
      selectedAllCategories () {
        return this.select.length == this.categories.length
      },
      selectedSomeCategories () {
        return this.select.length > 0 && !this.selectedAllCategories
      },
      icon () {
        if (this.selectedAllCategories) return 'mdi-close-box'
        if (this.selectedSomeCategories) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      },
    },

    mounted () {
      if (this.tempRisk) {
        this.filteredRisks = [...this.tempRisk]
        this.SET_TEMP_RISK([])
      }
      this.fetchRisks()
    },

    methods: {
      ...mapActions(['SET_TEMP_RISK']),
      formatDate,
      removeQuotes,
      highlightText,

      toggleSelect () {
        this.$nextTick(() => {
          if (this.selectedAllCategories) {
            this.select = []
          } else {
            this.select = this.categories.slice()
          }
        })
      },

      updateData () {
        if (this.select.length) {
          this.risks = this.risksOrigin.filter(risk => this.select.includes(risk.category))
        } else {
          this.risks = this.risksOrigin.filter(risk => risk)
        }
        this.risks = this.risks.filter(risk => {
          if (this.filteredRisks.length) {
            let pattern = risk.risk_level || 'low'
            pattern = pattern.toLowerCase().trim()
            if (pattern == 'critical') {
              pattern = /critical/i
            } else if (pattern == 'high') {
              pattern = /high/i
            } else if (pattern == 'medium') {
              pattern = /medium/i
            } else if (pattern == 'low') {
              pattern = /low/i
            } else if (pattern == 'informational') {
              pattern = /informational/i
            } 
            if (this.filteredRisks.join('').match(pattern)) {
              return risk
            }
          } else {
            return risk
          }
        })
      },
      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },
      showDetails (item) {
        if (this.expanded.includes(item)) {
          const index = this.expanded.indexOf(item);
          this.expanded.splice(index, 1);
        } else {
          this.expanded.push(item)
          this.currentQuestion = item
          this.details = true
        }
      },

      async showHistory (item) {
        this.dialog = true
        this.loading = true
        this.history = []
        const res = await Get(`risks/history/${item.question_id}/${this.companyId}`)
        this.history = res.risks
        this.loading = false
      },
      
      async fetchRisks () {
        if (!this.isLevelVisible) {
          this.filteredRisks = []
        }

        this.loading = true
        const res = await Get(`risks/${this.category}/${this.companyId}`)
        this.risks = res.risks
        this.categories = res.categories
        this.risksOrigin = res.risks

        this.updateData()
        this.loading = false
      },
      remove (item) {
        this.select.map((cat, i) => {
          if (cat == item) {
            this.select.splice(i, 1)
          }
        })

        this.updateData(this.select)
      },
    },

    props: {
      category: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: 'Email Security'
      },
      banner: {
        type: Object,
        default: undefined
      },
    }
  }
</script>
<style scoped>
.max-100 {
  max-width: 300px;
}
</style>