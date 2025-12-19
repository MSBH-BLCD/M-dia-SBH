
export interface WorkflowResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const sendToWorkflow = async (url: string, data: any): Promise<WorkflowResponse> => {
  // --- MODE SIMULATION (Si URL vide) ---
  if (!url || url.trim() === '') {
    console.group('%c🚀 [SIMULATION MODE] Action Interceptée', 'color: #F59E0B; font-weight: bold; font-size: 12px;');
    console.log('%cStatut:', 'font-weight: bold;', 'Succès simulé (Backend n8n non configuré)');
    console.log('%cAction:', 'font-weight: bold;', data.intent || 'Action inconnue');
    console.log('%cPayload:', 'font-weight: bold;', JSON.parse(JSON.stringify(data)));
    console.groupEnd();
    
    return new Promise((resolve) => {
      // Un délai court pour simuler un temps de réponse réseau
      setTimeout(() => {
        resolve({
          success: true,
          message: "Simulation: Action validée par le système de démo."
        });
      }, 800);
    });
  }

  // --- MODE RÉEL ---
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
    }

    return { success: true, message: "Commande transmise avec succès." };

  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de la commande:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erreur de communication." 
    };
  }
};
