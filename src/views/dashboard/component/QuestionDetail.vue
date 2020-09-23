<template>
	<div
    class="px-4 py-2"
    >
      <v-row
        align="center"
      >
        <v-col
          cols="auto"
          class=""
        >
          <div class="font-weight-medium">
            Question
          </div>
        </v-col>
        <v-col
          cols="auto"
	      class="display-2"
        >
          <!-- <v-card shaped outlined class="my-0 pa-2"> -->
            <span class="text--secondary">
            	{{currentQuestion.question}} 
            	<v-chip :color="levelColor(currentQuestion.risk_level)" dark>
		            <div class="subtitle-2 text-capitalize">{{ currentQuestion.risk_level }}</div>
          	  	</v-chip>
            </span>
          <!-- </v-card> -->
        </v-col>
      </v-row>
      <v-row
        align="center"
      >
        <v-col
          cols="auto"
          class=""
        >
          <div class="font-weight-medium">
            Answer
          </div>
        </v-col>
        <v-col
          cols="auto"
        >
          <!-- <v-card shaped outlined class="my-0 pa-2"> -->
            <span class="text--secondary">{{removeQuotes(currentQuestion.answer)}}</span>
          <!-- </v-card> -->
        </v-col>
      </v-row>
      <v-row
        align="center"
      >
        <v-col
          cols="auto"
          class=""
        >
          <div class="font-weight-medium">
            Category
          </div>
        </v-col>
        <v-col
          cols="auto"
        >
          <!-- <v-card shaped outlined class="my-0 pa-2"> -->
            <span class="text--secondary">{{currentQuestion.category}}</span>
          <!-- </v-card> -->
        </v-col>
      </v-row>
      <v-row
        align="center"
      >
        <v-col
          cols="auto"
          class="mb-0"
        >
          <div class="font-weight-medium">
            Description
          </div>
        </v-col>
        <v-col
          cols="auto"
          class="mt-0"
        >
          <span class="text--secondary" v-html="highlightText(currentQuestion.description)"></span>
        </v-col>
      </v-row>
      <v-row
        align="center"
      >
        <v-col
          cols="auto"
          class="mb-0"
        >
          <div class="font-weight-medium">
            Recommendation
          </div>
        </v-col>
        <v-col
          cols="auto"
          class="mt-0"
        >
            <span class="text--secondary">{{currentQuestion.recommendation}}</span>
        </v-col>
      </v-row>
      <v-row
        align="center"
      >
        <v-col
          cols="auto"
          class="mb-0"
        >
          <div class="font-weight-medium">
            Impact
          </div>
        </v-col>
        <v-col
          cols="auto"
          class="mt-0"
        >
            <span class="text--secondary">{{currentQuestion.impact}}</span>
        </v-col>
      </v-row>
      <v-row
        align="center"
      >
        <v-col
          cols="auto"
          class=""
        >
          <div class="font-weight-medium">
            Notes
          </div>
        </v-col>
        <v-col
          cols="auto"
        >
          <!-- <v-card shaped outlined class="my-0 pa-2"> -->
            <span class="text--secondary">{{currentQuestion.Notes}}</span>
          <!-- </v-card> -->
        </v-col>
      </v-row>
      <v-row
        align="center"
        class="mb-3"
      >
        <v-col
          cols="auto"
          class="py-0"
        >
          <div class="font-weight-medium">
            CIA
          </div>
        </v-col>
        <v-col
          cols="auto"
        >
          <v-chip-group
            column
          >
            <v-chip color="red lighten-1" outlined v-for="(cia, i) in parseJSON(currentQuestion.cia)" :value="cia" class="text-capitalize">{{cia}}</v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
      <v-row
        align="center"
      >
        <v-col
          cols="auto"
          class="py-0"
        >
          <div class="font-weight-medium">
            Threats
          </div>
        </v-col>
        <v-col
          cols="auto"
        >
          <v-chip-group
            column
          >
            <v-chip color="main" outlined v-for="(t, i) in parseJSON(currentQuestion.threats)" :value="t" class="text-capitalize">{{t}}</v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
    </div>
</template>

<script>
	import { levelColor, highlightText, removeQuotes } from '../../../util'
	export default {
		name: 'QuestionDetail',

    components: {
      ChipListGroup: () => import('./ChipListGroup')
    },

		props: {
			currentQuestion: {
				type: Object
			}
		},

		methods: {
			levelColor,
      highlightText,
      removeQuotes,

      parseJSON(val) {
        return val.split(';')
      }
		}
	}
</script>