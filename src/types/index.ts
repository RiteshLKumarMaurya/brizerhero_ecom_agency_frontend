// ============================================================
// API Response Wrapper
// ============================================================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;       // backend uses "page" not "number"
  last: boolean;
  // convenience helpers — computed from above
  first?: boolean;
  number?: number;    // alias for page, kept for compatibility
}

// ============================================================
// Media
// ============================================================
export interface MediaResponse {
  publicId: string;
  originalKey: string;
  optimizedKey: string;
  thumbKey: string;
  width: number;
  height: number;
}

// ============================================================
// Auth — exact field names from Swagger / Postman
// ============================================================
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
}

/** Google login response */
export interface AuthResponse {
  user: UserProfileResponse;
  tokens: TokenResponse;
}

/** Phone/password login response */
export interface PhonePasswordLoginResponse {
  userProfileResponse: UserProfileResponse;
  tokenResponse: TokenResponse;
}

/** Phone/password register response */
export interface PhonePasswordRegisterResponse {
  userProfileResponse: UserProfileResponse;
  tokenResponse: TokenResponse;
}

export interface GoogleLoginRequest {
  idToken: string;
}

/** Postman-confirmed: fullPhoneNumber = countryCode+phone concatenated */
export interface LoginRequest {
  fullPhoneNumber: string;   // e.g. "+918651600737"
  password: string;
  fcmToken?: string;
  device?: string;
}

/** Register: phoneNumber (not phone), roleName required */
export interface PhonePasswordRegisterRequest {
  fullName: string;
  phoneNumber: string;        // NOTE: "phoneNumber" not "phone"
  countryCode: string;
  password: string;
  roleName: string;           // required: "ROLE_CLIENT"
  fcmToken?: string;
  device?: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

/** Logout: deviceToken (not refreshToken) */
export interface LogoutRequest {
  deviceToken?: string;
}

// ============================================================
// User
// ============================================================
export interface TechnicalIssueHandleSettingResponse {
  enabled: boolean;
  message: string;
}

export interface SettingResponse {
  technicalIssueSetting: TechnicalIssueHandleSettingResponse;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  phone: string;
  fullName: string;
  mediaProfile: MediaResponse | null;
  blocked: boolean;
  roleName: string;
  settings: SettingResponse;
  webLinks: LinkResponse[];
  addresses: AddressResponse[];
}

// ============================================================
// Services
// ============================================================
export interface ServiceFeatureResponse {
  id: number;
  feature: FeatureResponse;
  displayOrder: number;
  highlighted: boolean;
}

export interface ServiceResponse {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  iconImage: MediaResponse | null;
  serviceLinks: LinkResponse[];
  displayOrder: number;
  featured: boolean;
  active: boolean;
  features: FeatureResponse[];
  technologies: TechnologyResponse[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Projects
// ============================================================
/** Swagger-confirmed field names */
export interface ProjectBundleSummaryResponse {
  projectBundleId: number;
  projectBundleName: string;
  projectBundleSlug: string;
}

export interface ProjectResponse {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  thumbImage: MediaResponse | null;
  bannerImages: MediaResponse[];
  externalLinks: LinkResponse[];
  featured: boolean;
  active: boolean;
  technologies: TechnologyResponse[];
  createdAt: string;
  updatedAt: string;
  projectBundle: ProjectBundleSummaryResponse | null;
  projectDeliverableType: string;
}

export interface ProjectBundleResponse {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  featured: boolean;
  active: boolean;
  thumbImage: MediaResponse | null;
  projects: ProjectResponse[];
  packageEntity: PackageResponse | null;
  testimonial: TestimonialResponse | null;
}

// ============================================================
// Packages
// ============================================================
export interface PackageServiceMapping {
  id: number;
  service: ServiceResponse;
  displayOrder: number;
  highlighted?: boolean;
}

export interface PackageResponse {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  currencyCode: string;
  iconImage: MediaResponse | null;
  featured: boolean;
  displayOrder: number;
  active: boolean;
  services: PackageServiceMapping[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Technologies
// ============================================================
export interface TechnologyResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconImage: MediaResponse | null;
  links: LinkResponse[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Testimonials
// ============================================================
export interface TestimonialResponse {
  id: number;
  clientName: string;
  companyName: string;
  designationType: string;
  review: string;
  rating: number;
  thumbImage: MediaResponse | null;
  bannerImages: MediaResponse[];
  links: LinkResponse[];
  featured: boolean;
  active: boolean;
  clientId: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Features & Links
// ============================================================
export interface FeatureResponse {
  id: number;
  name: string;
  description: string;
  iconImage: MediaResponse | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LinkResponse {
  id: number;
  name: string;
  description: string;
  url: string;
  linkType: string;
  iconImage: MediaResponse | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Banners
// ============================================================
export interface BannerResponse {
  id: number;
  bannerImage: MediaResponse | null;
  type: string;
  referenceId: number;
  redirectUrl: string;
  active: boolean;
  startAt: string;
  endAt: string;
  priority: number;
}

// ============================================================
// Contact
// ============================================================
export interface ContactRequestCreateRequest {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  companyName?: string;
  country: string;
  source?: string;
  packageId?: number;
  budgetMin?: number;
  budgetMax?: number;
  message: string;
  currencyCode?: string;
  businessModelType?: string;
  projectIdea?: string;
  sharePercentage?: number;
}

export interface ContactRequestResponse {
  id: number;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  companyName: string;
  country: string;
  status: string;
  source: string;
  packageId: number;
  packageName: string;
  budgetMin: number;
  budgetMax: number;
  message: string;
  contactedAt: string;
  closedAt: string;
  notes: string;
  assignedToId: number;
  assignedToName: string;
  createdAt: string;
  updatedAt: string;
  currencyCode: string;
  businessModelType: string;
  projectIdea: string;
  sharePercentage: number;
  partnershipAccepted: boolean;
}

// ============================================================
// Address
// ============================================================
export interface AddressResponse {
  id: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  addressType: string;
  isDefault: boolean;
}

// ============================================================
// Admin
// ============================================================
export interface AdminUserSummaryResponse {
  id: number;
  email: string;
  phone: string;
  fullName: string;
  blocked: boolean;
  roleName: string;
  createdAt: string;
}

export interface ContactRequestStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

export interface UpdateContactStatusRequest {
  status: string;
  notes?: string;
  assignedToId?: number;
}

// Contact status enum values from Postman
export type ContactStatus =
  | 'PENDING'
  | 'CONTACTED'
  | 'PROPOSAL_SENT'
  | 'IN_PROGRESS'
  | 'CLOSED_WON'
  | 'CLOSED_LOST';
