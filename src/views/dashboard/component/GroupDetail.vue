<template>
	<div
      class="px-3 py-1"
    >
      <v-row>
      	<v-col
          cols="12"
          sm="6"
          md="6"
        >
            <b class="display-1 d-block">Full Name</b>
            <span class="text--secondary">{{currentGroup.name}}</span>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
        >
            <b class="display-1 d-block">Email</b>
            <span class="text--secondary" v-html="beautifyEmails(currentGroup.email)"></span>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
        >
            <b class="display-1 d-block">Aliases</b>
            <div class="d-flex flex-wrap text--secondary" v-html="beautifyEmails(currentGroup.aliases)">
            </div>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
        >
            <b class="display-1 d-block">Description</b>
            <span class="text--secondary">{{currentGroup.description}}</span>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
        >
            <b class="display-1 d-block">Members</b>
            <div class="d-flex flex-wrap text--secondary" v-html="beautifyEmails(currentGroup.members)">
            </div>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
        >
            <b class="display-1 d-block">Company</b>
            <span class="text--secondary">{{currentGroup.company_id}}</span>
        </v-col>
      </v-row>
    </div>
</template>

<script>
	import { beautifyEmails } from '../../../util'
	export default {
		name: 'GroupDetail',

		props: {
			currentGroup: {
				type: Object
			}
		},

		methods: {
			beautifyEmails
		}
	}
</script>