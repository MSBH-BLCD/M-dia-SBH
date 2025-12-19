
// Configuration des URLs de workflow (n8n, Make, etc.)
// Mode Démo : Endpoint vide pour simuler le succès sans backend réel

const API_ENDPOINT = "";

export const API_CONFIG = {
  // Workflow Social Media (Génération & Planification)
  SOCIAL_WORKFLOW_URL: API_ENDPOINT, 
  
  // Workflow SEO (Rédaction & Publication)
  SEO_WORKFLOW_URL: API_ENDPOINT, 
  
  // Workflow Google Business (Publication Posts)
  GMB_POST_WORKFLOW_URL: API_ENDPOINT,
  
  // Workflow Réponses aux Avis
  GMB_REPLY_WORKFLOW_URL: API_ENDPOINT,
  
  // Workflow Onboarding (Sauvegarde des connexions)
  ONBOARDING_WORKFLOW_URL: API_ENDPOINT,

  // Workflow Stripe/Paiement
  STRIPE_CHECKOUT: API_ENDPOINT,
};
