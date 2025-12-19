import React from 'react';

export interface KpiData {
  title: string;
  value: string;
  change?: number; // percentage
  icon: React.ElementType;
  colorClass: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  name: string;
  maps: number;
  search: number;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  content: string;
  avatar: string;
  replied: boolean;
}

export interface Competitor {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  status: 'better' | 'worse' | 'equal';
}