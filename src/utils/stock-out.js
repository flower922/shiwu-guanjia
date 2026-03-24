import { deleteProduct, updateSlotStatus, getProducts } from './cloudbase.js'

/**
 * 出库操作：删除产品记录，并在该库位无剩余产品时将库位状态改为 empty
 * @param {string} productId - 要出库的产品 _id
 * @param {string} slotId    - 产品所在库位 slot_id
 */
export async function stockOut(productId, slotId) {
  await deleteProduct(productId)

  // 检查该库位是否还有其他产品
  const remaining = await getProducts({ slot_id: slotId })
  if (remaining.length === 0) {
    await updateSlotStatus(slotId, 'empty')
  }
}
