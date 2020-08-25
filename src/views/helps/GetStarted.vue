<template>
  <div>
    
    <v-container
      id="login"
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
                  <a @click="goto(item.name)" >{{ item.text}}</a>
                </li>
              </ul>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import { HelpMixin } from './HelpMixin'

  export default {
    name: 'Help',
    mixins: [HelpMixin],

    data () {
      return {
        menuItems:[
          {text: 'How to register an account?', name: 'Register Account'},
          {text: 'Why do I have to register?', name: 'Why Register'},
          {text: 'Cannot Log In / How to access my account', name: 'Access Account'},
          {text: 'How to find data in my account?', name: 'Find Data'},
          {text: 'What to do after you purchase a product from Revamp Cyber?', name: 'Purchase Product'}
        ]
      }
    },
  }
</script>

<style lang="scss">
.help-title {
  font-size: 30px;
  margin-bottom: 1.875rem;
}

ul.help-list {
  li {
    margin: 1.5rem 0px;
    a {
      font-size: 1.3125rem;
      color: #333;
      font-weight: 400;
    }
  }
}
</style>