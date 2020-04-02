<template>
  <category-risk
    category="netowrk"
    title="Network Security"
    :banner="banner"
  />
</template>

<script>
  export default {
    name: 'DashboardSecurityNetwork',

    data: () => ({
      banner: {
        title: 'What is Network Security?',
        body: 'Network security consists of the policies and practices adopted to prevent and monitor unauthorized access, misuse, modification, or denial of a computer network and network-accessible resources.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
