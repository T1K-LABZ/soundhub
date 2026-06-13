// ── Union types ───────────────────────────────────────────────────────────────

export type CustomerTier = "New" | "Regular" | "Loyal" | "VIP";
export type ContactPreference = "Whatsapp" | "Call" | "SMS";
export type OfferType =
  | "Discount %"
  | "Fixed Discount"
  | "Free Service"
  | "Bundle Deal"
  | "Birthday Offer"
  | "Loyalty Reward"
  | "General Promotion";
export type OfferChannel = "Whatsapp" | "SMS" | "Email";
export type OfferStatus = "Sent" | "Opened" | "Redeemed";

// ── Vehicle ───────────────────────────────────────────────────────────────────

export type CustomerVehicle = {
  id: string;
  plate: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  color?: string;
};

// ── Offer sent record ─────────────────────────────────────────────────────────

export type SentOffer = {
  id: string;
  dateSent: string;
  title: string;
  type: OfferType;
  channel: OfferChannel;
  status: OfferStatus;
};

// ── Customer note ─────────────────────────────────────────────────────────────

export type CustomerNote = {
  id: string;
  date: string;
  text: string;
  addedBy: string;
  pinned?: boolean;
};

// ── Core customer record ──────────────────────────────────────────────────────

export type Customer = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  location: string;
  birthday?: string; // ISO date e.g. "1990-06-15"
  contactPreference: ContactPreference;
  optedInToPromos: boolean;
  notes?: string;
  memberSince: string; // ISO date

  vehicles: CustomerVehicle[];
  totalVisits: number;
  lastVisit: string; // ISO date
  totalSpent: number; // KES
  loyaltyPoints: number;

  offersHistory: SentOffer[];
  customerNotes: CustomerNote[];
};

// ── Computed tier (derived, not stored) ──────────────────────────────────────

// Tier is derived from visits + spend so we don't duplicate state
export function deriveCustomerTier(
  c: Pick<Customer, "totalVisits" | "totalSpent">,
): CustomerTier {
  if (c.totalVisits >= 10 || c.totalSpent >= 50000) return "VIP";
  if (c.totalVisits >= 6) return "Loyal";
  if (c.totalVisits >= 2) return "Regular";
  return "New";
}

// ── Summary type ──────────────────────────────────────────────────────────────

export type CustomerSummary = {
  total: number;
  newThisMonth: number;
  regular: number;
  loyal: number;
  vip: number;
  totalLifetimeRevenue: number;
  avgSpendPerCustomer: number;
  avgVisitsPerCustomer: number;
  retentionRate: number; // %
  pendingOffers: number;
};

// ── Form types ────────────────────────────────────────────────────────────────

export type VehicleFormEntry = Omit<CustomerVehicle, "id"> & {
  localId: string;
};

export type AddCustomerForm = {
  // Step 1
  fullName: string;
  phone: string;
  email: string;
  location: string;
  birthday: string;
  contactPreference: ContactPreference;
  optedInToPromos: boolean;
  notes: string;
  // Step 2
  vehicles: VehicleFormEntry[];
};

export type SendOfferForm = {
  title: string;
  offerType: OfferType;
  message: string;
  validFrom: string;
  validUntil: string;
  channels: OfferChannel[];
  // Bulk mode
  targetSegment: string;
};

// ── Filter type ───────────────────────────────────────────────────────────────

export type CustomerFilters = {
  search: string;
  tier: string;
  location: string;
  lastVisit: string;
  carMake: string;
  sortBy: string;
};
