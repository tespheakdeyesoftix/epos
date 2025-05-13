import { Haptics, ImpactStyle } from '@capacitor/haptics';

export default {
  beforeMount(el, binding) {
    let pressTimer = null;

    const startPress = () => {
      pressTimer = setTimeout(async () => {
        await Haptics.impact({ style: ImpactStyle.Heavy });
        binding.value(); // Execute assigned function
      }, 700);
    };

    const cancelPress = () => {
      clearTimeout(pressTimer);
    };

    el.addEventListener('pointerdown', startPress);
    el.addEventListener('pointerup', cancelPress);
    el.addEventListener('pointerleave', cancelPress);
  },
};
