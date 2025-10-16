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
    component: SelectWorkspace,
    meta: { hideTab:true }
  },
  {
    path: "/login",
     component: () => import('@/views/Login.vue'),
    meta: { hideTab:true }
  },
  {
    path: "/test",
     component: () => import('@/views/test.vue'),
   
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
    component: () =>  import('@/modules/ecoupon/sale-coupon/SaleCoupon.vue'),
    meta: { requiresAuth: true }
  },  
  
  {
    path: "/sale-coupon-mobile",
    component: () =>  import('@/modules/ecoupon/sale-coupon/SaleCouponMobile.vue'),
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
    meta: { requiresAuth: true },
     children: [
       {
        path: "/shift-detail/:name",
        component: () => import('@/views/shift/TestPage/Page1.vue'),
      },
      {
        path: '/cashier-shift/page-1',
        component: () => import('@/views/shift/TestPage/Page1.vue'),
      },
       
      {
        path: '/cashier-shift/page-2',
        component: () => import('@/views/shift/TestPage/Page2.vue'),
      },
       
    ],
  },
  {
    path: "/sale-detail/:name",
    name:"SaleDetail",
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
    path: "/bold-report-viewer",
    component: () => import('@/views/reports/BoldReportViewer.vue'),
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
    path: "/sold-coupon",
    component: () => import('@/modules/ecoupon/dashboard/components/SoldCoupon.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/coupon_code_history",
    component: () => import('@/modules/ecoupon/Coupon Code History/CouponCodeHistory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/coupon-transaction-list",
    component: () => import('@/modules/ecoupon/coupon-codes/CouponTransactionList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/coupon-transaction-detail/:name",
    component: () => import('@/modules/ecoupon/coupon-codes/CouponTransactionDetail.vue'),
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
  },
  {
    path: "/coupon-detail/:name",
    component: () => import('@/modules/ecoupon/coupon-codes/CouponDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    name:"CheckCoupon",
    path: "/check-coupon/:name",
    component: () => import('@/modules/ecoupon/coupon-codes/CheckCoupon.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/ecoupon/sale-dashboard",
    component: () => import('@/modules/ecoupon/dashboard/SaleDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/cashier-shift-list",
    component: () => import('@/views/shift/CashierShiftList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/barcode",
    component: () => import('@/views/Barcode.vue')
  },
   {
    path: "/barcode/:product_code",
    component: () => import('@/views/Barcode.vue')
  },
  {
    path: "/working-day-list",
    component: () => import('@/views/working-day/WorkingDayList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/working-day-detail/:name",
    component: () => import('@/views/working-day/WorkingDayDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/store-payment-list",
    component: () => import('@/modules/ecoupon/store-payment/StorePaymentList.vue'),
    meta: { requiresAuth: true }
  },
  
  {
    path: "/store-list",
    component: () => import('@/modules/ecoupon/store/StoreList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/store-detail/:name",
    component: () => import('@/modules/ecoupon/store/StoreDetail.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: "/store-payment-detail/:name",
    component: () => import('@/modules/ecoupon/store-payment/StorePaymentDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/setting",
    component: () => import('@/views/Setting.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/print-barcode",
    component: () => import('@/views/PrintBarcode.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/coupon-register-list",
    component: () => import('@/modules/ecoupon/CouponRegister/CouponRegisterList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/coupon-register/:name",
    component: () => import('@/modules/ecoupon/CouponRegister/CouponRegister.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/store-shift-list",
    component: () => import('@/modules/ecoupon/StoreShift/StoreShift.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/check-balance",
    component: () => import('@/modules/ecoupon/check-coupon-balance/CouponBalanceList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/check-balance-detail/:coupon_number",
    component: () => import('@/modules/ecoupon/check-coupon-balance/components/ComCouponBalanceDetail.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: "/page-1",
    component: () => import('@/views/shift/TestPage/Page1.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  
  {
    path: "/page-2",
    component: () => import('@/views/shift/TestPage/Page2.vue'),
    props: true,
    meta: { requiresAuth: true }
  },

]


// will be filter by user permission in the future

export function getRoute(){
    return  routes;
}