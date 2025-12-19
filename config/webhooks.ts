
// Configuration des points de terminaison Webhook (n8n, Make, Zapier, API custom)
// Mode Démo : Endpoint vide

const API_ENDPOINT = "";

export const WEBHOOK_URLS = {
  // Module Social Media
  SOCIAL_GENERATION: API_ENDPOINT, 
  
  // Module SEO
  SEO_ARTICLE_GENERATION: API_ENDPOINT, 
  
  // Module Google Business
  GMB_POST_PUBLISH: API_ENDPOINT, 
  GMB_REVIEW_REPLY: API_ENDPOINT, 
  
  // Module Système
  STRIPE_CHECKOUT: API_ENDPOINT, 
  CONNECT_ACCOUNT: API_ENDPOINT, 
};
