import { formatCurrency } from '../utils/priceUtils';

export interface WhatsAppQuotePayload {
  designCode?: string;
  productName: string;
  colorName: string;
  size: string;
  quantity: number;
  techniqueName: string;
  printedSidesText: string;
  totalPrice: number;
  phoneNumber?: string; // Optional default business number e.g. 573000000000
}

export const whatsappService = {
  createQuoteMessage: (payload: WhatsAppQuotePayload): string => {
    return (
      `*Hola, quiero realizar el pedido / cotizar mi diseño personalizado.* 👕✨\n\n` +
      `▪ *Producto:* ${payload.productName}\n` +
      `▪ *Color:* ${payload.colorName}\n` +
      `▪ *Talla:* ${payload.size}\n` +
      `▪ *Cantidad:* ${payload.quantity} unidad(es)\n` +
      `▪ *Técnica:* ${payload.techniqueName}\n` +
      `▪ *Zonas Estampadas:* ${payload.printedSidesText}\n\n` +
      `💰 *Total del Pedido:* ${formatCurrency(payload.totalPrice)}\n\n` +
      `Adjunto la imagen de mi diseño para iniciar la producción.`
    );
  },

  generateWhatsAppUrl: (payload: WhatsAppQuotePayload): string => {
    // El número se configura en .env como VITE_WHATSAPP_NUMBER (sin exponer en el código fuente)
    const rawNumber = payload.phoneNumber
      || import.meta.env.VITE_WHATSAPP_NUMBER
      || '573000000000';
    const message = whatsappService.createQuoteMessage(payload);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${rawNumber}?text=${encodedMessage}`;
  },

  openWhatsApp: (payload: WhatsAppQuotePayload): void => {
    const url = whatsappService.generateWhatsAppUrl(payload);
    window.open(url, '_blank');
  }
};
