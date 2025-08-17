export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  isAdmin: boolean;
  nationalID?: string;
  phone?: string;
  profilePictureUrl?: string;
  bio?: string;
  dateOfBirth?: string;
  governmentIdVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  hostSince?: string;
  isSuperhost: boolean;
  preferredLanguage?: string;
  timezone?: string;
}

export interface Apartment {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  bedrooms: number;
  maxGuests: number;
  squareMeter: number;
  amenities?: any;
  availabilityStatus: string;
  minimumStay: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  propertyType: string;
  instantBook: boolean;
  rating: number;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
  apartment_tags?: string[];
}

export interface Transaction {
  id: number;
  senderID: number;
  receiverID: number;
  amount: number;
  currency: string;
  status: string;
  method: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  token: string;
  expiresIn: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}