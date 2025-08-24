import { useEffect, useState } from 'react'

function genAnonId() {
  const buf = new Uint8Array(16)
  crypto.getRandomValues(buf)
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function useAnonIdentity(storageKey = 'anon_user_id') {
  const [id, setId] = useState('')
  useEffect(() => {
    let v = localStorage.getItem(storageKey)
    if (!v) {
      v = genAnonId()
      localStorage.setItem(storageKey, v)
    }
    setId(v)
  }, [storageKey])
  return id
}
