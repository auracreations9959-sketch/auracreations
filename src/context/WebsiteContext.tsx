import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import defaultBusiness from '../content/business.json';
import defaultServices from '../content/services.json';
import defaultPortfolio from '../content/portfolio.json';

export interface BusinessInfo {
  name: string;
  tagline: string;
  category: string;
  businessType: string;
  proprietor: string;
  proprietorRole?: string;
  phone1: string;
  phone1Raw: string;
  administrator?: string;
  administratorRole?: string;
  phone2: string;
  phone2Raw: string;
  phone3?: string;
  phone3Display?: string;
  phone3Raw?: string;
  supportingTeamName?: string;
  supportingTeamRole?: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  address: string;
  gstin: string;
  heroHeadline: string;
  heroSubheadline: string;
  location: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  features: string[];
  price?: string;
  tag?: string;
  active?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  client?: string;
  tags?: string[];
}

export interface EnquiryItem {
  id: string;
  date: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
}

export interface PhotoRecord {
  id: string;
  url: string;
  name: string;
  size?: number;
  contentType?: string;
  createdAt: string;
}

interface WebsiteContextType {
  business: BusinessInfo;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  enquiries: EnquiryItem[];
  photos: PhotoRecord[];
  isSyncingBlob: boolean;
  blobSyncStatus: string | null;
  updateBusiness: (info: Partial<BusinessInfo>) => Promise<{ success: boolean; error?: string }>;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  deleteService: (id: string) => void;
  updatePortfolio: (id: string, updated: Partial<PortfolioItem>) => void;
  addPortfolio: (item: Omit<PortfolioItem, 'id'>) => void;
  deletePortfolio: (id: string) => void;
  addEnquiry: (enquiry: Omit<EnquiryItem, 'id' | 'date' | 'status'>) => void;
  updateEnquiryStatus: (id: string, status: 'new' | 'contacted' | 'resolved') => void;
  deleteEnquiry: (id: string) => void;
  clearAllEnquiries: () => void;
  fetchEnquiries: () => Promise<EnquiryItem[]>;
  uploadImageToStorage: (file: File, onProgress?: (pct: number) => void) => Promise<string>;
  uploadMultipleImages: (files: File[], onProgress?: (pct: number, currentName: string) => void) => Promise<string[]>;
  fetchPhotos: () => Promise<PhotoRecord[]>;
  deletePhotoFromStorage: (url: string) => Promise<boolean>;
  resetToDefaults: () => void;
  exportDataJSON: () => void;
}

const STORAGE_KEY_BIZ = 'aura_business_info_v3';
const STORAGE_KEY_SRV = 'aura_services_v2';
const STORAGE_KEY_PORT = 'aura_portfolio_v2';
const STORAGE_KEY_ENQ = 'aura_enquiries_v2';

// Automatic client-side image compression: converts any phone/camera photo (up to 25MB) into a crisp ~100KB WebP
export const compressImageFile = async (file: File): Promise<{ dataUrl: string; blob: Blob }> => {
  return new Promise((resolve, reject) => {
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|jfif|bmp|gif|avif)$/i.test(file.name);
    if (!isImage && file.type !== '') {
      reject(new Error('Please select a valid photo file (JPG, PNG, WebP, etc.).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image from device.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => {
        // Fallback: create blob from raw reader result
        fetch(reader.result as string)
          .then(res => res.blob())
          .then(blob => resolve({ dataUrl: reader.result as string, blob }))
          .catch(() => resolve({ dataUrl: reader.result as string, blob: file }));
      };
      img.onload = () => {
        try {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ dataUrl: reader.result as string, blob: file });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Try webp first, fallback to jpeg
          let dataUrl = canvas.toDataURL('image/webp', 0.85);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          }

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({ dataUrl, blob });
              } else {
                resolve({ dataUrl, blob: file });
              }
            },
            'image/webp',
            0.85
          );
        } catch {
          resolve({ dataUrl: reader.result as string, blob: file });
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export const WebsiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<BusinessInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BIZ);
      return saved ? { ...defaultBusiness, ...JSON.parse(saved) } : (defaultBusiness as BusinessInfo);
    } catch {
      return defaultBusiness as BusinessInfo;
    }
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SRV);
      return saved ? JSON.parse(saved) : (defaultServices as ServiceItem[]);
    } catch {
      return defaultServices as ServiceItem[];
    }
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PORT);
      return saved ? JSON.parse(saved) : (defaultPortfolio as PortfolioItem[]);
    } catch {
      return defaultPortfolio as PortfolioItem[];
    }
  });

  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ENQ);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'enq-initial-1',
          date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
          name: 'Venkata Rao',
          phone: '+91 98480 12345',
          email: 'venkat@example.com',
          service: 'LED Boards',
          message: 'Need 3D LED channel letter board for new supermarket in Arundelpet, Guntur.',
          status: 'new'
        }
      ];
    } catch {
      return [];
    }
  });

  const [isSyncingBlob, setIsSyncingBlob] = useState(false);
  const [blobSyncStatus, setBlobSyncStatus] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);

  // Fetch photos from API
  const fetchPhotos = useCallback(async (): Promise<PhotoRecord[]> => {
    try {
      const res = await fetch('/api/photos', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.photos)) {
          setPhotos(data.photos);
          return data.photos;
        }
      }
    } catch {
      // Local or offline fallback
    }
    return [];
  }, []);

  // Fetch enquiries from persistent Vercel Blob API (Admin session required)
  const fetchEnquiries = useCallback(async (): Promise<EnquiryItem[]> => {
    try {
      const res = await fetch(`/api/enquiries?t=${Date.now()}`, {
        credentials: 'include',
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.enquiries)) {
          setEnquiries(data.enquiries);
          try {
            localStorage.setItem(STORAGE_KEY_ENQ, JSON.stringify(data.enquiries));
          } catch {}
          return data.enquiries;
        }
      }
    } catch {
      // Local fallback
    }
    return [];
  }, []);

  // Fetch initial photos on mount
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Sync with persistent Vercel Blob on startup if deployed
  useEffect(() => {
    const fetchBlobData = async () => {
      try {
        const res = await fetch(`/api/services?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.services && Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services);
            try {
              localStorage.setItem(STORAGE_KEY_SRV, JSON.stringify(data.services));
            } catch {
              // Ignore storage limit
            }
            setBlobSyncStatus('Connected to Vercel Blob persistent manifest');
          }
        }
      } catch {
        // Running locally or offline
      }

      try {
        const portRes = await fetch(`/api/portfolio?t=${Date.now()}`, { cache: 'no-store' });
        if (portRes.ok) {
          const portData = await portRes.json();
          if (portData && portData.portfolio && Array.isArray(portData.portfolio) && portData.portfolio.length > 0) {
            setPortfolio(portData.portfolio);
            try {
              localStorage.setItem(STORAGE_KEY_PORT, JSON.stringify(portData.portfolio));
            } catch {
              // Ignore storage limit
            }
          }
        }
      } catch {
        // Running locally or offline
      }

      try {
        const bizRes = await fetch(`/api/business?t=${Date.now()}`, { cache: 'no-store' });
        if (bizRes.ok) {
          const bizData = await bizRes.json();
          if (bizData && bizData.business && (bizData.business.name || bizData.business.proprietorRole)) {
            const cleanBiz = { ...bizData.business };
            if (!cleanBiz.administrator?.trim()) cleanBiz.administrator = 'J. Vani';
            if (!cleanBiz.proprietor?.trim()) cleanBiz.proprietor = 'Shiva';
            if (!cleanBiz.supportingTeamName?.trim()) cleanBiz.supportingTeamName = 'Supporting Team';
            setBusiness((prev) => ({ ...prev, ...cleanBiz }));
            try {
              localStorage.setItem(STORAGE_KEY_BIZ, JSON.stringify(cleanBiz));
            } catch {
              // Ignore storage limit
            }
          }
        }
      } catch {
        // Running locally or offline
      }
    };
    fetchBlobData();
  }, []);

  // Save to localStorage safely (guarded against storage quota)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BIZ, JSON.stringify(business));
    } catch {
      // quota safeguard
    }
  }, [business]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SRV, JSON.stringify(services));
    } catch {
      // quota safeguard
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PORT, JSON.stringify(portfolio));
    } catch {
      // quota safeguard
    }
  }, [portfolio]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ENQ, JSON.stringify(enquiries));
    } catch {
      // quota safeguard
    }
  }, [enquiries]);

  // Synchronize changes to Vercel Blob persistent manifest
  const syncServicesToVercelBlob = useCallback(async (newServices: ServiceItem[]) => {
    try {
      setIsSyncingBlob(true);
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newServices),
      });
      if (res.ok) {
        setBlobSyncStatus('Successfully synced to Vercel Blob');
      }
    } catch {
      // Local fallback active
    } finally {
      setIsSyncingBlob(false);
    }
  }, []);

  const syncPortfolioToVercelBlob = useCallback(async (newPortfolio: PortfolioItem[]) => {
    try {
      setIsSyncingBlob(true);
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newPortfolio),
      });
      if (res.ok) {
        setBlobSyncStatus('Successfully synced portfolio to Vercel Blob');
      }
    } catch {
      // Local fallback active
    } finally {
      setIsSyncingBlob(false);
    }
  }, []);

  const syncBusinessToVercelBlob = useCallback(async (newBiz: BusinessInfo): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsSyncingBlob(true);
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newBiz),
      });
      if (res.ok) {
        setBlobSyncStatus('Successfully synced business info to Vercel Blob');
        return { success: true };
      }
      const data = await res.json().catch(() => ({}));
      const errMsg = data.error || `HTTP ${res.status}`;
      return { success: false, error: errMsg };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      return { success: false, error: msg };
    } finally {
      setIsSyncingBlob(false);
    }
  }, []);

  // Bulletproof Image Upload Handler:
  // 1. Compresses & resizes on client (handles ANY image file up to 25MB)
  // 2. Uploads to Vercel Blob API if connected with HttpOnly credentials
  // 3. Fallback to lightweight DataURL (~80-150KB) so preview and persistence work immediately everywhere
  const uploadImageToStorage = async (file: File, onProgress?: (pct: number) => void): Promise<string> => {
    onProgress?.(20);

    // 1. Automatic client-side compression (optimizes camera photos to lightweight WebP)
    const { dataUrl, blob } = await compressImageFile(file);
    onProgress?.(50);

    // 2. Upload to Vercel Blob persistent API endpoint
    const cleanFilename = (file.name || `service-${Date.now()}.webp`).replace(/[^a-zA-Z0-9._-]/g, '_');

    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(cleanFilename)}`, {
        method: 'POST',
        headers: { 'Content-Type': blob.type || 'image/webp' },
        credentials: 'include',
        body: blob,
      });

      onProgress?.(85);

      if (res.ok) {
        const data = await res.json();
        if (data && data.url) {
          onProgress?.(100);
          return data.url;
        }
        throw new Error('Upload server did not return image URL.');
      }

      // Parse server error (e.g., unauthorized or blob token missing)
      const errJson = await res.json().catch(() => ({}));
      const errorMsg = errJson.error || `Upload failed with status ${res.status}`;

      const isLocalHost = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      if (isLocalHost && res.status === 500) {
        console.warn('Local dev mode without Vercel Blob token: using compressed data URL fallback.');
        onProgress?.(100);
        return dataUrl;
      }

      throw new Error(errorMsg);
    } catch (err: unknown) {
      onProgress?.(100);
      const isLocalHost = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      if (isLocalHost && !(err instanceof Error && err.message.includes('Unauthorized'))) {
        console.warn('Local offline fallback active:', err);
        return dataUrl;
      }
      throw err;
    }
  };

  // Multiple Image Upload Handler (Bulk Photo Upload)
  const uploadMultipleImages = async (
    files: File[],
    onProgress?: (pct: number, currentName: string) => void
  ): Promise<string[]> => {
    const urls: string[] = [];
    const total = files.length;
    if (total === 0) return urls;

    for (let i = 0; i < total; i++) {
      const file = files[i];
      const startPct = Math.round((i / total) * 100);
      onProgress?.(startPct, file.name);

      try {
        const url = await uploadImageToStorage(file, (singlePct) => {
          const overallPct = Math.round(((i + singlePct / 100) / total) * 100);
          onProgress?.(overallPct, file.name);
        });
        urls.push(url);
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
      }
    }

    onProgress?.(100, 'Complete');
    await fetchPhotos();
    return urls;
  };

  // Delete photo from storage and manifest
  const deletePhotoFromStorage = async (url: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/photos?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.url !== url));
        return true;
      }
    } catch {
      // Fallback
    }
    setPhotos(prev => prev.filter(p => p.url !== url));
    return true;
  };

  const updateBusiness = async (info: Partial<BusinessInfo>): Promise<{ success: boolean; error?: string }> => {
    let updatedObj: BusinessInfo = business;
    setBusiness(prev => {
      const updated = { ...prev, ...info };
      if (info.phone1) updated.phone1Raw = info.phone1.replace(/\D/g, '');
      if (info.phone2) updated.phone2Raw = info.phone2.replace(/\D/g, '');
      if (info.phone3 || info.phone3Display) {
        const p3 = info.phone3 || info.phone3Display || '';
        updated.phone3Raw = p3.replace(/\D/g, '');
      }
      updatedObj = updated;
      return updated;
    });
    return await syncBusinessToVercelBlob(updatedObj);
  };

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    setServices(prev => {
      const next = prev.map(s => (s.id === id ? { ...s, ...updated } : s));
      syncServicesToVercelBlob(next);
      return next;
    });
  };

  const addService = (item: Omit<ServiceItem, 'id'>) => {
    const id = 'srv-' + Date.now();
    setServices(prev => {
      const next = [{ id, ...item }, ...prev];
      syncServicesToVercelBlob(next);
      return next;
    });
  };

  const deleteService = (id: string) => {
    setServices(prev => {
      const next = prev.filter(s => s.id !== id);
      syncServicesToVercelBlob(next);
      return next;
    });
  };

  const updatePortfolio = (id: string, updated: Partial<PortfolioItem>) => {
    setPortfolio(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...updated } : p));
      syncPortfolioToVercelBlob(next);
      return next;
    });
  };

  const addPortfolio = (item: Omit<PortfolioItem, 'id'>) => {
    const id = 'port-' + Date.now();
    setPortfolio(prev => {
      const next = [{ id, ...item }, ...prev];
      syncPortfolioToVercelBlob(next);
      return next;
    });
  };

  const deletePortfolio = (id: string) => {
    setPortfolio(prev => {
      const next = prev.filter(p => p.id !== id);
      syncPortfolioToVercelBlob(next);
      return next;
    });
  };

  const addEnquiry = (enquiry: Omit<EnquiryItem, 'id' | 'date' | 'status'>) => {
    const newEnq: EnquiryItem = {
      ...enquiry,
      id: 'enq-' + Date.now(),
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'new'
    };
    setEnquiries(prev => [newEnq, ...prev]);

    // Asynchronously synchronize with persistent Vercel Blob cloud storage
    fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry),
    }).catch(() => {});
  };

  const updateEnquiryStatus = (id: string, status: 'new' | 'contacted' | 'resolved') => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    fetch('/api/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, status }),
    }).catch(() => {});
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
    fetch('/api/enquiries', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

  const clearAllEnquiries = () => {
    setEnquiries([]);
  };

  const resetToDefaults = () => {
    setBusiness(defaultBusiness as BusinessInfo);
    setServices(defaultServices as ServiceItem[]);
    setPortfolio(defaultPortfolio as PortfolioItem[]);
    localStorage.removeItem(STORAGE_KEY_BIZ);
    localStorage.removeItem(STORAGE_KEY_SRV);
    localStorage.removeItem(STORAGE_KEY_PORT);
  };

  const exportDataJSON = () => {
    const data = {
      business,
      services,
      portfolio,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-creations-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <WebsiteContext.Provider
      value={{
        business,
        services,
        portfolio,
        enquiries,
        isSyncingBlob,
        blobSyncStatus,
        updateBusiness,
        updateService,
        addService,
        deleteService,
        updatePortfolio,
        addPortfolio,
        deletePortfolio,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        clearAllEnquiries,
        fetchEnquiries,
        photos,
        fetchPhotos,
        uploadImageToStorage,
        uploadMultipleImages,
        deletePhotoFromStorage,
        resetToDefaults,
        exportDataJSON
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
};
