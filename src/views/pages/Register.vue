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
      <v-icon
        dark
      >
        mdi-checkbox-marked-circle
      </v-icon>
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

          <div
            ref="form"
            class="text-center"
          >
            <v-text-field
              ref="email"
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

            <v-checkbox
              v-model="form.opt_out"
            >
              <template v-slot:label>
                <div class="black--text">Would you like to receive <b>Daily Security Tips</b>?</div>
              </template>
            </v-checkbox>

            <v-btn
              :loading="loading"
              color="main"
              class="display-1 mt-6"
              :disabled="formHasErrors || loading"
              @click="submit"
            >
              Submit
            </v-btn>
            <div class="text-center grey--text mt-2 body-1 font-weight-light">
              If you already have an account, please <a href="javascript:;" @click="gotoLogin">login</a>
            </div>
          </div>
        </v-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import { BASE_API } from '../../api'
  import { DOMAIN_LIST } from '../../util'
  import axios from 'axios'

  export default {
    name: 'PagesRegister',

    components: {
      PagesHeading: () => import('./components/Heading'),
    },

    data () {
      const defaultForm = Object.freeze({
        username: '',
        email: '',
        opt_out: 0,
      })

      return {
        loading: false,
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
      }
    },

    computed: {
      formHasErrors () {
        return  !this.errorMessages.email.required || !this.errorMessages.email.invalid || !this.form.email
      }
    },

    watch: {
    },

    methods: {
      gotoLogin () {
        this.$router.push({ name: "Login" });
      },
      passwordCheck () {
        this.errorMessages.password = this.form.password !== this.form.password1
          ? 'The password does not match.'
          : ''
        return !!this.errorMessages.password
      },
      resetForm () {
        this.form = Object.assign({}, this.defaultForm)
        this.$refs.form.reset()
        this.formHasErrors = false
      },
      async submit () {
        this.$refs.email.validate(true)
        
        if (!this.formHasErrors) {
          this.loading = true
          const self = this
          const data = {
            username: this.form.username,
            email: this.form.email,
            daily_tips_opt_out: !this.form.opt_out
          }
          axios({
            url: `${BASE_API}/api/users/register`,
            method: 'POST',
            data: data,
          })
            .then(function (res) {
              self.loading = false
              self.snackbar_message = res.data.message
              if (res.data.status === 'failure') {
                self.snackbar_color = 'red darken-3'
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
    },
  }
</script>

<style lang="sass">
  #register
    .v-list-item__subtitle
      -webkic-line-clamp: initial
      -webkit-box-orient: initial
</style>
