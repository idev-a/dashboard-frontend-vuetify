<template>
	<v-container
	    id="public-data-run"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
	    	<v-card-title>
		        Public Data (Run)
		        <v-spacer></v-spacer>
		        <v-btn :loading="loading" :disabled="loading" @click="importCSV" color="success">Import CSV<v-icon  size="16" right dark>mdi-database-import</v-icon></v-btn>
		        <v-file-input
				    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
				    placeholder="Import CSV file containing domain list"
				    prepend-icon="mdi-database-import"
				    label="CSV file"
				    ref="myfile" 
				    v-model="files"
			  	></v-file-input>
		    </v-card-title>
		</v-card>
	</v-container>
</template>

<script>
	import axios from 'axios'
	import { BASE_API } from '../../../api'

	export default {
		name: 'PublicDataList',

		data: () => ({
			loading: false,
			files: null
		}),

		methods: {
			importCSV () {
				let formData = new FormData()
				formData.append('userName', 'CSV');

		        if(this.files){
		            for( let file in this.files){
		                formData.append("file", file);
		            }

					  var xhttp = new XMLHttpRequest();
					  xhttp.open("POST", `${BASE_API}/api/admin/publicdata/run`, true);
					  xhttp.setRequestHeader('Content-Type', 'multipart/form-data; boundary=AaB03x;  charset=utf-8');
					  xhttp.send(formData);

		            // axios.post(`${BASE_API}/api/admin/publicdata/run`,	
              //           formData,
              //           {
              //           	headers: { 'Content-Type': 'multipart/form-data' },
              //       	},
              //       ).then( response => {
              //           console.log({response})
              //       }).catch(error => {
              //           console.log({error})
              //       })
		        }
			}
		}
	}
</script>