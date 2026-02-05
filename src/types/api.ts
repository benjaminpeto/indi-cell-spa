export type ApiProductListItem = {
  id: string;
  brand: string;
  model: string;
  price: string; // API returns string
  imgUrl: string;
};

export type ProductOption = {
  code: number;
  name: string;
};

export type ApiProductOptions = {
  colors: ProductOption[];
  storages: ProductOption[];
};

export type ApiProductDetails = ApiProductListItem & {
  networkTechnology?: string;
  networkSpeed?: string;
  gprs?: string;
  edge?: string;
  announced?: string;
  status?: string;
  dimentions?: string; // typo in API
  weight?: string;
  sim?: string;
  displayType?: string;
  displayResolution?: string;
  displaySize?: string;
  os?: string;
  cpu?: string;
  chipset?: string;
  gpu?: string;
  externalMemory?: string;
  internalMemory?: string[];
  ram?: string;
  primaryCamera?: string[];
  secondaryCmera?: string[]; // API typo
  speaker?: string;
  audioJack?: string;
  wlan?: string[];
  bluetooth?: string[];
  gps?: string;
  nfc?: string;
  radio?: string;
  usb?: string;
  sensors?: string[];
  battery?: string;
  colors?: string[];
  options?: ApiProductOptions;
};

export type AddToCartRequest = {
  id: string;
  colorCode: number;
  storageCode: number;
};

export type AddToCartResponse = {
  count: number;
};
