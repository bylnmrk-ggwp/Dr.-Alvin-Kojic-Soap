import emailjs from '@emailjs/browser'
import { site } from '@/config/site'
import { paymentLabels } from '@/features/orders/OrderSummary'
import { formatDateTime, formatPrice } from '@/lib/utils'
import type { Order } from '@/types'

const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const orderTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ORDER
const inboxTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_INBOX
const storeEmail = import.meta.env.VITE_STORE_EMAIL || site.email

/** Public key and service id are set. Each helper also needs its own template id. */
export const isEmailConfigured = Boolean(publicKey && serviceId)

export interface InboxNotificationInput {
  kind: 'contact' | 'distributor'
  fromName: string
  fromEmail: string
  phone?: string
  subject: string
  message: string
}

let initialised = false

function ensureInitialised() {
  if (initialised || !publicKey) return
  emailjs.init({ publicKey })
  initialised = true
}

/**
 * Sends one template. Resolves silently when EmailJS is not configured and
 * swallows failures: by the time this runs the order or message is already
 * saved, so a mail problem must never surface as an error to the caller.
 */
async function send(templateId: string | undefined, params: Record<string, string>): Promise<void> {
  if (!isEmailConfigured || !serviceId || !templateId) return
  try {
    ensureInitialised()
    await emailjs.send(serviceId, templateId, params)
  } catch (error) {
    console.warn(`[email] Could not send template ${templateId}`, error)
  }
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function lineTotal(item: Order['items'][number]): string {
  return formatPrice(item.unitPriceCentavos * item.quantity)
}

function itemsHtml(order: Order): string {
  const rows = order.items
    .map(
      (item) =>
        `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.sizeLabel)}</td>` +
        `<td align="right">${item.quantity}</td><td align="right">${lineTotal(item)}</td></tr>`,
    )
    .join('')
  return (
    '<table cellpadding="6" cellspacing="0" border="0">' +
    '<thead><tr><th align="left">Item</th><th align="left">Size</th><th align="right">Qty</th><th align="right">Total</th></tr></thead>' +
    `<tbody>${rows}</tbody></table>`
  )
}

function itemsText(order: Order): string {
  return order.items
    .map((item) => `${item.name} (${item.sizeLabel}) x ${item.quantity} = ${lineTotal(item)}`)
    .join('\n')
}

function shipToLine(order: Order): string {
  const a = order.shipTo
  return [a.fullName, a.street, a.barangay, a.city, a.province, a.postalCode, a.phone].join(', ')
}

/** Customer copy of a placed order, with the store CC'd by the template. */
export function sendOrderConfirmation(order: Order): Promise<void> {
  return send(orderTemplateId, {
    to_email: order.shipTo.email,
    to_name: order.shipTo.fullName,
    order_reference: order.reference,
    order_date: formatDateTime(order.placedAt),
    items_html: itemsHtml(order),
    items_text: itemsText(order),
    subtotal: formatPrice(order.subtotalCentavos),
    shipping: order.shippingCentavos === 0 ? 'Free' : formatPrice(order.shippingCentavos),
    total: formatPrice(order.totalCentavos),
    payment_method: paymentLabels[order.paymentMethod],
    ship_to: shipToLine(order),
    store_email: storeEmail,
  })
}

/** Forwards a saved contact message or reseller application to the store inbox. */
export function sendInboxNotification(input: InboxNotificationInput): Promise<void> {
  return send(inboxTemplateId, {
    kind: input.kind,
    from_name: input.fromName,
    from_email: input.fromEmail,
    phone: input.phone ?? '',
    subject: input.subject,
    message: input.message,
    store_email: storeEmail,
  })
}
