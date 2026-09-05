import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  FarmerProfile,
  FieldPlot,
  CropDiagnosis,
  MandiPrice,
  FarmingTask,
  NotificationItem,
  LanguageCode,
  SoilCard,
  AgriProduct,
  OrderItem,
} from '../types';
import {
  initialFarmerProfile,
  initialFields,
  initialMandiPrices,
  initialTasks,
  initialNotifications,
  sampleSoilCard,
} from '../data/mockData';
import { initialAgriProducts } from '../data/agriProducts';
import { translations, TranslationDictionary } from '../data/translations';

export type ActiveTab =
  | 'dashboard'
  | 'myFields'
  | 'cropDoctor'
  | 'weather'
  | 'cropHealth'
  | 'mandiPrices'
  | 'soilHealth'
  | 'calendar'
  | 'schemes'
  | 'expertHelp'
  | 'orderForm';

interface FarmContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  farmer: FarmerProfile;
  updateFarmerProfile: (profile: Partial<FarmerProfile>) => void;
  updateFarmer: (profile: Partial<FarmerProfile>) => void;
  fields: FieldPlot[];
  selectedField: FieldPlot | null;
  setSelectedFieldId: (id: string | null) => void;
  addField: (field: Omit<FieldPlot, 'id'>) => void;
  updateField: (id: string, updates: Partial<FieldPlot>) => void;
  deleteField: (id: string) => void;
  diagnoses: CropDiagnosis[];
  addDiagnosis: (diagnosis: CropDiagnosis) => void;
  mandiPrices: MandiPrice[];
  tasks: FarmingTask[];
  toggleTaskCompletion: (taskId: string) => void;
  addTask: (task: Omit<FarmingTask, 'id' | 'completed'>) => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  isVoiceAssistantOpen: boolean;
  setIsVoiceAssistantOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  triggerConfetti: () => void;
  soilCard: SoilCard;
  updateSoilCard: (card: Partial<SoilCard>) => void;
  // Shopping Cart & Order Checkout
  cartItems: OrderItem[];
  addToCart: (product: AgriProduct, qty?: number) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Language
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('km_language');
    return (saved as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('km_language', lang);
  };

  const t = translations[language] || translations.en;

  // Farmer profile
  const [farmer, setFarmer] = useState<FarmerProfile>(() => {
    try {
      const saved = localStorage.getItem('km_farmer_profile');
      return saved ? JSON.parse(saved) : initialFarmerProfile;
    } catch {
      return initialFarmerProfile;
    }
  });

  useEffect(() => {
    localStorage.setItem('km_farmer_profile', JSON.stringify(farmer));
  }, [farmer]);

  const updateFarmerProfile = (updates: Partial<FarmerProfile>) => {
    setFarmer(prev => ({ ...prev, ...updates }));
  };

  // Fields / Plots
  const [fields, setFields] = useState<FieldPlot[]>(() => {
    try {
      const saved = localStorage.getItem('km_fields');
      return saved ? JSON.parse(saved) : initialFields;
    } catch {
      return initialFields;
    }
  });

  useEffect(() => {
    localStorage.setItem('km_fields', JSON.stringify(fields));
  }, [fields]);

  const [selectedFieldId, setSelectedFieldIdState] = useState<string | null>(fields[0]?.id || null);

  const selectedField = fields.find(f => f.id === selectedFieldId) || fields[0] || null;

  const setSelectedFieldId = (id: string | null) => {
    setSelectedFieldIdState(id);
  };

  const addField = (newFieldData: Omit<FieldPlot, 'id'>) => {
    const newField: FieldPlot = {
      ...newFieldData,
      id: `field-${Date.now()}`,
    };
    setFields(prev => [...prev, newField]);
    setSelectedFieldIdState(newField.id);
    triggerConfetti();
  };

  const updateField = (id: string, updates: Partial<FieldPlot>) => {
    setFields(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    if (selectedFieldId === id) {
      const remaining = fields.filter(f => f.id !== id);
      setSelectedFieldIdState(remaining[0]?.id || null);
    }
  };

  // Crop Diagnoses history
  const [diagnoses, setDiagnoses] = useState<CropDiagnosis[]>(() => {
    try {
      const saved = localStorage.getItem('km_diagnoses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addDiagnosis = (diag: CropDiagnosis) => {
    setDiagnoses(prev => [diag, ...prev]);
    localStorage.setItem('km_diagnoses', JSON.stringify([diag, ...diagnoses]));
  };

  // Tasks
  const [tasks, setTasks] = useState<FarmingTask[]>(() => {
    try {
      const saved = localStorage.getItem('km_tasks');
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  useEffect(() => {
    localStorage.setItem('km_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            triggerConfetti();
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const addTask = (taskData: Omit<FarmingTask, 'id' | 'completed'>) => {
    const newTask: FarmingTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  // Mandi Prices
  const [mandiPrices] = useState<MandiPrice[]>(initialMandiPrices);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Soil Card
  const [soilCard, setSoilCard] = useState<SoilCard>(() => {
    try {
      const saved = localStorage.getItem('km_soil_card');
      return saved ? JSON.parse(saved) : sampleSoilCard;
    } catch {
      return sampleSoilCard;
    }
  });

  const updateSoilCard = (updates: Partial<SoilCard>) => {
    setSoilCard(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('km_soil_card', JSON.stringify(updated));
      return updated;
    });
  };

  // Modals
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Shopping Cart & Order Checkout
  const [cartItems, setCartItems] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('km_cart_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        productId: 'prod-seed-wheat-hd2967',
        name: 'HD-2967 Certified Wheat Seeds',
        category: 'Seeds',
        quantity: 2,
        price: 1450,
        unit: '40 kg Bag',
        total: 2900,
      },
      {
        productId: 'prod-fert-azotobacter',
        name: 'Liquid Azotobacter Bio-Fertilizer',
        category: 'Fertilizers',
        quantity: 1,
        price: 380,
        unit: '1 Liter Bottle',
        total: 380,
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('km_cart_items', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const addToCart = (product: AgriProduct, qty: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + qty,
                total: (item.quantity + qty) * item.price,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          quantity: qty,
          price: product.pricePerUnit,
          unit: product.unit,
          total: qty * product.pricePerUnit,
        },
      ];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              total: newQty * item.price,
            };
          }
          return item;
        })
        .filter(Boolean) as OrderItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#16a34a', '#eab308', '#0284c7', '#f97316'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <FarmContext.Provider
      value={{
        activeTab,
        setActiveTab,
        farmer,
        updateFarmerProfile,
        updateFarmer: updateFarmerProfile,
        fields,
        selectedField,
        setSelectedFieldId,
        addField,
        updateField,
        deleteField,
        diagnoses,
        addDiagnosis,
        mandiPrices,
        tasks,
        toggleTaskCompletion,
        addTask,
        notifications,
        markNotificationAsRead,
        markAllNotificationsRead,
        language,
        setLanguage,
        t,
        isVoiceAssistantOpen,
        setIsVoiceAssistantOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        triggerConfetti,
        soilCard,
        updateSoilCard,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
