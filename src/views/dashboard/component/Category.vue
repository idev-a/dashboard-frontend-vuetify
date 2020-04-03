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
      </v-card-title>
      <v-card-title>
        <v-select
          :loading="loading"
          v-if="category == 'all'"
          v-model="select"
          :items="categories"
          attach
          chips
          label="Select a cetegory"
          multiple
          @input="updateData"
        ></v-select>
      </v-card-title> 
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="risks"
        item-key="id"
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
              <v-row
                align="center"
              >
                <v-col
                  cols="auto"
                  class=""
                >
                  <div class="font-weight-medium">
                    Question
                  </div>
                </v-col>
                <v-col
                  cols="auto"
                >
                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
                    <span class="text--secondary">{{currentQuestion.question}}</span>
                  <!-- </v-card> -->
                </v-col>
              </v-row>
              <v-row
                align="center"
              >
                <v-col
                  cols="auto"
                  class=""
                >
                  <div class="font-weight-medium">
                    Answer
                  </div>
                </v-col>
                <v-col
                  cols="auto"
                >
                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
                    <span class="text--secondary">{{currentQuestion.answer}}</span>
                  <!-- </v-card> -->
                </v-col>
              </v-row>
              <v-row
                align="center"
              >
                <v-col
                  cols="auto"
                  class=""
                >
                  <div class="font-weight-medium">
                    Category
                  </div>
                </v-col>
                <v-col
                  cols="auto"
                >
                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
                    <span class="text--secondary">{{currentQuestion.category}}</span>
                  <!-- </v-card> -->
                </v-col>
              </v-row>
              <v-row
                align="center"
              >
                <v-col
                  cols="auto"
                  class="mb-0"
                >
                  <div class="font-weight-medium">
                    Description
                  </div>
                </v-col>
                <v-col
                  cols="auto"
                  class="pt-0"
                >
                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
                    <span class="text--secondary">{{currentQuestion.description}}</span>
                  <!-- </v-card> -->
                </v-col>
              </v-row>
              <v-row
                align="center"
              >
                <v-col
                  cols="auto"
                  class=""
                >
                  <div class="font-weight-medium">
                    Notes
                  </div>
                </v-col>
                <v-col
                  cols="auto"
                >
                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
                    <span class="text--secondary">{{currentQuestion.notes}}</span>
                  <!-- </v-card> -->
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <div
                  class="d-flex flex-wrap"
                >
                  <v-chip
                    outlined
                    class="ma-2"
                    :color="currentQuestion.availability == 1 ? 'red accent-2' : 'grey accent-4'"
                  >
                    <v-avatar v-if="currentQuestion.availability == 1" left>
                      <v-icon>mdi-checkbox-marked-circle</v-icon>
                    </v-avatar>
                    Availability
                  </v-chip>
               
                  <v-chip
                    outlined
                    class="ma-2"
                    :color="currentQuestion.confidentiality == 1 ? 'red accent-2' : 'grey accent-4'"
                  >
                    <v-avatar v-if="currentQuestion.confidentiality == 1" left>
                      <v-icon>mdi-checkbox-marked-circle</v-icon>
                    </v-avatar>
                    Confidentiality
                  </v-chip>
               
                  <v-chip
                    outlined
                    class="ma-2"
                    :color="currentQuestion.integrity == 1 ? 'red accent-2' : 'grey accent-4'"
                  >
                    <v-avatar v-if="currentQuestion.integrity == 1" left>
                      <v-icon>mdi-checkbox-marked-circle</v-icon>
                    </v-avatar>
                    Integrity
                  </v-chip>
                </div>
              </v-row>
              <v-row
                align="center"
              >
                <div
                  class="d-flex flex-wrap"
                >
                  <v-chip
                    v-if="currentQuestion['T1. Software Failures (code, configuration etc.)'] == 1"
                    outlined
                    class="ma-2"
                    color="secondary"
                  >
                    Software Failures (code, configuration etc.)
                  </v-chip>
                  <v-chip
                    v-if="currentQuestion['T2. Cloud Failures (Provider, VHardware, Capacity)'] == 1"
                    outlined
                    class="ma-2"
                    color="secondary"
                  >
                    Cloud Failures (Provider, VHardware, Capacity)
                  </v-chip>
                </v-col>
                  <v-chip
                    v-if="currentQuestion['T3. Legal Threats (failure to comply, bad contacts)'] == 1"
                    outlined
                    class="ma-2"
                    color="secondary"
                  >
                    Legal Threats (failure to comply, bad contacts)
                  </v-chip>
                  <v-chip
                    v-if="currentQuestion['T4. Social Engineering'] == 1"
                    outlined
                    class="ma-2"
                    color="secondary"
                  >
                    Social Engineering
                  </v-chip>
                  <v-chip
                    v-if="currentQuestion['T5. External Unauthorized Access to Information Systems / Data'] == 1"
                    outlined
                    class="ma-2"
                    color="secondary"
                  >
                    External Unauthorized Access to Information Systems / Data
                  </v-chip>
                  <v-chip
                    v-if="currentQuestion['T6. Traffic Monitoring or Interception'] == 1"
                    outlined
                    class="ma-2"
                    color="secondary"
                  >
                    Traffic Monitoring or Interception
                  </v-chip>
                  <v-chip
                    v-if="currentQuestion['T7.External Attacker Tampering with Data / Data Destruction'] == 1"
                    outlined
                    class="ma-2"
                    color="secondary"
                  >
                    External Attacker Tampering with Data / Data Destruction
                  </v-chip>
                  <v-chip
                    v-if="currentQuestion['T8. Repudiation of transactions and messages'] == 1"
                    outlined
                    class="ma-2"
                    color="secondary"
                  >
                    Repudiation of transactions and messages
                  </v-chip>
                  <v-chip
                    v-if="currentQuestion['T9. Insider Abuse of Privilege'] == 1"
                    outlined
                    class="ma-2"
                    color="secondary"
                  >
                    Insider Abuse of Privilege
                  </v-chip>
                  <v-chip
                    v-if="currentQuestion['T10. Third Party Liability (contractors, third processing)'] == 1"
                    outlined
                    class="ma-2"
                    color="secondary"
                  >
                    Third Party Liability (contractors, third processing)
                  </v-chip>
                  <v-chip
                    v-if="currentQuestion['T11. Employee / User Mistakes'] == 1"
                    outlined
                    class="ma-2"
                    color="secondary"
                  >
                    Employee / User Mistakes
                  </v-chip>
                </div>
              </v-row>
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
      risksOrigin: []
    }),

    computed: {
      page () {
        return Number(localStorage.getItem('page')) || 5
      }, 
      headers () {
        let headers = [
          {
            text: 'Question',
            value: 'question',
          },
          {
            text: 'Answer',
            value: 'answer',
            width: '200'
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
    },

    mounted () {
      this.fetchRisks()
    },

    methods: {
      updateData (data) {
        if (data.length) {
          this.risks = this.risksOrigin.filter(risk => data.includes(risk.category))
        } else {
          this.risks = this.risksOrigin
        }
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
        let user = {}
        try {
          user = JSON.parse(localStorage.getItem('user'))
        } catch(e) {}
        const companyId = user.email.split('@')[1];
        const self = this
        self.loading = true
        axios(`${BASE_API}/api/risks/${this.category}/${companyId}`, {
            method: 'GET',
          })
            .then(function (res) {
              self.risks = res.data.risks
              self.categories = res.data.categories
              self.risksOrigin = res.data.risks
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              self.loading = false
            })
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
      }
    }
  }
</script>