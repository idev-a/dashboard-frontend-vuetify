import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  mode: 'hash',
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
          path: 'customers/all',
          component: () => import('@/views/dashboard/customers/customer'),
          meta: {
            is_admin: true,
            requiresAuth: true
          }
        },
        {
          name: 'Daily Tips',
          path: 'customers/dailytips',
          component: () => import('@/views/dashboard/customers/dailytips'),
          meta: {
            is_admin: true,
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