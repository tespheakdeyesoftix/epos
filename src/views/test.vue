<template>
  <div style="max-width:780px;font-family:system-ui,Segoe UI,Roboto,Arial">
    <h3>Find local API on port 1213 (uses detected client IP)</h3>

    <div>
      Detected local IP: <strong>{{ localIp || '—' }}</strong>
      <button @click="detectIp" :disabled="detecting" style="margin-left:8px">
        {{ detecting ? 'Detecting…' : 'Detect IP' }}
      </button>
    </div>

    <div style="margin-top:8px;">
      <label>
        Or enter local IP manually:
        <input v-model="manualIp" placeholder="e.g. 192.168.10.50" style="margin-left:6px" />
      </label>
    </div>

    <div style="margin-top:12px;">
      <button @click="startScan" :disabled="scanning || !scanBase">
        {{ scanning ? 'Scanning…' : 'Start scan (derived /24 only)' }}
      </button>
      <button @click="stopScan" v-if="scanning" style="margin-left:8px">Stop</button>
    </div>

    <p style="margin-top:10px;">
      Status: <strong>{{ status }}</strong>
    </p>

    <div v-if="found" style="margin-top:8px;">
      ✅ Found server: <code>{{ found }}</code>
    </div>

    <div v-if="scanning" style="margin-top:6px;">
      Scanned {{ scannedCount }} / {{ scanTotal }} addresses — concurrency: {{ concurrency }}
    </div>

    <ul v-if="log.length" style="margin-top:10px;font-size:0.9em;">
      <li v-for="(l,i) in log" :key="i">{{ l }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

/* reactive state */
const localIp = ref(null)      // detected IPv4 such as 192.168.10.50
const manualIp = ref('')       // user-supplied IP if detection fails
const detecting = ref(false)
const scanning = ref(false)
const status = ref('idle')
const scannedCount = ref(0)
const scanTotal = ref(0)
const log = ref([])
const found = ref(null)
const stopRequested = ref(false)

/* scan control */
const concurrency = 20
const timeoutMs = 2500

const appendLog = (msg) => {
  log.value.unshift(`${new Date().toLocaleTimeString()} — ${msg}`)
  if (log.value.length > 200) log.value.pop()
}

/* --- WebRTC local IPv4 discovery (best-effort) --- */
const getLocalIps = async () => {
  const ips = new Set()
  try {
    const pc = new RTCPeerConnection({ iceServers: [] })
    // data channel triggers ICE candidate gathering
    try { pc.createDataChannel('ip-check') } catch(e){/* ignore */ }

    pc.onicecandidate = (evt) => {
      if (!evt.candidate || !evt.candidate.candidate) return
      const cand = evt.candidate.candidate
      // find IPv4 addresses in candidate string
      const match = cand.match(/(\d{1,3}\.){3}\d{1,3}/g)
      if (match) {
        match.forEach(ip => {
          // filter out obvious non-RFC addresses (basic)
          if (!ip.startsWith('127.') && !ip.startsWith('0.')) ips.add(ip)
        })
      }
    }

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    // wait a bit for ICE candidates to arrive
    await new Promise(res => setTimeout(res, 800))
    try { pc.close() } catch(e){/* ignore */ }
  } catch (err) {
    console.warn('WebRTC IP discovery error', err)
  }
  return Array.from(ips)
}

/* extract base like "192.168.10" from "192.168.10.50" */
const cidr24FromIp = (ip) => {
  const m = ip && ip.match(/^(\d+\.\d+\.\d+)\.\d+$/)
  return m ? m[1] : null
}

/* probe single IP for ping; stops when global found or stop requested */
const probeIp = async (ip) => {
  if (found.value || stopRequested.value) return null
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  const url = `http://${ip}:1216/api/method/ping` // ensure server supports CORS & policy
  try {
    const res = await fetch(url, { mode: 'cors', signal: controller.signal })
    clearTimeout(t)
    if (!res.ok) {
      // log a few failures without spamming
      if (Math.random() < 0.03) appendLog(`${ip} ➜ HTTP ${res.status}`)
      return null
    }
    const text = (await res.text()).trim()
    appendLog(`${ip} ➜ "${text}"`)
    if (text.toLowerCase().includes('pong')) {
      found.value = `http://${ip}:1213`
      status.value = 'found'
      return ip
    }
  } catch (err) {
    // silent or occasional log for diagnostics
    if (err?.name === 'AbortError') {
      if (Math.random() < 0.05) appendLog(`${ip} ➜ timeout`)
    } else {
      if (Math.random() < 0.05) appendLog(`${ip} ➜ ${err.message || 'error'}`)
    }
  } finally {
    clearTimeout(t)
    scannedCount.value++
  }
  return null
}

/* scan only the /24 derived from provided base (no fallbacks) */
const scanCidr24 = async (base) => {
  if (!base) return
  const ips = []
  for (let i = 1; i <= 254; i++) ips.push(`${base}.${i}`)
  scanTotal.value += ips.length

  let next = 0
  const worker = async () => {
    while (next < ips.length && !found.value && !stopRequested.value) {
      const idx = next++
      const ip = ips[idx]
      await probeIp(ip)
    }
  }

  // start concurrency workers
  await Promise.all(new Array(concurrency).fill(0).map(() => worker()))
}

/* trigger detect IP */
const detectIp = async () => {
  detecting.value = true
  status.value = 'detecting'
  appendLog('Attempting local IP detection via WebRTC')
  const ips = await getLocalIps()
  if (ips.length) {
    // prefer private IPv4 ranges
    const ipv4 = ips.find(i => i.startsWith('192.') || i.startsWith('10.') || i.startsWith('172.')) || ips[0]
    localIp.value = ipv4
    appendLog(`Detected local IP(s): ${ips.join(', ')}`)
    status.value = 'local IP detected'
  } else {
    appendLog('No IPv4 detected via WebRTC')
    status.value = 'no local IP detected'
  }
  detecting.value = false
}

/* main start scan: uses detected localIp or manualIp; does NOT use fallback ranges */
const startScan = async () => {
  if (scanning.value) return
  // choose IP: manual has precedence if provided
  const sourceIp = manualIp.value?.trim() || localIp.value
  if (!sourceIp) {
    appendLog('No local IP available — press "Detect IP" or enter manually')
    status.value = 'no ip'
    return
  }
  const base = cidr24FromIp(sourceIp)
  if (!base) {
    appendLog(`Invalid IPv4 provided: ${sourceIp}`)
    status.value = 'invalid ip'
    return
  }

  // reset controls
  scanning.value = true
  stopRequested.value = false
  scannedCount.value = 0
  scanTotal.value = 0
  found.value = null
  log.value = []
  status.value = `scanning ${base}.0/24`
  appendLog(`Starting scan on ${base}.0/24 (derived from ${sourceIp})`)

  await scanCidr24(base)

  if (found.value) {
    appendLog(`Server found: ${found.value}`)
    status.value = 'found'
  } else if (stopRequested.value) {
    appendLog('Scan stopped by user')
    status.value = 'stopped'
  } else {
    appendLog('Scan finished — no server responded with pong on port 1213')
    status.value = 'not found'
  }

  scanning.value = false
}

/* stop scan */
const stopScan = () => {
  if (!scanning.value) return
  stopRequested.value = true
  status.value = 'stopping'
  appendLog('Stop requested — workers will finish soon')
}

/* derived computed for UI: scanBase available? */
const scanBase = (() => {
  // we simply ensure either manual or detected ip produces a valid /24
  const ip = () => manualIp.value?.trim() || localIp.value
  return {
    get value() { return cidr24FromIp(ip()) }
  }
})()
</script>
