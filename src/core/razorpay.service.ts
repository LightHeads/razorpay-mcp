import Razorpay from 'razorpay';
import { RazorpayPaginationSchema, type RazorpayPaginationOptions, type RazorpayQuery } from './schemas.js';

export class RazorpayService {
  private razorpay: Razorpay;

  constructor(keyId: string, keySecret: string) {
    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  // Orders
  async getAllOrders(options: RazorpayPaginationOptions = {}) {
    const validatedOptions = RazorpayPaginationSchema.parse(options) as RazorpayQuery;
    return this.razorpay.orders.all(validatedOptions);
  }

  // Payments
  async getAllPayments(options: RazorpayPaginationOptions = {}) {
    const validatedOptions = RazorpayPaginationSchema.parse(options) as RazorpayQuery;
    return this.razorpay.payments.all(validatedOptions);
  }

  // Settlements
  async getAllSettlements(options: RazorpayPaginationOptions = {}) {
    const validatedOptions = RazorpayPaginationSchema.parse(options) as RazorpayQuery;
    return this.razorpay.settlements.all(validatedOptions);
  }

  async getAllRefunds(options: RazorpayPaginationOptions = {}) {
    const validatedOptions = RazorpayPaginationSchema.parse(options) as RazorpayQuery;
    return this.razorpay.refunds.all(validatedOptions);
  }

  // Disputes
  async getAllDisputes(options: RazorpayPaginationOptions = {}) {
    const validatedOptions = RazorpayPaginationSchema.parse(options) as RazorpayQuery;
    return this.razorpay.disputes.all(validatedOptions);
  }

  // Invoices
  async getAllInvoices(options: RazorpayPaginationOptions = {}) {
    const validatedOptions = RazorpayPaginationSchema.parse(options) as RazorpayQuery;
    return this.razorpay.invoices.all(validatedOptions);
  }

  // Account Balances
  async getAccountBalance(accountId: string) {
    return this.razorpay.accounts.fetch(accountId);
  }

  // Contacts/Customers
  async getAllContacts(options: RazorpayPaginationOptions = {}) {
    const validatedOptions = RazorpayPaginationSchema.parse(options) as RazorpayQuery;
    return this.razorpay.customers.all(validatedOptions);
  }

  // Transactions (Transfers)
  async getAllTransactions(options: RazorpayPaginationOptions = {}) {
    const validatedOptions = RazorpayPaginationSchema.parse(options) as RazorpayQuery;
    return this.razorpay.transfers.all(validatedOptions);
  }

  // VPAs (Virtual Accounts)
  async getAllVPAs(options: RazorpayPaginationOptions = {}) {
    const validatedOptions = RazorpayPaginationSchema.parse(options) as RazorpayQuery;
    return this.razorpay.virtualAccounts.all(validatedOptions);
  }

  // Customers
  async getAllCustomers(options: RazorpayPaginationOptions = {}) {
    const validatedOptions = RazorpayPaginationSchema.parse(options) as RazorpayQuery;
    return this.razorpay.customers.all(validatedOptions);
  }
}
  
