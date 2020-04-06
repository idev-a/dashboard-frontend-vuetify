<template>
	<v-expansion-panel
		v-if="data"
	>
		<v-expansion-panel-header>
			<b class="display-2 d-block">{{data.question}}</b>
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<!-- <div class="pre-strim">{{removeQuotes(data.answer)}}</div> -->
			<pre v-html="readNewLine(removeQuotes(data.answer))"></pre>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
	import { 
		get_json,
		removeQuotes,
		readNewLine,
	} from '../../../util'
	export default {
    	name: 'PublicDataPanelItem',

    	props: {
	      	data: {
		        type: Object,
      		},
      	},
      	methods: {
	    	removeQuotes,

	    	readNewLine
      	}
    }
</script>