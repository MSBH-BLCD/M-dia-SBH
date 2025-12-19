
/**
 * Service générique pour l'envoi de commandes vers le backend d'automatisation.
 * Gère les headers, le formatage JSON et les erreurs réseaux de base.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export const apiService = {
  /**
   * Envoie une commande (payload) à une URL Webhook spécifique.
   */
  async sendCommand(webhookUrl: string, payload: any): Promise<ApiResponse> {
    // Simulation pour éviter le crash si l'URL n'est pas configurée dans config/webhooks.ts
    if (!webhookUrl || webhookUrl.trim() === '') {
      console.warn("⚠️ [Simulation Mode] Webhook URL non configurée. Payload:", payload);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: { message: "Simulation: Commande reçue (Webhook non configuré)" }
          });
        }, 1500);
      });
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
      }

      // Tente de parser le JSON, ou retourne un succès générique si le webhook ne renvoie pas de JSON (ex: n8n par défaut)
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return { success: true, data };

    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de la commande:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue lors de la communication avec le serveur." 
      };
    }
  }
};
