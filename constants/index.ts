export const FREE_ACTION = "Free Action"
export const PRIMARY_ACTION = "Primary Action"

// API Key from .env file (must be prefixed with EXPO_PUBLIC_ for client-side access)
export const API_KEY = process.env.EXPO_PUBLIC_API_KEY || '';

// API URL - same for all environments (development, staging, production)
export const API_URL = 'https://eventide-encounters-1b91dba2dcce.herokuapp.com'