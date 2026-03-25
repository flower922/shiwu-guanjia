import cloudbase from '@cloudbase/js-sdk'

const app = cloudbase.init({ env: import.meta.env.VITE_CB_ENV_ID })

const auth = app.auth({ persistence: 'local' })
// 启动时触发登录，后续操作等待此 Promise
const loginReady = auth.getLoginState().then(state => {
  if (!state) return auth.anonymousAuthProvider().signIn()
})

export const db = app.database()

// ─── 通用 CRUD ────────────────────────────────────────────────

export async function addDoc(collection, data) {
  try {
    await loginReady
    const res = await db.collection(collection).add(data)
    return { _id: res.id, ...data }
  } catch (e) {
    console.error('addDoc error:', e)
    throw e
  }
}

export async function getList(collection, where = {}) {
  try {
    await loginReady
    let query = db.collection(collection)
    if (Object.keys(where).length) {
      query = query.where(where)
    }
    const res = await query.get()
    return res.data
  } catch (e) {
    console.error('getList error:', e)
    throw e
  }
}

export async function getOne(collection, id) {
  try {
    await loginReady
    const res = await db.collection(collection).doc(id).get()
    return res.data[0] ?? null
  } catch (e) {
    console.error('getOne error:', e)
    throw e
  }
}

export async function updateDoc(collection, id, data) {
  try {
    await loginReady
    await db.collection(collection).doc(id).update(data)
  } catch (e) {
    console.error('updateDoc error:', e)
    throw e
  }
}

export async function removeDoc(collection, id) {
  try {
    await loginReady
    await db.collection(collection).doc(id).remove()
  } catch (e) {
    console.error('removeDoc error:', e)
    throw e
  }
}

// ─── products ────────────────────────────────────────────────

export async function getProducts(filter = {}) {
  await loginReady
  let query = db.collection('products')
  if (filter.slot_id) query = query.where({ slot_id: filter.slot_id })
  const res = await query.orderBy('created_at', 'desc').get()
  return res.data
}

export async function getProductById(id) {
  await loginReady
  const res = await db.collection('products').doc(id).get()
  return res.data[0] || null
}

export async function addProduct(data) {
  await loginReady
  return db.collection('products').add(data)
}

export async function updateProduct(id, data) {
  await loginReady
  return db.collection('products').doc(id).update(data)
}

export async function deleteProduct(id) {
  await loginReady
  return db.collection('products').doc(id).remove()
}

// ─── slots ───────────────────────────────────────────────────

export async function getSlots(zoneCode) {
  await loginReady
  let query = db.collection('slots')
  if (zoneCode) query = query.where({ zone_code: zoneCode })
  const res = await query.get()
  return res.data
}

export async function updateSlotStatus(slotId, status) {
  await loginReady
  const res = await db.collection('slots').where({ slot_id: slotId }).get()
  if (res.data.length === 0) return
  return db.collection('slots').doc(res.data[0]._id).update({ status })
}

// ─── zones ───────────────────────────────────────────────────

export async function getZones() {
  await loginReady
  const res = await db.collection('zones').orderBy('code', 'asc').get()
  return res.data
}

export async function addZone(data) {
  await loginReady
  return db.collection('zones').add(data)
}

export async function updateZone(id, data) {
  await loginReady
  return db.collection('zones').doc(id).update(data)
}

export async function deleteZone(id) {
  await loginReady
  return db.collection('zones').doc(id).remove()
}
