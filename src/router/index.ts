import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import SelectWorkspace from '@/SelectWorkspace.vue'
import AddWorkspace from '@/AddWorkspace.vue';
import Home from '@/views/Home.vue';
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
    path: "/home/:parent_menu",
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
    path: "/pending-order",
    component: () => import('@/views/pending_order/PendingOrder.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/sale",
    component: () => import('@/views/sales/SaleList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/sale-coupon-list",
    component: () => import('@/modules/ecoupon/sale-coupon/SaleCouponList.vue'),
    meta: { requiresAuth: true }
  },
  
  {
    path: "/sale-coupon",
    component: () => import('@/modules/ecoupon/sale-coupon/SaleCoupon.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/top-up",
    component: () => import('@/modules/ecoupon/sale-coupon/ComTopUp.vue'),
    meta: { requiresAuth: true }
  },

  
  {
    path: "/sale-detail/:name",
    component: () => import('@/views/sales/SaleDetail.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: "/dashboard",
    component: () => import('@/views/dashboard/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/stock-adjustment",
    component: () => import('@/views/stock-adjustment/StockAdjustment.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/stock-adjustment/:product_code",
    component: () => import('@/views/stock-adjustment/StockAdjustment.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/stock-adjustment-history",
    component: () => import('@/views/stock-adjustment/StockAdjustmentHistory.vue'),
    meta: { requiresAuth: true }
  },
  
  {
    path: "/page/:doctype/new",
    component: () => import('@/views/pages/Form.vue'),
    meta: { requiresAuth: true }
  },
  
  {
    path: "/report",
    component: () => import('@/views/reports/ReportList.vue'),
    meta: { requiresAuth: true }
  },
  
  {
    path: "/report/:report_name",
    component: () => import('@/views/reports/ServerReport.vue'),
    meta: { requiresAuth: true }
  },


  
 
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
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
