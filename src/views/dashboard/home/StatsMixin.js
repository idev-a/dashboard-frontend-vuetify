import { applyDrag, generateItems } from '@/util'
import { mapState, mapActions } from 'vuex'
import { Get, Post, getCompaniesUsers } from '@/api'

export const StatsMixin = {
  data () {
    return {
      loading: false,
      banner: true,
      cards: null,
      removedCards: [],
      defaultCards: null,
      movable: this.$route.name != 'Dashboard',
      isUser: this.$route.name == 'Dashboard',
      companies: [],
      selectedCompany: '',
      upperDropPlaceholderOptions: {
        className: 'cards-drop-preview',
        animationDuration: '150',
        showOnTop: true
      },
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true
      },
      trashMenu: false,
      rules: {
        required: value => {
          return !!value || 'This field is required.'
        },
      }
    }
  },
  computed: {
    ...mapState(['companyId']),
    _movable () {
      return true
      return this.$route.name != 'Dashboard'
    },
    lockAxis () {
      console.log(this.movable)
      this.movable ? 'undefined' : 'xy'
    },
    cardGhostClass () {
      return this.movable ? 'card-ghost, rotate-z': 'card-ghost'
    },
    cardGhostDropClass () {
      return this.movable ? 'card-ghost-drop, rotate-z-zero': 'card-ghost-drop'
    },
    labelSwitchMode () {
      return this.movable ? 'Customer View' : 'Admin View'
    }
  },
  watch:{
    companyId: {
      handler(newValue) {
        if (newValue && this.isUser) {
          this.selectedCompany = this.companyId
          this.fetchAllCardData()
        }
      },
      immediate: true
    },
    selectedCompany () {
      this.fetchAllCardData()
    }
  },
  async mounted () {
    if (!this.isUser) {
      await this.fetchUsers()
      if (this.companies.length) {
        this.selectedCompany = this.companyId
      }
    }
  },
  methods: {
    ...mapActions('security', ['showSnackbar']),

    async fetchAllCardData () {
      this.loading = true
      const res = await Get(`dashboard/${this.selectedCompany}/all`)
      this.cards = res.cards
      this.removedCards = res.removed_cards
      this.defaultCards = res.default_cards
      this.loading = false
    },
    columnClass (className) {
      return [{ 'bg-gray': this.movable }, className]
    },
    onColumnDrop (dropResult) {
      const cards = Object.assign({}, this.cards)
      cards.children = applyDrag(cards.children, dropResult)
      this.cards = cards
    },
    onTrashDrop (dropResult) {
      this.removedCards.splice(dropResult.removedIndex, 1)
    },
    onCardDrop (columnId, dropResult) {
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        const cards = Object.assign({}, this.cards)
        const column = cards.children.filter(p => p.id === columnId)[0]
        const columnIndex = cards.children.indexOf(column)
        const newColumn = Object.assign({}, column)
        newColumn.children = applyDrag(newColumn.children, dropResult)
        cards.children.splice(columnIndex, 1, newColumn)
        this.cards = cards
      }
    },
    getCardPayload (columnId) {
      return index => {
        return this.cards.children.filter(p => p.id === columnId)[0].children[index]
      }
    },
    getRemovedCardPayload(index) {
      return this.removedCards[index]
    },
    shouldAcceptDrop (sourceContainerOptions, payload) {
      return this.movable;
    },
    shouldAnimateDrop (sourceContainerOptions, payload) {
      return this.movable;
    },
    async fetchUsers () {
      this.loadingUsers = true
      this.companies = await getCompaniesUsers()
      this.loadingUsers = false
    },
    resetConfig () {
      this.cards = Object.assign({}, this.defaultCards)
      this.removedCards = []
    },
    async _saveConfig () {
      this.loading = true
      const data = {
        cards: this.cards,
        removed_cards: this.removedCards,
        company_id: this.selectedCompany,
      }
      const res = await Post('admin/dashboard/save', data)
      this.showSnackbar(res)
      this.loading = false
    },
    async saveConfig () {
      await this.confirm('Do you want to save this dashboard?', this._saveConfig)
    },
    updateCards (columnIdx, cardIdx) {
      const cards = Object.assign({}, this.cards)
      const column = cards.children[columnIdx]
      this.removedCards.push(column.children[cardIdx])
      const newColumn = Object.assign({}, column)
      newColumn.children.splice(cardIdx, 1)
      cards.children.splice(columnIdx, 1, newColumn)
      this.cards = cards
    },
    showRemovedCards () {
      this.trashMenu = true
    },
    async confirm(msg, callback) {
      await this.$dialog.confirm({
        text: msg,
        title: 'Warning',
        actions: {
          false: 'No',
          true: {
            color: 'red',
            text: 'Yes',
            handle: () => {
              callback()
            }
          }
        }
      })
    },
  }
}