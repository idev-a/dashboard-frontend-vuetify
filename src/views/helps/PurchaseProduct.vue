<template>
  
</template>
<script>
  import { HelpMixin } from './HelpMixin'

  export default {
    name: 'PuchaseProduct',
    mixins: [HelpMixin],

    data: () => {
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
            text: 'What to do after you purchase a product from Revamp Cyber?',
            disabled: true,
            to: 'Purchase Product',
          },
        ],
      }
    },
  }
</script>