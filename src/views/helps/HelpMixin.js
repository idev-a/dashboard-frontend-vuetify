import { mapActions, mapState } from 'vuex'
import { Get } from '../../api'

export const HelpMixin = {
  data ()  {
    return {
      loading: false,
    }
  },

  mounted () {
    this.getHelps()
  },

  computed: {
    ...mapState('help', ['menuItems', 'items'])
  },
  
  methods: {
    ...mapActions('help', ['setItems', 'setMenuItems']),

    goto (name) {
      this.$router.push({ path: `/help/get-started/${name}` })
    },

    async getHelps () {
      this.loading = true
      const res = await Get('admin/help/read_all')
      this.setMenuItems(res.items)
      this.loading = false
    }
  }
}