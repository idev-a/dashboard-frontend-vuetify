<template>
  <div v-if="cards">
    <v-row v-for="(column, columnIdx) in cards.children" :key="column.id">
      <v-col cols="12" md="6" lg="3" v-for="card in column.children" :key="card.id">
        <Atomic :class="card" :loading="loading" :data="card" :movable="false"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Atomic from '../component/Atomic.vue'
import { StatsMixin } from './StatsMixin.js'

export default {
  name: 'Stats',
  components: {
    Atomic
  },

  mixins: [StatsMixin],
}
</script>