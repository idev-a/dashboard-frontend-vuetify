<template>
  <v-container
    id="public-data-run"
    fluid
    tag="section"
  >
    <v-card
      class="pa-5"
    >
      <v-card-title>
        Public Data (Run)
        <v-spacer></v-spacer>
        <v-btn  :disabled="loadingBulk" class="mb-2" @click="done=true;getBulkData()" color="main">Check Progress<v-icon  size="16" right dark>mdi-database</v-icon></v-btn>
        <v-btn :loading="loading" :disabled="loading || (!file && !domains)"  class="mb-2" @click="importCSV" color="main">Import & Run<v-icon  size="16" right dark>mdi-database-import</v-icon></v-btn>
      </v-card-title>
      <v-subheader>
        Run automation script to get public data for listed companies.
      </v-subheader>

      <v-card-text>
        <v-row>
          <v-col cols="12" md=6>
            <v-textarea
              v-model="domains"
              label="Public domain list with new line" 
              hint="Ctrl + Enter to run the functionality"
              rows="2"
              auto_grow
              clearable
              outlined
              @keyup.ctrl.13="keyDownOnRun"
          />
          </v-col>
          <v-col cols="12" md=6>
            <v-file-input
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              placeholder="Import CSV file containing domain field"
              prepend-icon="mdi-database-import"
              label="CSV file"
              ref="myfile" 
              v-model="file"
              multiple 
            ></v-file-input>
          </v-col>
        </v-row>
      </v-card-text>
    
      <v-spacer></v-spacer>
      <v-card-title>
        CSV Data 
        <v-spacer></v-spacer>
        <v-text-field
          v-model="csvSearch"
          append-icon="mdi-magnify"
          label="Search"
          class="mb-5"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-data-table
          v-model="csvData"
          :loading="loading"
          :headers="csvHeaders"
          :items="indexedCSV"
          :items-per-page="page"
          item-key="_id"
          :search="csvSearch"
          @update:items-per-page="getPageNum"
          dense
        > 
        </v-data-table>
      </v-card-text>
      <v-spacer></v-spacer>
      <v-card-title>
        Public Data Progress <small>&nbsp;(Click to see its data)</small>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="bulkSearch"
          append-icon="mdi-magnify"
          label="Search"
          class="mb-5"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :loading="loadingBulk"
          :headers="bulkHeaders"
          :items="bulkData"
          :items-per-page="page"
          item-key="_id"
          :search="bulkSearch"
          @update:items-per-page="getPageNum"
          dense
          @click:row="showPublicData"
        > 
          <template v-slot:item.logs="{ item }">
              <pre>{{ item.logs }}</pre>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-card>
      <public-data
        v-if="domain"
        title='Business Data'
        category='business'
        :banner="banner"
        :company="domain"
        :key="componentkey"
        :mode="mode"
      >
      </public-data>
    </v-card>

    <v-snackbar
      v-model="snackbar"
      bottom
      :color="color"
      >
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          dark
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
  import { BASE_API, Get, Post } from '../../../api'
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'PublicDataList',

    data: () => ({
      done: false,
      loading: false,
      loadingBulk: false,
      file: null,
      domains: '',
      csvSearch: '',
      bulkSearch: '',
      snackbar: false,
      message: '',
      color: 'success',
      checkInterval: null,
      csvData: [],
      csvHeaders: [
        {
          text: 'Domain',
          value: 'domain',
        }
      ],
      bulkData: [],
      bulkHeaders: [
        {
          text: 'Domain',
          value: 'domain',
        },
        {
          text: 'Status',
          value: 'status'
        },
        {
          text: 'Logs',
          value: 'logs'
        },
        {
          text: 'Run at',
          value: 'run_at'
        }
      ],
      domain: '',
      banner: false,
      mode: true,
    }),

    mounted () {
      const self = this;
      this.checkInterval = setInterval(function() { self.getBulkData() }, 15000)
    },

    beforeDestroy () {
      clearInterval(this.checkInterval)
    },

    components: {
      PublicData: () => import('../component/PublicData'),
    },

    computed: {
      ...mapState('publicdata', {
        componentkey: state => state.componentkey
      }),
      ...mapState(['page']),

      indexedCSV () {
        return this.csvData.map((item, index) => ({
          _id: index,
          ...item
        }))
      },
    },

    methods: {
      showPublicData (item) {
        if (item.status == 'finished') {
          this.domain = item.domain
        } else {
          this.message = `Sorry, Script is still running for this domain, So, display the old data instead.`
          this.color = 'failure'
          this.snackbar = true
          this.domain = item.domain
        }
      },

      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },

      async getBulkData () {
        if (!this.done || this.loadingBulk) {
          return;
        }
        this.loadingBulk = true
        try {
          const res = await Get(`admin/publicdata/check`)
          this.bulkData = res.data
            // this.message = res.data.message
            // this.color = res.data.status
        } catch(e) {
          this.message = 'Something wrong happened on the server.'
            // this.snackbar = true
        } finally {
            this.loadingBulk = false
        }
      },

      keyDownOnRun () {
        if (this.domains) {
          this.importCSV()
        }
      },

      async importCSV () {
        let formData = new FormData()
        formData.append('userName', 'CSV');

        if(this.file){
          for (let file of this.file) {
            formData.append("file", file, file.name);
          }
        }

        const data = {
          domains: this.domains
        }
        const json = JSON.stringify(data);
        const blob = new Blob([json], {
          type: 'application/json'
        });

        formData.append("domains", blob);

        this.done = true
        this.loading = true
        this.file = null
        const res = await Post(`admin/publicdata/run`, formData)
        this.csvData = res.csv_data
        this.message = res.message
        this.color = res.status
        this.loading = false
        this.snackbar = true
      }
    }
  }
</script>