import cloudbase from '@cloudbase/js-sdk'

const app = cloudbase.init({
  env: import.meta.env.VITE_CB_ENV_ID
})

// 匿名登录（首次使用时自动登录）
const auth = app.auth({ persistence: 'local' })
async function ensureLogin() {
  const loginState = await auth.getLoginState()
  if (!loginState) {
    await auth.anonymousAuthProvider().signIn()
  }
}
ensureLogin()

export const db = app.database()

// ─── products ────────────────────────────────────────────────

export async function getProducts(filter = {}) {
  await ensureLogin()
  let query = db.collection('products')
  if (filter.slot_id) query = query.where({ slot_id: filter.slot_id })
  const res = await query.orderBy('created_at', 'desc').get()
  return res.data
}

export async function getProductById(id) {
  await ensureLogin()
  const res = await db.collection('products').doc(id).get()
  return res.data[0] || null
}

export async function addProduct(data) {
  await ensureLogin()
  return db.collection('products').add(data)
}

export async function updateProduct(id, data) {
  await ensureLogin()
  return db.collection('products').doc(id).update(data)
}

export async function deleteProduct(id) {
  await ensureLogin()
  return db.collection('products').doc(id).remove()
}

// ─── slots ───────────────────────────────────────────────────

export async function getSlots(zoneCode) {
  await ensureLogin()
  let query = db.collection('slots')
  if (zoneCode) query = query.where({ zone_code: zoneCode })
  const res = await query.get()
  return res.data
}

export async function updateSlotStatus(slotId, status) {
  await ensureLogin()
  const res = await db.collection('slots').where({ slot_id: slotId }).get()
  if (res.data.length === 0) return
  return db.collection('slots').doc(res.data[0]._id).update({ status })
}

// ─── zones ───────────────────────────────────────────────────

export async function getZones() {
  await ensureLogin()
  const res = await db.collection('zones').orderBy('code', 'asc').get()
  return res.data
}

export async function addZone(data) {
  await ensureLogin()
  return db.collection('zones').add(data)
}

export async function updateZone(id, data) {
  await ensureLogin()
  return db.collection('zones').doc(id).update(data)
}

export async function deleteZone(id) {
  await ensureLogin()
  return db.collection('zones').doc(id).remove()
}
