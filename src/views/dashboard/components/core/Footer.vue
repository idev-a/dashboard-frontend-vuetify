<template>
  <v-footer
    id="dashboard-core-footer"
  >
    <v-container>
      <v-row
        align="center"
        no-gutters
      >
        <v-col
          v-for="(social, i) in socials"
          :key="i"
          class="text-center mb-sm-0 mb-5 mx-2"
          cols="auto"
        >
          <v-btn icon color="main" fab outlined :href="social.href">
            <v-icon size="25">{{social.icon}}</v-icon>
          </v-btn>
        </v-col>

        <v-spacer class="hidden-sm-and-down" />

        <v-col
          cols="12"
          md="auto"
        >
          <div
            class="text-center"
          >
            <a  
              v-for="(link, i) in links"
              :key="i" 
              class="mb-sm-0 mb-5 mx-1 text--black"
              :href="link.href">
              {{link.text}}
            </a>
          </div>
        </v-col>
      </v-row>
      <v-row class="mt-7" align="center" justify="center">
        <div class="body-1 font-weight-light pt-6 pt-md-0 text-center">
          &copy; 2019, copyright
          by <a color="main" href="https://revampcybersecurity.com/">RevampCyberSecurity</a>
        </div>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    name: 'DashboardCoreFooter',

    data: () => ({
      links: [
        {
          href: 'https://revampcybersecurity.com',
          icon: 'mdi-home',
          text: 'Home',
        },
        {
          href: 'https://revampcybersecurity.com/privacy-policy/',
          icon: 'mdi-twitter',
          text: 'Privacy Policy',
        },
        {
          href: 'https://revampcybersecurity.com/security/',
          icon: 'mdi-twitter',
          text: 'Security',
        },
      ],
      socials: [
        {
          href: 'https://twitter.com/revampcyber',
          icon: 'mdi-twitter',
          text: 'Twitter',
        },
        {
          href: 'https://www.instagram.com/revampcyber/',
          icon: 'mdi-instagram',
          text: 'Instagram',
        },
        {
          href: 'https://www.facebook.com/Revamp-Cybersecurity-764581397233712/',
          icon: 'mdi-facebook',
          text: 'Facebook',
        },
        {
          href: 'https://www.linkedin.com/company/revamp-cybersecurity',
          icon: 'mdi-linkedin',
          text: 'Linkedin',
        },
        {
          href: 'https://www.youtube.com/channel/UCCKRNAopNV_U-9EGVUGM7rA',
          icon: 'mdi-youtube',
          text: 'Youtube',
        },
      ],
    }),
  }
</script>

<style lang="sass">
  #dashboard-core-footer
    a
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
</style>
