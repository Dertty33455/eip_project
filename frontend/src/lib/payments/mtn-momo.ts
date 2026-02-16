// MTN Mobile Money Integration Service
// Documentation: https://momodeveloper.mtn.com/

import { v4 as uuidv4 } from 'uuid'

interface MTNConfig {
  apiKey: string
  userId: string
  subscriptionKey: string
  baseUrl: string
  callbackUrl: string
}

interface RequestToPayParams {
  amount: number
  currency: string
  phoneNumber: string
  externalId: string
  payerMessage: string
  payeeNote: string
}

interface TransferParams {
  amount: number
  currency: string
  phoneNumber: string
  externalId: string
  payerMessage: string
  payeeNote: string
}

interface MTNResponse {
  success: boolean
  referenceId?: string
  status?: string
  error?: string
  data?: any
}

class MTNMomoService {
  private config: MTNConfig
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor() {
    this.config = {
      apiKey: process.env.MTN_MOMO_API_KEY || '',
      userId: process.env.MTN_MOMO_USER_ID || '',
      subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY || '',
      baseUrl: process.env.MTN_MOMO_API_URL || 'https://sandbox.momodeveloper.mtn.com',
      callbackUrl: process.env.MTN_MOMO_CALLBACK_URL || '',
    }
  }

  // Get access token
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken
    }

    const credentials = Buffer.from(
      `${this.config.userId}:${this.config.apiKey}`
    ).toString('base64')

    try {
      const response = await fetch(
        `${this.config.baseUrl}/collection/token/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get access token')
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000)
      return this.accessToken!
    } catch (error) {
      console.error('MTN Token Error:', error)
      throw new Error('Impossible de se connecter à MTN Mobile Money')
    }
  }

  // Request to Pay (collect money)
  async requestToPay(params: RequestToPayParams): Promise<MTNResponse> {
    const referenceId = uuidv4()
    
    try {
      const token = await this.getAccessToken()

      const response = await fetch(
        `${this.config.baseUrl}/collection/v1_0/requesttopay`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
            'Content-Type': 'application/json',
            'X-Callback-Url': this.config.callbackUrl,
          },
          body: JSON.stringify({
            amount: params.amount.toString(),
            currency: params.currency,
            externalId: params.externalId,
            payer: {
              partyIdType: 'MSISDN',
              partyId: this.formatPhoneNumber(params.phoneNumber),
            },
            payerMessage: params.payerMessage,
            payeeNote: params.payeeNote,
          }),
        }
      )

      if (response.status === 202) {
        return {
          success: true,
          referenceId,
          status: 'PENDING',
        }
      }

      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || 'Échec de la demande de paiement',
      }
    } catch (error) {
      console.error('MTN Request to Pay Error:', error)
      return {
        success: false,
        error: 'Erreur de connexion avec MTN Mobile Money',
      }
    }
  }

  // Check payment status
  async getPaymentStatus(referenceId: string): Promise<MTNResponse> {
    try {
      const token = await this.getAccessToken()

      const response = await fetch(
        `${this.config.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Target-Environment': process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
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
      console.error('MTN Payment Status Error:', error)
      return {
        success: false,
        error: 'Impossible de vérifier le statut du paiement',
      }
    }
  }

  // Transfer money (disbursement)
  async transfer(params: TransferParams): Promise<MTNResponse> {
    const referenceId = uuidv4()
    
    try {
      // Get disbursement token
      const credentials = Buffer.from(
        `${this.config.userId}:${this.config.apiKey}`
      ).toString('base64')

      const tokenResponse = await fetch(
        `${this.config.baseUrl}/disbursement/token/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          },
        }
      )

      if (!tokenResponse.ok) {
        throw new Error('Failed to get disbursement token')
      }

      const tokenData = await tokenResponse.json()
      const token = tokenData.access_token

      const response = await fetch(
        `${this.config.baseUrl}/disbursement/v1_0/transfer`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
            'Content-Type': 'application/json',
            'X-Callback-Url': this.config.callbackUrl,
          },
          body: JSON.stringify({
            amount: params.amount.toString(),
            currency: params.currency,
            externalId: params.externalId,
            payee: {
              partyIdType: 'MSISDN',
              partyId: this.formatPhoneNumber(params.phoneNumber),
            },
            payerMessage: params.payerMessage,
            payeeNote: params.payeeNote,
          }),
        }
      )

      if (response.status === 202) {
        return {
          success: true,
          referenceId,
          status: 'PENDING',
        }
      }

      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || 'Échec du transfert',
      }
    } catch (error) {
      console.error('MTN Transfer Error:', error)
      return {
        success: false,
        error: 'Erreur de connexion avec MTN Mobile Money',
      }
    }
  }

  // Check transfer status
  async getTransferStatus(referenceId: string): Promise<MTNResponse> {
    try {
      const credentials = Buffer.from(
        `${this.config.userId}:${this.config.apiKey}`
      ).toString('base64')

      const tokenResponse = await fetch(
        `${this.config.baseUrl}/disbursement/token/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          },
        }
      )

      const tokenData = await tokenResponse.json()
      const token = tokenData.access_token

      const response = await fetch(
        `${this.config.baseUrl}/disbursement/v1_0/transfer/${referenceId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Target-Environment': process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
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
      console.error('MTN Transfer Status Error:', error)
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

  // Validate phone number
  validatePhoneNumber(phone: string): boolean {
    const formatted = this.formatPhoneNumber(phone)
    // MTN Côte d'Ivoire numbers typically start with 05, 06, 07, 44, 45, 46
    return /^225(05|06|07|44|45|46)[0-9]{7}$/.test(formatted)
  }
}

export const mtnMomo = new MTNMomoService()
export default mtnMomo
