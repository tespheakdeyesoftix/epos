import SelectWorkspace from '@/SelectWorkspace.vue'
import AddWorkspace from '@/AddWorkspace.vue';
import Home from '@/views/Home.vue';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
    path: '/:pathMatch(.*)*', // Catch-all
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  },
    {
    path: '/message/:id', 
    name:"Message",
    component: () => import('@/views/ErrorPage.vue')
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: "/select-workspace/",
    component: () => import('@/SelectWorkspace.vue'),
    meta: { hideTab:true }
  },
  {
    path: "/login",
     component: () => import('@/views/Login.vue'),
    meta: { hideTab:true }
  },

  {
    path: "/enter-station-name",
     component: () => import('@/views/EnterStationName.vue'),
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
    path: "/pending-order-list",
    component: () => import('@/modules/epos/pending-order-table/PendingOrderList.vue'),
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
    path: "/sale-coupon/:name",
    name:"EditSaleCoupon",
    component: () => import('@/modules/ecoupon/sale-coupon/SaleCoupon.vue'),
    meta: { requiresAuth: true }
  }, 
  {
    path: "/top-up-list",
    component: () => import('@/modules/ecoupon/TopUpList/TopUpList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/redeem-list",
    component: () => import('@/modules/ecoupon/RedeemList/RedeemList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/redeem",
    component: () => import('@/modules/ecoupon/RedeemList/Redeem.vue'),
    meta: { requiresAuth: true }
  },
   {
    path: "/start-shift",
    component: () => import('@/views/shift/components/StartCashierShift.vue'),
    meta: { requiresAuth: true }
  },
   {
    path: "/close-shift",
    component: () => import('@/views/shift/CloseShift.vue'),
    meta: { requiresAuth: true }
  },
   {
    path: "/shift-detail/:name",
    component: () => import('@/views/shift/CashierShiftDetail.vue'),
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
  {
    path: "/start-working-day",
    component: () => import('@/views/shift/startWorkingDay.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/close-working-day",
    component: () => import('@/views/shift/closeWorkingDay.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/customer",
    component: () => import('@/views/customer/CustomerList.vue'),
    meta: { requiresAuth: true }
  },
    {
    path: "/customer-detail/:name",
    component: () => import('@/views/customer/CustomerDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/top-up",
    component: () => import('@/modules/ecoupon/TopUpList/TopUp.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/coupon-code-list",
    component: () => import('@/modules/ecoupon/coupon-codes/CouponCodeList.vue'),
    meta: { requiresAuth: true }
  }

  
 
]


// will be filter by user permission in the future

export function getRoute(){
    return  routes;
}