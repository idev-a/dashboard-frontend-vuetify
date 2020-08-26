<template>
  <v-container
    id="pagefooter"
    class="justify-center p-relative"
    tag="section"
  >
    <v-row justify="center">
      <v-col cols="12" lg="8">
        <v-card class="pa-3">
          <v-card-title class="mb-5">
            Send Email
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.subject"
                    label="Your Subject"
                    :rules="[rules.required]"
                    outlined
                  />
                  <v-text-field
                    v-model="form.name"
                    label="Your Name"
                    outlined
                  />
                  <v-text-field
                    v-model="form.email"
                    label="Your Email"
                    :rules="[rules.required, rules.email]"
                    outlined
                  />
                  <v-textarea
                    v-model="form.message"
                    label="You can write your message here..."
                    :rules="[rules.required]"
                    outlined
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid || loading"
              :loading="loading"
              color="primary"
              @click="submit"
            >
              Send
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

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
  import { Post } from '../../api'
  import { mapState, mapActions } from 'vuex'
  import { HelpMixin } from './HelpMixin'

  export default {
    name: 'ContactUs',
    mixins: [HelpMixin],

    data () {
      return {
        valid: true,
        loading: false,
        form: {},
        snackbar: false,
        message: '',
        color: 'success',
        items: [
        ],
        rules: {
          required: value => {
            return !!value || 'This field is required.'
          },
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        }
      }
    },

    computed: {
      ...mapState('help', ['title'])
    },

    methods: {
      ...mapActions('help', ['changeTitle']),

      async submit () {
        this.$refs.form.validate()
        if (this.valid) {
          this.loading = true
          const res = await Post('admin/contactus', this.form)
          this.message = res.message
          this.color = res.status
          this.snackbar = true
          this.loading = false
          this.form = {}
        }
      }
    },

    mounted () {
      this.changeTitle('Contact Us')
    }
  }
</script>