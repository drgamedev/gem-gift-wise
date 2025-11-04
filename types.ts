
export interface Gift {
  productName: string;
  reason: string;
  estimatedPrice: number;
  rating: number;
  amazonSearchQuery: string;
}

export interface SearchParams {
  recipient: string;
  occasion: string;
  budget: [number, number];
  interests: string[];
}

export class GiftWiseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GiftWiseError';
  }
}
