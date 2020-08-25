<template>
  
</template>
<script>
  import { HelpMixin } from './HelpMixin'

  export default {
    name: 'WhyRegister',
    mixins: [HelpMixin],

    data: () => {
      return {
        items: [
          {
            text: 'Getting Started',
            disabled: false,
            to: 'Get Started',
          },
          {
            text: 'Cannot Log In / How to access my account',
            disabled: true,
            to: 'Access Account',
          },
        ],
      }
    },
    
    methods: {

    }
  }
</script>