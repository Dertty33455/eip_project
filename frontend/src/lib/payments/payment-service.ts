// Unified Payment Service
// Handles both MTN Mobile Money and Moov Money

import prisma from '../prisma'
import mtnMomo from './mtn-momo'
import moovMoney from './moov-money'
import { PaymentProvider, TransactionType, TransactionStatus } from '@prisma/client'
import { calculateCommission } from '../utils'

interface PaymentRequest {
  userId: string
  amount: number
  provider: PaymentProvider
  phoneNumber: string
  type: TransactionType
  description?: string
  orderId?: string
  subscriptionId?: string
}

interface PaymentResult {
  success: boolean
  transactionId?: string
  referenceId?: string
  status?: TransactionStatus
  error?: string
}

class PaymentService {
  // Process deposit (recharge wallet)
  async processDeposit(params: PaymentRequest): Promise<PaymentResult> {
    const { userId, amount, provider, phoneNumber, description } = params

    try {
      // Get user wallet
      const wallet = await prisma.wallet.findUnique({
        where: { userId },
      })

      if (!wallet) {
        return { success: false, error: 'Portefeuille non trouvé' }
      }

      // Create pending transaction
      const transaction = await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: TransactionType.DEPOSIT,
          status: TransactionStatus.PENDING,
          amount: amount,
          fee: 0,
          netAmount: amount,
          currency: 'XOF',
          provider,
          description: description || 'Recharge de portefeuille',
        },
      })

      // Initiate payment with provider
      let result
      if (provider === PaymentProvider.MTN_MOMO) {
        result = await mtnMomo.requestToPay({
          amount,
          currency: 'XOF',
          phoneNumber,
          externalId: transaction.id,
          payerMessage: 'Recharge BookShell',
          payeeNote: `Recharge wallet ${wallet.id}`,
        })
      } else if (provider === PaymentProvider.MOOV_MONEY) {
        result = await moovMoney.initiatePayment({
          amount,
          currency: 'XOF',
          phoneNumber,
          description: 'Recharge BookShell',
          transactionId: transaction.id,
        })
      } else {
        return { success: false, error: 'Fournisseur de paiement non supporté' }
      }

      if (!result.success) {
        // Mark transaction as failed
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: TransactionStatus.FAILED },
        })
        return { success: false, error: result.error }
      }

      // Update transaction with provider reference
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { providerRef: result.referenceId },
      })

      return {
        success: true,
        transactionId: transaction.id,
        referenceId: result.referenceId,
        status: TransactionStatus.PENDING,
      }
    } catch (error) {
      console.error('Deposit Error:', error)
      return { success: false, error: 'Erreur lors de la recharge' }
    }
  }

  // Process withdrawal
  async processWithdrawal(params: PaymentRequest): Promise<PaymentResult> {
    const { userId, amount, provider, phoneNumber, description } = params

    try {
      // Get user wallet
      const wallet = await prisma.wallet.findUnique({
        where: { userId },
      })

      if (!wallet) {
        return { success: false, error: 'Portefeuille non trouvé' }
      }

      // Check balance
      if (Number(wallet.balance) < amount) {
        return { success: false, error: 'Solde insuffisant' }
      }

      // Create pending transaction
      const transaction = await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: TransactionType.WITHDRAWAL,
          status: TransactionStatus.PENDING,
          amount: amount,
          fee: 0,
          netAmount: amount,
          currency: 'XOF',
          provider,
          description: description || 'Retrait de fonds',
        },
      })

      // Deduct from wallet immediately (will be refunded if failed)
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      })

      // Initiate transfer with provider
      let result
      if (provider === PaymentProvider.MTN_MOMO) {
        result = await mtnMomo.transfer({
          amount,
          currency: 'XOF',
          phoneNumber,
          externalId: transaction.id,
          payerMessage: 'Retrait BookShell',
          payeeNote: `Retrait wallet ${wallet.id}`,
        })
      } else if (provider === PaymentProvider.MOOV_MONEY) {
        result = await moovMoney.transfer({
          amount,
          currency: 'XOF',
          phoneNumber,
          description: 'Retrait BookShell',
          transactionId: transaction.id,
        })
      } else {
        // Refund wallet
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: amount } },
        })
        return { success: false, error: 'Fournisseur de paiement non supporté' }
      }

      if (!result.success) {
        // Refund wallet and mark as failed
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: amount } },
        })
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: TransactionStatus.FAILED },
        })
        return { success: false, error: result.error }
      }

      // Update transaction with provider reference
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { providerRef: result.referenceId },
      })

      return {
        success: true,
        transactionId: transaction.id,
        referenceId: result.referenceId,
        status: TransactionStatus.PENDING,
      }
    } catch (error) {
      console.error('Withdrawal Error:', error)
      return { success: false, error: 'Erreur lors du retrait' }
    }
  }

  // Process book purchase with wallet
  async processPurchase(
    buyerId: string,
    sellerId: string,
    amount: number,
    orderId: string
  ): Promise<PaymentResult> {
    try {
      // Get buyer wallet
      const buyerWallet = await prisma.wallet.findUnique({
        where: { userId: buyerId },
      })

      if (!buyerWallet) {
        return { success: false, error: 'Portefeuille acheteur non trouvé' }
      }

      // Check balance
      if (Number(buyerWallet.balance) < amount) {
        return { success: false, error: 'Solde insuffisant' }
      }

      // Get seller wallet
      let sellerWallet = await prisma.wallet.findUnique({
        where: { userId: sellerId },
      })

      if (!sellerWallet) {
        // Create wallet for seller if not exists
        sellerWallet = await prisma.wallet.create({
          data: { userId: sellerId, balance: 0 },
        })
      }

      // Calculate commission
      const { commission, sellerAmount } = calculateCommission(amount)

      // Create transactions in a database transaction
      const result = await prisma.$transaction(async (tx) => {
        // Deduct from buyer
        await tx.wallet.update({
          where: { id: buyerWallet.id },
          data: { balance: { decrement: amount } },
        })

        // Create buyer transaction
        const buyerTx = await tx.transaction.create({
          data: {
            walletId: buyerWallet.id,
            type: TransactionType.PURCHASE,
            status: TransactionStatus.COMPLETED,
            amount: amount,
            fee: 0,
            netAmount: amount,
            currency: 'XOF',
            provider: PaymentProvider.WALLET,
            orderId,
            description: 'Achat de livre',
          },
        })

        // Add to seller (minus commission)
        await tx.wallet.update({
          where: { id: sellerWallet!.id },
          data: { balance: { increment: sellerAmount } },
        })

        // Create seller transaction
        await tx.transaction.create({
          data: {
            walletId: sellerWallet!.id,
            type: TransactionType.SALE,
            status: TransactionStatus.COMPLETED,
            amount: amount,
            fee: commission,
            netAmount: sellerAmount,
            currency: 'XOF',
            provider: PaymentProvider.WALLET,
            orderId,
            description: 'Vente de livre',
          },
        })

        // Create commission transaction (for platform tracking)
        await tx.transaction.create({
          data: {
            walletId: sellerWallet!.id,
            type: TransactionType.COMMISSION,
            status: TransactionStatus.COMPLETED,
            amount: commission,
            fee: 0,
            netAmount: commission,
            currency: 'XOF',
            provider: PaymentProvider.WALLET,
            orderId,
            description: 'Commission plateforme (5%)',
          },
        })

        return buyerTx
      })

      return {
        success: true,
        transactionId: result.id,
        status: TransactionStatus.COMPLETED,
      }
    } catch (error) {
      console.error('Purchase Error:', error)
      return { success: false, error: 'Erreur lors du paiement' }
    }
  }

  // Process subscription payment
  async processSubscription(
    userId: string,
    amount: number,
    subscriptionId: string
  ): Promise<PaymentResult> {
    try {
      // Get user wallet
      const wallet = await prisma.wallet.findUnique({
        where: { userId },
      })

      if (!wallet) {
        return { success: false, error: 'Portefeuille non trouvé' }
      }

      // Check balance
      if (Number(wallet.balance) < amount) {
        return { success: false, error: 'Solde insuffisant' }
      }

      // Process payment
      const result = await prisma.$transaction(async (tx) => {
        // Deduct from wallet
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { decrement: amount } },
        })

        // Create transaction
        const transaction = await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: TransactionType.SUBSCRIPTION,
            status: TransactionStatus.COMPLETED,
            amount: amount,
            fee: 0,
            netAmount: amount,
            currency: 'XOF',
            provider: PaymentProvider.WALLET,
            subscriptionId,
            description: 'Abonnement livres audio',
          },
        })

        return transaction
      })

      return {
        success: true,
        transactionId: result.id,
        status: TransactionStatus.COMPLETED,
      }
    } catch (error) {
      console.error('Subscription Error:', error)
      return { success: false, error: 'Erreur lors du paiement de l\'abonnement' }
    }
  }

  // Handle payment webhook callback
  async handleWebhook(
    provider: PaymentProvider,
    referenceId: string,
    status: string,
    data: any
  ): Promise<boolean> {
    try {
      // Find transaction by provider reference
      const transaction = await prisma.transaction.findFirst({
        where: { providerRef: referenceId },
        include: { wallet: true },
      })

      if (!transaction) {
        console.error('Transaction not found for webhook:', referenceId)
        return false
      }

      // Map provider status to our status
      let newStatus: TransactionStatus
      if (status === 'SUCCESSFUL' || status === 'SUCCESS' || status === 'COMPLETED') {
        newStatus = TransactionStatus.COMPLETED
      } else if (status === 'FAILED' || status === 'REJECTED') {
        newStatus = TransactionStatus.FAILED
      } else if (status === 'CANCELLED') {
        newStatus = TransactionStatus.CANCELLED
      } else {
        // Still pending
        return true
      }

      // Update transaction status
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: newStatus, metadata: data },
      })

      // If deposit completed, add to wallet
      if (
        transaction.type === TransactionType.DEPOSIT &&
        newStatus === TransactionStatus.COMPLETED
      ) {
        await prisma.wallet.update({
          where: { id: transaction.walletId },
          data: { balance: { increment: transaction.netAmount } },
        })

        // Create notification
        await prisma.notification.create({
          data: {
            userId: transaction.wallet.userId,
            type: 'WALLET_DEPOSIT',
            title: 'Recharge réussie',
            message: `Votre portefeuille a été rechargé de ${transaction.netAmount} XOF`,
            link: '/wallet',
          },
        })
      }

      // If withdrawal failed, refund wallet
      if (
        transaction.type === TransactionType.WITHDRAWAL &&
        newStatus === TransactionStatus.FAILED
      ) {
        await prisma.wallet.update({
          where: { id: transaction.walletId },
          data: { balance: { increment: transaction.amount } },
        })

        // Create notification
        await prisma.notification.create({
          data: {
            userId: transaction.wallet.userId,
            type: 'SYSTEM',
            title: 'Retrait échoué',
            message: `Votre retrait de ${transaction.amount} XOF a échoué. Le montant a été recrédité.`,
            link: '/wallet',
          },
        })
      }

      return true
    } catch (error) {
      console.error('Webhook Handler Error:', error)
      return false
    }
  }

  // Check payment status
  async checkPaymentStatus(transactionId: string): Promise<PaymentResult> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
      })

      if (!transaction) {
        return { success: false, error: 'Transaction non trouvée' }
      }

      if (!transaction.providerRef) {
        return { success: true, status: transaction.status }
      }

      // Check with provider
      let result
      if (transaction.provider === PaymentProvider.MTN_MOMO) {
        if (transaction.type === TransactionType.DEPOSIT) {
          result = await mtnMomo.getPaymentStatus(transaction.providerRef)
        } else {
          result = await mtnMomo.getTransferStatus(transaction.providerRef)
        }
      } else if (transaction.provider === PaymentProvider.MOOV_MONEY) {
        if (transaction.type === TransactionType.DEPOSIT) {
          result = await moovMoney.getPaymentStatus(transaction.providerRef)
        } else {
          result = await moovMoney.getTransferStatus(transaction.providerRef)
        }
      } else {
        return { success: true, status: transaction.status }
      }

      if (result.success && result.status) {
        // Handle status update via webhook logic
        await this.handleWebhook(
          transaction.provider!,
          transaction.providerRef,
          result.status,
          result.data
        )
      }

      // Get updated transaction
      const updated = await prisma.transaction.findUnique({
        where: { id: transactionId },
      })

      return {
        success: true,
        transactionId: updated?.id,
        status: updated?.status,
      }
    } catch (error) {
      console.error('Check Status Error:', error)
      return { success: false, error: 'Erreur lors de la vérification' }
    }
  }
}

export const paymentService = new PaymentService()
export default paymentService
