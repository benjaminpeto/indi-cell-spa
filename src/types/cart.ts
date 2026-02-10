export type CartItem = {
  key: string;
  productId: string;
  brand: string;
  model: string;
  imgUrl: string;
  unitPrice: number;
  colorCode: number;
  colorName: string;
  storageCode: number;
  storageName: string;
  quantity: number;
};

export type CartItemInput = Omit<CartItem, 'quantity' | 'key'>;
