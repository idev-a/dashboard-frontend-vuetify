<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-breakpoint="960"
    app
    mini-variant-width="80"
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom, ${barColor}`"
        v-bind="props"
      />
    </template>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-uppercase font-weight-regular display-2">
          <span class="logo-mini">{{ $t('SD') }}</span>
          <span class="logo-normal">{{ $t('Secure Dashboard') }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider class="mb-1" />

<!--     <v-list
      dense
      nav
    >
      <base-item-group :item="profile" />
    </v-list>

    <v-divider class="mb-2" /> -->

    <v-list
      expand
      nav
    >
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />

      <template v-for="(item, i) in computedItems">
        <base-item-group
          v-if="item && item.children && item.selected"
          :key="`group-${i}`"
          :item="item"
        >
          <!--  -->
        </base-item-group>

        <base-item
          v-if="item && !item.children && item.selected"
          :key="`item-${i}`"
          :item="item"
        />
      </template>

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import jwtDecode from 'jwt-decode'
import { Get, Post } from '@/api'
  // Utilities
  import {
    mapState,
  } from 'vuex'

  export default {
    name: 'DashboardCoreDrawer',

    props: {
      expandOnHover: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      user: {},
      items: []
    }),

    computed: {
      ...mapState(['barColor', 'barImage', 'email']),

      drawer: {
        get () {
          return this.$store.state.drawer
        },
        set (val) {
          this.$store.commit('SET_DRAWER', val)
        },
      },
      computedItems () {
        const new_items = this.items.map(this.mapItem)
        return new_items.filter(item => item)
      },
      profile () {
        return {
          avatar: true,
          group: '',
          title: this.$t('avatar'),
          children: [
            {
              to: 'pages/user',
              title: this.$t('my-profile'),
            },
            {
              to: '',
              title: this.$t('settings'),
            },
          ],
        }
      },
    },

    watch: {
      '$vuetify.breakpoint.smAndDown' (val) {
        this.$emit('update:expandOnHover', !val)
      },
      email: {
        handler (newVal) {
          if (newVal) {
            this.getItems()
          }
        },
        immediate: true
      }
    },

    mounted () {
    },

    methods: {
      mapItem (item) {
        try {
          this.user = jwtDecode(localStorage.getItem('jwt'))
        } catch (e) {
          console.log(e)
        }
        if (item.is_admin) {
          if (this.user.role === 'Admin') {
            return {
              ...item,
              children: item.children ? item.children.map(this.mapItem) : undefined,
              title: this.$t(item.title),
            }
          }
        } else {
          return {
            ...item,
            children: item.children ? item.children.map(this.mapItem) : undefined,
            title: this.$t(item.title),
          }
        }
      },
      async getItems () {
        const res = await Get(`admin/drawer/${this.email}/read`)
        this.items = res.items
      }
    },
  }
</script>

<style lang="sass">
  @import '~vuetify/src/styles/tools/_rtl.sass'

  #core-navigation-drawer
    &.v-navigation-drawer--mini-variant
      .v-list-item
        justify-content: flex-start !important

      .v-list-group--sub-group
        display: block !important

    .v-list-group__header.v-list-item--active:before
      opacity: .24

    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px

        +ltr()
          margin-right: 24px
          margin-left: 12px !important

        +rtl()
          margin-left: 24px
          margin-right: 12px !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
          padding-left: 8px

        +rtl()
          padding-right: 8px

      .v-list-group__header
        +ltr()
          padding-right: 0

        +rtl()
          padding-right: 0

        .v-list-item__icon--text
          margin-top: 19px
          order: 0

        .v-list-group__header__prepend-icon
          order: 2

          +ltr()
            margin-right: 8px

          +rtl()
            margin-left: 8px
</style>
