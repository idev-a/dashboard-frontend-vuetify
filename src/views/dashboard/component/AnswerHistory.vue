<template>
  <v-dialog
    v-model="value"
    @click:outside="closeDialog"
  >
    <v-card>
      <div class="d-flex py-3 px-5 align-center">
        <div class="display-1 ml-4">History ({{ history.length }})</div>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="searchHistory"
          append-icon="mdi-magnify"
          label="Search"
          class="mb-3"
          single-line
          hide-details
        />
      </div>
      <v-card-text>
        <v-data-table
          :loading="loading"
          :headers="headers"
          :items="history"
          item-key="id"
          single-expand
          calculate-widths
          show-expand
          :expanded.sync="expandedHistory"
          @click:row="showDetailsInHistory"
          :items-per-page="page"
          :search="searchHistory"
          @update:items-per-page="getPageNum"
        >
          <template v-slot:item.run_at="{ item }">
            <span>{{ formatDate(item.run_at) }}</span>
          </template>
          <template v-slot:item.Answer="{ item }">
            <span>{{removeQuotes(item.Answer)}}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn 
                  text 
                  small
                  color="primary"
                  v-on="on"
                  @click.stop="showDetailsInHistory(item)"
                >
                  Details
                </v-btn>
              </template>
              <span>Show Details</span>
            </v-tooltip>
          </template>
          <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
            <v-btn @click="expand(true)" v-if="item.canExpand && !isExpanded">Expand</v-btn>
            <v-btn @click="expand(false)" v-if="item.canExpand && isExpanded">close</v-btn>
          </template>
          <template v-slot:item.Answer="{ item }">
            <span v-html="highlightText(removeQuotes(item.Answer))"></span>
          </template>
          <template v-slot:expanded-item="{ headers }">
            <td :colspan="headers.length">
              <div
                v-if="detailsHistory"
                class="px-4"
              >
                <question-detail :currentQuestion="currentQuestion"></question-detail>
              </div>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { Get, Post } from '@/api'
import { formatDate, removeQuotes, highlightText } from '@/util'
export default {
  props: ['loading', 'headers', 'history', 'value'],

  components: {
    QuestionDetail: () => import('./QuestionDetail')
  },

  data: () => ({
    dialogValue: false,
    searchHistory: '',
    expandedHistory: [],
    currentQuestion: '',
    detailsHistory: false,
  }),

  computed: {
    ...mapState(['page', 'companyId']),
  },

  methods: {
    formatDate,
    removeQuotes,
    highlightText,

    getPageNum (_page) {
      localStorage.setItem('page', _page)
    },

    showDetailsInHistory (item) {
      if (this.expandedHistory.includes(item)) {
        const index = this.expandedHistory.indexOf(item);
        this.expandedHistory.splice(index, 1);
      } else {
        this.expandedHistory.push(item)
        this.currentQuestion = item
        this.detailsHistory = true
      }
    },
    closeDialog () {
      this.$emit('update:value', false)
    }
  }
}
</script>