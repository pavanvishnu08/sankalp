import React from 'react';

export interface NavLink {
  label: string;
  path: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  image: string;
  stats: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface ImpactStat {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export interface DonationFormData {
  cause: string;
  amount: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  screenshot: File | null;
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';