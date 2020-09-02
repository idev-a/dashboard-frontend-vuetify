<template>
  <v-expansion-panel
    v-if="data"
  >
    <v-expansion-panel-header>
      <v-row align="center">
        <div v-if="mode" class="align-self-center">
                  <v-btn
                    color="success"
                    icon
                    @click="showDialog"
                  >
                    <v-icon
                      color="success"
                    >
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </div>
        <b class="display-2 d-block">{{data.Question}}</b>
            </v-row>
    </v-expansion-panel-header>
      </v-hover>
    <v-expansion-panel-content>
      <div class="pre-strim" v-html="removeQuotes(data.Answer)"></div>
      <update-answer-dialog 
        v-if="mode"
        :loading="loading"
        @update-answer="updateItem"
      />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
  import { 
    get_json,
    removeQuotes
  } from '../../../util'
  import { mapState, mapActions } from 'vuex';

  export default {
      name: 'PublicDataPanelItemPre',

      components: {
          UpdateAnswerDialog: () => import('./UpdateAnswerDialog'),
    },

      data: () => ({
        loading: false,
      }),

      mounted () {
        this.setPublicItem(this.data)
      },

      props: {
          data: {
            type: Object,
          },
          mode: {
            type: Boolean,
            default: false
          },
        },
        methods: {
          ...mapActions('publicdata', ['updateAnswer', 'updateComponentKey', 'setPublicItem', 'showUpdateAnswerDialog', 'showUploadBtn', 'setStaticField']),

        removeQuotes,

        showDialog () {
          this.showUploadBtn(false)
          this.setStaticField(false)
          this.setPublicItem(this.data)
          this.showUpdateAnswerDialog(true)
        },

      async updateItem (item) {
        this.loading = true
        await this.updateAnswer(item)
        this.loading = false

        this.showUpdateAnswerDialog(false)
        this.updateComponentKey()
      }
        },
    }
</script>
