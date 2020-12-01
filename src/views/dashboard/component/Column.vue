<template>
  <flex :items="items" direction="column"></flex>
</template>

<script>
import Flex from "./Flex.vue";

export default {
  name: "Column",
  components: {
    Flex
  },
  props: {
    items: null
  }
};
</script>

<style scoped>
</style>