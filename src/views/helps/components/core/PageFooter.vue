<template>
  <v-container
    id="pagefooter"
    class="justify-center p-relative"
    tag="section"
  >
    <v-divider v-if="showDivider" class="mb-13 mt-10"/>

    <v-row v-if="showDivider" justify="center" class="ma-0 pa-0">
      <v-col cols=12 lg=10>
        <v-row class="ma-0 pa-0">
          <v-col>
            <div class="help-title mb-2">
              Love what you see?
            </div>
            <div>
              High Risk Apps, High Risk Users, Security Answers, Public Data.
            </div>
            <v-btn
              class="my-5"
              color="primary"
              rounded
              to="/pages/register"
            >
              Create account
            </v-btn>
          </v-col>
          <v-col>
            <div class="help-title mb-2">
              Need more help?
            </div>
            <div>
              Send us an email with more details about your specific needs.
            </div>
            <v-btn
              class="my-5"
              color="primary"
              rounded
              target="_blank"
              to="contact-us"
            >
              Submit a request
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'ContactUs',

    computed: {
      ...mapState('help', ['title']),

      showDivider () {
        return this.title != 'Contact Us'
      }
    },
  }
</script>