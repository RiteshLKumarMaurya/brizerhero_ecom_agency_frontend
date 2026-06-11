import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  servicesApi, projectsApi, projectBundlesApi, packagesApi,
  technologiesApi, testimonialsApi, bannersApi, featuresApi,
  contactApi, settingsApi, userApi, adminApi,
} from '@/services/api';


import type {
  ContactRequestCreateRequest,

  // ...
} from '@/types';

// ─── Query Keys ──────────────────────────────────────────────
export const queryKeys = {
  services:             ['services'] as const,
  service:              (slug: string) => ['services', slug] as const,
  projects:             (page?: number) => ['projects', page] as const,
  featuredProjects:     ['projects', 'featured'] as const,
  project:              (slug: string) => ['projects', slug] as const,
  bundles:              ['bundles'] as const,
  featuredBundles:      ['bundles', 'featured'] as const,
  bundle:               (slug: string) => ['bundles', slug] as const,
  packages:             ['packages'] as const,
  featuredPackages:     ['packages', 'featured'] as const,
  package:              (slug: string) => ['packages', slug] as const,
  technologies:         ['technologies'] as const,
  technology:           (slug: string) => ['technologies', slug] as const,
  testimonials:         (page?: number) => ['testimonials', page] as const,
  featuredTestimonials: ['testimonials', 'featured'] as const,
  banners:              ['banners'] as const,
  features:             ['features'] as const,
  settings:             ['settings'] as const,
  me:                   ['me'] as const,
  adminUsers:           (page?: number) => ['admin', 'users', page] as const,
  adminProjects:        (page?: number) => ['admin', 'projects', page] as const,
  adminServices:        (page?: number) => ['admin', 'services', page] as const,
  adminPackages:        (page?: number) => ['admin', 'packages', page] as const,
  adminTechnologies:    (page?: number) => ['admin', 'technologies', page] as const,
  adminTestimonials:    (page?: number) => ['admin', 'testimonials', page] as const,
  adminBanners:         ['admin', 'banners'] as const,
  adminContacts:        (page?: number) => ['admin', 'contacts', page] as const,
  contactStats:         ['admin', 'contacts', 'stats'] as const,
};

// ─── Public Hooks ────────────────────────────────────────────
export function useServices() {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: () => servicesApi.getAll().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useService(slug: string) {
  return useQuery({
    queryKey: queryKeys.service(slug),
    queryFn: () => servicesApi.getBySlug(slug).then((r) => r.data.data),
    enabled: !!slug,
  });
}

export function useProjects(page = 0, size = 12) {
  return useQuery({
    queryKey: queryKeys.projects(page),
    queryFn: async () => {
      const res = await projectsApi.getAll({ page, size });
      const data = res.data.data;
      // Normalise: backend uses "page" field, add "number"/"first" aliases
      return {
        ...data,
        number: data.page,
        first: data.page === 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: queryKeys.featuredProjects,
    queryFn: () => projectsApi.getFeatured().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: queryKeys.project(slug),
    queryFn: () => projectsApi.getBySlug(slug).then((r) => r.data.data),
    enabled: !!slug,
  });
}

export function useFeaturedBundles() {
  return useQuery({
    queryKey: queryKeys.featuredBundles,
    queryFn: () => projectBundlesApi.getFeatured().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBundle(slug: string) {
  return useQuery({
    queryKey: queryKeys.bundle(slug),
    queryFn: () => projectBundlesApi.getBySlug(slug).then((r) => r.data.data),
    enabled: !!slug,
  });
}

export function usePackages() {
  return useQuery({
    queryKey: queryKeys.packages,
    queryFn: () => packagesApi.getAll().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedPackages() {
  return useQuery({
    queryKey: queryKeys.featuredPackages,
    queryFn: () => packagesApi.getFeatured().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePackage(slug: string) {
  return useQuery({
    queryKey: queryKeys.package(slug),
    queryFn: () => packagesApi.getBySlug(slug).then((r) => r.data.data),
    enabled: !!slug,
  });
}

export function useTechnologies() {
  return useQuery({
    queryKey: queryKeys.technologies,
    queryFn: () => technologiesApi.getAll().then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  });
}

export function useTechnology(slug: string) {
  return useQuery({
    queryKey: queryKeys.technology(slug),
    queryFn: () => technologiesApi.getBySlug(slug).then((r) => r.data.data),
    enabled: !!slug,
  });
}

export function useTestimonials(page = 0, size = 12) {
  return useQuery({
    queryKey: queryKeys.testimonials(page),
    queryFn: async () => {
      const res = await testimonialsApi.getAll({ page, size });
      const data = res.data.data;
      return { ...data, number: data.page, first: data.page === 0 };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedTestimonials() {
  return useQuery({
    queryKey: queryKeys.featuredTestimonials,
    queryFn: () => testimonialsApi.getFeatured().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBanners() {
  return useQuery({
    queryKey: queryKeys.banners,
    queryFn: () => bannersApi.getAll().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeatures() {
  return useQuery({
    queryKey: queryKeys.features,
    queryFn: () => featuresApi.getAll().then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => settingsApi.getPublic().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => userApi.getMe().then((r) => r.data.data),
    retry: false,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Mutations ───────────────────────────────────────────────
export function useSubmitContact() {
  return useMutation({
    mutationFn: (data: ContactRequestCreateRequest) => contactApi.submit(data),
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { fullName?: string }) => userApi.updateMe(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.me }),
  });
}

// ─── Admin Hooks ─────────────────────────────────────────────
export function useAdminUsers(page = 0) {
  return useQuery({
    queryKey: queryKeys.adminUsers(page),
    queryFn: () => adminApi.getUsers({ page, size: 20 }).then((r) => r.data.data),
  });
}

export function useAdminProjects(page = 0) {
  return useQuery({
    queryKey: queryKeys.adminProjects(page),
    queryFn: () => adminApi.getProjects({ page, size: 20 }).then((r) => r.data.data),
  });
}

export function useAdminServices(page = 0) {
  return useQuery({
    queryKey: queryKeys.adminServices(page),
    queryFn: () => adminApi.getServices({ page, size: 20 }).then((r) => r.data.data),
  });
}

export function useAdminPackages(page = 0) {
  return useQuery({
    queryKey: queryKeys.adminPackages(page),
    queryFn: () => adminApi.getPackages({ page, size: 20 }).then((r) => r.data.data),
  });
}

export function useAdminTechnologies(page = 0) {
  return useQuery({
    queryKey: queryKeys.adminTechnologies(page),
    queryFn: () => adminApi.getTechnologies({ page, size: 20 }).then((r) => r.data.data),
  });
}

export function useAdminTestimonials(page = 0) {
  return useQuery({
    queryKey: queryKeys.adminTestimonials(page),
    queryFn: () => adminApi.getTestimonials({ page, size: 20 }).then((r) => r.data.data),
  });
}

export function useAdminBanners() {
  return useQuery({
    queryKey: queryKeys.adminBanners,
    queryFn: () => adminApi.getBanners().then((r) => r.data.data),
  });
}

export function useAdminContacts(page = 0) {
  return useQuery({
    queryKey: queryKeys.adminContacts(page),
    queryFn: () => adminApi.getContactRequests({ page, size: 20 }).then((r) => r.data.data),
  });
}

export function useContactStats() {
  return useQuery({
    queryKey: queryKeys.contactStats,
    queryFn: () => adminApi.getContactStats().then((r) => r.data.data),
  });
}

// ─── Admin Mutations ─────────────────────────────────────────
export function useAdminBlockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, block }: { id: number; block: boolean }) =>
      block ? adminApi.blockUser(id) : adminApi.unblockUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'projects'] }),
  });
}

export function useUpdateContactStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminApi.updateContactStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'contacts'] });
      qc.invalidateQueries({ queryKey: queryKeys.contactStats });
    },
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteTestimonial(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] }),
  });
}

export function useDeleteTechnology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteTechnology(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'technologies'] }),
  });
}
