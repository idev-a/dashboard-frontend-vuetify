<template>
  <v-container
    id="register"
    class="fill-height justify-center"
    tag="section"
  >
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      center
      :timeout="timeout"
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
          light
          max-width="100%"
          width="400"
          class="px-5 mt-10 py-5"
        >
         
          <v-card-title class="justify-center display-2">
            Register
          </v-card-title>

          <v-form
            ref="form"
            v-model="valid"
            class="text-center"
          >
            <v-text-field
              v-model="form.email"
              :rules="[rules.required, rules.email]"
              :loading="loading"
              class="mt-5 mb-3"
              hide-details="auto"
              color="secondary"
              label="Please enter your email address."
              prepend-icon="mdi-email"
              @keyup.enter="submit"
              required
            />

            <v-text-field
              v-model="form.company_id"
              :rules="[rules.required, rules.validCompanyName]"
              :loading="loading"
              class="mt-3"
              hide-details="auto"
              color="secondary"
              label="Please enter your company domain correctly."
              prepend-icon="mdi-application"
              @keyup.enter="submit"
              required
            />

            <v-text-field
              v-model="form.company_name"
              :loading="loading"
              class="mt-3 mb-7"
              hide-details="auto"
              color="secondary"
              label="Company Name."
              prepend-icon="mdi-application"
              @keyup.enter="submit"
              required
            />

            <v-checkbox
              v-model="form.daily_tips_opt_out"
              label="Would you like to receive Daily Security Tips?"
            >
            </v-checkbox>

            <v-btn
              :loading="loading"
              color="main"
              class="display-1 mt-6"
              :disabled="!valid || loading"
              @click="submit"
            >
              Submit
            </v-btn>
            <div class="text-center grey--text mt-2 body-1 font-weight-light">
              If you already have an account, please <a href="javascript:;" @click="gotoLogin">login</a>
            </div>
          </v-form>
        </v-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import { BASE_API, Get, Post } from '@/api'
  import { DOMAIN_LIST } from '@/util'

  export default {
    name: 'PagesRegister',

    components: {
      PagesHeading: () => import('./components/Heading'),
    },

    data () {
      const defaultForm = Object.freeze({
        username: '',
        email: '',
        company_id: '',
        daily_tips_opt_out: 0,
      })

      return {
        loading: false,
        valid: true,
        socials: [
          {
            href: '#',
            icon: 'mdi-google',
            iconColor: '#dd4b39',
          },
        ],
        errorMessages: {
          username: '',
          email: {
            required: false,
            invalid: false,
            business: false
          },
          password: ''
        },
        snackbar: false,
        timeout: 10000,
        multiLine: true,
        snackbar_message: '',
        snackbar_color: 'success',
        terms: false,
        defaultForm,
        form: Object.assign({}, defaultForm),
        rules: {
          required: value => {
            return !!value || 'This field is required.'
          },
          counter: value => value.length >= 6 || 'Min 6 characters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
          validEmail: value => {
            const domain = value.split('@')[1]
            return value.includes('@') && !DOMAIN_LIST.includes(domain.toLowerCase())  || 'Please enter a business email'
          },
          validCompanyName: v => {
            return (v.split(' ').length <= 1) || 'Space is not allowed'
          }
        },
      }
    },

    methods: {
      gotoLogin () {
        this.$router.push({ name: "Login" });
      },
      passwordCheck () {
        let checkPassword = this.form.password !== this.form.password1
          ? 'The password does not match.'
          : ''
        return !!checkPassword
      },
      async submit () {
        this.$refs.form.validate()
        if (!this.valid) {
          return
        }
        
        this.loading = true
        const res = await Post(`users/register`, this.form)
        this.loading = false
        this.snackbar_message = res.message
        if (res.status === 'failure') {
          this.snackbar_color = 'red darken-3'
        } else {
          this.snackbar_color = 'success'
        }
        this.snackbar = true
      }
    },
  }
</script>

<style lang="sass">
  #register
    .v-list-item__subtitle
      -webkic-line-clamp: initial
      -webkit-box-orient: initial
</style>
