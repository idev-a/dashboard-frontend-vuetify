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
        <base-material-card
          color="blue"
          light
          max-width="100%"
          width="400"
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <div class="text-center">
              <h1 class="display-2 font-weight-bold mb-2">
                Register
              </h1>
            </div>
          </template>

          <div
            ref="form"
            class="text-center"
            @submit.prevent="submit"
          >
          <!--   <v-text-field
              ref="username"
              v-model="form.username"
              :rules="[rules.required]"
              :error-messages="errorMessages.username"
              :loading="loading"
              hide-details="auto"
              class="mb-2"
              color="secondary"
              label="Username"
              prepend-icon="mdi-face"
              required
            /> -->

            <v-text-field
              ref="email"
              v-model="form.email"
              :rules="[rules.required, rules.email]"
              :error-messages="errorMessages.email"
              :loading="loading"
              class="mb-5"
              hide-details="auto"
              color="secondary"
              label="Your purchase email address"
              prepend-icon="mdi-email"
              required
            />

            <v-btn
              :loading="loading"
              color="primary"
              class="display-1"
              @click="submit"
            >
              Submit
            </v-btn>
            <div class="text-center grey--text mt-2 body-1 font-weight-light">
              If you already have an account, please <a href="javascript:;" @click="gotoLogin">login</a>
            </div>
          </div>
        </base-material-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import { BASE_API } from '../../api'
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
      })

      return {
        socials: [
          {
            href: '#',
            icon: 'mdi-google',
            iconColor: '#dd4b39',
          },
        ],
        loading: false,
        formHasErrors: false,
        errorMessages: {
          username: '',
          email: '',
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
          required: value => !!value || 'This field is required.',
          counter: value => value.length >= 6 || 'Min 6 characters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        },
      }
    },

    computed: {
    },

    watch: {
      name () {
        this.errorMessages = ''
      },
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
        if (!this.form.email) this.formHasErrors = true
        this.$refs.email.validate(true)
      
        if (!this.formHasErrors) {
          this.loading = true
          const self = this
          const data = {
            username: this.form.username,
            email: this.form.email,
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
