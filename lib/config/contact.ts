// Centralized contact config
// Display format must use leading 00 per requirements (Vodafone Cash + WhatsApp same number)
export const VODAFONE_CASH_NUMBER_DISPLAY = "00201062453344"

// WhatsApp requires E.164 digits without leading + or 00
export const WHATSAPP_NUMBER_E164 = "201062453344"

export function getWhatsAppLink(message: string) {
  const encoded = encodeURIComponent(message || "Hello")
  return `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encoded}`
}
