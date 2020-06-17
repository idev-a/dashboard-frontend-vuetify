<template>
	<div>
		<v-textarea
            v-if="mode == 'Edit'"
            v-model="editItem.answer"
            label="Answer" 
            auto-grow
            rows="1"
            :rules="[rules.required]"
            hide-details="auto"
            class="mb-3"
            required
        >
        </v-textarea>
        <v-textarea
            v-if="mode == 'Edit'"
            v-model="editItem.notes"
            label="Notes" 
            auto-grow
            rows="1"
            :rules="[rules.required]"
            hide-details="auto"
            class="mb-3"
        >
      	</v-textarea>
      	<v-row>
      		<v-col class="col-auto">
          	  <v-select
          	  	v-if="mode == 'Edit'"
                v-model="editItem.risk"
                label="Risk" 
                :items="risks"
                >
              </v-select>
            </v-col>
        </v-row>
      	<div v-if="mode == 'Edit'" class="body-1 text--secondary mt-4">CIA</div>
      	<v-chip-group
          	v-if="mode == 'Edit'"
	        v-model="editItem.cia"
	        column
	        multiple
      	>
	        <v-chip filter outlined v-for="cia in cias" class="text-capitalize">{{cia}}</v-chip>
      	</v-chip-group>
      	<div v-if="mode == 'Edit'" class="body-1 text--secondary mt-4">T1 ~ T11</div>
      	<v-chip-group
          	v-if="mode == 'Edit'"
	        v-model="editItem.Ts"
	        column
	        multiple
      	>
	        <v-chip filter outlined v-for="t in tList">{{t}}</v-chip>
      	</v-chip-group>
	</div>
</template>

<script>
	export default {
		name: 'SecurityAnswerEditForm',

		props: {
			mode: {
				type: String
			}
		},

		data () {
			return {
				editItem: {},
				rules: {
		          required: value => {
		            return !!value || 'This field is required.'
		          },
		        }
		    }
		}  
	}
</script>