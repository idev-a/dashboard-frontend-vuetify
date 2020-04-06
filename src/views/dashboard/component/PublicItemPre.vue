<template>
	<v-expansion-panel
		v-if="data"
	>
		<v-expansion-panel-header>
			<b class="display-2 d-block">{{data.question}}</b>
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<pre class="pre-strim">{{data.answer}}</pre>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
	export default {
    	name: 'PublicDataPanelItemPre',

    	props: {
	      	data: {
		        type: Object,
      		},
      	}
    }
</script>