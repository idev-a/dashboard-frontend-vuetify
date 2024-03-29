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
    <v-row justify="center">
      <v-slide-y-transition appear>
        <v-card
          max-width="100%"
          width="400"
          class="px-5 mt-10 py-5"
        >
          <v-card-title class="justify-center display-3">
            Login
          </v-card-title>

         

          <v-card-text
            ref="form"
            class="text-center"
          >
            <v-text-field
              ref="email"
              v-model="form.email"
              :rules="[rules.required, rules.email]"
              :loading="loading"
              hide-details="auto"
              class="mb-2"
              color="secondary"
              label="Please enter your email address."
              prepend-icon="mdi-email"
              @keyup.enter="request"
              required
            />

            <v-btn
              class="ma-1 mt-4 mb-6"
              color="main"
              :loading="loading"
              :disabled="loading || formHasErrors"
              @click="request"
            >
              Request Code
            </v-btn>

            <v-text-field
              ref="code"
              v-model="code"
              :rules="[rules.required]"
              :loading="loading"
              hide-details="auto"
              class="mb-2"
              color="secondary"
              label="Your access code"
              prepend-icon="mdi-eye"
              @keyup.enter="submit"
              required
            />

            <v-checkbox
              v-model="keepMeLogin"
              label="Keep me login"
              required
            ></v-checkbox>

            <v-btn
              class="ma-1 mt-1"
              color="main"
              :loading="loading"
              :disabled="!code || loading"
              @click="submit"
            >
              Login
            </v-btn>
            <div class="text-center mt-2 grey--text body-1 font-weight-light">
              If you don't have any account, please <a href="javascript:;" @click="gotoSignup" class="">sign up</a>
            </div>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import { BASE_API, Post } from '@/api'
  import { DOMAIN_LIST } from '@/util'
  import { mapState } from 'vuex'

  export default {
    name: 'PagesLogin',

    data () {
      const defaultForm = Object.freeze({
        email: '',
      })

      return {
        loading: false,
        errorMessages: {
          email: {
            required: false,
            invalid: false,
            business: false
          },
        },
        snackbar: false,
        snackbar_message: '',
        snackbar_color: 'success',
        multiLine: true,
        defaultForm,
        form: Object.assign({}, defaultForm),
        code: '',
        keepMeLogin: false,
        rules: {
          required: value => {
            this.errorMessages.email.required = !!value
            return this.errorMessages.email.required || 'This field is required.'
          },
          counter: value => value.length >= 6 || 'Min 6 characters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            this.errorMessages.email.invalid = pattern.test(value)
            return this.errorMessages.email.invalid || 'Invalid e-mail.'
          },
          validEmail: value => {
            const domain = value.split('@')[1]
            this.errorMessages.email.business = value.includes('@') && !DOMAIN_LIST.includes(domain.toLowerCase()) 
            return this.errorMessages.email.business || 'Please enter a business email'
          }
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
      ...mapState(['companyId']),

      formHasErrors () {
        return !this.errorMessages.email.required || !this.errorMessages.email.invalid || !this.form.email
      }
    },

    mounted () {
      const message = localStorage.getItem('message')
      console.log(message)
      if (message != undefined && message) {
        localStorage.removeItem('message')
        this.snackbar_message = message
        this.snackbar_color = 'failure'
        this.snackbar = true
      }
    },

    methods: {
      gotoSignup () {
        this.$router.push({ name: "Register" });
      },
      gotoDashboard (data) {
        localStorage.setItem('jwt', data.auth_token)
        window.location.href = '/'
      },
      resetForm () {
        this.form = Object.assign({}, this.defaultForm)
        this.$refs.form.reset()
      },
      async request () {
        if (!this.formHasErrors) {
          this.loading = true
          const data = {
            email: this.form.email,
          }
          const res = await Post(`users/login/code`, data)
          this.loading = false
          this.snackbar_message = res.message
          this.snackbar_color = res.status
          this.snackbar = true
        }
      },

      async submit () {
        this.$refs.code.validate(true)

        if (this.code) {
          this.loading = true
          const data = {
            code: this.code,
            keep: this.keepMeLogin,
          }
          const res = await Post(`users/login/verify`, data)
          this.snackbar_message = res.message
          this.snackbar_color = res.status
          this.snackbar = true
          if (res.status === 'success') {
            this.gotoDashboard(res)
          }
          this.loading = false
        }
      },
    },
  }
</script>
