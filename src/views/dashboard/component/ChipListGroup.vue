<template>
  <div
    class="d-flex flex-wrap"
  >
    <v-chip
      v-for="item in items"
      :key="item"
      outlined
      class="ma-2"
      color="red accent-2"
    >
      <v-avatar left>
        <v-icon>mdi-checkbox-marked-circle</v-icon>
      </v-avatar>
      {{upperFirst(item)}}
    </v-chip>
  </div>
</template>

<script>
import upperFirst from 'lodash/upperFirst'
export default {
  name: 'ChipListGroup',
  props: ['items'],

  data () {
    return {

    }
  },

  methods: {
    upperFirst
  }
}
</script>