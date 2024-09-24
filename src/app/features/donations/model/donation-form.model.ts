export interface DonationForm {
  name: string;
  firstSurname: string;
  secondSurname: string;
  cif: string;
  phone: string;
  email: string;
  deduct: boolean;
  amount: null;
  frequency: "SINGLE" | "YEARLY" | "BIANNUAL" | "QUARTERLY" | "MONTHLY";
  singleDonationPaymentType: "TPV" | "IBAN" | "MANUAL";
  iban: string;
}
