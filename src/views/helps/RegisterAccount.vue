<template>
  
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
      }
    },
  }
</script>