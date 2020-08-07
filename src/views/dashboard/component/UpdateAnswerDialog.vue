<template>
  <v-dialog v-model="show" max-width="1024px" @click:outside="closeDialog">
        <v-card :loading="loading">
            <v-card-title>
              <v-row>
                  <div class="headline" style="margin: 0 auto;">Update the Question & Answer</div>
                  <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
                  <v-btn :disabled="loading" color="blue darken-1" text @click="updateAnswer">Save</v-btn>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-container>
                  <v-form
                    ref="appForm"
                    v-model="formValid"
                  >
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-select
                                v-model="editedItem.risk_level"
                                label="Risk" 
                                :items="riskItems"
                              >
                              </v-select>
                          </v-col>
                        <v-col cols="12" md="12">
                            <v-textarea
                              v-model="editedItem.question"
                              label="Question" 
                              auto-grow
                              rows="1"
                              hide-details="auto"
                              required
                            >
                            </v-textarea>
                        </v-col>
                        <v-col v-if="uploadBtn" cols="12" md="12">
                <file-reader @load="readFileContent"></file-reader>
                        </v-col>
                        <v-col v-if="!staticField" cols="12" md="12">
                            <v-textarea
                              v-model="editedItem.answer"
                              label="Answer" 
                              auto-grow
                              rows="1"
                              hide-details="auto"
                              required
                              class="max-400"
                            >
                            </v-textarea>
                        </v-col>
                       
                    </v-row>
                </v-form>
            </v-container>
        </v-card-text>
        
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  export default {
    name: 'UpdateAnswerDialog',

    data: () => ({
      formValid: false,
    }),

    components: {
          FileReader: () => import('./FileReader')
    },

    computed: {
      ...mapState(['riskItems']),
        ...mapState('publicdata', {
          publicItem: state => state.publicItem,
          updateAnswerDialog: state => state.updateAnswerDialog,
          uploadBtn: state => state.uploadBtn,
          staticField: state => state.staticField,
        }),
        show: {
          set () {

          },
          get () {
            return this.updateAnswerDialog
          }
        },
        editedItem: {
          get () {
            let val = Object.assign({}, this.publicItem)
            return val
          },
          set () {
            
          }
        }
      },

    props: {
      loading: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      ...mapActions('publicdata', ['setPublicItem', 'showUpdateAnswerDialog']),

      readFileContent (val) {
        var allTextLines = val.split(/\r\n|\n/);
          var headers = allTextLines[0].split(',');
          var lines = [];

          for (var i=1; i<allTextLines.length; i++) {

              var data = allTextLines[i].split(',');
              if (data.length == headers.length) {
                  var row = {};
                  for (var j=0; j< headers.length; j++) {
                     row[headers[j].trim()] = data[j].trim();

                  }
                  lines.push(row);
              }
          }
        this.editedItem.answer = JSON.stringify(lines)
        this.setPublicItem(this.editedItem)
      },

      changeRisk (value) {
        this.editedItem.high = value == 'High' ? 1 : 0
        this.editedItem.medium = value == 'Medium' ? 1 : 0
        this.editedItem.low = value == 'Low' ? 1 : 0
      },

      closeDialog () {
        this.showUpdateAnswerDialog(false)
      },

      updateAnswer () {
        this.$emit('update-answer', this.editedItem)
      }
    },
  }
</script>

<style>
  .max-400 {
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>