// Moov Money Integration Service
// Moov Africa / Flooz integration

import { v4 as uuidv4 } from 'uuid'

interface MoovConfig {
  apiKey: string
  merchantId: string
  baseUrl: string
  callbackUrl: string
}

interface PaymentParams {
  amount: number
  currency: string
  phoneNumber: string
  description: string
  transactionId: string
}

interface MoovResponse {
  success: boolean
  referenceId?: string
  status?: string
  error?: string
  data?: any
}

class MoovMoneyService {
  private config: MoovConfig
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor() {
    this.config = {
      apiKey: process.env.MOOV_MONEY_API_KEY || '',
      merchantId: process.env.MOOV_MONEY_MERCHANT_ID || '',
      baseUrl: process.env.MOOV_MONEY_API_URL || 'https://api.moov-africa.com',
      callbackUrl: process.env.MOOV_MONEY_CALLBACK_URL || '',
    }
  }

  // Get access token
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: this.config.apiKey,
          merchantId: this.config.merchantId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get access token')
      }

      const data = await response.json()
      this.accessToken = data.token
      this.tokenExpiry = new Date(Date.now() + 3600 * 1000) // 1 hour
      return this.accessToken!
    } catch (error) {
      console.error('Moov Token Error:', error)
      throw new Error('Impossible de se connecter à Moov Money')
    }
  }

  // Initiate payment (collect money)
  async initiatePayment(params: PaymentParams): Promise<MoovResponse> {
    const referenceId = uuidv4()
    
    try {
      const token = await this.getAccessToken()

      const response = await fetch(`${this.config.baseUrl}/payment/collect`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: this.config.merchantId,
          referenceId,
          amount: params.amount,
          currency: params.currency,
          phone: this.formatPhoneNumber(params.phoneNumber),
          description: params.description,
          transactionId: params.transactionId,
          callbackUrl: this.config.callbackUrl,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          referenceId: data.referenceId || referenceId,
          status: 'PENDING',
          data,
        }
      }

      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || 'Échec de la demande de paiement',
      }
    } catch (error) {
      console.error('Moov Payment Error:', error)
      return {
        success: false,
        error: 'Erreur de connexion avec Moov Money',
      }
    }
  }

  // Check payment status
  async getPaymentStatus(referenceId: string): Promise<MoovResponse> {
    try {
      const token = await this.getAccessToken()

      const response = await fetch(
        `${this.config.baseUrl}/payment/status/${referenceId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get payment status')
      }

      const data = await response.json()
      return {
        success: true,
        status: data.status,
        data,
      }
    } catch (error) {
      console.error('Moov Payment Status Error:', error)
      return {
        success: false,
        error: 'Impossible de vérifier le statut du paiement',
      }
    }
  }

  // Transfer money (disbursement)
  async transfer(params: PaymentParams): Promise<MoovResponse> {
    const referenceId = uuidv4()
    
    try {
      const token = await this.getAccessToken()

      const response = await fetch(`${this.config.baseUrl}/payment/disburse`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: this.config.merchantId,
          referenceId,
          amount: params.amount,
          currency: params.currency,
          phone: this.formatPhoneNumber(params.phoneNumber),
          description: params.description,
          transactionId: params.transactionId,
          callbackUrl: this.config.callbackUrl,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          referenceId: data.referenceId || referenceId,
          status: 'PENDING',
          data,
        }
      }

      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || 'Échec du transfert',
      }
    } catch (error) {
      console.error('Moov Transfer Error:', error)
      return {
        success: false,
        error: 'Erreur de connexion avec Moov Money',
      }
    }
  }

  // Check transfer status
  async getTransferStatus(referenceId: string): Promise<MoovResponse> {
    try {
      const token = await this.getAccessToken()

      const response = await fetch(
        `${this.config.baseUrl}/payment/disburse/status/${referenceId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get transfer status')
      }

      const data = await response.json()
      return {
        success: true,
        status: data.status,
        data,
      }
    } catch (error) {
      console.error('Moov Transfer Status Error:', error)
      return {
        success: false,
        error: 'Impossible de vérifier le statut du transfert',
      }
    }
  }

  // Format phone number to international format
  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '')
    
    // Remove leading 00 or +
    if (cleaned.startsWith('00')) {
      cleaned = cleaned.substring(2)
    }
    
    // Add country code if missing (default Côte d'Ivoire)
    if (cleaned.length === 10 && !cleaned.startsWith('225')) {
      cleaned = '225' + cleaned
    }
    
    return cleaned
  }

  // Validate phone number (Moov Côte d'Ivoire)
  validatePhoneNumber(phone: string): boolean {
    const formatted = this.formatPhoneNumber(phone)
    // Moov Côte d'Ivoire numbers typically start with 01, 02, 03
    return /^225(01|02|03)[0-9]{7}$/.test(formatted)
  }
}

export const moovMoney = new MoovMoneyService()
export default moovMoney
