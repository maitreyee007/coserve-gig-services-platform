import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ADMIN_EMAIL, auth, db } from '../config/firebase';
import { WORKERS } from '../data/mockData';

export interface WorkerRecord {
  id: string;
  name: string;
  avatar: string;
  service: string;
  skills: string[];
  certifications: string[];
  experience: number;
  rating: number;
  reviews: number;
  completedJobs: number;
  matchScore: number;
  availability: string;
  availableNow: boolean;
  city: string;
  area: string;
  distance: number;
  cooperative: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  accountStatus: 'active' | 'suspended';
  priceMin: number;
  priceMax: number;
  priceLabel: string;
  priceTier: 'affordable' | 'standard' | 'premium';
  servicePricing: { service: string; min: number; max: number }[];
  eta: string;
  bio: string;
  phone: string;
  email: string;
  aadhaarMasked: string;
  address?: string;
  cancellationRate: number;
  createdAt: string;
}

export interface WorkerLoadState {
  error: string | null;
}

const DEMO_WORKERS: WorkerRecord[] = WORKERS.map(worker => ({
  ...worker,
  id: String(worker.id),
  accountStatus: 'active',
  phone: '+91 98765 43210',
  email: `${worker.name.toLowerCase().replace(/\s+/g, '.')}@coserve.demo`,
  aadhaarMasked: 'XXXX XXXX XXXX',
  address: `${worker.area}, ${worker.city}`,
  createdAt: '2026-01-15T00:00:00.000Z',
})) as WorkerRecord[];

DEMO_WORKERS.push(
  {
    id: 'demo-gardener', name: 'Karthik Raj', avatar: 'KR', service: 'Gardener',
    skills: ['Lawn Care', 'Plant Care', 'Pruning'], certifications: ['Urban Gardening Certificate'],
    experience: 6, rating: 4.8, reviews: 39, completedJobs: 67, matchScore: 82,
    availability: 'Available Today', availableNow: true, city: 'Chennai', area: 'Adyar', distance: 2.9,
    cooperative: 'South Chennai Home Services Cooperative', verificationStatus: 'verified', accountStatus: 'active',
    priceMin: 300, priceMax: 400, priceLabel: '₹300–₹400', priceTier: 'affordable',
    servicePricing: [{ service: 'Gardening', min: 300, max: 400 }], eta: '10–15 min',
    bio: 'Reliable gardener helping Chennai homes keep their plants and outdoor spaces healthy.',
    phone: '+91 98765 43210', email: 'karthik.raj@coserve.demo', aadhaarMasked: 'XXXX XXXX XXXX',
    address: 'Adyar, Chennai', cancellationRate: 2, createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'demo-security', name: 'Naveen Kumar', avatar: 'NK', service: 'Security Systems',
    skills: ['CCTV Installation', 'Alarm Setup', 'Access Control'], certifications: ['CCTV Technician Certificate'],
    experience: 8, rating: 4.7, reviews: 31, completedJobs: 54, matchScore: 78,
    availability: 'Available Tomorrow', availableNow: false, city: 'Chennai', area: 'Velachery', distance: 4.6,
    cooperative: 'South Chennai Home Services Cooperative', verificationStatus: 'verified', accountStatus: 'active',
    priceMin: 800, priceMax: 1040, priceLabel: '₹800–₹1,040', priceTier: 'premium',
    servicePricing: [{ service: 'Security Systems', min: 800, max: 1040 }], eta: '25–35 min',
    bio: 'Certified security systems technician for dependable CCTV and access control installations.',
    phone: '+91 98765 43210', email: 'naveen.kumar@coserve.demo', aadhaarMasked: 'XXXX XXXX XXXX',
    address: 'Velachery, Chennai', cancellationRate: 1, createdAt: '2026-01-15T00:00:00.000Z',
  },
);

interface WorkerCtx {
  workers: WorkerRecord[];
  error: string | null;
  addWorker: (data: NewWorkerPayload) => Promise<WorkerRecord>;
  updateWorker: (id: string, updates: Partial<WorkerRecord>) => Promise<void>;
  verifyWorker: (id: string) => Promise<void>;
  rejectWorker: (id: string) => Promise<void>;
  suspendWorker: (id: string) => Promise<void>;
  activateWorker: (id: string) => Promise<void>;
  getWorker: (id: string) => WorkerRecord | undefined;
}

export interface NewWorkerPayload {
  name: string;
  phone: string;
  email: string;
  aadhaarNumber: string; // will be masked on store
  address: string;
  city: string;
  area: string;
  service: string;
  skills: string[];
  experience: number;
  priceMin: number;
  bio: string;
  availability: string;
}

function deriveAvatar(name: string): string {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function maskAadhaar(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.length >= 4 ? 'XXXX XXXX ' + digits.slice(-4) : 'XXXX XXXX';
}

function deriveTier(priceMin: number): 'affordable' | 'standard' | 'premium' {
  if (priceMin < 400) return 'affordable';
  if (priceMin < 600) return 'standard';
  return 'premium';
}

const Ctx = createContext<WorkerCtx>({
  workers: [],
  error: null,
  addWorker: async () => ({ id: '' } as WorkerRecord),
  updateWorker: async () => {},
  verifyWorker: async () => {},
  rejectWorker: async () => {},
  suspendWorker: async () => {},
  activateWorker: async () => {},
  getWorker: () => undefined,
});

export function WorkerProvider({ children }: { children: ReactNode }) {
  const [workers, setWorkers] = useState<WorkerRecord[]>(DEMO_WORKERS);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let firestoreWorkers = new Map<string, WorkerRecord>();
    let stopWorkers: (() => void) | undefined;
    let stopOwnWorker: (() => void) | undefined;

    const updateWorkers = () => {
      const liveWorkers = [...firestoreWorkers.values()];
      const liveIds = new Set(liveWorkers.map(worker => worker.id));
      setWorkers([...DEMO_WORKERS.filter(worker => !liveIds.has(worker.id)), ...liveWorkers]);
    };

    const stopListening = () => {
      stopWorkers?.();
      stopOwnWorker?.();
      stopWorkers = undefined;
      stopOwnWorker = undefined;
      firestoreWorkers = new Map();
    };

    const unsubscribeAuth = onAuthStateChanged(auth, firebaseUser => {
      stopListening();
      const isAdmin = firebaseUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const workersQuery = isAdmin
        ? collection(db, 'workers')
        : query(collection(db, 'workers'), where('verificationStatus', '==', 'verified'), where('accountStatus', '==', 'active'));

      stopWorkers = onSnapshot(workersQuery, snapshot => {
        snapshot.docs.forEach(workerDoc => firestoreWorkers.set(workerDoc.id, { id: workerDoc.id, ...workerDoc.data() } as WorkerRecord));
        updateWorkers();
        setError(null);
      }, () => setError('Live worker data is unavailable. Showing demo worker profiles.'));

      if (firebaseUser && !isAdmin) {
        stopOwnWorker = onSnapshot(doc(db, 'workers', firebaseUser.uid), snapshot => {
          if (snapshot.exists()) firestoreWorkers.set(snapshot.id, { id: snapshot.id, ...snapshot.data() } as WorkerRecord);
          updateWorkers();
        });
      }
    });

    return () => {
      unsubscribeAuth();
      stopListening();
    };
  }, []);

  const addWorker = async (data: NewWorkerPayload): Promise<WorkerRecord> => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('Please sign in again to finish worker registration.');
    const workerId = firebaseUser.uid;
    const priceMax = data.priceMin + Math.round(data.priceMin * 0.3);
    const newWorker: WorkerRecord = {
      id: workerId,
      name: data.name,
      avatar: deriveAvatar(data.name),
      service: data.service,
      skills: data.skills,
      certifications: [],
      experience: data.experience,
      rating: 0,
      reviews: 0,
      completedJobs: 0,
      matchScore: 75,
      availability: data.availability,
      availableNow: data.availability === 'Available Now',
      city: data.city,
      area: data.area,
      distance: 2.5,
      cooperative: 'Independent Worker',
      verificationStatus: 'pending',
      accountStatus: 'active',
      priceMin: data.priceMin,
      priceMax,
      priceLabel: `₹${data.priceMin}–₹${priceMax}`,
      priceTier: deriveTier(data.priceMin),
      servicePricing: [{ service: data.service, min: data.priceMin, max: priceMax }],
      eta: '15–25 min',
      bio: data.bio,
      phone: data.phone,
      email: data.email,
      aadhaarMasked: maskAadhaar(data.aadhaarNumber),
      cancellationRate: 0,
      createdAt: new Date().toISOString(),
    };
    await Promise.all([
      setDoc(doc(db, 'workers', workerId), { ...newWorker, uid: workerId, createdAt: serverTimestamp() }),
      setDoc(doc(db, 'workerPrivate', workerId), { uid: workerId, aadhaarNumber: data.aadhaarNumber, aadhaarMasked: newWorker.aadhaarMasked, address: data.address, createdAt: serverTimestamp() }),
    ]);
    return newWorker;
  };

  const updateWorker = async (id: string, updates: Partial<WorkerRecord>) => {
    const priceMax = updates.priceMin === undefined ? undefined : updates.priceMax ?? updates.priceMin + Math.round(updates.priceMin * 0.3);
    const nextUpdates = {
      ...updates,
      ...(priceMax === undefined ? {} : { priceMax, priceLabel: `₹${updates.priceMin}–₹${priceMax}`, priceTier: deriveTier(updates.priceMin) }),
      ...(updates.name === undefined ? {} : { avatar: deriveAvatar(updates.name) }),
    };
    setWorkers(current => current.map(worker => worker.id === id ? { ...worker, ...nextUpdates } as WorkerRecord : worker));
    try {
      await updateDoc(doc(db, 'workers', id), nextUpdates);
    } catch (error) {
      setWorkers(current => current.map(worker => worker.id === id ? { ...worker, ...(updates.verificationStatus ? { verificationStatus: 'pending' } : {}) } as WorkerRecord : worker));
      throw error;
    }
  };

  const setVerification = (id: string, verificationStatus: WorkerRecord['verificationStatus']) => updateWorker(id, { verificationStatus });
  const verifyWorker = (id: string) => setVerification(id, 'verified');

  const rejectWorker = (id: string) => setVerification(id, 'rejected');

  const suspendWorker = (id: string) => updateWorker(id, { accountStatus: 'suspended' });

  const activateWorker = (id: string) => updateWorker(id, { accountStatus: 'active' });

  const getWorker = (id: string) => workers.find(w => w.id === id);

  return (
    <Ctx.Provider value={{ workers, error, addWorker, updateWorker, verifyWorker, rejectWorker, suspendWorker, activateWorker, getWorker }}>
      {children}
    </Ctx.Provider>
  );
}

export const useWorkers = () => useContext(Ctx);
