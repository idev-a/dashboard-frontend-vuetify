<template>
  <v-treeview
    selectable
    hoverable
    item-disabled="locked"
    :items="items"
    item-key="title"
    item-text="title"
  ></v-treeview>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DrawerBoard',

  data () {
    return {

    }
  },

  computed: {
    ...mapState('drawer', ['items'])
  }
}
</script>