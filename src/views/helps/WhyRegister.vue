<template>
  
</template>
<script>
  import { HelpMixin } from './HelpMixin'

  export default {
    name: 'WhyRegister',
    mixins: [HelpMixin],

    data () {
      return {
        items: [
          {
            text: 'Getting Started',
            disabled: false,
            to: 'Get Started',
          },
          {
            text: 'Why do I have to register?',
            disabled: true,
            to: 'Why Register',
          },
        ],
      }
    }
  }
</script>