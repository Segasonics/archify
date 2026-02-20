export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Archify';

export const PLANS = {
  free: {
    name: 'Free',
    credits: 20,
    price: '$0',
    description: 'Try blueprint-to-render workflows',
  },
  pro: {
    name: 'Pro',
    credits: 300,
    price: '$39/mo',
    description: 'For solo architects and designers',
  },
  team: {
    name: 'Team',
    credits: 1200,
    price: '$129/mo',
    description: 'For studios and collaboration-heavy teams',
  },
};

export const MAX_UPLOAD_SIZE_MB = 15;
export const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];

