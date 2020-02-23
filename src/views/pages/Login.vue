<template>
  <v-container
    id="login"
    class="fill-height justify-center"
    tag="section"
  >
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      center
      :color="snackbar_color"
      :multi-line="multiLine"
    >
      <span>{{ snackbar_message }}</span>
      <v-icon
        dark
      >
        mdi-checkbox-marked-circle
      </v-icon>
    </v-snackbar>
    <v-row justify="center">
      <v-slide-y-transition appear>
        <base-material-card
          color="success"
          light
          max-width="100%"
          width="400"
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <div class="text-center">
              <h1 class="display-2 font-weight-bold mb-2">
                Login
              </h1>
             
            </div>
          </template>

          <v-card-text
            ref="form"
            class="text-center"
          >
            <v-text-field
              ref="email"
              v-model="form.email"
              :rules="[rules.required, rules.email]"
              :error-message="errorMessages"
              :loading="loading"
              hide-details="auto"
              class="mb-2"
              color="secondary"
              label="Your purchase email address"
              prepend-icon="mdi-email"
              required
            />

            <v-btn
              class="ma-1 mt-4 mb-6"
              color="primary"
              :loading="loading"
              @click="request"
            >
              Request Code
            </v-btn>

            <v-text-field
              ref="code"
              v-model="code"
              :rules="[rules.required]"
              :error-message="errorMessages"
              :loading="loading"
              hide-details="auto"
              class="mb-2"
              color="secondary"
              label="Your access code"
              prepend-icon="mdi-eye"
              required
            />

            <v-btn
              class="ma-1 mt-4"
              color="primary"
              :loading="loading"
              @click="submit"
            >
              Login
            </v-btn>
            <div class="text-center mt-2 grey--text body-1 font-weight-light">
              If you don't have any account, please <a href="javascript:;" @click="gotoSignup" class="">sign up</a>
            </div>
          </v-card-text>
        </base-material-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import { BASE_API } from '../../api'
  import axios from 'axios'

  export default {
    name: 'PagesLogin',

    components: {
    },

    data () {
      const defaultForm = Object.freeze({
        email: '',
      })

      return {
        loading: false,
        formHasErrors: false,
        errorMessages: {
          email: '',
        },
        snackbar: false,
        snackbar_message: '',
        snackbar_color: 'success',
        multiLine: true,
        defaultForm,
        form: Object.assign({}, defaultForm),
        code: '',
        rules: {
          required: value => !!value || 'This field is required.',
          counter: value => value.length <= 20 || 'Max 20 characters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        },
        socials: [
          {
            href: '#',
            icon: 'mdi-google',
          },
        ],
      }
    },

    computed: {
    },

    watch: {
      email () {
        this.errorMessages = ''
      },
    },

    methods: {
      gotoSignup () {
        this.$router.push({ name: "Register" });
      },
      gotoDashboard (user) {
        localStorage.setItem('jwt', 'success')
        localStorage.setItem('user', JSON.stringify(user))
        this.$router.push({ name: "Dashboard" });
      },
      resetForm () {
        this.form = Object.assign({}, this.defaultForm)
        this.$refs.form.reset()
        this.formHasErrors = false
      },
      request () {
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
          if (!this.form[f]) this.formHasErrors = true

          this.$refs[f].validate(true)
        })

        if (!this.formHasErrors) {
          this.loading = true
          const self = this
          const data = {
            email: this.form.email,
          }
          axios({
            url: `${BASE_API}/api/users/login/code`,
            method: 'POST',
            data,
          })
            .then(function (res) {
              self.loading = false
              self.snackbar_message = res.data.message
              if (res.data.status === 'failure') {
                self.snackbar_color = 'error'
              } else {
                self.snackbar_color = 'success'
              }
              self.snackbar = true
            })
            .catch(error => {
              console.log(error)
              self.loading = false
            })
        }
      },

      submit () {
        this.formHasErrors = false

        if (!this.code) this.formHasErrors = true
        this.$refs['code'].validate(true)

        if (!this.formHasErrors) {
          this.loading = true
          const self = this
          const data = {
            code: this.code,
          }
          axios({
            url:`${BASE_API}/api/users/login/verify`,
            method: 'POST',
            data,
          })
            .then(function (res) {
              self.loading = false
              self.snackbar_message = res.data.message
              if (res.data.status === 'failure') {
                self.snackbar_color = 'error'
              } else {
                self.snackbar_color = 'success'
                self.gotoDashboard(res.data.user)
              }
              self.snackbar = true
            })
            .catch(error => {
              console.log(error)
              self.loading = false
            })
        }
      },
    },
  }
</script>
