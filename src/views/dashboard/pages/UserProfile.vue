<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-card 
      class="pa-5"
    >
      <v-card-title>
        My Profile
      </v-card-title>

      <v-form>
        <v-container class="py-0">
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                label="Company Name"
                v-model="user.company_id"
                readonly
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                label="Email Address"
                class="purple-input"
                v-model="user.email"
                readonly
              />
            </v-col>

            <v-col
              v-if="false"
              cols="12"
              md="6"
            >
              <v-text-field
                class="purple-input"
                label="User Name"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                class="purple-input"
                label="Role"
                :value="user.role"
                readonly
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-checkbox
                :value="!user.daily_tips_opt_out"
                label="Receive Daily Security Tips"
                disabled
              >
              </v-checkbox>
            </v-col>

            <v-col
              cols="12"
              class="text-right"
            >
              <v-btn
                color="success"
                class="mr-0"
                disabled
              >
                Update Profile
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
  import jwtDecode from 'jwt-decode'

  export default {
    name: "UserProfile",

    data: () => ({
      loading: false,
      user: {}
    }),

    mounted () {
      try {
        this.user = jwtDecode(localStorage.getItem('jwt'))
      } catch(e){
        console.log(e)
      }
    }
  }
</script>
