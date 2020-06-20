<template>
 	<v-text-field
	 	v-bind="{
	      ...$attrs,
	      ...$props,
	    }"
        hide-details="auto"
        outlined
  	>
  	</v-text-field>
</template>

<script>
	export default {
		name: 'QuoteTextField',
	}
</script>