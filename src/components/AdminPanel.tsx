import React, { useState, useEffect, useRef } from 'react';
import { useWebsite, type ServiceItem, type PortfolioItem } from '../context/WebsiteContext';
import { 
  X, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  FolderKanban, 
  Briefcase, 
  Building2, 
  Mail, 
  Download, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  AlertCircle,
  Phone,
  MessageSquare,
  Search,
  Camera,
  Copy,
  Key,
  Check,
  RefreshCw
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { 
    business, 
    services, 
    portfolio, 
    enquiries, 
    fetchPhotos,
    fetchEnquiries,
    uploadImageToStorage,
    isSyncingBlob,
    updateBusiness, 
    updateService, 
    addService, 
    deleteService, 
    addPortfolio, 
    updatePortfolio,
    deletePortfolio,
    updateEnquiryStatus,
    deleteEnquiry,
    clearAllEnquiries,
    resetToDefaults, 
    exportDataJSON 
  } = useWebsite();

  // =========================================================================
  // SERVER AUTHENTICATION & SESSION STATE
  // =========================================================================
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isSetupNeeded, setIsSetupNeeded] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');

  // Login Form
  const [loginEmail, setLoginEmail] = useState('auracreations9959@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Setup Form (First-Time Provisioning)
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [setupError, setSetupError] = useState('');
  const [isSubmittingSetup, setIsSubmittingSetup] = useState(false);

  // Forgot Password / Recovery Form
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // One-Time Secret Recovery Code Modal Display
  const [secretCodeModal, setSecretCodeModal] = useState<{
    code: string;
    isNewReset?: boolean;
  } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [codeSavedConfirmed, setCodeSavedConfirmed] = useState(false);

  // Admin Account & Password Management in Dashboard
  const [currentAccountPassword, setCurrentAccountPassword] = useState('');
  const [newAccountPassword, setNewAccountPassword] = useState('');
  const [isUpdatingAdminAccount, setIsUpdatingAdminAccount] = useState(false);
  const [adminAccountStatusMsg, setAdminAccountStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // =========================================================================
  // DASHBOARD TABS & MANAGEMENT STATES
  // =========================================================================
  const [activeTab, setActiveTab] = useState<'services' | 'inquiries' | 'portfolio' | 'business' | 'security'>('services');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Business Form State
  const [bizForm, setBizForm] = useState(business);
  const [bizSavedMessage, setBizSavedMessage] = useState(false);
  const [isSavingBiz, setIsSavingBiz] = useState(false);

  // Service Management States
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('All');
  const [targetServiceIdForPhoto, setTargetServiceIdForPhoto] = useState<string | null>(null);
  const [directUploadingId, setDirectUploadingId] = useState<string | null>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);

  // Add Service Modal State
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    category: 'Signage',
    image: '/images/services/led-boards.jpg',
    description: '',
    price: 'Starting from ₹120 / sq.ft',
    features: 'High Quality, Fast Turnaround, Custom Sizes',
    tag: 'Popular'
  });
  const [addUploadProgress, setAddUploadProgress] = useState<number | null>(null);
  const [addUploadError, setAddUploadError] = useState<string | null>(null);
  const [addUploadSuccess, setAddUploadSuccess] = useState(false);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Service Modal State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: 'Signage',
    image: '',
    description: '',
    price: '',
    features: '',
    tag: ''
  });
  const [editUploadProgress, setEditUploadProgress] = useState<number | null>(null);
  const [editUploadError, setEditUploadError] = useState<string | null>(null);
  const [editUploadSuccess, setEditUploadSuccess] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Delete Service Modal State
  const [deletingService, setDeletingService] = useState<ServiceItem | null>(null);

  // Portfolio Modal State
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    category: 'LED & Sign Boards',
    image: '/images/portfolio/led-boards.jpg',
    description: '',
    client: '',
    tags: 'Signage, Guntur'
  });
  const [addPortfolioUploadProgress, setAddPortfolioUploadProgress] = useState<number | null>(null);
  const [addPortfolioUploadError, setAddPortfolioUploadError] = useState<string | null>(null);
  const [addPortfolioUploadSuccess, setAddPortfolioUploadSuccess] = useState(false);
  const addPortfolioFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Portfolio Modal State
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const [editPortfolioForm, setEditPortfolioForm] = useState({
    title: '',
    category: 'LED & Sign Boards',
    image: '',
    description: '',
    client: '',
    tags: ''
  });
  const [editPortfolioUploadProgress, setEditPortfolioUploadProgress] = useState<number | null>(null);
  const [editPortfolioUploadError, setEditPortfolioUploadError] = useState<string | null>(null);
  const [editPortfolioUploadSuccess, setEditPortfolioUploadSuccess] = useState(false);
  const editPortfolioFileInputRef = useRef<HTMLInputElement>(null);

  // Direct quick photo replace for portfolio card
  const [directUploadingPortfolioId, setDirectUploadingPortfolioId] = useState<string | null>(null);
  const [targetPortfolioIdForPhoto, setTargetPortfolioIdForPhoto] = useState<string | null>(null);
  const directPortfolioFileInputRef = useRef<HTMLInputElement>(null);


  // Sync bizForm with context
  useEffect(() => {
    setBizForm(business);
  }, [business]);

  // =========================================================================
  // SERVER SESSION VERIFICATION ON OPEN
  // =========================================================================
  useEffect(() => {
    if (!isOpen) return;

    const checkServerSession = async () => {
      setIsCheckingAuth(true);
      try {
        // 1. Check if authenticated via HttpOnly cookie
        const meRes = await fetch('/api/auth?action=me', { credentials: 'include' });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.authenticated && meData.user) {
            setIsAuthenticated(true);
            setAdminEmail(meData.user.email);
            fetchPhotos();
            fetchEnquiries();
            setIsCheckingAuth(false);
            return;
          }
        }

        // 2. Check if initial setup is needed
        const statusRes = await fetch('/api/auth?action=status', { credentials: 'include' });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setIsSetupNeeded(statusData.setupNeeded);
          if (statusData.adminEmail) {
            setLoginEmail(statusData.adminEmail);
          }
        }
      } catch {
        // Fallback for offline local dev
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkServerSession();
  }, [isOpen, fetchPhotos]);

  if (!isOpen) return null;

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // =========================================================================
  // AUTHENTICATION HANDLERS
  // =========================================================================
  const handleServerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setIsAuthenticated(true);
        const email = data.user?.email || loginEmail;
        setAdminEmail(email);
        setLoginPassword('');
        fetchPhotos();
        showToast('✓ Successfully signed in to Admin Dashboard');
      } else {
        if (data?.setupNeeded) {
          setIsSetupNeeded(true);
        }
        setLoginError(data?.error || 'Invalid email or password.');
      }
    } catch {
      setLoginError('Could not connect to authentication server. Please retry.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleServerSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');

    if (setupPassword !== setupConfirmPassword) {
      setSetupError('Passwords do not match. Please re-enter.');
      return;
    }
    if (setupPassword.length < 6) {
      setSetupError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmittingSetup(true);

    try {
      const res = await fetch('/api/auth?action=setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: setupEmail, password: setupPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setIsSetupNeeded(false);
        setAdminEmail(data.user?.email || setupEmail);
        setSecretCodeModal({ code: data.recoveryCode, isNewReset: false });
        setCodeCopied(false);
        setCodeSavedConfirmed(false);
        fetchPhotos();
      } else {
        setSetupError(data.error || 'Failed to initialize admin account.');
      }
    } catch {
      setSetupError('Connection error during setup. Please retry.');
    } finally {
      setIsSubmittingSetup(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (newPasswordInput !== confirmNewPasswordInput) {
      setResetError('New passwords do not match.');
      return;
    }
    if (newPasswordInput.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }

    setIsResetting(true);

    try {
      const res = await fetch('/api/auth?action=reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: recoveryEmail,
          recoveryCode: recoveryCodeInput.trim().toUpperCase(),
          newPassword: newPasswordInput,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setShowForgotPassword(false);
        setIsAuthenticated(true);
        setAdminEmail(data.user?.email || recoveryEmail);
        setSecretCodeModal({ code: data.newRecoveryCode, isNewReset: true });
        setCodeCopied(false);
        setCodeSavedConfirmed(false);
        setRecoveryCodeInput('');
        setNewPasswordInput('');
        setConfirmNewPasswordInput('');
        fetchPhotos();
      } else {
        setResetError(data.error || 'Password reset failed. Please check your recovery code.');
      }
    } catch {
      setResetError('Server error while resetting password.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleServerLogout = async () => {
    try {
      await fetch('/api/auth?action=logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore
    }
    setIsAuthenticated(false);
    setLoginPassword('');
    showToast('Logged out securely.');
  };

  // Update Admin Password (Authenticated)
  const handleUpdateAdminAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingAdminAccount(true);
    setAdminAccountStatusMsg(null);

    if (!newAccountPassword || newAccountPassword.length < 6) {
      setAdminAccountStatusMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      setIsUpdatingAdminAccount(false);
      return;
    }

    try {
      const res = await fetch('/api/auth?action=update-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: currentAccountPassword,
          newPassword: newAccountPassword,
        }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setAdminAccountStatusMsg({ type: 'success', text: 'Password updated successfully!' });
        setCurrentAccountPassword('');
        setNewAccountPassword('');
        showToast('✓ Password updated successfully');
      } else {
        setAdminAccountStatusMsg({ type: 'error', text: data?.error || 'Could not update password. Please check your current password.' });
      }
    } catch {
      setAdminAccountStatusMsg({ type: 'error', text: 'Connection error. Please retry.' });
    } finally {
      setIsUpdatingAdminAccount(false);
    }
  };

  // Download recovery key as a text file
  const downloadRecoveryKey = (code: string) => {
    const content = `AURA CREATIONS - SECRET ADMIN RECOVERY KEY\n==========================================\nRecovery Code: ${code}\nAdmin Email: ${adminEmail || 'auracreations9959@gmail.com'}\nGenerated At: ${new Date().toLocaleString()}\n\nIMPORTANT INSTRUCTIONS:\n1. Keep this file in a secure location.\n2. If you ever forget your admin password, click 'Forgot Password / Recovery Key?' on the website login screen.\n3. Enter your Admin Email and this Secret Recovery Key to regain access instantly.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AURA-RECOVERY-KEY-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ Recovery key downloaded as .txt file');
  };

  // =========================================================================
  // PHOTO GALLERY HANDLERS
  // =========================================================================
  // Direct Quick Photo Upload for Service Card
  const triggerDirectPhotoUpload = (serviceId: string) => {
    setTargetServiceIdForPhoto(serviceId);
    if (directFileInputRef.current) {
      directFileInputRef.current.value = '';
      directFileInputRef.current.click();
    }
  };

  const handleDirectPhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetServiceIdForPhoto) return;
    const srvId = targetServiceIdForPhoto;
    e.target.value = '';

    setDirectUploadingId(srvId);
    try {
      const url = await uploadImageToStorage(file);
      updateService(srvId, { image: url });
      const srvName = services.find((s) => s.id === srvId)?.name || 'Service';
      showToast(`✓ Photo updated for "${srvName}"!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      alert(`Could not upload photo: ${msg}`);
    } finally {
      setDirectUploadingId(null);
      setTargetServiceIdForPhoto(null);
    }
  };

  // Add Service Handler
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name.trim()) return;

    addService({
      name: newService.name.trim(),
      category: newService.category,
      image: newService.image.trim() || '/images/services/led-boards.jpg',
      description: newService.description.trim(),
      price: newService.price.trim() || 'Custom Quote',
      features: newService.features.split(',').map((f) => f.trim()).filter(Boolean),
      tag: newService.tag.trim() || undefined,
    });

    setIsAddingService(false);
    setNewService({
      name: '',
      category: 'Signage',
      image: '/images/services/led-boards.jpg',
      description: '',
      price: 'Starting from ₹120 / sq.ft',
      features: 'High Quality, Fast Turnaround, Custom Sizes',
      tag: 'Popular',
    });
    setAddUploadProgress(null);
    setAddUploadSuccess(false);
    showToast('✓ New service/advertisement added!');
  };

  // Start Editing Service
  const handleStartEditService = (srv: ServiceItem) => {
    setEditingService(srv);
    setEditForm({
      name: srv.name,
      category: srv.category,
      image: srv.image,
      description: srv.description,
      price: srv.price || '',
      features: srv.features ? srv.features.join(', ') : '',
      tag: srv.tag || '',
    });
    setEditUploadProgress(null);
    setEditUploadError(null);
    setEditUploadSuccess(false);
  };

  // Save Edited Service
  const handleSaveEditService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editForm.name.trim()) return;

    updateService(editingService.id, {
      name: editForm.name.trim(),
      category: editForm.category,
      image: editForm.image.trim() || editingService.image,
      description: editForm.description.trim(),
      price: editForm.price.trim() || undefined,
      features: editForm.features.split(',').map((f) => f.trim()).filter(Boolean),
      tag: editForm.tag.trim() || undefined,
    });

    setEditingService(null);
    showToast('✓ Service changes saved!');
  };

  // Handle Delete Service
  const handleConfirmDeleteService = () => {
    if (!deletingService) return;
    deleteService(deletingService.id);
    const deletedName = deletingService.name;
    setDeletingService(null);
    showToast(`✓ Removed "${deletedName}" from catalogue.`);
  };

  // Business Save
  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBiz(true);
    const cleanBiz = {
      ...bizForm,
      administrator: bizForm.administrator?.trim() || 'J. Vani',
      proprietor: bizForm.proprietor?.trim() || 'Shiva',
      supportingTeamName: bizForm.supportingTeamName?.trim() || 'Supporting Team',
      proprietorRole: bizForm.proprietorRole?.trim() || 'Managing Director',
      administratorRole: bizForm.administratorRole?.trim() || 'Administrator & WhatsApp',
      supportingTeamRole: bizForm.supportingTeamRole?.trim() || 'Customer Inquiries Desk',
    };
    
    try {
      const result = await updateBusiness(cleanBiz);
      if (result && !result.success) {
        alert(`⚠️ Notice: Could not save to cloud storage (${result.error}).\nPlease ensure you are signed in to the admin panel at https://auracreationss.com`);
        showToast(`⚠️ Cloud save error: ${result.error}`);
      } else {
        setBizSavedMessage(true);
        setTimeout(() => setBizSavedMessage(false), 2500);
        showToast('✓ Business info & contacts saved to cloud across all devices!');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      showToast(`⚠️ ${msg}`);
    } finally {
      setIsSavingBiz(false);
    }
  };

  // Direct Quick Photo Upload for Portfolio Card
  const triggerDirectPortfolioPhotoUpload = (portfolioId: string) => {
    setTargetPortfolioIdForPhoto(portfolioId);
    if (directPortfolioFileInputRef.current) {
      directPortfolioFileInputRef.current.value = '';
      directPortfolioFileInputRef.current.click();
    }
  };

  const handleDirectPortfolioPhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetPortfolioIdForPhoto) return;
    const portId = targetPortfolioIdForPhoto;
    e.target.value = '';

    setDirectUploadingPortfolioId(portId);
    try {
      const url = await uploadImageToStorage(file);
      updatePortfolio(portId, { image: url });
      const itemTitle = portfolio.find((p) => p.id === portId)?.title || 'Portfolio Project';
      showToast(`✓ Photo updated for "${itemTitle}"!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      alert(`Could not upload photo: ${msg}`);
    } finally {
      setDirectUploadingPortfolioId(null);
      setTargetPortfolioIdForPhoto(null);
    }
  };

  // Start Editing Portfolio
  const handleStartEditPortfolio = (item: PortfolioItem) => {
    setEditingPortfolio(item);
    setEditPortfolioForm({
      title: item.title,
      category: item.category,
      image: item.image,
      description: item.description,
      client: item.client || '',
      tags: item.tags ? item.tags.join(', ') : '',
    });
    setEditPortfolioUploadProgress(null);
    setEditPortfolioUploadError(null);
    setEditPortfolioUploadSuccess(false);
  };

  // Save Edited Portfolio
  const handleSaveEditPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPortfolio || !editPortfolioForm.title.trim()) return;

    updatePortfolio(editingPortfolio.id, {
      title: editPortfolioForm.title.trim(),
      category: editPortfolioForm.category,
      image: editPortfolioForm.image.trim() || editingPortfolio.image,
      description: editPortfolioForm.description.trim(),
      client: editPortfolioForm.client.trim() || undefined,
      tags: editPortfolioForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setEditingPortfolio(null);
    showToast('✓ Portfolio project updated!');
  };

  // Add Portfolio Handler
  const handleCreatePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolio.title.trim()) return;

    addPortfolio({
      title: newPortfolio.title.trim(),
      category: newPortfolio.category,
      image: newPortfolio.image.trim() || '/images/portfolio/master-collage.jpg',
      description: newPortfolio.description.trim(),
      client: newPortfolio.client.trim(),
      tags: newPortfolio.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setIsAddingPortfolio(false);
    setNewPortfolio({
      title: '',
      category: 'LED & Sign Boards',
      image: '/images/portfolio/led-boards.jpg',
      description: '',
      client: '',
      tags: 'Signage, Guntur',
    });
    setAddPortfolioUploadProgress(null);
    setAddPortfolioUploadError(null);
    setAddPortfolioUploadSuccess(false);
    showToast('✓ New portfolio project added!');
  };

  // Filtered Services
  const categoriesList = ['All', 'Signage', 'Printing', 'Branding', 'Promotional', 'Outdoor'];
  const filteredServices = services.filter((srv) => {
    const matchesCategory =
      serviceCategoryFilter === 'All' || srv.category.toLowerCase() === serviceCategoryFilter.toLowerCase();
    const matchesSearch =
      srv.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      srv.description.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Hidden global inputs for direct card photo changes */}
      <input
        type="file"
        ref={directFileInputRef}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleDirectPhotoFile}
      />
      <input
        type="file"
        ref={directPortfolioFileInputRef}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleDirectPortfolioPhotoFile}
      />

      <div className="relative w-full max-w-6xl bg-[#0d081b] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#170a2c] via-[#240c38] to-[#110826] border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white font-['Montserrat',sans-serif]">
                  Aura Creations Business Admin
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-mono">
                  HttpOnly Secure Session
                </span>
                {isSyncingBlob && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-[10px] text-amber-300 font-mono animate-pulse">
                    Syncing Storage...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isAuthenticated
                  ? `Signed in as ${adminEmail || 'Administrator'} • Secure Console`
                  : 'Administrative Access Portal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleServerLogout}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-rose-300 border border-rose-500/20 hover:border-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                title="Sign out of Admin Session"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-md animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ONE-TIME SECRET RECOVERY CODE MODAL                                      */}
        {/* ========================================================================= */}
        {secretCodeModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
            <div className="bg-[#140b28] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 mx-auto">
                <Key className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
                  {secretCodeModal.isNewReset ? 'New Secret Recovery Code' : 'Important Security Step'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 font-['Montserrat',sans-serif]">
                  Save Your Secret Recovery Code
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Since no external email service is configured, this secret code is your <strong>ONLY key</strong> to reset your password if you ever forget it.
                </p>
                <p className="text-xs text-rose-400 mt-1 font-semibold">
                  ⚠️ This code is shown ONLY ONCE and will never be displayed again.
                </p>
              </div>

              {/* The Recovery Code Box */}
              <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <code className="text-lg sm:text-xl font-extrabold text-amber-300 font-mono tracking-widest select-all">
                  {secretCodeModal.code}
                </code>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(secretCodeModal.code);
                      setCodeCopied(true);
                      showToast('✓ Secret recovery code copied!');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      codeCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{codeCopied ? 'Copied!' : 'Copy Code'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadRecoveryKey(secretCodeModal.code)}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Download as text file"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Download .TXT</span>
                  </button>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-3 text-left cursor-pointer select-none bg-white/5 p-3 rounded-xl border border-white/10">
                <input
                  type="checkbox"
                  checked={codeSavedConfirmed}
                  onChange={(e) => setCodeSavedConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-fuchsia-600 focus:ring-fuchsia-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-slate-300 leading-snug">
                  I have copied and saved this recovery code in a secure location (such as a password manager or physical safe).
                </span>
              </label>

              <button
                type="button"
                disabled={!codeSavedConfirmed}
                onClick={() => setSecretCodeModal(null)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold text-sm hover:brightness-110 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Continue to Admin Dashboard →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* AUTH GATE (LOGIN / SETUP / FORGOT PASSWORD)                               */}
        {/* ========================================================================= */}
        {isCheckingAuth ? (
          <div className="p-16 flex flex-col items-center justify-center my-auto space-y-3">
            <RefreshCw className="w-8 h-8 text-fuchsia-400 animate-spin" />
            <p className="text-xs text-slate-400 font-mono">Verifying secure admin session...</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6 w-full">
            
            {/* VIEW 1: FIRST-TIME SETUP */}
            {isSetupNeeded ? (
              <div className="w-full space-y-5 animate-in fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-fuchsia-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-xl">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white font-['Montserrat',sans-serif]">
                    Initial Admin Account Setup
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Create the master administrator account for Aura Creations. A secret recovery code will be generated for emergency access.
                  </p>
                </div>

                <form onSubmit={handleServerSetup} className="space-y-3 text-left">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      required
                      value={setupEmail}
                      onChange={(e) => setSetupEmail(e.target.value)}
                      placeholder="admin@auracreations.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      New Password (min 6 characters)
                    </label>
                    <input
                      type="password"
                      required
                      value={setupPassword}
                      onChange={(e) => setSetupPassword(e.target.value)}
                      placeholder="Enter strong password"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={setupConfirmPassword}
                      onChange={(e) => setSetupConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>

                  {setupError && (
                    <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{setupError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingSetup}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold text-sm hover:brightness-110 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingSetup ? 'Provisioning Account...' : 'Create Admin Account & Generate Recovery Code'}
                  </button>
                </form>
              </div>

            // VIEW 2: FORGOT PASSWORD RECOVERY
            ) : showForgotPassword ? (
              <div className="w-full space-y-5 animate-in fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-xl">
                  <Key className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white font-['Montserrat',sans-serif]">
                    Password Recovery
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your admin email and secret recovery code to reset your password securely on the server.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-3 text-left">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="admin@auracreations.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Secret Recovery Code
                    </label>
                    <input
                      type="text"
                      required
                      value={recoveryCodeInput}
                      onChange={(e) => setRecoveryCodeInput(e.target.value)}
                      placeholder="AURA-XXXX-XXXX-XXXX"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      New Password (min 6 chars)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmNewPasswordInput}
                      onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>

                  {resetError && (
                    <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isResetting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:brightness-110 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {isResetting ? 'Verifying Code...' : 'Reset Password & Invalidate Old Code'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      ← Back to Admin Login
                    </button>
                  </div>
                </form>
              </div>

            // VIEW 3: STANDARD ADMIN LOGIN
            ) : (
              <div className="w-full space-y-5 animate-in fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-600/30 to-purple-600/30 border border-fuchsia-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-xl">
                  <Lock className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white font-['Montserrat',sans-serif]">
                    Protected Admin Login
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your administrative credentials to manage photos, advertisements, services, and studio content.
                  </p>
                </div>

                <form onSubmit={handleServerLogin} className="space-y-4 text-left">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@auracreations.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors"
                      autoFocus
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setRecoveryEmail(loginEmail);
                          setResetError('');
                        }}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Key className="w-3 h-3 text-amber-400" />
                        <span>Forgot Password / Recovery Key?</span>
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors"
                    />
                  </div>

                  {loginError && (
                    <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-fuchsia-950/60 cursor-pointer disabled:opacity-50"
                  >
                    {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setRecoveryEmail(loginEmail);
                        setResetError('');
                      }}
                      className="text-xs text-amber-400/90 hover:text-amber-300 font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>Lost your password? Reset with Secret Recovery Key</span>
                    </button>
                  </div>

                  <div className="pt-2 text-center">
                    <p className="text-[11px] text-slate-500 font-mono">
                      Protected by PBKDF2 Password Hashing & HttpOnly Session
                    </p>
                  </div>
                </form>
              </div>
            )}

          </div>
        ) : (

          // =========================================================================
          // AUTHENTICATED DASHBOARD
          // =========================================================================
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Navigation Tabs */}
            <div className="px-4 sm:px-6 pt-3 bg-[#0a0515] border-b border-purple-900/30 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('services')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'bg-[#140b28] text-white border-t-2 border-fuchsia-500 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span>Services & Ads ({services.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'portfolio'
                    ? 'bg-[#140b28] text-white border-t-2 border-fuchsia-500 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FolderKanban className="w-4 h-4 text-amber-400" />
                <span>Portfolio ({portfolio.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('business')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'business'
                    ? 'bg-[#140b28] text-white border-t-2 border-fuchsia-500 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Business Info & Contacts</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'inquiries'
                    ? 'bg-[#140b28] text-white border-t-2 border-fuchsia-500 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Enquiries ({enquiries.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'bg-[#140b28] text-white border-t-2 border-fuchsia-500 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Security & Recovery Key</span>
              </button>
            </div>

            {/* Dashboard Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

              {/* ========================================================================= */}
              {/* TAB 1: SERVICES & ADVERTISEMENTS MANAGEMENT                               */}
              {/* ========================================================================= */}
              {activeTab === 'services' && (
                <div className="space-y-6 animate-in fade-in">
                  {/* Top Bar with Add Service and Filters */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={serviceSearch}
                          onChange={(e) => setServiceSearch(e.target.value)}
                          placeholder="Search services or ads..."
                          className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 w-56"
                        />
                      </div>

                      <select
                        value={serviceCategoryFilter}
                        onChange={(e) => setServiceCategoryFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-[#140b28] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-fuchsia-500"
                      >
                        {categoriesList.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => setIsAddingService(true)}
                      className="brand-btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-fuchsia-950/40"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Service / Ad</span>
                    </button>
                  </div>

                  {/* Services Grid (All 18 Services Maintained & Editable) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredServices.map((srv) => (
                      <div
                        key={srv.id}
                        className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group"
                      >
                        <div>
                          {/* Image Thumbnail with Direct Photo Upload Overlay */}
                          <div className="relative aspect-video bg-black/40 overflow-hidden">
                            <img
                              src={srv.image}
                              alt={srv.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-fuchsia-300 border border-fuchsia-500/30">
                              {srv.category}
                            </div>
                            {srv.price && (
                              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-amber-950/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                                {srv.price}
                              </div>
                            )}

                            {/* Direct Quick Photo Upload Button */}
                            <button
                              onClick={() => triggerDirectPhotoUpload(srv.id)}
                              disabled={directUploadingId === srv.id}
                              className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-fuchsia-950/90 text-white text-[11px] font-semibold border border-white/20 hover:border-fuchsia-400 flex items-center gap-1 backdrop-blur-md transition-all cursor-pointer shadow-lg"
                              title="Upload new photo for this service"
                            >
                              <Camera className="w-3.5 h-3.5 text-fuchsia-300" />
                              <span>{directUploadingId === srv.id ? 'Uploading...' : 'Replace Photo'}</span>
                            </button>
                          </div>

                          <div className="p-4 space-y-2">
                            <h4 className="text-sm font-bold text-white font-['Montserrat',sans-serif]">
                              {srv.name}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {srv.description}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-3 bg-[#100922] border-t border-white/5 flex items-center justify-between">
                          <button
                            onClick={() => handleStartEditService(srv)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Edit Details</span>
                          </button>

                          <button
                            onClick={() => setDeletingService(srv)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: PORTFOLIO MANAGEMENT                                              */}
              {/* ========================================================================= */}
              {activeTab === 'portfolio' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white font-['Montserrat',sans-serif]">
                        Client Project Portfolio
                      </h3>
                      <p className="text-xs text-slate-400">
                        Showcase high-resolution photographs of completed client installations across Guntur.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddingPortfolio(true)}
                      className="brand-btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Portfolio Item</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {portfolio.map((item) => (
                      <div
                        key={item.id}
                        className="glass-card rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-video bg-black/40 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-amber-500/30">
                              {item.category}
                            </div>
                            {item.client && (
                              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-purple-950/80 backdrop-blur-md text-[10px] font-medium text-purple-200 border border-purple-500/30">
                                {item.client}
                              </div>
                            )}

                            {/* Direct Quick Photo Upload Button */}
                            <button
                              onClick={() => triggerDirectPortfolioPhotoUpload(item.id)}
                              disabled={directUploadingPortfolioId === item.id}
                              className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-amber-950/90 text-white text-[11px] font-semibold border border-white/20 hover:border-amber-400 flex items-center gap-1 backdrop-blur-md transition-all cursor-pointer shadow-lg"
                              title="Upload new photo for this project"
                            >
                              <Camera className="w-3.5 h-3.5 text-amber-300" />
                              <span>{directUploadingPortfolioId === item.id ? 'Uploading...' : 'Replace Photo'}</span>
                            </button>
                          </div>

                          <div className="p-4 space-y-1">
                            <h4 className="text-sm font-bold text-white font-['Montserrat',sans-serif]">{item.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                          </div>
                        </div>

                        <div className="p-3 bg-[#100922] border-t border-white/5 flex items-center justify-between">
                          <button
                            onClick={() => handleStartEditPortfolio(item)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Edit Details</span>
                          </button>

                          <button
                            onClick={() => deletePortfolio(item.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete portfolio item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: BUSINESS INFO & CONTACTS                                          */}
              {/* ========================================================================= */}
              {activeTab === 'business' && (
                <form onSubmit={handleSaveBusiness} className="space-y-6 max-w-3xl animate-in fade-in">
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-fuchsia-400">
                      Studio Details & Tagline
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Company Name</label>
                        <input
                          type="text"
                          value={bizForm.name}
                          onChange={(e) => setBizForm({ ...bizForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Brand Tagline</label>
                        <input
                          type="text"
                          value={bizForm.tagline}
                          onChange={(e) => setBizForm({ ...bizForm, tagline: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Full Studio Address</label>
                      <input
                        type="text"
                        value={bizForm.address}
                        onChange={(e) => setBizForm({ ...bizForm, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">GSTIN Number</label>
                        <input
                          type="text"
                          value={bizForm.gstin}
                          onChange={(e) => setBizForm({ ...bizForm, gstin: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Official Email</label>
                        <input
                          type="email"
                          value={bizForm.email}
                          onChange={(e) => setBizForm({ ...bizForm, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Roles, Labels, Names & Numbers */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-amber-400">
                        Studio Leadership & Phone Lines
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Customize contact person names, role labels/designations, and phone numbers shown across the website.
                      </p>
                    </div>

                    {/* Contact Line 1 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-fuchsia-300 uppercase font-mono">
                          Primary Contact Line (WhatsApp & Direct)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
                          Line 1
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Person Name</label>
                          <input
                            type="text"
                            value={bizForm.administrator || ''}
                            placeholder="e.g. J. Vani"
                            onChange={(e) => setBizForm({ ...bizForm, administrator: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Role / Designation Label</label>
                          <input
                            type="text"
                            value={bizForm.administratorRole || ''}
                            placeholder="e.g. Administrator & WhatsApp"
                            onChange={(e) => setBizForm({ ...bizForm, administratorRole: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={bizForm.phone1}
                            placeholder="e.g. +91 99597 37964"
                            onChange={(e) => setBizForm({ ...bizForm, phone1: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Line 2 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 uppercase font-mono">
                          Executive Leadership Line (Direct Call)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-[10px] font-mono text-purple-300 font-bold">
                          Line 2
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Person Name</label>
                          <input
                            type="text"
                            value={bizForm.proprietor || ''}
                            placeholder="e.g. Shiva"
                            onChange={(e) => setBizForm({ ...bizForm, proprietor: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Role / Designation Label</label>
                          <input
                            type="text"
                            value={bizForm.proprietorRole || ''}
                            placeholder="e.g. Managing Director"
                            onChange={(e) => setBizForm({ ...bizForm, proprietorRole: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={bizForm.phone2}
                            placeholder="e.g. +91 81438 88858"
                            onChange={(e) => setBizForm({ ...bizForm, phone2: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Line 3 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-300 uppercase font-mono">
                          Support Desk & Inquiries Line
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold">
                          Line 3
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Team / Desk Name</label>
                          <input
                            type="text"
                            value={bizForm.supportingTeamName || ''}
                            placeholder="e.g. Supporting Team"
                            onChange={(e) => setBizForm({ ...bizForm, supportingTeamName: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Role / Label</label>
                          <input
                            type="text"
                            value={bizForm.supportingTeamRole || ''}
                            placeholder="e.g. Customer Inquiries Desk"
                            onChange={(e) => setBizForm({ ...bizForm, supportingTeamRole: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={bizForm.phone3Display || bizForm.phone3 || ''}
                            placeholder="e.g. +91 88869 30880"
                            onChange={(e) => setBizForm({ ...bizForm, phone3Display: e.target.value, phone3: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSavingBiz}
                      className="brand-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      <Save className={`w-4 h-4 ${isSavingBiz ? 'animate-spin' : ''}`} />
                      <span>{isSavingBiz ? 'Saving to Cloud...' : 'Save Business Changes'}</span>
                    </button>
                    {bizSavedMessage && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Saved to cloud!
                      </span>
                    )}
                  </div>
                </form>
              )}

              {/* ========================================================================= */}
              {/* TAB 5: CUSTOMER ENQUIRIES                                                */}
              {/* ========================================================================= */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-white font-['Montserrat',sans-serif]">
                        Customer Inquiries Desk ({enquiries.length})
                      </h3>
                      <p className="text-xs text-slate-400">
                        View, manage, contact, or delete customer inquiries and requests.
                      </p>
                    </div>

                    {enquiries.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete ALL customer inquiries? This cannot be undone.')) {
                            clearAllEnquiries();
                            showToast('Cleared all customer inquiries.');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-100 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear All Inquiries</span>
                      </button>
                    )}
                  </div>

                  {enquiries.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl bg-white/5 text-slate-400 text-xs">
                      No customer inquiries received yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {enquiries.map((enq) => (
                        <div
                          key={enq.id}
                          className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-white/20 transition-all"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-white">{enq.name}</span>
                              <span className="text-[10px] font-mono text-slate-400">({enq.date})</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  enq.status === 'new'
                                    ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                                    : enq.status === 'contacted'
                                    ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {enq.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300">
                              Service Requested: <strong className="text-fuchsia-300">{enq.service}</strong>
                            </p>
                            <p className="text-xs text-slate-300 bg-black/30 p-2.5 rounded-lg border border-white/5 italic">
                              "{enq.message}"
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                              <a
                                href={`tel:${enq.phone.replace(/\D/g, '')}`}
                                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono transition-colors"
                              >
                                <Phone className="w-3 h-3" />
                                {enq.phone}
                              </a>
                              {enq.phone && (
                                <a
                                  href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${enq.name}, thank you for contacting Aura Creations regarding ${enq.service}.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  WhatsApp
                                </a>
                              )}
                              {enq.email && (
                                <a
                                  href={`mailto:${enq.email}`}
                                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                                >
                                  <Mail className="w-3 h-3" />
                                  {enq.email}
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            <select
                              value={enq.status}
                              onChange={(e) =>
                                updateEnquiryStatus(enq.id, e.target.value as 'new' | 'contacted' | 'resolved')
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-[#140b28] border border-white/10 text-xs text-slate-200 cursor-pointer focus:border-purple-500 focus:outline-none"
                            >
                              <option value="new">Mark New</option>
                              <option value="contacted">Mark Contacted</option>
                              <option value="resolved">Mark Resolved</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete inquiry from "${enq.name}"?`)) {
                                  deleteEnquiry(enq.id);
                                  showToast(`Deleted inquiry from ${enq.name}`);
                                }
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                              title="Delete this inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 6: SECURITY & CREDENTIALS                                             */}
              {/* ========================================================================= */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-3xl animate-in fade-in">

                  {/* 1. SECRET RECOVERY KEY STATUS */}
                  <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-amber-300">
                          Secret Recovery Key Protection
                        </h3>
                        <p className="text-xs text-slate-400">
                          Fixed cryptographic recovery credentials established during setup.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-slate-400 uppercase">Protection Status:</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          ACTIVE & PERMANENT
                        </span>
                      </div>
                      <p className="leading-relaxed text-slate-300">
                        Your unique Secret Recovery Code was issued during your initial account setup and is protected on the server with a cryptographic salt. It stays the exact same and is never regenerated on page load.
                      </p>
                      <p className="leading-relaxed text-slate-400 text-[11px]">
                        ℹ️ <strong>How to use:</strong> If you ever forget your password, click <em>"Forgot Password / Recovery Key?"</em> on the login screen, enter your admin email, your Secret Recovery Code, and choose a new password. After a successful reset, the old code is invalidated and a new code is generated only then.
                      </p>
                    </div>
                  </div>

                  {/* 2. ADMIN CREDENTIALS & PASSWORD */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-fuchsia-400">
                          Admin Password & Account
                        </h3>
                        <p className="text-xs text-slate-400">
                          Current Admin Email: <strong className="text-white font-mono">{adminEmail}</strong>
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateAdminAccount} className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            required
                            value={currentAccountPassword}
                            onChange={(e) => setCurrentAccountPassword(e.target.value)}
                            placeholder="Current password"
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1">
                            New Password (min 6 chars)
                          </label>
                          <input
                            type="password"
                            required
                            value={newAccountPassword}
                            onChange={(e) => setNewAccountPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                          />
                        </div>
                      </div>

                      {adminAccountStatusMsg && (
                        <div
                          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                            adminAccountStatusMsg.type === 'success'
                              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                              : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                          }`}
                        >
                          {adminAccountStatusMsg.type === 'success' ? (
                            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                          )}
                          <span>{adminAccountStatusMsg.text}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isUpdatingAdminAccount}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold text-xs hover:brightness-110 transition-all shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {isUpdatingAdminAccount ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  </div>

                  {/* 3. DATA BACKUP & RESTORATION */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-indigo-400">
                      Data Backup & Restoration
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={exportDataJSON}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Download className="w-4 h-4 text-emerald-400" />
                        <span>Export Full Site JSON Backup</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Reset all services and portfolio to original factory defaults?')) {
                            resetToDefaults();
                            showToast('✓ Restored factory defaults.');
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/30 text-xs font-semibold text-rose-300 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset to Factory Defaults</span>
                      </button>
                    </div>
                  </div>

                  {/* 4. SECURITY ENGINE SPECIFICATIONS */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-slate-400">
                      Security Engine Specifications
                    </h3>
                    <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                      <p>
                        • <strong>Server Authentication:</strong> PBKDF2 Password Hashing with 100,000 rounds and cryptographic salt.
                      </p>
                      <p>
                        • <strong>Session Management:</strong> Signed HMAC-SHA256 session token stored in an HttpOnly, SameSite=Lax cookie.
                      </p>
                      <p>
                        • <strong>Recovery Protocol:</strong> Salted SHA-256 one-way hashing with automatic old-key invalidation upon every reset.
                      </p>
                      <p>
                        • <strong>Hidden Access:</strong> Public admin buttons removed. Access via desktop shortcut <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/20 font-mono text-amber-300">Ctrl + Shift + A</kbd> or mobile secret URL <code className="px-1.5 py-0.5 rounded bg-black/60 font-mono text-fuchsia-300">/admin</code>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADD SERVICE MODAL                                                         */}
        {/* ========================================================================= */}
        {isAddingService && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="bg-[#140b28] border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-base font-bold text-white">Add New Service / Advertisement</h3>
                <button
                  onClick={() => setIsAddingService(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateService} className="space-y-3 text-left">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Service / Ad Title *</label>
                  <input
                    type="text"
                    required
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    placeholder="e.g. 3D Acrylic Glow Signage"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Category</label>
                    <select
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1a0e33] border border-white/10 text-xs text-white"
                    >
                      <option value="Signage">Signage</option>
                      <option value="Printing">Printing</option>
                      <option value="Branding">Branding</option>
                      <option value="Promotional">Promotional</option>
                      <option value="Outdoor">Outdoor</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Price / Pricing Text</label>
                    <input
                      type="text"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      placeholder="e.g. Starting from ₹120 / sq.ft"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Service Photo Selection / Upload */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Service Photo</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={newService.image}
                      alt="Preview"
                      className="w-16 h-12 object-cover rounded-lg border border-white/15 shrink-0 bg-black/40"
                    />
                    <div className="flex-1 space-y-1">
                      <input
                        type="file"
                        ref={addFileInputRef}
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setAddUploadProgress(20);
                          try {
                            const url = await uploadImageToStorage(file, (p) => setAddUploadProgress(p));
                            setNewService((prev) => ({ ...prev, image: url }));
                            setAddUploadSuccess(true);
                          } catch {
                            setAddUploadError('Failed to upload image');
                          } finally {
                            setAddUploadProgress(null);
                          }
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => addFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-fuchsia-400" />
                          <span>Upload from Device</span>
                        </button>
                      </div>
                      {addUploadProgress !== null && (
                        <p className="text-[10px] text-fuchsia-400 font-mono">Uploading: {addUploadProgress}%</p>
                      )}
                      {addUploadError && (
                        <p className="text-[10px] text-rose-400 font-medium">⚠️ {addUploadError}</p>
                      )}
                      {addUploadSuccess && (
                        <p className="text-[10px] text-emerald-400 font-medium">✓ Image uploaded and attached!</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder="Enter detailed description of specifications, materials, and turnaround..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingService(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="brand-btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-lg"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* EDIT SERVICE MODAL                                                        */}
        {/* ========================================================================= */}
        {editingService && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="bg-[#140b28] border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-base font-bold text-white">Edit Service: {editingService.name}</h3>
                <button
                  onClick={() => setEditingService(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditService} className="space-y-3 text-left">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Service / Ad Title *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1a0e33] border border-white/10 text-xs text-white"
                    >
                      <option value="Signage">Signage</option>
                      <option value="Printing">Printing</option>
                      <option value="Branding">Branding</option>
                      <option value="Promotional">Promotional</option>
                      <option value="Outdoor">Outdoor</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Pricing Text</label>
                    <input
                      type="text"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Photo replacement */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Service Photo</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={editForm.image || editingService.image}
                      alt="Preview"
                      className="w-16 h-12 object-cover rounded-lg border border-white/15 shrink-0 bg-black/40"
                    />
                    <div className="flex-1 space-y-1">
                      <input
                        type="file"
                        ref={editFileInputRef}
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setEditUploadProgress(20);
                          try {
                            const url = await uploadImageToStorage(file, (p) => setEditUploadProgress(p));
                            setEditForm((prev) => ({ ...prev, image: url }));
                            setEditUploadSuccess(true);
                          } catch {
                            setEditUploadError('Failed to upload image');
                          } finally {
                            setEditUploadProgress(null);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-fuchsia-400" />
                        <span>Upload New Image</span>
                      </button>
                      {editUploadProgress !== null && (
                        <p className="text-[10px] text-fuchsia-400 font-mono">Uploading: {editUploadProgress}%</p>
                      )}
                      {editUploadError && (
                        <p className="text-[10px] text-rose-400 font-medium">⚠️ {editUploadError}</p>
                      )}
                      {editUploadSuccess && (
                        <p className="text-[10px] text-emerald-400 font-medium">✓ Photo replaced!</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="brand-btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DELETE CONFIRMATION MODAL                                                 */}
        {/* ========================================================================= */}
        {deletingService && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="bg-[#140b28] border border-rose-500/40 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Service?</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Are you sure you want to remove <strong>"{deletingService.name}"</strong>? This will remove it from the catalogue and live revolution animation.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingService(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteService}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/50 cursor-pointer"
                >
                  Yes, Delete Service
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADD PORTFOLIO MODAL                                                       */}
        {/* ========================================================================= */}
        {isAddingPortfolio && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-[#140b28] border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl my-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-base font-bold text-white">Add Portfolio Project</h3>
                <button
                  onClick={() => setIsAddingPortfolio(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePortfolio} className="space-y-3 text-left">
                {/* Photo Upload for New Portfolio Item */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Project Photo *</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={newPortfolio.image || '/images/portfolio/led-boards.jpg'}
                      alt="Preview"
                      className="w-20 h-14 object-cover rounded-xl border border-white/15 shrink-0 bg-black/40"
                    />
                    <div className="flex-1 space-y-1">
                      <input
                        type="file"
                        ref={addPortfolioFileInputRef}
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setAddPortfolioUploadProgress(20);
                          setAddPortfolioUploadError(null);
                          setAddPortfolioUploadSuccess(false);
                          try {
                            const url = await uploadImageToStorage(file, (p) => setAddPortfolioUploadProgress(p));
                            setNewPortfolio((prev) => ({ ...prev, image: url }));
                            setAddPortfolioUploadSuccess(true);
                          } catch {
                            setAddPortfolioUploadError('Failed to upload image');
                          } finally {
                            setAddPortfolioUploadProgress(null);
                          }
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => addPortfolioFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white flex items-center gap-1.5 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-amber-400" />
                          <span>Upload Photo from Device</span>
                        </button>
                      </div>
                      {addPortfolioUploadProgress !== null && (
                        <p className="text-[10px] text-amber-400 font-mono">Uploading: {addPortfolioUploadProgress}%</p>
                      )}
                      {addPortfolioUploadError && (
                        <p className="text-[10px] text-rose-400 font-medium">⚠️ {addPortfolioUploadError}</p>
                      )}
                      {addPortfolioUploadSuccess && (
                        <p className="text-[10px] text-emerald-400 font-medium">✓ Photo uploaded & attached!</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={newPortfolio.title}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                    placeholder="e.g. Hotel Grand LED Signage"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Category</label>
                    <select
                      value={newPortfolio.category}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1a0e33] border border-white/10 text-xs text-white"
                    >
                      <option value="LED & Sign Boards">LED & Sign Boards</option>
                      <option value="Flex & Hoardings">Flex & Hoardings</option>
                      <option value="Printing">Printing</option>
                      <option value="Corporate Branding">Corporate Branding</option>
                      <option value="Promotional Products">Promotional Products</option>
                      <option value="Promotional & Events">Promotional & Events</option>
                      <option value="Transit Advertising">Transit Advertising</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Client Name</label>
                    <input
                      type="text"
                      value={newPortfolio.client}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, client: e.target.value })}
                      placeholder="e.g. Hotel Grand Plaza"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newPortfolio.description}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                    placeholder="Brief description of the installation..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newPortfolio.tags}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, tags: e.target.value })}
                    placeholder="e.g. LED Letters, 3D Glow Sign, Guntur"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingPortfolio(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="brand-btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-lg"
                  >
                    Add to Portfolio
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* EDIT PORTFOLIO MODAL                                                      */}
        {/* ========================================================================= */}
        {editingPortfolio && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-[#140b28] border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl my-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-base font-bold text-white">Edit Portfolio Project</h3>
                <button
                  onClick={() => setEditingPortfolio(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditPortfolio} className="space-y-3 text-left">
                {/* Photo replacement */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Project Photo</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={editPortfolioForm.image || editingPortfolio.image}
                      alt="Preview"
                      className="w-20 h-14 object-cover rounded-xl border border-white/15 shrink-0 bg-black/40"
                    />
                    <div className="flex-1 space-y-1">
                      <input
                        type="file"
                        ref={editPortfolioFileInputRef}
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setEditPortfolioUploadProgress(20);
                          setEditPortfolioUploadError(null);
                          setEditPortfolioUploadSuccess(false);
                          try {
                            const url = await uploadImageToStorage(file, (p) => setEditPortfolioUploadProgress(p));
                            setEditPortfolioForm((prev) => ({ ...prev, image: url }));
                            setEditPortfolioUploadSuccess(true);
                          } catch {
                            setEditPortfolioUploadError('Failed to upload image');
                          } finally {
                            setEditPortfolioUploadProgress(null);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => editPortfolioFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        <span>Upload New Photo</span>
                      </button>
                      {editPortfolioUploadProgress !== null && (
                        <p className="text-[10px] text-amber-400 font-mono">Uploading: {editPortfolioUploadProgress}%</p>
                      )}
                      {editPortfolioUploadError && (
                        <p className="text-[10px] text-rose-400 font-medium">⚠️ {editPortfolioUploadError}</p>
                      )}
                      {editPortfolioUploadSuccess && (
                        <p className="text-[10px] text-emerald-400 font-medium">✓ Photo replaced & attached!</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editPortfolioForm.title}
                    onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Category</label>
                    <select
                      value={editPortfolioForm.category}
                      onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1a0e33] border border-white/10 text-xs text-white"
                    >
                      <option value="LED & Sign Boards">LED & Sign Boards</option>
                      <option value="Flex & Hoardings">Flex & Hoardings</option>
                      <option value="Printing">Printing</option>
                      <option value="Corporate Branding">Corporate Branding</option>
                      <option value="Promotional Products">Promotional Products</option>
                      <option value="Promotional & Events">Promotional & Events</option>
                      <option value="Transit Advertising">Transit Advertising</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Client Name</label>
                    <input
                      type="text"
                      value={editPortfolioForm.client}
                      onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, client: e.target.value })}
                      placeholder="e.g. Hotel Grand Plaza"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editPortfolioForm.description}
                    onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editPortfolioForm.tags}
                    onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, tags: e.target.value })}
                    placeholder="e.g. LED Letters, 3D Glow Sign, Guntur"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPortfolio(null)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="brand-btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
