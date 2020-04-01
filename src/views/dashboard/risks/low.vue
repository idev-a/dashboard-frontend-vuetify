<template>
  <v-container
    id="low-risks"
    fluid
    tag="section"
  >
    <v-card
      raised
      shaped
      class="p-3"
    >
      <v-card-title class="mb-2" >
        What is Low Risk?
      </v-card-title>
      <v-card-text>
        <span>
          Low risk findings mean the impact and likelihood is a security event is rare. If a security event in this category were to occur there would be little impact financially and reputation on the business.
        </span>
      </v-card-text>
    </v-card>
    <v-card
      class="px-5 py-3"
    >
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
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="risks"
        item-key="id"
        :items-per-page="5"
        :search="search"
        single-expand
        show-expand
        :expanded.sync="expanded"
        @click:row="showDetails"
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
            <v-card
              v-if="details"
              class="px-10 my-1 py-4"
            >
              <v-row
                align="center"
              >
                <v-col
                  cols="auto"
                  class=""
                >
                  <div>
                    Question
                  </div>
                </v-col>
                <v-col
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <span>{{currentQuestion.question}}</span>
                  </v-card>
                </v-col>
              </v-row>
              <v-row
                align="center"
              >
                <v-col
                  cols="auto"
                  class=""
                >
                  <div>
                    Answer
                  </div>
                </v-col>
                <v-col
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <span>{{currentQuestion.answer}}</span>
                  </v-card>
                </v-col>
              </v-row>
              <v-row
                align="center"
              >
                <v-col
                  cols="auto"
                  class=""
                >
                  <div>
                    Category
                  </div>
                </v-col>
                <v-col
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <span>{{currentQuestion.category}}</span>
                  </v-card>
                </v-col>
              </v-row>
              <v-row
                align="center"
              >
                <v-col
                  cols="auto"
                  class=""
                >
                  <div>
                    Description
                  </div>
                </v-col>
                <v-col
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <span>{{currentQuestion.description}}</span>
                  </v-card>
                </v-col>
              </v-row>
              <v-row
                align="center"
              >
                <v-col
                  cols="auto"
                  class=""
                >
                  <div>
                    Notes
                  </div>
                </v-col>
                <v-col
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <span>{{currentQuestion.notes}}</span>
                  </v-card>
                </v-col>
              </v-row>
              <v-row
                align="center"
              >
                <v-col
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                    :color="currentQuestion.availability == 1 ? 'red' : 'grey'" 
                  >
                    <div>Availability</div>
                  </v-card>
                </v-col>
                <v-col
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                    :color="currentQuestion.confidentiality == 1 ? 'red' : 'grey'" 
                  >
                    <div>Confidentiality</div>
                  </v-card>
                </v-col>
                <v-col
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                    :color="currentQuestion.integrity == 1 ? 'red' : 'grey'" 
                  >
                    <div>Integrity</div>
                  </v-card>
                </v-col>
              </v-row>
              <v-row
                align="center"
              >
                <v-col
                  v-if="currentQuestion['T1. Software Failures (code, configuration etc.)'] == 1"
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                  >
                    <div>Software Failures (code, configuration etc.)</div>
                  </v-card>
                </v-col>
                <v-col
                  v-if="currentQuestion['T2. Cloud Failures (Provider, VHardware, Capacity)'] == 1"
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                  >
                    <div>Cloud Failures (Provider, VHardware, Capacity)</div>
                  </v-card>
                </v-col>
                <v-col
                  v-if="currentQuestion['T3. Legal Threats (failure to comply, bad contacts)'] == 1"
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                  >
                    <div>Legal Threats (failure to comply, bad contacts)</div>
                  </v-card>
                </v-col>
                <v-col
                  v-if="currentQuestion['T4. Social Engineering'] == 1"
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                  >
                    <div>Social Engineering</div>
                  </v-card>
                </v-col>
                <v-col
                  v-if="currentQuestion['T5. External Unauthorized Access to Information Systems / Data'] == 1"
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                  >
                    <div>External Unauthorized Access to Information Systems / Data</div>
                  </v-card>
                </v-col>
                <v-col
                  v-if="currentQuestion['T6. Traffic Monitoring or Interception'] == 1"
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                  >
                    <div>Traffic Monitoring or Interception</div>
                  </v-card>
                </v-col>
                <v-col
                  v-if="currentQuestion['T7.External Attacker Tampering with Data / Data Destruction'] == 1"
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                  >
                    <div>External Attacker Tampering with Data / Data Destruction</div>
                  </v-card>
                </v-col>
                <v-col
                  v-if="currentQuestion['T8. Repudiation of transactions and messages'] == 1"
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                  >
                    <div>Repudiation of transactions and messages</div>
                  </v-card>
                </v-col>
                <v-col
                  v-if="currentQuestion['T9. Insider Abuse of Privilege'] == 1"
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                  >
                    <div>Insider Abuse of Privilege</div>
                  </v-card>
                </v-col>
                <v-col
                  v-if="currentQuestion['T10. Third Party Liability (contractors, third processing)'] == 1"
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                  >
                    <div>Third Party Liability (contractors, third processing)</div>
                  </v-card>
                </v-col>
                <v-col
                  v-if="currentQuestion['T11. Employee / User Mistakes'] == 1"
                  cols="auto"
                >
                  <v-card 
                    shaped 
                    outlined 
                    class="my-0 pa-2"
                  >
                    <div>Employee / User Mistakes</div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
  import { BASE_API } from '../../../api'
  import axios from 'axios'

  export default {
    name: 'DashboardLowRisksTables',

    data: () => ({
      loading: false,
      search: '',
      currentQuestion: '',
      details: false,
      expanded: [],
      snack: false,
      snackColor: '',
      snackText: '',
      pagination: {},
      actions: [
        {
          color: 'info',
          icon: 'mdi-account',
        },
        {
          color: 'success',
          icon: 'mdi-pencil',
        },
        {
          color: 'error',
          icon: 'mdi-close',
        },
      ],
      headers: [
        {
          text: 'Question',
          value: 'question',
        },
        {
          text: 'Answer',
          value: 'answer',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      risks: [
      ],
    }),

    mounted () {
      this.fetchRisks()
    },

    methods: {
      expand (can) {
        if (can) {

        }
      },
      showDetails (item) {
        this.currentQuestion = item
        this.details = true
        if (this.expanded.length) {
          this.expanded = []
        } else {
          this.expanded.push(item)
        }
      },
      fetchRisks () {
        let user = {}
        try {
          user = JSON.parse(localStorage.getItem('user'))
        } catch(e) {}
        const companyId = user.email.split('@')[1];
        const self = this
        self.loading = true
        axios(`${BASE_API}/api/risks/low/${companyId}`, {
            method: 'GET',
          })
            .then(function (res) {
              self.risks = res.data.risks
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              self.loading = false
            })
      },
    }
  }
</script>
