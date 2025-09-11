import { ref } from "vue";


const buffer = ref("");
const lastScanned = ref("");
let lastTime = 0;

export function onScanCheckOupon(e) {
    if (window.disable_scan_check_coupon == true) return ;

  const now = Date.now();

  // Only track printable keys or Enter
  if (e.key.length === 1 || e.key === "Enter") {
    const timeDiff = now - lastTime;
    lastTime = now;

    // If typing is too slow (>50ms), reset buffer (likely human typing)
    if (timeDiff > 50) {
      buffer.value = "";
    }

    if (e.key === "Enter") {
      if (buffer.value.length > 3) { // prevent noise
        lastScanned.value = buffer.value;
        onCheckCouponCode(buffer.value);
      }
      buffer.value = "";
    } else {
      buffer.value += e.key;
    }
  }
}

export async function onCheckCouponCode(barcode){
  if(barcode){
      const res = await app.getDocList("Coupon Codes", {
        filters: [["coupon", "=", app.utils.getCouponNumber(barcode)]],
        limit: 1
      });
      if(res.data.length == 0){
        await app.showWarning(t("No coupon code found"));
        return;
      }
      if(app.route.name && app.route.name == "CheckCoupon"){
 
        app.ionRouter.navigate("/check-coupon/" + app.utils.getCouponNumber(barcode) + "?appbar=1","forward","replace")
      }else {
        app.ionRouter.navigate("/check-coupon/" + app.utils.getCouponNumber(barcode) + "?appbar=1","forward","push")
      }
      
  }
  
}

