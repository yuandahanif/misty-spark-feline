import { MapViewState } from "@deck.gl/core";

export const VIEWPOINT_DEFAULT = {
  zoom: 15.5,
  pitch: 45,
  bearing: -17.6,
};

export const CITIES: { [name: string]: MapViewState } = {
  SF: {
    longitude: -122.4,
    latitude: 37.8,
    ...VIEWPOINT_DEFAULT,
  },
  NYC: {
    longitude: -74.0,
    latitude: 40.7,
    ...VIEWPOINT_DEFAULT,
  },

  // Southeast Asian cities
  BKK: {
    // Bangkok, Thailand
    longitude: 100.5018,
    latitude: 13.7563,
    ...VIEWPOINT_DEFAULT,
  },
  SIN: {
    // Singapore
    longitude: 103.8198,
    latitude: 1.3521,
    ...VIEWPOINT_DEFAULT,
  },
  JKT: {
    // Jakarta, Indonesia
    longitude: 106.865,
    latitude: -6.1751,
    ...VIEWPOINT_DEFAULT,
  },
  KUL: {
    // Kuala Lumpur, Malaysia
    longitude: 101.6869,
    latitude: 3.139,
    ...VIEWPOINT_DEFAULT,
  },
  MNL: {
    // Manila, Philippines
    longitude: 120.9842,
    latitude: 14.5995,
    ...VIEWPOINT_DEFAULT,
  },
  HCMC: {
    // Ho Chi Minh City, Vietnam
    longitude: 106.6297,
    latitude: 10.8231,
    ...VIEWPOINT_DEFAULT,
  },
  HAN: {
    // Hanoi, Vietnam
    longitude: 105.8342,
    latitude: 21.0278,
    ...VIEWPOINT_DEFAULT,
  },
  PNH: {
    // Phnom Penh, Cambodia
    longitude: 104.916,
    latitude: 11.5564,
    ...VIEWPOINT_DEFAULT,
  },
  RGN: {
    // Yangon, Myanmar
    longitude: 96.1951,
    latitude: 16.8409,
    ...VIEWPOINT_DEFAULT,
  },
  VTE: {
    // Vientiane, Laos
    longitude: 102.6331,
    latitude: 17.9757,
    ...VIEWPOINT_DEFAULT,
  },
  DPS: {
    // Denpasar, Bali, Indonesia
    longitude: 115.2126,
    latitude: -8.6705,
    ...VIEWPOINT_DEFAULT,
  },
  BWN: {
    // Bandar Seri Begawan, Brunei
    longitude: 114.9403,
    latitude: 4.9031,
    ...VIEWPOINT_DEFAULT,
  },
};
