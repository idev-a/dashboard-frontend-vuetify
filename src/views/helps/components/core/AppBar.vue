<template>
  <!-- <v-app-bar
    absolute
    color="transparent"
    flat
    height="85"
  >
    <v-container class="px-0 ">
      <v-img
        class="hidden-xs-only mt-3"
        width="200"
          :src="require(`@/assets/rc-logo.png`)"
        >
      </v-img>
    </v-container>
  </v-app-bar> -->
  <header class="gradient-light-blue">
      <div class="container pt-8">
        <v-img
          class="hidden-xs-only"
          width="200"
            :src="require(`@/assets/rc-logo.png`)"
          >
        </v-img>
      </div>
      <div
        class="section section-contact-page section-header"
      >
        <v-container
          id="login"
          class="justify-center"
          tag="section"
        >
          <div class="text-center display-2 white--text">
            <h1 class="font-weight-regular">How can we help?</h1>
            <v-breadcrumbs class="justify-center" :items="items">
              <template v-slot:divider>
                <v-icon color="white">mdi-arrow-right-bold-outline</v-icon>
              </template>
              <template v-slot:item="d">
                <a @click="goTo(d.item.to)" class="white--text display-1 font-weight-medium">{{d.item.text}}</a>
              </template>
            </v-breadcrumbs>
          </div>
        </v-container>
      </div>
      <v-row justify="center">
        <v-col cols="12" md="9" style="position: relative;">
          <v-card
            class="help-search"
            width="100%"
          >
            <v-text-field
              placeholder="Search"
              append-icon="mdi-magnify"
            />
          </v-card>
        </v-col>
      </v-row>
    </header>
</template>

<script>
import { mapState } from 'vuex'

  export default {
    name: 'PagesCoreAppBar',

    data: () => ({
      titles: {
        '/pages/lock': 'Lock Page',
        '/pages/login': 'Login Page',
        '/pages/register': 'Register Page',
      },
      searchItems: [
        {text: 'test', value: 'test'}
      ]
    }),

    computed: {
      ...mapState('help', ['items']),
      title () {
        return this.titles[this.$route.path]
      },
    },

    methods: {
      goTo (name) {
        const token = localStorage.getItem('jwt')
        if (this.$router.history && this.$router.history.current && this.$router.history.current.name == name) {
          return;
        }
        if (name === 'Dashboard') {
          if (token === 'success') {
            this.$router.push({ name });
          }
        } else {
          this.$router.push({ name });
        }
      },
    },
  }
</script>

<style lang="scss">
.center-title {
  position: absolute;
  top: 31px;
  left: calc(50% - 175px);  
}
.section-header {
  height: 12.625rem;
}

.gradient-light-blue {
  position: relative;
  background-color: rgba(28,206,234,.82);
  background: linear-gradient(-45deg,rgba(147,26,222,.83),rgba(28,206,234,.82));
}

.help-search {
  position: absolute;
  bottom: -58px;
  box-shadow: 0 0.125rem 0.4375rem 0 rgba(0,0,0,.3);
  margin-top: -2.82531rem;
  padding: .0625rem 1.75rem;
  min-height: 5.5625rem;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid #e5e5e5;
  border-radius: .625rem;

  .v-text-field > .v-input__control > .v-input__slot:before, .v-text-field > .v-input__control > .v-input__slot:after {
    width: 0;
  }

  .v-text-field input {
    padding: 24px 0 20px 20px;
  }

  .theme--light.v-input:not(.v-input--is-disabled) input, .theme--light.v-input:not(.v-input--is-disabled) textarea {
    font-size: 24px;
  }

  .v-text-field .v-input__prepend-inner, .v-text-field .v-input__append-inner {
    margin-top: 14px;
  }

  input::placeholder {
    color: black !important;
    font-size: 24px;
    opacity: 1;
  }

  .v-label {
    color: black;
    opacity: 1;
  }
}


</style>