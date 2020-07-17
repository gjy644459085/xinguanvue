import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Users from '../components/system/Users'
import Welcome from '../components/Welcome'
import Roles from '../components/system/Roles'
import Department from '../components/system/Department'
import Alerts from '../components/message/Alerts'
import Urge from '../components/message/Urge'
import Approve from '../components/message/Approve'
import Pass from '../components/message/Pass'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [{ path: '/welcome', component: Welcome },
      { path: '/roles', component: Roles },
      { path: '/users', component: Users },
      { path: '/department', component: Department },
      { path: '/alerts', component: Alerts },
      { path: '/urge', component: Urge },
      { path: '/approve', component: Approve },
      { path: '/pass', component: Pass }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
