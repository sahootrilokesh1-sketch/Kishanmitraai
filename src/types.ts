export type LanguageCode = 'en' | 'hi' | 'mr' | 'pa' | 'te' | 'ta' | 'bn' | 'gu';

export interface FarmerProfile {
  name: string;
  phone: string;
  mobile?: string;
  state: string;
  district: string;
  village: string;
  totalLandAcres: number;
  primaryCrops: string[];
  soilType: string;
  irrigationSource: string;
  language: LanguageCode;
  kisanCreditCardNo?: string;
}

export interface FieldPlot {
  id: string;
  name: string;
  sizeAcres: number;
  currentCrop: string;
  variety: string;
  sowingDate: string;
  estimatedHarvestDate: string;
  soilType: string;
  irrigationType: 'Drip' | 'Sprinkler' | 'Flood' | 'Rainfed';
  healthScore: number; // 0-100
  ndviStatus: 'Optimal' | 'Normal' | 'Stressed' | 'Critical';
  soilMoisturePercent: number;
  growthStage: 'Germination' | 'Vegetative' | 'Tillering' | 'Flowering' | 'Grain Filling' | 'Maturity';
  notes: string;
  coordinates: { lat: number; lng: number };
}

export interface CropDiagnosis {
  id: string;
  timestamp: string;
  cropName: string;
  diseaseName: string;
  confidenceScore: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  causalOrganism: string;
  summary: string;
  organicRemedy: string[];
  chemicalRemedy: string[];
  preventiveMeasures: string[];
  urgency: 'Low' | 'Moderate' | 'Urgent';
  imageUrl?: string;
  fieldId?: string;
}

export interface MandiPrice {
  id: string;
  commodity: string;
  variety: string;
  state: string;
  district: string;
  marketName: string;
  minPrice: number; // ₹ per Quintal
  maxPrice: number;
  modalPrice: number;
  mspPrice: number;
  priceChangePercent: number;
  arrivalTons: number;
  date: string;
  distanceKm: number;
  trend: 'up' | 'down' | 'stable';
  historicalPrices: { date: string; price: number }[];
}

export interface WeatherDayForecast {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
  rainProbability: number;
  rainfallMm: number;
  humidity: number;
  windSpeedKm: number;
  uvIndex: number;
  spraySuitability: 'Ideal' | 'Moderate' | 'Do Not Spray';
  sprayReason: string;
  irrigationNeed: 'Skip Irrigation' | 'Normal Irrigation' | 'Heavy Irrigation';
}

export interface SoilCard {
  sampleId: string;
  testDate: string;
  nitrogenKgHa: number; // Normal: 280-560
  nitrogenStatus: 'Low' | 'Medium' | 'High';
  phosphorusKgHa: number; // Normal: 23-56
  phosphorusStatus: 'Low' | 'Medium' | 'High';
  potassiumKgHa: number; // Normal: 145-337
  potassiumStatus: 'Low' | 'Medium' | 'High';
  ph: number; // Normal 6.5 - 7.5
  phStatus: 'Acidic' | 'Normal' | 'Alkaline';
  electricalConductivity: number; // dS/m < 1.0 is normal
  organicCarbonPercent: number; // Normal > 0.75%
  organicCarbonStatus: 'Low' | 'Medium' | 'High';
  zincPpm: number;
  ironPpm: number;
}

export interface FarmingTask {
  id: string;
  fieldId: string;
  fieldName: string;
  crop: string;
  title: string;
  category: 'Irrigation' | 'Fertilizer' | 'Pest Control' | 'Weeding' | 'Harvesting' | 'General';
  dueDate: string;
  daysAfterSowing: number;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface GovtScheme {
  id: string;
  title: string;
  hindiTitle?: string;
  category: 'Income Support' | 'Insurance' | 'Irrigation & Solar' | 'Credit' | 'Machinery' | 'Soil & Seeds';
  funding: string;
  benefitDescription: string;
  eligibility: string[];
  documentsRequired: string[];
  officialUrl: string;
  helpline: string;
  status: 'Open' | 'Expiring Soon' | 'Ongoing';
  minLandRequired?: number;
  applicableStates: string[];
}

export interface ExpertConsultant {
  id: string;
  name: string;
  designation: string;
  specialization: string;
  institution?: string;
  kvkLocation: string;
  state: string;
  phone: string;
  rating: number;
  available: boolean;
  status?: string;
  languages: string[];
  photoUrl?: string;
  experienceYears?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorLocation: string;
  crop: string;
  title: string;
  content: string;
  likes: number;
  repliesCount: number;
  timestamp: string;
  verifiedAgriExpertReply?: {
    expertName: string;
    answer: string;
    timestamp: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'weather' | 'mandi' | 'pest' | 'scheme' | 'task';
  timestamp: string;
  read: boolean;
  actionTab?: string;
}

export interface AgriProduct {
  id: string;
  name: string;
  category: 'Seeds' | 'Fertilizers' | 'Bio-Pesticides' | 'Irrigation' | 'Tools';
  varietyOrBrand: string;
  pricePerUnit: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  subsidyEligible: boolean;
  description: string;
  dosageOrUsage: string;
  badge?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  unit: string;
  total: number;
}

export interface CheckoutFormData {
  customerName: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  deliveryAddress: string;
  paymentMethod: 'Cash on Delivery' | 'Kisan Credit Card (KCC)' | 'UPI / NetBanking' | 'Direct Mandi Credit';
  deliveryDate: string;
  orderNotes?: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  address: string;
  items: OrderItem[];
  total_amount: number;
  payment_method: string;
  delivery_date: string;
  order_notes?: string;
  status: 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered';
  created_at: string;
  synced_to_supabase?: boolean;
}
