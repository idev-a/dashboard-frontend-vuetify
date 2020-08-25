<template>
	
</template>
<script>
	import { HelpMixin } from './HelpMixin'

	export default {
		name: 'FindData',
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
            text: 'How to find data in my account?',
            disabled: true,
            to: 'Find Data',
          },
        ],
			}
		},
	}
</script>