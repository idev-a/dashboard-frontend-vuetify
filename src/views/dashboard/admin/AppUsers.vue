<template>
  <v-container
    id="high-risks"
    fluid
    tag="section"
  >
<!--     <v-row>
      <v-col
        cols='12'
        md="6"
        >
          <v-select
            :loading="loadingCompany"
            v-model="company"
            :items="companies"
            attach
            chips
            label="Select a company"
            multiple
            @input="changeCompany"
          ></v-select>
        </v-col>
    </v-row> -->
    <!-- Applications to each company -->
    <v-card
      inline
      icon="mdi-alert-outline"
      class="px-5 py-3"
    >
      <v-card-title>
        Apps & Users (applications)
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="appHeaders"
        :items="apps"
        :items-per-page="page"
        item-key="id"
        :search="search"
        single-expand
        show-expand
        :expanded.sync="expanded"
        @update:items-per-page="getPageNum"
      > 
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>
               <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                class="mb-3"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- Dialog for applications table -->
            <v-dialog v-model="appDialog" max-width="1024px">
              <template v-slot:activator="{ on }">
                <v-btn color="success" dark class="mb-2" v-on="on"><v-icon size="16" left dark>mdi-plus</v-icon>Add New App</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ appFormTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form
                      ref="appForm"
                      v-model="appValid"
                    >
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-textarea
                            v-model="editedAppItem.application_name"
                            label="Name" 
                            auto-grow
                            rows="1"
                            :rules="[rules.required, uniqueApp]"
                            hide-details="auto"
                            required
                            >
                          </v-textarea>
                        </v-col>
                        <v-col cols="12" md="8">
                          <v-textarea
                            v-model="editedAppItem.purpose"
                            label="Purpose" 
                            auto-grow
                            rows="1"
                            :rules="[rules.required]"
                            hide-details="auto"
                            required
                            >
                          </v-textarea>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-textarea
                            v-model="editedAppItem.application_logo"
                            label="Logo" 
                            auto-grow
                            rows="1"
                            hide-details="auto"
                            >
                          </v-textarea>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-textarea
                            v-model="editedAppItem.login_url"
                            label="Login url" 
                            auto-grow
                            rows="1"
                            hide-details="auto"
                            >
                          </v-textarea>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-textarea
                            v-model="editedAppItem.authentication_method"
                            label="Authentication Method" 
                            auto-grow
                            rows="1"
                            hide-details="auto"
                            >
                          </v-textarea>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-select
                            v-model="editedAppItem.risk"
                            label="Risk" 
                            :items="riskItems"
                            >
                          </v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-textarea
                            v-model="editedAppItem.notes"
                            label="Notes" 
                            auto-grow
                            rows="1"
                            hide-details="auto"
                            >
                          </v-textarea>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-textarea
                            v-model="editedAppItem.soc2"
                            label="SoC2" 
                            auto-grow
                            rows="1"
                            hide-details="auto"
                            >
                          </v-textarea>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="editedAppItem.users_table_name"
                            label="Users tablename"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeAppDialog">Cancel</v-btn>
                  <v-btn :disabled="!appValid" color="blue darken-1" text @click="createApp">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.risk="{ item }">
          <v-chip :color="levelColor(item.risk)" dark>
            <div class="subtitle-2">{{ item.risk ? item.risk : 'low' }}</div>
          </v-chip>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click.stop="showUsers(item)"
              >
                <v-icon>mdi-account-search</v-icon>
              </v-btn>
            </template>
            <span>Show Users</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click="editApp(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit Application</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click="deleteApp(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Delete Application</span>
          </v-tooltip>
        </template>
        <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
          <v-btn @click="expand(true)" v-if="item.canExpand && !isExpanded">Expand</v-btn>
          <v-btn @click="expand(false)" v-if="item.canExpand && isExpanded">close</v-btn>
        </template>
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length">
            <!-- Users for the each application -->
            <div
              v-if="user"
              class="px-4 py-1"
            >
              <v-card-title
              >
                <span
                  class="display-1"
                >
                  {{usersTitle}}
                </span>
              </v-card-title>
              <v-data-table
                :loading="loading"
                :headers="userHeaders"
                :items="users"
                :items-per-page="page"
                item-key="id"
                :search="searchUser"
              >
                <template v-slot:top>
                  <v-toolbar flat color="white">
                    <v-toolbar-title>
                       <v-text-field
                        v-model="searchUser"
                        append-icon="mdi-magnify"
                        label="Search"
                        class="mb-3"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <!-- Dialog for app_users table -->
                    <v-dialog v-model="userDialog" max-width="1024px">
                      <template v-slot:activator="{ on }">
                        <v-btn color="success" dark class="mb-2" v-on="on"><v-icon size="16" left dark>mdi-plus</v-icon>Add New App User</v-btn>
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="headline">{{ userFormTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-form
                              ref="userForm"
                              v-model="userValid"
                              
                            >
                              <v-row>
                                <v-col cols="12" md="4">
                                  <v-text-field 
                                    v-model="editedUserItem.email"
                                    :rules="[rules.required, rules.email]"
                                    label="Email"
                                    required
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                  <v-select
                                    v-model="editedUserItem.status"
                                    :items="statusItems"
                                    label="Select a status"
                                  ></v-select>
                                </v-col>
                                <v-col cols="12" md="4">
                                  <v-textarea
                                    v-model="editedUserItem.fullname"
                                    label="Full Name" 
                                    auto-grow
                                    rows="1"
                                    hide-details="auto"
                                    >
                                  </v-textarea>
                                </v-col>
                                <v-col cols="12" md="4">
                                  <v-switch
                                    v-model="editedUserItem.has_2fa"
                                    label="Has 2FA"
                                  ></v-switch>
                                </v-col>
                              </v-row>
                            </v-form>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="closeUserDialog">Cancel</v-btn>
                          <v-btn color="blue darken-1" text @click="createUser">Save</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-toolbar>
                </template>
                <template v-slot:item.action="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn 
                        text 
                        icon 
                        v-on="on"
                        @click="editUser(item)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit User</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn 
                        text 
                        icon 
                        v-on="on"
                        @click="deleteUser(item)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Delete User</span>
                  </v-tooltip>
                </template>
                <template v-slot:item.email="{ item }">
                  <span v-html="beautifyEmail(item.email)"></span>
                </template>
                <template v-slot:item.has_2fa="{ item }">
                  <v-chip :color="item.has_2fa == 1 ? 'success' : 'default'" dark>{{ item.has_2fa == 1 ? 'Yes' : 'No' }}</v-chip>
                </template>
                <template v-slot:item.status="{ item }">
                  <v-chip :color="item.status == 'Active' ? 'success' : 'default'" dark>{{ item.status == 'Active' ? 'Active' : 'Disabled' }}</v-chip>
                </template>
              </v-data-table>
            </div>
          </td>
        </template>
      </v-data-table>
    </v-card>

    <v-card
      inline
      icon="mdi-alert-outline"
      class="px-5 py-3"
    >
      <v-card-title>
        Application Detail (company_applications)
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="appDetailsHeaders"
        :items="appDetails"
        :items-per-page="page"
        item-key="id"
        :search="searchDetail"
        single-expand
        show-expand
        :expanded.sync="expandedDetail"
        @update:items-per-page="getPageNum"
      > 
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>
               <v-text-field
                v-model="searchDetail"
                append-icon="mdi-magnify"
                label="Search"
                class="mb-3"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- Dialog for company_applications table -->
            <v-dialog v-model="detailDialog" max-width="1024px">
              <template v-slot:activator="{ on }">
                <v-btn color="success" dark class="mb-2" v-on="on"><v-icon size="16" left dark>mdi-plus</v-icon>Add New Company App</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ detailFormTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form
                      ref="detailForm"
                      v-model="detailValid"
                    >
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-select
                            :loading="loadingCompany"
                            v-model="editedDetailItem.company_id"
                            :items="companies"
                            :rules="[rules.required]"
                            chips
                            dense
                            label="Select a Company"
                            required
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-select
                            v-model="editedDetailItem.application_id"
                            :items="apps"
                            label="Select a Application"
                            :rules="[rules.required]"
                            item-value="id"
                            item-text="application_name"
                            chips
                            dense
                            required
                          >
                          </v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-textarea
                            v-model="editedDetailItem.department"
                            label="Department" 
                            auto-grow
                            rows="1"
                            hide-details="auto"
                            >
                          </v-textarea>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-textarea
                            v-model="editedDetailItem.owner"
                            label="Owner" 
                            auto-grow
                            rows="1"
                            hide-details="auto"
                            >
                          </v-textarea>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field 
                            v-model="editedDetailItem.admin_user"
                            :rules="[rules.email]"
                            label="Admin User" 
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="editedDetailItem.price"
                            label="Price"
                            prefix="$"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-menu
                            v-model="expirationDateMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="editedDetailItem.expiration_date"
                                label="Expiration Date"
                                readonly
                                v-on="on"
                              >
                                <v-icon slot="prepend" color="red">mdi-calendar</v-icon>
                              </v-text-field>
                            </template>
                            <v-date-picker v-model="editedDetailItem.expiration_date"  @input="expirationDateMenu = false"></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-switch
                            v-model="editedDetailItem.saml_enabled"
                            label="SAML Enabled"
                          ></v-switch>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-textarea
                            v-model="editedDetailItem.other"
                            label="Other" 
                            auto-grow
                            rows="1"
                            hide-details="auto"
                            >
                          </v-textarea>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-textarea
                            v-model="editedDetailItem.security_setting_1"
                            label="Security Setting 1" 
                            auto-grow
                            rows="1"
                            hide-details="auto"
                            >
                          </v-textarea>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDetailDialog">Cancel</v-btn>
                  <v-btn :disabled="!detailValid" color="blue darken-1" text @click="createDetail">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
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
            <span>Show Detail</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click="editAppDetail(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit Detail</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click="deleteDetail(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Delete Detail</span>
          </v-tooltip>
        </template>
         <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
          <v-btn @click="expand(true)" v-if="item.canExpand && !isExpanded">Expand</v-btn>
          <v-btn @click="expand(false)" v-if="item.canExpand && isExpanded">close</v-btn>
        </template>
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length">
           <!-- Application detail -->
            <div
              v-if="details"
              class="px-4 py-1"
            > 
              <v-row>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                    <b class="display-1">No of Users</b>
                    <div class="text--secondary">{{currentDetail.no_users}}</div>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                    <b class="display-1">Price</b>
                    <div class="text--secondary">{{currentDetail.price}}</div>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                    <b class="display-1">Other</b>
                    <div class="text--secondary">{{currentDetail.other}}</div>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  sm="3"
                >
                    <b class="display-1 mr-1">Login URL</b>
                    <a :href="currentDetail.login_url" target="_blank" class="text--red">GoTo</a>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  sm="3"
                >
                    <b class="display-1">Owner</b>
                    <div class="text--secondary">{{currentDetail.owner}}</div>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  sm="3"
                >
                    <b class="display-1">Admin User</b>
                    <div v-html="beautifyEmail(currentDetail.admin_user)" class="text--secondary"></div>
                </v-col>
                <v-col
                  cols="6"
                >
                    <b class="display-1">Purpose</b>
                    <div class="text--secondary">{{currentDetail.purpose}}</div>
                </v-col>
              </v-row>
            </div>
          </td>
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>

    <v-dialog v-model="modal" max-width="290">
      <v-card>
        <v-card-title class="text-center"><b>WARNING</b></v-card-title>
        <v-card-text>Are you sure?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="clearAction()">Disagree</v-btn>
          <v-btn color="green darken-1" text @click="deleteAction()">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    
  </v-container>
</template>

<script>
  import { fetchApps, fetchAppUsers, BASE_API } from '../../../api'
  import { validEmail, levelColor, DOMAIN_LIST, getTableName } from '../../../util'
  import axios from 'axios'

  export default {
    name: 'DashboardApplications',

    data: () => ({
      loading: false,
      loadingCompany: true,
      modal: false,
      confirm: false,
      company: '',
      companies: [],
      statusItems: [
        'Active',
        'Disabled'
      ],
      search: '',
      searchDetail: '',
      searchUser: '',
      snack: false,
      snackColor: '',
      snackText: '',
      appValid: false,
      userValid: false,
      detailValid: false,
      currentApp: '',
      delApp: '',
      user: '',
      delUser: '',
      delDetail: '',
      details: false,
      pagination: {},
      appDialog: false,
      userDialog: false,
      detailDialog: false,
      defaultAppIndex: -1,
      defaultUserIndex: -1,
      defaultDetailIndex: -1,
      defaultAppItem: {
        risk: 'High',
        application_logo: '',
        purpse: '',
        login_url: '',
        application_name: '',
        authentication_method: '',
        notes: '',
        soc2: '',
        users_table_name: ''
      },
      defaultUserItem: {
        email: '',
        has_2fa: 'false',
        status: 'active',
        fullname: '',
        company_id: ''
      },
      defaultDetailItem: {
        application_id: -1,
        company_id: '',
        department: '',
        owner: '',
        admin_user: '',
        price: '',
        expiration_date: '',
        saml_enabled: false,
        other: '',
        security_setting_1: ''
      },
      editedAppItem: {
        risk: 'High'
      },
      editedUserItem: {
        has_2fa: 'false',
        status: 'active',
      },
      editedDetailItem: {
      },
      appHeaders: [
        {
          text: 'Name',
          value: 'application_name',
        },
        {
          text: 'Purpose',
          value: 'purpose',
        },
        {
          text: 'Risk',
          value: 'risk',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      appDetailsHeaders: [
        {
          text: 'Name',
          value: 'application_name',
        },
        {
          text: 'Company',
          value: 'company_id',
        },
        {
          text: 'Department',
          value: 'department',
        },
        {
          text: 'Owner',
          value: 'owner',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      userHeaders: [
        {
          text: 'Name',
          value: 'fullname',
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Status',
          value: 'status',
        },
        {
          text: '2FA',
          value: 'has_2fa',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      apps: [],
      appsList: [],
      appDetails: [],
      users: [],
      expanded: [],
      expandedDetail: [],
      rules: {
        required: value => !!value || 'This field is required.',
        counter: value => value.length >= 6 || 'Min 6 characters',
        email: value => {
          if (value.length == 0) {
            return true
          }
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },
      riskItems: [
        'High',
        'Medium',
        'Low'
      ],
      renewalDateMenu: false,
      expirationDateMenu: false,
    }),

    async mounted () {
      this.loading = true
      await this.fetchDashboardUsers()
      this.appDetails = await fetchApps('all')
      const res = await axios.get(`${BASE_API}/api/applications/all`)
      if (res.data) {
        this.apps = res.data.apps
      }
      this.loading = false

      // initialize dialogs
      this.closeAppDialog ()
      this.closeDetailDialog()
      this.closeUserDialog()
    },

    computed: {
      usersTitle () {
        if (this.currentApp) {
          return `Users (${this.currentApp.users_table_name})`
        } else {
          return 'Users'
        }
      },
      page () {
        return Number(localStorage.getItem('page')) || 5
      }, 

      appFormTitle () {
        return this.defaultAppIndex === -1 ? 'New Application' : 'Edit Application'
      },

      userFormTitle () {
        return this.defaultUserIndex === -1 ? 'New Application User' : 'Edit Application User'
      },

      detailFormTitle () {
        return this.defaultDetailIndex === -1 ? 'New Company Application' : 'Edit Company Application'
      },
    },

    watch: {
      appDialog (val) {
        val || this.closeAppDialog()
      },

      userDialog (val) {
        val || this.closeUserDialog()
      },

      detailDialog (val) {
        val || this.closeDetailDialog()
      },

      editedAppItem: {
        handler(val){
          if (val.application_name && val.application_name.length > 0) {
            this.editedAppItem.users_table_name = getTableName(val.application_name)  + '_users'
          }
          if (this.$refs.appForm) {
            this.$refs.appForm.validate()
          }
        },
        deep: true
      },

      editedDetailItem: {
        handler(val){
          if (this.$refs.detailForm) {
            this.$refs.detailForm.validate()
          }
        },
        deep: true
      }
    },

    methods: {
      uniqueApp (value) {
        if (this.defaultAppIndex > -1) {
          return true
        }
        const _apps = this.apps.filter(app => app.application_name.toLowerCase() == value.toLowerCase())
        return _apps.length == 0 || 'This app name already exists'
      },

      levelColor (level) {
        return levelColor(level)
      },
      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },
      beautifyEmail (emails) {
        let res = ''
        const list = emails.split(' ')
        list.map(email => {
          if (validEmail(email)) {
            res += `<a href="mailto:${email}">${email}</a><br />`
          } else {
            res += `${email} <br />`
          }
        })

        return res
      },
      showDetails (item) {
        this.expandedDetail = []
        this.currentDetail = item
        this.details = true
        this.expandedDetail.push(item)
      },
      async showUsers (item) {
        this.currentApp = item
        this.user  = true
        this.details = false
        this.expanded = []
        this.expanded.push(item)
        this.loading = true
        let company = this.company
        if (company.length == 0) {
          company = 'all'
        }
        this.users = await fetchAppUsers(item.users_table_name, company)
        this.loading = false
      },

      async fetchDashboardUsers () {
        let res = await axios.get(`${BASE_API}/api/users/all`)
        res = res.data.users
        const companyUsers = res.filter(user => !DOMAIN_LIST.includes(user.email.split('@')[1]))
        const self = this;
        companyUsers.map(user => {
          if (!self.companies.includes(user.email.split('@')[1])) {
            self.companies.push(user.email.split('@')[1]) 
          }
        })

        this.loadingCompany = false
      },

      async changeCompany (data) {
        if (data.length) {
          this.apps = this.appsOrigin.filter(app => data.includes(app.company_id))
          let company = this.company
          if (company.length == 0) {
            company = '%'
          }
          this.users = await fetchAppUsers(this.currentApp.users_table_name, company)
        } else {
          this.apps = this.appsOrigin
        }
      },

      closeAppDialog () {
        this.appDialog = false
        setTimeout(() => {
          this.editedAppItem = Object.assign({}, this.defaultAppItem)
          this.defaultAppIndex = -1
        }, 300)
      },

      closeUserDialog () {
        this.userDialog = false
        setTimeout(() => {
          this.editedUserItem = Object.assign({}, this.defaultUserItem)
          this.defaultUserIndex = -1
        }, 300)
      },

      closeDetailDialog () {
        this.detailDialog = false
        setTimeout(() => {
          this.editedDetailItem = Object.assign({}, this.defaultDetailItem)
          this.defaultDetailIndex = -1
        }, 300)
      },

      showSnack (res) {
        if (res.data.status == 'Ok') {
          this.snackText = 'Success'
          this.snackColor = 'success'
        } else {
          this.snackText = 'Failed'
          this.snackColor = 'warning'
        }
        this.snack = true
      },

      async createApp () {
        const item = Object.assign({}, this.editedAppItem)
        let res
        if (this.defaultAppIndex > -1) {
          res = await this._updateApp(item)
          if (res.data.status == 'Ok') {
            Object.assign(this.apps[this.defaultAppIndex], item)
          }
        } else {
          res = await this._createApp(item)
          if (res.data.status == 'Ok') {
            this.apps.push(item)
          } 
        }
        this.closeAppDialog()

        this.showSnack(res)
      },

      async createDetail() {
        const item = Object.assign({}, this.editedDetailItem)
        let res
        if (this.defaultDetailIndex > -1) {
          res = await this._updateDetail(item)
          if (res.data.status == 'Ok') {
            const app = this.apps.filter(app => app.id == item.application_id)
            item.application_name = app[0].application_name
            Object.assign(this.appDetails[this.defaultDetailIndex], item)
          } 
        } else {
          res = await this._createDetail(item)
          if (res.data.status == 'Ok') {
            const app = this.apps.filter(app => app.id == item.application_id)
            item.application_name = app[0].application_name
            this.appDetails.push(item)
          } 
        }
        this.closeDetailDialog()
        this.showSnack(res)
      },

      async createUser () {
        const item = Object.assign({}, this.editedUserItem)
        let res
        if (this.defaultUserIndex > -1) {
          res = await this._updateUser(item)
          if (res.data.status == 'Ok') {
            Object.assign(this.users[this.defaultUserIndex], item)
          } 
        } else {
          res = await this._createUser(item)
          if (res.data.status == 'Ok') {
            this.users.push(item)
          } 
        }

        this.closeUserDialog()
        this.showSnack(res)
      },

      editApp (item) {
        this.defaultAppIndex = this.apps.indexOf(item)
        this.editedAppItem = Object.assign({}, item)
        this.appDialog = true
      },

      editAppDetail (item) {
        this.defaultDetailIndex = this.appDetails.indexOf(item)
        this.editedDetailItem = Object.assign({}, item)
        this.detailDialog = true
      },

      editUser (item) {
        this.defaultUserIndex = this.users.indexOf(item)
        this.editedUserItem = Object.assign({}, item)
        this.userDialog = true
      },

      deleteApp (item) {
        this.delApp = item
        this.modal = true
      },

      deleteUser (item) {
        this.delUser = item
        this.modal = true
      },

      deleteDetail (item) {
        this.delDetail = item
        this.modal = true
      },

      showAlert () {
        this.modal = true
      },

      async deleteAction () {
        this.modal = false
        let res, index
        if (this.delApp) {
          res = await this._deleteApp()
          if (res.data.status == 'Ok') {
            index = this.apps.indexOf(this.delApp)
            this.apps.splice(index, 1)
          } 
        } else if (this.delUser) {
          res = await this._deleteUser()
          if (res.data.status == 'Ok') {
            index = this.users.indexOf(this.delUser)
            this.users.splice(index, 1) 
          } 
        } else if (this.delDetail) {
          res = await this._deleteDetail()
          if (res.data.status == 'Ok') {
            index = this.appDetails.indexOf(this.delDetail)
            this.appDetails.splice(index, 1) 
          } 
        }

        this.showSnack(res)
      },

      clearAction () {
        this.modal = false
        this.delApp = {}
        this.delUser = {}
        this.delDetail = {}
      },

      async _callAPI (data, url) {
        this.loading = true
        const res = await axios({
          url,
          data,
          method: 'POST'
        })
        this.loading = false
        return res
      },

      async _deleteApp () {
        return await this._callAPI(this.delApp, `${BASE_API}/api/applications/delete`)
      },

      async _updateApp (data) {
        return await this._callAPI(data, `${BASE_API}/api/applications/update`)
      },

      async _createApp (data) {
        return await this._callAPI(data, `${BASE_API}/api/applications/create`)
      },

      async _deleteUser () {
        const data = {
          id: this.delUser.id,
          users_table_name: this.currentApp.users_table_name
        }
        return await this._callAPI(data, `${BASE_API}/api/applications/user/delete`)
      },

      async _updateUser (data) {
        data.users_table_name = this.currentApp.users_table_name
        return await this._callAPI(data, `${BASE_API}/api/applications/user/update`)
      },

      async _createUser (data) {
        data.users_table_name = this.currentApp.users_table_name
        return await this._callAPI(data, `${BASE_API}/api/applications/user/create`)
      },

      async _deleteDetail (data) {
        return await this._callAPI(this.delDetail, `${BASE_API}/api/applications/detail/delete`)
      },

      async _updateDetail (data) {
        return await this._callAPI(data, `${BASE_API}/api/applications/detail/update`)
      },

      async _createDetail (data) {
        return await this._callAPI(data, `${BASE_API}/api/applications/detail/create`)
      }
    }
  }
</script>
