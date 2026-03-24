/**
 * 根据保质期日期判断临期状态
 * @param {string} expireDate - 格式 YYYY-MM-DD
 * @returns {'expired' | 'warning' | 'normal'}
 *   expired  = 已过期
 *   warning  = 30天内临期
 *   normal   = 正常
 */
export function getExpireStatus(expireDate) {
  if (!expireDate) return 'normal'
  const now = new Date()
  const expire = new Date(expireDate)
  const diffDays = Math.ceil((expire - now) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'expired'
  if (diffDays <= 30) return 'warning'
  return 'normal'
}

/**
 * 从产品列表中筛选出已过期和临期产品
 * @param {Array} products
 * @returns {{ expired: Array, warning: Array }}
 */
export function filterExpiring(products) {
  const expired = []
  const warning = []
  for (const p of products) {
    const status = getExpireStatus(p.expire_date)
    if (status === 'expired') expired.push(p)
    else if (status === 'warning') warning.push(p)
  }
  return { expired, warning }
}

/**
 * 返回距离过期的剩余天数（负数表示已过期）
 */
export function daysUntilExpire(expireDate) {
  if (!expireDate) return null
  const now = new Date()
  const expire = new Date(expireDate)
  return Math.ceil((expire - now) / (1000 * 60 * 60 * 24))
}
