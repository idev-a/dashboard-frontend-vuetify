<template>
  <category-risk
    category="physical"
    title="Physical Security"
    :banner="banner"
  />
</template>

<script>
  export default {
    name: 'DashboardSecurityPhysical',

    data: () => ({
      banner: {
        title: 'What is Physical Security?',
        body: 'Physical security describes security measures that are designed to deny unauthorized access to facilities, equipment and resources and to protect personnel and property from damage or harm.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
