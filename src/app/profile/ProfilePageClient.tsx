'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Edit2, Save, X, Loader2, Shield, LogOut,
  Camera, Calendar, CheckCircle, Key, Eye, EyeOff,
  MapPin, Plus, Trash2, Home, ChevronRight, Star,
  Link as LinkIcon, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { useShallow } from 'zustand/react/shallow';
import { useLogout } from '@/hooks/useLogout';
import {
  useMe,
  useUpdateMe,
  useChangePhone,
  useChangePassword,
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useChangeProfileImage,
  useAddPhone,
} from '@/hooks/useApi';
import { authApi } from '@/services/api';
import { getOptimizedUrl } from '@/lib/cdn';
import { cn, formatDate } from '@/lib/utils';
import type { AddressResponse, CreateAddressRequest, UpdateAddressRequest, AddressType } from '@/types';

// ─── Tabs ──────────────────────────────────────────────────────
const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'webLinks', label: 'Web Links', icon: LinkIcon },
];

// ─── Main Component ───────────────────────────────────────────
export function ProfilePageClient() {
  const router = useRouter();
  const { user: storeUser, isAuthenticated, isHydrated, setUser } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      isAuthenticated: s.isAuthenticated,
      isHydrated: s.isHydrated,
      setUser: s.setUser,
    }))
  );
  const logout = useLogout();

  const [activeTab, setActiveTab] = useState('profile');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login?redirect=/profile');
    }
  }, [isHydrated, isAuthenticated, router]);

  // ─── Data & Mutations ──────────────────────────────────────
  const { data: profile, isLoading, refetch } = useMe();
  const { data: addresses = [], refetch: refetchAddresses } = useAddresses();
  const { mutateAsync: updateMe, isPending: saving } = useUpdateMe();
  const { mutateAsync: changePhone, isPending: changingPhone } = useChangePhone();
  const { mutateAsync: changePassword, isPending: changingPassword } = useChangePassword();
  const { mutateAsync: changeProfileImage, isPending: uploadingImage } = useChangeProfileImage();
  const { mutateAsync: addAddress, isPending: addingAddress } = useAddAddress();
  const { mutateAsync: updateAddress, isPending: updatingAddress } = useUpdateAddress();
  const { mutateAsync: deleteAddress, isPending: deletingAddress } = useDeleteAddress();
  const { mutateAsync: setDefaultAddress, isPending: settingDefault } = useSetDefaultAddress();
  const { mutateAsync: addPhone, isPending: addingPhone } = useAddPhone();

  // ─── Profile edit states ──────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Phone modal states ────────────────────────────────────
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneModalMode, setPhoneModalMode] = useState<'add' | 'change' | null>(null);
  // Change phone fields
  const [currentFullPhone, setCurrentFullPhone] = useState('');
  const [newFullPhone, setNewFullPhone] = useState('');
  const [phonePassword, setPhonePassword] = useState('');
  // Add phone fields
  const [addCountryCode, setAddCountryCode] = useState('+91');
  const [addPhoneNumber, setAddPhoneNumber] = useState('');
  const [addPassword, setAddPassword] = useState('');

  // ─── Password change states ────────────────────────────────
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ─── Address management ────────────────────────────────────
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null);
  const [addressForm, setAddressForm] = useState<CreateAddressRequest>({
    addressType: 'HOME',
    countryCode: '+91',
    contactPersonName: '',
    contactPhoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    stateName: '',
    zipCode: '',
    countryName: 'India',
    landmark: '',
    nearbyPlace: '',
    directions: '',
    displayName: '',
    fullAddress: '',
    googlePlaceId: '',
    latitude: undefined,
    longitude: undefined,
    isDefault: false,
    isActive: true,
  });

  // ─── Effects ───────────────────────────────────────────────
  useEffect(() => {
    if (!profile) return;

    setFullName(profile.fullName || '');

    if (storeUser?.id !== profile.id) {
      setUser(profile);
    }
  }, [profile, storeUser?.id, setUser]);

  // Reset address form when modal opens/closes
  useEffect(() => {
    if (showAddressModal) {
      if (editingAddress) {
        setAddressForm({
          addressType: editingAddress.addressType,
          countryCode: editingAddress.countryCode || '+91',
          contactPersonName: editingAddress.contactPersonName || '',
          contactPhoneNumber: editingAddress.contactPhoneNumber || '',
          addressLine1: editingAddress.addressLine1 || '',
          addressLine2: editingAddress.addressLine2 || '',
          city: editingAddress.city || '',
          district: editingAddress.district || '',
          stateName: editingAddress.stateName || '',
          zipCode: editingAddress.zipCode || '',
          countryName: editingAddress.countryName || 'India',
          landmark: editingAddress.landmark || '',
          nearbyPlace: editingAddress.nearbyPlace || '',
          directions: editingAddress.directions || '',
          displayName: editingAddress.displayName || '',
          fullAddress: editingAddress.fullAddress || '',
          googlePlaceId: editingAddress.googlePlaceId || '',
          latitude: editingAddress.latitude || undefined,
          longitude: editingAddress.longitude || undefined,
          isDefault: editingAddress.isDefault || false,
          isActive: editingAddress.isActive ?? true,
        });
      } else {
        setAddressForm({
          addressType: 'HOME',
          countryCode: '+91',
          contactPersonName: '',
          contactPhoneNumber: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          district: '',
          stateName: '',
          zipCode: '',
          countryName: 'India',
          landmark: '',
          nearbyPlace: '',
          directions: '',
          displayName: '',
          fullAddress: '',
          googlePlaceId: '',
          latitude: undefined,
          longitude: undefined,
          isDefault: false,
          isActive: true,
        });
      }
    }
  }, [showAddressModal, editingAddress]);

  // ─── Handlers ──────────────────────────────────────────────

  // Profile image
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      changeProfileImage(file)
        .then(() => {
          refetch();
          toast.success('Profile image updated');
        })
        .catch(() => {});
    }
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    try {
      const response = await updateMe({ fullName });
      setUser(response.data.data);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    }
  };

  // Phone handlers
  const handleOpenAddPhone = () => {
    setPhoneModalMode('add');
    setAddCountryCode('+91');
    setAddPhoneNumber('');
    setAddPassword('');
    setShowPhoneModal(true);
  };

  const handleOpenChangePhone = () => {
    setPhoneModalMode('change');
    setCurrentFullPhone(displayUser?.phone || '');
    setNewFullPhone('');
    setPhonePassword('');
    setShowPhoneModal(true);
  };

  const handleClosePhoneModal = () => {
    setShowPhoneModal(false);
    setPhoneModalMode(null);
  };

  const handleSubmitPhone = async () => {
    if (phoneModalMode === 'add') {
      if (!addCountryCode || !addPhoneNumber || !addPassword) {
        toast.error('Please fill all fields');
        return;
      }
      // Enforce max 10 digits (backend allows 7-15, but we want a cleaner experience)
      if (!/^[0-9]{1,10}$/.test(addPhoneNumber)) {
        toast.error('Phone number must be up to 10 digits');
        return;
      }
      try {
        await addPhone({ countryCode: addCountryCode, phoneNumber: addPhoneNumber, password: addPassword });
        handleClosePhoneModal();
        refetch();
      } catch {
        // handled in hook
      }
    } else if (phoneModalMode === 'change') {
      if (!currentFullPhone || !newFullPhone || !phonePassword) {
        toast.error('Please fill all fields');
        return;
      }
      try {
        await changePhone({
          currentFullPhoneNumber: currentFullPhone,
          newFullPhoneNumber: newFullPhone,
          password: phonePassword,
        });
        handleClosePhoneModal();
        refetch();
      } catch {
        // handled in hook
      }
    }
  };

  // Password change
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await changePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully');
    } catch {
      // handled in hook
    }
  };

  // Logout
  const handleLogout = async () => {
    await logout({ redirectTo: '/' });
    toast.success('Logged out successfully');
  };

  // Address CRUD
  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (addr: AddressResponse) => {
    setEditingAddress(addr);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (id: number) => {
    if (window.confirm('Delete this address?')) {
      await deleteAddress(id);
      refetchAddresses();
    }
  };

  const handleSetDefault = async (id: number) => {
    await setDefaultAddress(id);
    refetchAddresses();
  };

  const handleSaveAddress = async () => {
    if (!addressForm.addressLine1 || !addressForm.city || !addressForm.stateName || !addressForm.zipCode) {
      toast.error('Please fill all required fields (Address, City, State, Zip)');
      return;
    }
    try {
      if (editingAddress) {
        await updateAddress({
          id: editingAddress.id,
          data: addressForm as UpdateAddressRequest,
        });
      } else {
        await addAddress(addressForm);
      }
      setShowAddressModal(false);
      refetchAddresses();
    } catch {
      // handled in hook
    }
  };

  // ─── Render ──────────────────────────────────────────────────
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  const displayUser = profile || storeUser;
  const memberSince = displayUser?.createdAt ? formatDate(displayUser.createdAt) : 'Recently';

  // Get profile image URL – handles both string and object
  const getProfileImageUrl = () => {
    if (avatarPreview) return avatarPreview;

    if (!displayUser?.mediaProfile) return null;

    if (typeof displayUser.mediaProfile === 'string') {
      return displayUser.mediaProfile;
    }

    return getOptimizedUrl(displayUser.mediaProfile as any);
  };

  const profileImageUrl = getProfileImageUrl();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 pt-24 pb-16">
      <div className="section-container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            My Account
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your profile, addresses, and security</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all relative whitespace-nowrap',
                activeTab === tab.id
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Avatar & Name Card – Premium style */}
              <div className="card-base p-6 md:p-8 rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 dark:to-brand-800/40 flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-zinc-800 shadow-xl transition-transform group-hover:scale-105">
                      {profileImageUrl ? (
                        <Image
                          src={profileImageUrl}
                          alt={displayUser?.fullName || 'Avatar'}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <User className="w-10 h-10 text-brand-600 dark:text-brand-400" />
                      )}
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-brand-500 text-white shadow-md hover:bg-brand-600 transition-all disabled:opacity-50 ring-2 ring-white dark:ring-zinc-800"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </div>
                  <div className="flex-1">
                    {isLoading ? (
                      <div className="space-y-2"><div className="skeleton h-6 w-48 rounded-lg" /><div className="skeleton h-4 w-32 rounded-lg" /></div>
                    ) : (
                      <>
                        {editing ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="input-base text-base font-semibold flex-1 min-w-[200px]"
                              autoFocus
                            />
                            <button onClick={handleSaveProfile} disabled={saving} className="btn-primary p-2.5">
                              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => { setEditing(false); setFullName(displayUser?.fullName || ''); }}
                              className="btn-secondary p-2.5"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="font-display text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                              {displayUser?.fullName || 'No name set'}
                            </h2>
                            <button onClick={() => setEditing(true)} className="text-zinc-400 hover:text-brand-500 transition">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300">
                            <Shield className="w-3 h-3" />{displayUser?.roleName?.replace('ROLE_', '') || 'CLIENT'}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                            <Calendar className="w-3 h-3" />Member since {memberSince}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Grid – Premium Cards */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="card-base p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950/40 dark:to-brand-900/30">
                      <Mail className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="font-display font-semibold">Email Address</h3>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 font-medium">{displayUser?.email || '—'}</p>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-500" /> Verified
                  </p>
                </div>

                {/* Phone Card – Dynamic Add/Change */}
                <div className="card-base p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950/40 dark:to-brand-900/30">
                        <Phone className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                      </div>
                      <h3 className="font-display font-semibold">Phone Number</h3>
                    </div>
                    {displayUser?.phone ? (
                      <button
                        onClick={handleOpenChangePhone}
                        className="text-xs font-medium text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/30 hover:bg-brand-100 dark:hover:bg-brand-950/50"
                      >
                        <Edit2 className="w-3 h-3" /> Change
                      </button>
                    ) : (
                      <button
                        onClick={handleOpenAddPhone}
                        className="text-xs font-medium text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    )}
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                    {displayUser?.phone || 'Not provided'}
                  </p>
                  {!displayUser?.phone && (
                    <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Add a phone number for better account recovery
                    </p>
                  )}
                </div>
              </div>

              {/* Account Status */}
              <div className="card-base p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50 shadow-lg">
                <h3 className="font-display font-semibold mb-4">Account Status</h3>
                <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Status</span>
                  <span className={cn(
                    'text-xs font-semibold px-2.5 py-1 rounded-full',
                    displayUser?.blocked ? 'bg-red-50 dark:bg-red-950/20 text-red-600' : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                  )}>
                    {displayUser?.blocked ? 'Suspended' : 'Active'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <motion.div
              key="addresses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-display text-2xl font-bold">Saved Addresses</h2>
                <button onClick={handleAddAddress} className="btn-primary gap-2">
                  <Plus className="w-4 h-4" /> Add Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="card-base p-12 text-center text-zinc-500">
                  <MapPin className="w-12 h-12 mx-auto mb-3 text-zinc-300" />
                  <p>No addresses saved yet.</p>
                  <button onClick={handleAddAddress} className="btn-secondary mt-3">Add your first address</button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-5">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="card-base p-5 rounded-2xl relative group transition hover:shadow-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Home className="w-5 h-5 text-brand-500" />
                          <h3 className="font-semibold">{addr.addressType}</h3>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => handleEditAddress(addr)} className="p-1.5 text-zinc-500 hover:text-brand-500 transition">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 text-zinc-500 hover:text-red-500 transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          {!addr.isDefault && (
                            <button onClick={() => handleSetDefault(addr.id)} className="p-1.5 text-zinc-500 hover:text-amber-500 transition" title="Set as default">
                              <Star className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">{addr.fullAddress || `${addr.addressLine1}, ${addr.city}, ${addr.stateName} - ${addr.zipCode}`}</p>
                      {addr.isDefault && (
                        <span className="inline-block mt-2 text-xs bg-brand-50 dark:bg-brand-950/30 text-brand-600 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Address Modal */}
              <AnimatePresence>
                {showAddressModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                    onClick={() => setShowAddressModal(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="font-display text-xl font-bold mb-4">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </h3>
                      <div className="space-y-4">
                        {/* Address Type */}
                        <div>
                          <label className="block text-sm font-medium mb-1">Type</label>
                          <select
                            value={addressForm.addressType}
                            onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value as AddressType })}
                            className="input-base w-full"
                          >
                            <option value="HOME">Home</option>
                            <option value="CLINIC">Clinic</option>
                            <option value="BUSINESS">Business</option>
                            <option value="BILLING">Billing</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Contact Person Name</label>
                          <input
                            value={addressForm.contactPersonName}
                            onChange={(e) => setAddressForm({ ...addressForm, contactPersonName: e.target.value })}
                            className="input-base w-full"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Contact Phone</label>
                          <input
                            value={addressForm.contactPhoneNumber}
                            onChange={(e) => setAddressForm({ ...addressForm, contactPhoneNumber: e.target.value })}
                            className="input-base w-full"
                            placeholder="+919876543210"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
                          <input
                            value={addressForm.addressLine1}
                            onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                            className="input-base w-full"
                            placeholder="123 Main Street"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Address Line 2</label>
                          <input
                            value={addressForm.addressLine2}
                            onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                            className="input-base w-full"
                            placeholder="Apartment, Suite"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">City *</label>
                            <input
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              className="input-base w-full"
                              placeholder="Mumbai"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">District</label>
                            <input
                              value={addressForm.district}
                              onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                              className="input-base w-full"
                              placeholder="Mumbai City"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">State *</label>
                            <input
                              value={addressForm.stateName}
                              onChange={(e) => setAddressForm({ ...addressForm, stateName: e.target.value })}
                              className="input-base w-full"
                              placeholder="Maharashtra"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Zip Code *</label>
                            <input
                              value={addressForm.zipCode}
                              onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                              className="input-base w-full"
                              placeholder="400001"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Country</label>
                          <input
                            value={addressForm.countryName}
                            onChange={(e) => setAddressForm({ ...addressForm, countryName: e.target.value })}
                            className="input-base w-full"
                            placeholder="India"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Landmark</label>
                          <input
                            value={addressForm.landmark}
                            onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                            className="input-base w-full"
                            placeholder="Near City Mall"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                            className="w-4 h-4 text-brand-600"
                          />
                          <label className="text-sm">Set as default address</label>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button onClick={() => setShowAddressModal(false)} className="flex-1 btn-secondary">
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveAddress}
                            disabled={addingAddress || updatingAddress}
                            className="flex-1 btn-primary justify-center gap-2"
                          >
                            {(addingAddress || updatingAddress) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            {editingAddress ? 'Update' : 'Save'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="card-base p-6 md:p-8 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Key className="w-5 h-5 text-amber-600" />
                  <h3 className="font-display font-semibold">Change Password</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="input-base w-full pr-10"
                      />
                      <button
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-base w-full pr-10"
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-base w-full pr-10"
                      />
                      <button
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="btn-primary w-full justify-center gap-2"
                  >
                    {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    {changingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
              <div className="card-base p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50 shadow-lg">
                <h3 className="font-display font-semibold mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-zinc-500">Enhance security – coming soon</p>
                <button className="btn-secondary text-sm mt-3" disabled>Set up →</button>
              </div>
            </motion.div>
          )}

          {/* WEB LINKS TAB */}
          {activeTab === 'webLinks' && (
            <motion.div
              key="webLinks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="card-base p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50 shadow-lg">
                <h3 className="font-display font-semibold mb-4">Your Website Links</h3>
                {displayUser?.webLinks?.length ? (
                  <ul className="space-y-3">
                    {displayUser.webLinks.map((link) => (
                      <li key={link.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                        <span className="text-sm font-medium">{link.name}</span>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-brand-500 text-sm flex items-center gap-1">
                          Visit <ChevronRight className="w-3 h-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-500">No web links available.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* ─── PHONE MODAL (Add / Change) ────────────────────────── */}
      <AnimatePresence>
        {showPhoneModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClosePhoneModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-xl font-bold mb-4">
                {phoneModalMode === 'add' ? 'Add Phone Number' : 'Change Phone Number'}
              </h3>
              <div className="space-y-4">
                {phoneModalMode === 'add' ? (
                  // ── Add Phone Fields ──
                  <>
                    {/* Country Code + Phone Number in a single row */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <div className="flex gap-2">
                        <div className="w-1/3">
                          <input
                            value={addCountryCode}
                            onChange={(e) => setAddCountryCode(e.target.value)}
                            className="input-base w-full"
                            placeholder="+91"
                          />
                        </div>
                        <div className="w-2/3">
                          <input
                            value={addPhoneNumber}
                            onChange={(e) => setAddPhoneNumber(e.target.value)}
                            className="input-base w-full"
                            placeholder="9876543210"
                            maxLength={10}
                            pattern="[0-9]*"
                            inputMode="numeric"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">Enter up to 10 digits</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <input
                        type="password"
                        value={addPassword}
                        onChange={(e) => setAddPassword(e.target.value)}
                        className="input-base w-full"
                      />
                    </div>
                  </>
                ) : (
                  // ── Change Phone Fields ──
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Current phone (full format)</label>
                      <input
                        value={currentFullPhone}
                        onChange={(e) => setCurrentFullPhone(e.target.value)}
                        className="input-base w-full"
                        placeholder="+919876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">New phone (full format)</label>
                      <input
                        value={newFullPhone}
                        onChange={(e) => setNewFullPhone(e.target.value)}
                        className="input-base w-full"
                        placeholder="+919876543211"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <input
                        type="password"
                        value={phonePassword}
                        onChange={(e) => setPhonePassword(e.target.value)}
                        className="input-base w-full"
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleClosePhoneModal}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitPhone}
                    disabled={addingPhone || changingPhone}
                    className="flex-1 btn-primary justify-center gap-2"
                  >
                    {(addingPhone || changingPhone) && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {phoneModalMode === 'add' ? 'Add' : 'Update'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── LOGOUT CONFIRMATION MODAL ────────────────────────── */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Sign Out</h3>
              <p className="text-zinc-500 mb-6">Are you sure you want to sign out?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 btn-secondary">Cancel</button>
                <button onClick={handleLogout} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition">
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}