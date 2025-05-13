import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import SelectWorkspace from '@/SelectWorkspace.vue'
import AddWorkspace from '@/AddWorkspace.vue';
import Home from '@/views/Home.vue';
 
import Help from '@/views/pages/Help.vue';
import { useAuth } from '@/hooks/useAuth';

const ctrl = useAuth();
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: "/select-workspace/",
    component: SelectWorkspace,
    meta: { hideTab:true }
  },
  {
    path: "/add-workspace/:property_code",
    component: AddWorkspace,
    meta: { hideTab:true }
  },
  {
    path: "/add-workspace",
    component: AddWorkspace,
    meta: { hideTab:true }
  },
  {
    path: "/home",
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: "/product-list",
    component: () => import('@/views/products/ProductList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/add-product",
    component: () => import('@/views/products/AddProduct.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/add-product/:name",
    component: () => import('@/views/products/AddProduct.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/help",
    component: Help,
    meta: { requiresAuth: true,title:"Help" }
  },
 
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


router.beforeEach(async (to, from, next) => {
  
  if (to.meta.requiresAuth && !ctrl.isAuthenticated.value) {
    next("/select-workspace");
  } else {
    
      next();
   
    
  }
});


export default router
