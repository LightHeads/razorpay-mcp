import Razorpay from 'razorpay';
import { z } from 'zod';

export const RazorpayPaginationSchema = z.object({
  skip: z.number().optional(),
  count: z.number().optional(),
  from: z.number().optional(),
  to: z.number().optional()
});

export type RazorpayPaginationOptions = z.infer<typeof RazorpayPaginationSchema>;

type RazorpayQuery = {
  skip?: number;
  count?: number;
  from?: number;
  to?: number;
};

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
}
  
