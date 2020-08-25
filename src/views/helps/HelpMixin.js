
import { mapActions } from 'vuex'

export const HelpMixin = {
  data ()  {
    return {
      items: [
        // {
        //   text: 'Getting Started',
        //   disabled: true,
        //   to: 'Get Started',
        // },
      ],
    }
  },

  mounted () {
    this.setItems(this.items)
  },
  
  methods: {
    ...mapActions('help', ['setItems']),

    goto (name) {
      this.$router.push({ name })
    }
  }
}