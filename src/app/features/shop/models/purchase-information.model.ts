export interface PurchaseInformation {
  name: string;
  surname: string;
  phone: string;
  email: string;
  observations: string;
  boughtProducts: BoughtProduct[];
  amount: number;
}

export interface PurchaseInformationForm {
  name: string;
  surname: string;
  phone: string;
  email: string;
  observations: string;
}

export interface BoughtProduct {
  productName: string;
  sizeName: string;
  count: number;
  price: number;
}
