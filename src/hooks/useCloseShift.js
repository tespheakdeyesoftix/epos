export async function cashierShiftInfo() {
  

app.postApi("epos_restaurant_2023.api.api.get_current_cashier_shift", {
  param: {
    pos_profile: "Main POS Profile"
  }
}).then((res) => {
  console.log("✅ Full response:", res);

  if (res.message) {
    console.log("✅ Shift:", res.message);
    CashierShift.value = res.message;
  } else {
    console.warn("⚠️ No active shift");
  }
}).catch((err) => {
  console.error("🔥 API call error:", err);
});




  return "No ";
}
