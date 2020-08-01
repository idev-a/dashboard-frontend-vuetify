<template>
  <v-container
    :id="category"
    fluid
    tag="section"
  >
    <v-card
      v-if="banner"
      raised
      shaped
      class="p-3"
    >
      <v-card-title class="mb-2" >
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
        <v-autocomplete
          :loading="loading"
          v-if="category == 'all'"
          v-model="select"
          :items="categories"
          chips
          dense
          deletable-chips
          label="Select a category"
          multiple
          @input="updateData"
        >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click="data.select"
              @click:close="remove(data.item)"
            >
              {{ data.item }}
            </v-chip>
          </template>
        </v-autocomplete>
      </v-card-title> 
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="risks"
        item-key="answer_id"
        :items-per-page="page"
        :search="search"
        single-expand
        show-expand
        :expanded.sync="expanded"
        @click:row="showDetails"
        @update:items-per-page="getPageNum"
      >
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click.stop="showDetails(item)"
              >
                <v-icon>mdi-application</v-icon>
              </v-btn>
            </template>
            <span>Show Details</span>
          </v-tooltip>
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
  </v-container>
</template>

<script>
  import { BASE_API } from '../../../api'
  import axios from 'axios'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'CategoryRisk',

    data: () => ({
      loading: false,
      search: '',
      ripple: false,
      currentQuestion: '',
      details: false,
      expanded: [],
      select:[],
      categories: [
      ],
      risks: [
      ],
      filteredRisks:[], 
      risksOrigin: []
    }),

    computed: {
      ...mapState(['page', 'companyId', 'riskItems', 'tempRisk']),
      
      headers () {
        let headers = [
          {
            text: 'Question',
            value: 'question',
            width: 350
          },
          {
            text: 'Answer',
            value: 'answer',
            width: 400
          },
        ]
        if (this.category == 'all') {
          headers.push({
            text: 'Category',
            value: 'category',
          })
        }
        headers.push({ text: 'Actions', value: 'action', sortable: false })
        return headers
      },
      isLevelVisible () {
        return !['critical', 'high', 'medium', 'low', 'informational'].includes(this.category)
      }
    },

    mounted () {
      if (this.tempRisk) {
        this.filteredRisks = [...this.tempRisk]
        this.SET_TEMP_RISK([])
      }
      this.fetchRisks()
    },

    components: {
      QuestionDetail: () => import('../component/QuestionDetail')
    },

    methods: {
      ...mapActions(['SET_TEMP_RISK']),

      updateData () {
        if (this.select.length) {
          this.risks = this.risksOrigin.filter(risk => this.select.includes(risk.category))
        } else {
          this.risks = this.risksOrigin
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
            const risks = this.filteredRisks.map(risk => risk.value)
            if (risks.join('').match(pattern)) {
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
      expand (can) {
        if (can) {
        }
      },
      showDetails (item) {
        this.expanded = []
        this.currentQuestion = item
        this.details = true
        this.expanded.push(item)
      },
      fetchRisks () {
        if (!this.isLevelVisible) {
          this.filteredRisks = []
        }

        const self = this
        self.loading = true
        axios(`${BASE_API}/api/risks/${this.category}/${this.companyId}`, {
            method: 'GET',
          })
            .then(function (res) {
              self.risks = res.data.risks
              self.categories = res.data.categories
              self.risksOrigin = res.data.risks

              self.updateData()
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              self.loading = false
            })
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