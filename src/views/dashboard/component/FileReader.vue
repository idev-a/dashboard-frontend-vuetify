<template>
  <label class="text-reader">
    Upload a CSV file
    <input type="file" @change="loadTextFromFile">
  </label>
</template>

<script>
  export default {
    name: "FileReader",

    methods: {
      loadTextFromFile (ev) {
        const file = ev.target.files[0];
        const reader = new FileReader();

        const self = this
        reader.onload = function(e) {
          self.$emit("load", reader.result);
        };
        reader.readAsText(file);
      }
    }
  };
</script>

<style>
  .text-reader {
    position: relative;
    overflow: hidden;
    display: inline-block;

    /* Fancy button style 😎 */
    border: 2px solid #1E88E5;
    border-radius: 5px;
    padding: 5px 22px;
    cursor: pointer;
  }
  .text-reader input {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    opacity: 0;
  }
</style>