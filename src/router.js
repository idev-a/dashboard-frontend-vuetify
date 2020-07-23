import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/pages',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: 'Lock',
          path: 'lock',
          component: () => import('@/views/pages/Lock'),
          meta: {
            requiresAuth: false
          }
        },
        {
          name: 'Login',
          path: 'login',
          component: () => import('@/views/pages/Login'),
          meta: {
            requiresAuth: false
          }
        },
        {
          name: 'Pricing',
          path: 'pricing',
          component: () => import('@/views/pages/Pricing'),
          meta: {
            requiresAuth: false
          }
        },
        {
          name: 'Register',
          path: 'register',
          component: () => import('@/views/pages/Register'),
          meta: {
            requiresAuth: false
          }
        },
        {
          name: 'Extension',
          path: 'extension/:email',
          component: () => import('@/views/pages/Extension'),
          meta: {
            requiresAuth: false
          }
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
          meta: {
            requiresAuth: true
          }
        },
        // Pages
        {
          name: 'My Profile',
          path: 'pages/user',
          component: () => import('@/views/dashboard/pages/UserProfile'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Notifications',
          path: 'components/notifications',
          component: () => import('@/views/dashboard/component/Notifications'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Customers',
          path: 'admin/customers',
          component: () => import('@/views/dashboard/admin/customer'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Random Board',
          path: 'admin/random-board',
          component: () => import('@/views/dashboard/admin/RandomData'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Daily Tips',
          path: 'admin/dailytips',
          component: () => import('@/views/dashboard/admin/DailyTips'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'DB (security_questions & security_answers table)',
          path: 'admin/publictable',
          component: () => import('@/views/dashboard/admin/PublicTable'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Public Data (Run)',
          path: 'admin/publicdata/run',
          component: () => import('@/views/dashboard/admin/PublicDataList'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Apps & Users',
          path: 'admin/appusers',
          component: () => import('@/views/dashboard/admin/AppUsers'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Users & Groups',
          path: 'admin/users-groups',
          component: () => import('@/views/dashboard/admin/users_groups/UsersAndGroups'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Query Board',
          path: 'admin/sql',
          component: () => import('@/views/dashboard/admin/QueryBoard'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Meraki Board (meraki)',
          path: 'admin/meraki',
          component: () => import('@/views/dashboard/admin/Meraki'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'RSS Board',
          path: 'admin/rss',
          component: () => import('@/views/dashboard/admin/RSS'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Chart Board',
          path: 'admin/chart',
          component: () => import('@/views/dashboard/admin/ChartBoard'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'GSuite Board',
          path: 'admin/gsuite',
          component: () => import('@/views/dashboard/admin/GSuiteBoard'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Slack Board',
          path: 'admin/slack',
          component: () => import('@/views/dashboard/admin/SlackBoard'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Office365 Board',
          path: 'admin/o365',
          component: () => import('@/views/dashboard/admin/O365Board'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Zoom Board',
          path: 'admin/zoom',
          component: () => import('@/views/dashboard/admin/ZoomBoard'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Atlassian Board',
          path: 'admin/atlassian',
          component: () => import('@/views/dashboard/admin/AtlassianBoard'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Chrome Extension Board',
          path: 'admin/chromeext',
          component: () => import('@/views/dashboard/admin/ChromeExtBoard'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Security Q&A Board',
          path: 'admin/securityqa',
          component: () => import('@/views/dashboard/admin/SecurityQABoard'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Calendar Board',
          path: 'admin/calendar-event',
          component: () => import('@/views/dashboard/admin/CalendarBoard'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Dropbox Board',
          path: 'admin/dropbox',
          component: () => import('@/views/dashboard/admin/DropboxBoard'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Bamboo Board',
          path: 'admin/bamboo',
          component: () => import('@/views/dashboard/admin/BambooBoard'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Critical Risks',
          path: 'risks/critical',
          component: () => import('@/views/dashboard/risks/critical'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'High Risks',
          path: 'risks/high',
          component: () => import('@/views/dashboard/risks/high'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Medium Risks',
          path: 'risks/medium',
          component: () => import('@/views/dashboard/risks/medium'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Low Risks',
          path: 'risks/low',
          component: () => import('@/views/dashboard/risks/low'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Information Risks',
          path: 'risks/information',
          component: () => import('@/views/dashboard/risks/information'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Application Risk',
          path: 'applications/index',
          component: () => import('@/views/dashboard/applications/application'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Users',
          path: 'users/index',
          component: () => import('@/views/dashboard/users/user'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Groups',
          path: 'groups/index',
          component: () => import('@/views/dashboard/groups/group'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Email Security',
          path: 'security/email',
          component: () => import('@/views/dashboard/security/email'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Network Security',
          path: 'security/network',
          component: () => import('@/views/dashboard/security/network'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Physical Security',
          path: 'security/physical',
          component: () => import('@/views/dashboard/security/physical'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Device Security',
          path: 'security/device',
          component: () => import('@/views/dashboard/security/device'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Category',
          path: 'category/all',
          component: () => import('@/views/dashboard/category/all'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Charts',
          path: 'charts/index',
          component: () => import('@/views/dashboard/charts/chart'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Public Data',
          path: 'publicdata/index',
          component: () => import('@/views/dashboard/publicdata/public'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Business',
          path: 'publicdata/business',
          component: () => import('@/views/dashboard/publicdata/business'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Personal',
          path: 'publicdata/personal',
          component: () => import('@/views/dashboard/publicdata/personal'),
          meta: {
            requiresAuth: true
          }
        },
      ],
    },
    {
      path: '*',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: '404 Error',
          path: '',
          component: () => import('@/views/pages/Error'),
          meta: {
            requiresAuth: false
          }
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('jwt') == null || localStorage.getItem('jwt') == 'null') {
            next({
                path: '/pages/login',
                params: { nextUrl: to.fullPath }
            })
        } else {
            let user = {}
            try {
              user = JSON.parse(localStorage.getItem('user'))
            } catch (e) {}
            if(to.matched.some(record => record.meta.is_admin)) {
                if(user.role == 'Admin'){
                    next()
                }
                else{
                    next({ name: 'Dashboard'})
                }
            }else {
                next()
            }
        }
    } else {
        next()
    }
})


export default router