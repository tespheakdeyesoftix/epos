export default {
  mounted(el, binding) {
    const delay = binding.value?.delay || 1000
    const callback = binding.value?.callback

    if (typeof callback !== 'function') {
      console.warn('v-debounce requires a callback function')
      return
    }

    // Ionic components emit events on the custom element itself, not the inner native input.
    const eventType = (binding.arg || 'ionInput').toLowerCase()

    let timeout

    const handler = (event) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        callback(event)
      }, delay)
    }

    el.__debounceHandler__ = handler

    // Wait until the custom element is ready (especially important in Ionic Framework)
    setTimeout(() => {
      el.addEventListener(eventType, handler)
    })
  },

  unmounted(el, binding) {
    const eventType = (binding.arg || 'ionInput').toLowerCase()
    el.removeEventListener(eventType, el.__debounceHandler__)
    delete el.__debounceHandler__
  }
}
