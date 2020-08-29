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
            	{{currentQuestion.Question}} 
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
            <span class="text--secondary">{{currentQuestion.Answer}}</span>
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
            <span class="text--secondary">{{currentQuestion.Category}}</span>
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
        <div
          class="d-flex flex-wrap"
        >
          <v-chip
            outlined
            class="ma-2"
            :color="currentQuestion.availability == 1 ? 'red accent-2' : 'grey accent-4'"
          >
            <v-avatar v-if="currentQuestion.availability == 1" left>
              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-avatar>
            Availability
          </v-chip>
       
          <v-chip
            outlined
            class="ma-2"
            :color="currentQuestion.Confidentiality == 1 ? 'red accent-2' : 'grey accent-4'"
          >
            <v-avatar v-if="currentQuestion.Confidentiality == 1" left>
              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-avatar>
            Confidentiality
          </v-chip>
       
          <v-chip
            outlined
            class="ma-2"
            :color="currentQuestion.Integrity == 1 ? 'red accent-2' : 'grey accent-4'"
          >
            <v-avatar v-if="currentQuestion.Integrity == 1" left>
              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-avatar>
            Integrity
          </v-chip>
        </div>
      </v-row>
      <v-row
        align="center"
      >
        <div
          class="d-flex flex-wrap"
        >
          <v-chip
            v-if="currentQuestion['T1. Software Failures (code, configuration etc.)'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Software Failures (code, configuration etc.)
          </v-chip>
          <v-chip
            v-if="currentQuestion['T2. Cloud Failures (Provider, VHardware, Capacity)'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Cloud Failures (Provider, VHardware, Capacity)
          </v-chip>
        </v-col>
          <v-chip
            v-if="currentQuestion['T3. Legal Threats (failure to comply, bad contacts)'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Legal Threats (failure to comply, bad contacts)
          </v-chip>
          <v-chip
            v-if="currentQuestion['T4. Social Engineering'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Social Engineering
          </v-chip>
          <v-chip
            v-if="currentQuestion['T5. External Unauthorized Access to Information Systems / Data'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            External Unauthorized Access to Information Systems / Data
          </v-chip>
          <v-chip
            v-if="currentQuestion['T6. Traffic Monitoring or Interception'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Traffic Monitoring or Interception
          </v-chip>
          <v-chip
            v-if="currentQuestion['T7.External Attacker Tampering with Data / Data Destruction'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            External Attacker Tampering with Data / Data Destruction
          </v-chip>
          <v-chip
            v-if="currentQuestion['T8. Repudiation of transactions and messages'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Repudiation of transactions and messages
          </v-chip>
          <v-chip
            v-if="currentQuestion['T9. Insider Abuse of Privilege'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Insider Abuse of Privilege
          </v-chip>
          <v-chip
            v-if="currentQuestion['T10. Third Party Liability (contractors, third processing)'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Third Party Liability (contractors, third processing)
          </v-chip>
          <v-chip
            v-if="currentQuestion['T11. Employee / User Mistakes'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Employee / User Mistakes
          </v-chip>
        </div>
      </v-row>
    </div>
</template>

<script>
	import { levelColor, highlightText } from '../../../util'
	export default {
		name: 'QuestionDetail',

		props: {
			currentQuestion: {
				type: Object
			}
		},

		computed: {
			risk () {
	      		let risk = 'Low'
            if (this.currentQuestion.critical) {
              risk = 'Critical'
            } else if (this.currentQuestion.high) {
	      			risk = 'High'
	      		} else if (this.currentQuestion.medium) {
	      			risk = 'Medium'
	      		} else if (this.currentQuestion.low) {
	      			risk = 'Low'
	      		} else if (this.currentQuestion.informational) {
              risk = 'Informational'
            }
	      		return risk
			},
		},

		methods: {
			levelColor,
      highlightText
		}
	}
</script>