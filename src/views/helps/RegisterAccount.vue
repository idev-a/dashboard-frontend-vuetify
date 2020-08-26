<template>
  <v-container
    id="register-account"
    class="justify-center mt-15"
    tag="section"
  >
    <v-row justify="center" no-gutters>
      <v-col cols=12 lg=9>
        <v-row>
          <v-col cols=12 lg=8>
            <v-img 
              :src="require(`@/assets/register.png`)"
            />
          </v-col>
          <v-col cols=12 lg=4>
            <v-sheet 
              class="pa-2"
              outlined
              rounded
            >
              <v-card-title>
                RELATED ARTICLES
              </v-card-title>
              <v-card-text>
                <ul class="help-list">
                  <li  v-for="(item, i) in menuItems" :key="i">
                    <a @click="goto(item.name)" >{{ item.text}}</a>
                  </li>
                </ul>
              </v-card-text>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { HelpMixin } from './HelpMixin'

  export default {
    name: 'RegisterAccount',
    mixins: [HelpMixin],

    data ()  {
      return {
        items: [
          {
            text: 'Dashboard',
            disabled: false,
            to: 'Dashboard',
          },
          {
            text: 'Getting Started',
            disabled: false,
            to: 'Get Started',
          },
          {
            text: 'How to register an account?',
            disabled: true,
            to: 'Register Account',
          },
        ],
        menuItems:[
          {text: 'Why do I have to register?', name: 'Why Register'},
          {text: 'Cannot Log In / How to access my account', name: 'Access Account'},
          {text: 'How to find data in my account?', name: 'Find Data'},
          {text: 'What to do after you purchase a product from Revamp Cyber?', name: 'Purchase Product'}
        ]
      }
    },
  }
</script>