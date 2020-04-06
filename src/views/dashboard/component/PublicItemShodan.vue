<template>
	<v-expansion-panel
		v-if="data"
	>
		<v-expansion-panel-header>
			<b class="display-2 d-block">{{data.question}}</b>
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<v-row>
				<v-col
                  cols="12"
                  md="6"
              	>
					<div>
						<v-icon
							large
					      size="16"
					      class="ml-2 mr-1"
					    >
					      mdi-earth
					    </v-icon>
					    <b class="display-2">{{get_json(data).ip_str}}</b>
					</div>
					<v-divider class="my-2"></v-divider>
					<div class="mb-3"><b>Country:</b> <span>{{get_json(data).country_name}}</span></div>
					<div class="mb-3"><b>Last Update:</b> <span>{{get_json(data).last_update}}</span></div>
					<v-row>
						<v-col
		                  cols="6"
		              	>
		              		<div class="mb-3"><b>ASN:</b> <span>{{get_json(data).asn}}</span></div>
		              	</v-col>
		              	<v-col
		                  cols="6"
		              	>
		              		<div class="mb-3"><b>Organization:</b> <span>{{get_json(data).org}}</span></div>
		              	</v-col>
		          	</v-row>
					<v-row>
						<v-col
		                  cols="6"
		              	>
		              		<div class="mb-3"><b>Latitude:</b> <span>{{get_json(data).latitude.toFixed(2)}}</span></div>
		              	</v-col>
		              	<v-col
		                  cols="6"
		              	>
		              		<div class="mb-3"><b>Longitude:</b> <span>{{get_json(data).longitude.toFixed(2)}}</span></div>
		              	</v-col>
		          	</v-row>
              	</v-col>
              	<v-col
                  cols="12"
                  md="6"
              	>
              		<div>
						<v-icon
							large
					      size="16"
					      class="ml-2 mr-1"
					    >
					      mdi-power-plug
					    </v-icon>
					    <b class="display-2">Ports ({{get_json(data).ports.length}})</b>
					</div>
					<v-divider class="my-2"></v-divider>
					<div class="d-flex flex-wrap">
						<div v-for="port in get_json(data).ports">
							<v-chip label outlined class="success ma-2 pa-2 mb-3">{{port}}</v-chip>
						</div>
					</div>
				</v-col>
			</v-row>
			<div>
				<v-icon
					large
			      size="16"
			      class="ml-2 mr-1"
			    >
			      mdi-power-plug
			    </v-icon>
			    <b class="display-2">Services ({{ get_json(data).data.length}})</b>
			</div>
			<v-divider class="my-2"></v-divider>
			<v-row>
				<v-col
					cols="12"
                  	md="6"
                  	v-for="service in get_json(data).data"
                >	
                	<div class="d-inline-flex mb-2">
                		<v-chip label class="success pa-0 px-5">{{service.port}}</v-chip>
                		<v-chip label class="orange pa-0 px-5">{{service.transport}}</v-chip>
                		<v-chip label class="dark pa-0 px-5">{{service._shodan.module}}</v-chip>
                	</div>
                	<pre class="pre-strim" >{{service.data}}</pre>
					<div v-if="service.http && !service.ssl">
						<b class="mb-2">{{service.http.title}}</b>
						<div v-html="service.http.html"></div>
					</div>

					<div v-if="service.ssl">
						<div v-if="service.ssl">
							<div class="display-1">SSL Certificate</div>
							<div class="mb-1"><b>Version:</b> <span>{{service.ssl.cert.version}}</span></div>
							<div class="mb-1"><b>Serial Number:</b> <span>{{service.ssl.cert.serial}}</span></div>
							<div class="mb-1"><b>Signature Algorithm:</b> <span>{{service.ssl.cert.sig_alg}}</span></div>
							<div class="mb-1"><b>Issuer:</b> <span v-for="(val, name) in service.ssl.cert.issuer"><span class="ma-1">{{name}}={{val}},</span></span></div>
							<div class="mb-1">
								<b>Validity:</b> 
								<span v-if="!service.ssl.cert.expired">
									<v-icon color="success">mdi-check</v-icon>
								</span> 
								<span v-else>
									<v-icon color="red">mdi-alert</v-icon>
								</span> 
							</div>
							<div class="mb-1 ml-2"><span>Not Before:</span> {{beautifyDateZ(service.ssl.cert.issued)}} </div>
							<div class="mb-1 ml-2"><span>Not After :</span> {{beautifyDateZ(service.ssl.cert.expires)}} </div>
							<div class="mb-1"><b>Subject:</b> <span v-for="(val, name) in service.ssl.cert.subject"><span class="ma-1">{{name}}={{val}},</span></span></div>
							<div class="">
								<b>Subject Public Key Info:</b> 
								<div class="mb-1 ml-2"><span>Public-Key:</span> {{ service.ssl.cert.pubkey.type }} - {{ service.ssl.cert.pubkey.bits }} bit </div>
								<v-expansion-panels
									flat
									hover
								>
									<v-expansion-panel>
								        <v-expansion-panel-header><b>Fingerprint:</b></v-expansion-panel-header>
								        <v-expansion-panel-content>
											<div v-for="(val, name) in service.ssl.cert.fingerprint">
												<div class="fingerprint">
													<div>{{name}}:</div>
													<pre class="mb-1 ml-4 body-2">{{hexEncode(val)}} </pre>
												</div>
											</div>
								        </v-expansion-panel-content>
							      	</v-expansion-panel>
						      	</v-expansion-panels>
							</div>
							<!-- <div class="mb-1">
								<b>X509v3 extensions:</b> 
								<div class="mb-1 ml-2">
									<div v-for="item in service.ssl.cert.extensions">
										<div class="mb-1 fingerprint">
											<div>X509v3 {{item.name}}: </div>
											<div class="ml-5" v-if="item.name == 'authorityKeyIdentifier' || item.name == 'subjectKeyIdentifier'">{{hexEncode(item.data)}}</div>
											<div class="ml-5" v-else>{{item.data}}</div>
										</div>
									</div>
								</div>
							</div> -->
							<div class="mb-2">
								<v-expansion-panels
									flat
									hover
								>
									<v-expansion-panel>
								        <v-expansion-panel-header><b>Certificates:</b></v-expansion-panel-header>
								        <v-expansion-panel-content>
											<div v-for="item in service.ssl.chain">
												<pre class="body-2">{{item}}</pre>
											</div>
								        </v-expansion-panel-content>
							      	</v-expansion-panel>
						      	</v-expansion-panels>
							</div>
						</div>
					</div>
              	</v-col>
			</v-row>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
	import { validEmail, get_json, beautifyEmail } from '../../../util'
	export default {
		name: 'PublicDataShodan',

		props: {
			data: {
				type: Object,
			},
		},

		methods: {
			get_json,

			beautifyEmail,
		}
	}
</script>