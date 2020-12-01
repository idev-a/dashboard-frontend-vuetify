<template>
  <base-material-stats-card
    class="mx-2"
    :loading="loading"
    :color="data.color"
    :icon="data.icon"
    :title="data.title"
    :value="data.value"
    :sub-icon="data.sub_icon"
    :sub-text="data.sub_text"
    :to="movable ? '': data.to"
    :hover="!movable && !data.dark"
    :ripple="!movable && !data.dark"
    :dark="data.dark"
    @update="$emit('update')"
  />
</template>

<script>
export default {
  name: "Atomic",

  props: [
    'data', 
    'movable', 
    'loading', 
    'columnIdx',
    'cardIdx',
  ],

};
</script>

<style scoped>
.Atomic {
  margin: 1rem;
}
</style>
