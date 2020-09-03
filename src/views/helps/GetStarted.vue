<template>
  <v-container
    id="GetStarted"
    class="justify-center p-relative"
    tag="section"
  >
    <v-row justify="center">
      <v-col cols=12 lg=10>
        <v-card tile flat class="mt-15">
          <v-card-title class="help-title">
            Getting Started
          </v-card-title>
          <v-card-text>
            <ul class="help-list">
              <li  v-for="(item, i) in menuItems" :key="i">
                <a @click="goto(item.id)" >{{ item.title}}</a>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { HelpMixin } from './HelpMixin'
  import { mapActions } from 'vuex'

  export default {
    name: 'Help',
    mixins: [HelpMixin],

    methods: {
      ...mapActions('help', ['setItems'])
    },

    mounted () {
      this.setItems([
        {
          text: 'Dashboard',
          disabled: false,
          to: 'Dashboard',
        },
        {
          text: 'Getting Started',
          disabled: true,
          to: 'Get Started',
        }
      ])
    }
  }
</script>
