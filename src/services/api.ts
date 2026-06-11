import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  PageResponse,
  ServiceResponse,
  ProjectResponse,
  ProjectBundleResponse,
  PackageResponse,
  TechnologyResponse,
  TestimonialResponse,
  BannerResponse,
  ContactRequestCreateRequest,
  ContactRequestResponse,
  ContactRequestStats,
  AuthResponse,
  PhonePasswordLoginResponse,
  PhonePasswordRegisterResponse,
  GoogleLoginRequest,
  LoginRequest,
  PhonePasswordRegisterRequest,
  LogoutRequest,
  UserProfileResponse,
  AdminUserSummaryResponse,
  FeatureResponse,
  LinkResponse,
  UpdateContactStatusRequest,
} from '@/types';

// ─── Auth ────────────────────────────────────────────────────
export const authApi = {
  googleLogin: (data: GoogleLoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/api/v1/auth/login/google', data),

  phoneLogin: (data: LoginRequest) =>
    apiClient.post<ApiResponse<PhonePasswordLoginResponse>>('/api/v1/auth/login/phone-pass', data),

  register: (data: PhonePasswordRegisterRequest) =>
    apiClient.post<ApiResponse<PhonePasswordRegisterResponse>>('/api/v1/auth/register/phone-pass', data),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/api/v1/auth/tokens/refresh', { refreshToken }),

  validateToken: (token: string) =>
    apiClient.post<ApiResponse<boolean>>('/api/v1/auth/tokens/validate', { token }),

  logout: (data?: LogoutRequest) =>
    apiClient.post<ApiResponse<string>>('/api/v1/auth/logout', data ?? {}),
};

// ─── Public Services ─────────────────────────────────────────
export const servicesApi = {
  getAll: () =>
    apiClient.get<ApiResponse<ServiceResponse[]>>('/api/v1/public/services'),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<ServiceResponse>>(`/api/v1/public/services/${slug}`),
};

// ─── Public Projects ─────────────────────────────────────────
export const projectsApi = {
  getAll: (params?: { page?: number; size?: number }) =>
    apiClient.get<ApiResponse<PageResponse<ProjectResponse>>>('/api/v1/public/projects', { params }),

  getFeatured: () =>
    apiClient.get<ApiResponse<ProjectResponse[]>>('/api/v1/public/projects/featured'),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<ProjectResponse>>(`/api/v1/public/projects/${slug}`),
};

// ─── Public Project Bundles ───────────────────────────────────
export const projectBundlesApi = {
  getActive: () =>
    apiClient.get<ApiResponse<ProjectBundleResponse[]>>('/api/v1/public/project-bundles/active'),

  getFeatured: () =>
    apiClient.get<ApiResponse<ProjectBundleResponse[]>>('/api/v1/public/project-bundles/featured'),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<ProjectBundleResponse>>(`/api/v1/public/project-bundles/slug/${slug}`),
};

// ─── Public Packages ─────────────────────────────────────────
export const packagesApi = {
  getAll: () =>
    apiClient.get<ApiResponse<PackageResponse[]>>('/api/v1/public/packages'),

  getFeatured: () =>
    apiClient.get<ApiResponse<PackageResponse[]>>('/api/v1/public/packages/featured'),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<PackageResponse>>(`/api/v1/public/packages/slug/${slug}`),
};

// ─── Public Technologies ─────────────────────────────────────
export const technologiesApi = {
  getAll: () =>
    apiClient.get<ApiResponse<TechnologyResponse[]>>('/api/v1/public/technologies'),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<TechnologyResponse>>(`/api/v1/public/technologies/${slug}`),
};

// ─── Public Testimonials ─────────────────────────────────────
export const testimonialsApi = {
  getAll: (params?: { page?: number; size?: number }) =>
    apiClient.get<ApiResponse<PageResponse<TestimonialResponse>>>('/api/v1/public/testimonials', { params }),

  getFeatured: () =>
    apiClient.get<ApiResponse<TestimonialResponse[]>>('/api/v1/public/testimonials/featured'),

  getById: (id: number) =>
    apiClient.get<ApiResponse<TestimonialResponse>>(`/api/v1/public/testimonials/details/${id}`),
};

// ─── Public Banners ──────────────────────────────────────────
export const bannersApi = {
  getAll: () =>
    apiClient.get<ApiResponse<BannerResponse[]>>('/api/v1/banners'),
};

// ─── Public Features ─────────────────────────────────────────
export const featuresApi = {
  getAll: () =>
    apiClient.get<ApiResponse<FeatureResponse[]>>('/api/v1/public/features'),
};

// ─── Public Links / Web-links ────────────────────────────────
export const linksApi = {
  getAll: () =>
    apiClient.get<ApiResponse<LinkResponse[]>>('/api/v1/public/links'),

  getWebLinks: () =>
    apiClient.get<ApiResponse<LinkResponse[]>>('/api/v1/public/web-links'),

  getWebLinkByType: (type: string) =>
    apiClient.get<ApiResponse<LinkResponse>>(`/api/v1/public/web-links/${type}`),
};

// ─── Contact ─────────────────────────────────────────────────
export const contactApi = {
  submit: (data: ContactRequestCreateRequest) =>
    apiClient.post<ApiResponse<ContactRequestResponse>>('/api/v1/public/contact-requests', data),
};

// ─── Settings ────────────────────────────────────────────────
export const settingsApi = {
  getPublic: () =>
    apiClient.get<ApiResponse<{ technicalIssueSetting: { enabled: boolean; message: string } }>>('/api/v1/public/settings'),

  getTechnicalIssue: () =>
    apiClient.get<ApiResponse<{ enabled: boolean; message: string }>>('/api/v1/public/settings/technical-issue'),
};

// ─── User (authenticated) ────────────────────────────────────
export const userApi = {
  getMe: () =>
    apiClient.get<ApiResponse<UserProfileResponse>>('/api/v1/users/me'),

  updateMe: (data: { fullName?: string }) =>
    apiClient.patch<ApiResponse<UserProfileResponse>>('/api/v1/users/me', data),
};

// ─── Admin ───────────────────────────────────────────────────
export const adminApi = {
  // Users
  getUsers: (params?: { page?: number; size?: number; sort?: string }) =>
    apiClient.get<ApiResponse<PageResponse<AdminUserSummaryResponse>>>('/api/v1/admin/users', {
      params: { sort: 'createdAt,DESC', ...params },
    }),

  getUserById: (id: number) =>
    apiClient.get<ApiResponse<UserProfileResponse>>(`/api/v1/admin/users/${id}`),

  blockUser: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/users/${id}/block`),

  unblockUser: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/users/${id}/unblock`),

  changeUserRole: (id: number, roleName: string) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/users/${id}/roles`, null, { params: { roleName } }),

  deleteUser: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/admin/users/${id}/delete`),

  // Projects
  getProjects: (params?: { page?: number; size?: number; sortBy?: string; direction?: string }) =>
    apiClient.get<ApiResponse<PageResponse<ProjectResponse>>>('/api/v1/admin/projects', {
      params: { sortBy: 'createdAt', direction: 'DESC', ...params },
    }),

  getProjectById: (id: number) =>
    apiClient.get<ApiResponse<ProjectResponse>>(`/api/v1/admin/projects/${id}`),

  createProject: (data: FormData) =>
    apiClient.post<ApiResponse<ProjectResponse>>('/api/v1/admin/projects', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateProject: (id: number, data: FormData) =>
    apiClient.put<ApiResponse<ProjectResponse>>(`/api/v1/admin/projects/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteProject: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/admin/projects/${id}`),

  enableProject: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/projects/${id}/enable`),

  disableProject: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/projects/${id}/disable`),

  // Project Bundles
  getBundles: () =>
    apiClient.get<ApiResponse<ProjectBundleResponse[]>>('/api/v1/admin/project-bundles'),

  createBundle: (data: FormData) =>
    apiClient.post<ApiResponse<ProjectBundleResponse>>('/api/v1/admin/project-bundles', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateBundle: (id: number, data: FormData) =>
    apiClient.put<ApiResponse<ProjectBundleResponse>>(`/api/v1/admin/project-bundles/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Packages
  getPackages: (params?: { page?: number; size?: number }) =>
    apiClient.get<ApiResponse<PageResponse<PackageResponse>>>('/api/v1/admin/packages', {
      params: { sortBy: 'createdAt', direction: 'DESC', ...params },
    }),

  getPackageById: (id: number) =>
    apiClient.get<ApiResponse<PackageResponse>>(`/api/v1/admin/packages/${id}`),

  createPackage: (data: unknown) =>
    apiClient.post<ApiResponse<PackageResponse>>('/api/v1/admin/packages', data),

  updatePackage: (id: number, data: unknown) =>
    apiClient.put<ApiResponse<PackageResponse>>(`/api/v1/admin/packages/${id}`, data),

  deletePackage: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/admin/packages/${id}/disable`),

  enablePackage: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/packages/${id}/enable`),

  disablePackage: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/packages/${id}/disable`),

  addServiceToPackage: (packageId: number, data: { serviceId: number; displayOrder: number; highlighted: boolean }) =>
    apiClient.post<ApiResponse<unknown>>(`/api/v1/admin/packages/${packageId}/services`, data),

  // Services
  getServices: (params?: { page?: number; size?: number }) =>
    apiClient.get<ApiResponse<PageResponse<ServiceResponse>>>('/api/v1/admin/services', {
      params: { sortBy: 'createdAt', direction: 'DESC', ...params },
    }),

  getServiceById: (id: number) =>
    apiClient.get<ApiResponse<ServiceResponse>>(`/api/v1/admin/services/${id}`),

  createService: (data: FormData) =>
    apiClient.post<ApiResponse<ServiceResponse>>('/api/v1/admin/services', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateService: (id: number, data: FormData) =>
    apiClient.put<ApiResponse<ServiceResponse>>(`/api/v1/admin/services/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteService: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/admin/services/${id}`),

  enableService: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/services/${id}/enable`),

  disableService: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/services/${id}/disable`),

  featureService: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/services/${id}/feature`),

  unfeatureService: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/services/${id}/unfeature`),

  // Technologies
  getTechnologies: (params?: { page?: number; size?: number }) =>
    apiClient.get<ApiResponse<PageResponse<TechnologyResponse>>>('/api/v1/admin/technologies', { params }),

  getTechnologyById: (id: number) =>
    apiClient.get<ApiResponse<TechnologyResponse>>(`/api/v1/admin/technologies/${id}`),

  createTechnology: (data: FormData) =>
    apiClient.post<ApiResponse<TechnologyResponse>>('/api/v1/admin/technologies', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateTechnology: (id: number, data: FormData) =>
    apiClient.put<ApiResponse<TechnologyResponse>>(`/api/v1/admin/technologies/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteTechnology: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/admin/technologies/${id}`),

  enableTechnology: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/technologies/${id}/enable`),

  disableTechnology: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/technologies/${id}/disable`),

  // Features
  getFeatures: (params?: { page?: number; size?: number }) =>
    apiClient.get<ApiResponse<PageResponse<FeatureResponse>>>('/api/v1/admin/features', { params }),

  createFeature: (data: FormData) =>
    apiClient.post<ApiResponse<FeatureResponse>>('/api/v1/admin/features', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateFeature: (id: number, data: FormData) =>
    apiClient.put<ApiResponse<FeatureResponse>>(`/api/v1/admin/features/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteFeature: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/admin/features/${id}`),

  // Testimonials
  getTestimonials: (params?: { page?: number; size?: number }) =>
    apiClient.get<ApiResponse<PageResponse<TestimonialResponse>>>('/api/v1/admin/testimonials', { params }),

  getTestimonialById: (id: number) =>
    apiClient.get<ApiResponse<TestimonialResponse>>(`/api/v1/admin/testimonials/${id}`),

  createTestimonial: (data: FormData) =>
    apiClient.post<ApiResponse<TestimonialResponse>>('/api/v1/admin/testimonials', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateTestimonial: (id: number, data: FormData) =>
    apiClient.put<ApiResponse<TestimonialResponse>>(`/api/v1/admin/testimonials/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteTestimonial: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/admin/testimonials/${id}`),

  enableTestimonial: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/testimonials/${id}/enable`),

  disableTestimonial: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/testimonials/${id}/disable`),

  // Banners
  getBanners: () =>
    apiClient.get<ApiResponse<BannerResponse[]>>('/api/v1/admin/banners'),

  createBanner: (data: FormData) =>
    apiClient.post<ApiResponse<BannerResponse>>('/api/v1/admin/banners', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateBanner: (id: number, data: Partial<BannerResponse>) =>
    apiClient.patch<ApiResponse<BannerResponse>>(`/api/v1/admin/banners/${id}`, data),

  deleteBanner: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/admin/banners/${id}`),

  enableBanner: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/banners/${id}/enable`),

  disableBanner: (id: number) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/banners/${id}/disable`),

  // Contact requests
  getContactRequests: (params?: { page?: number; size?: number; sortBy?: string; direction?: string }) =>
    apiClient.get<ApiResponse<PageResponse<ContactRequestResponse>>>('/api/v1/admin/contact-requests', {
      params: { sortBy: 'createdAt', direction: 'DESC', ...params },
    }),

  getContactRequestById: (id: number) =>
    apiClient.get<ApiResponse<ContactRequestResponse>>(`/api/v1/admin/contact-requests/${id}`),

  getContactStats: () =>
    apiClient.get<ApiResponse<ContactRequestStats>>('/api/v1/admin/contact-requests/stats'),

  updateContactRequest: (id: number, data: UpdateContactStatusRequest) =>
    apiClient.patch<ApiResponse<ContactRequestResponse>>(`/api/v1/admin/contact-requests/${id}`, data),

  updateContactStatus: (id: number, status: string) =>
    apiClient.patch<ApiResponse<void>>(`/api/v1/admin/contact-requests/${id}/status`, null, { params: { status } }),

  deleteContactRequest: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/admin/contact-requests/${id}`),

  // Settings
  getSettings: () =>
    apiClient.get<ApiResponse<{ technicalIssueSetting: { enabled: boolean; message: string } }>>('/api/v1/admin/settings'),

  getTechnicalIssueSetting: () =>
    apiClient.get<ApiResponse<{ enabled: boolean; message: string }>>('/api/v1/admin/settings/technical-issue'),

  updateTechnicalIssueSetting: (data: { enabled: boolean; message: string }) =>
    apiClient.put<ApiResponse<void>>('/api/v1/admin/settings/technical-issue', data),
};
