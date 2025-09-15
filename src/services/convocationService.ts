import api from './api';
import { ImportResponseDto, GenerateConvocationRequestDto, GenerateResponseDto, SendEmailRequestDto } from '../types';

export const convocationService = {
  // Import des candidats
  async importCandidats(file: File): Promise<ImportResponseDto> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Génération des convocations avec timeout étendu
  async generateConvocations(request: GenerateConvocationRequestDto): Promise<GenerateResponseDto> {
    const formData = new FormData();

    // Ajouter les données JSON
    const data = {
      sessionId: request.sessionId,
      villeId: request.villeId,
      typeExamenId: request.typeExamenId,
      certificationId: request.certificationId,
      adresseId: request.adresseId,
      dureeEpreuveId: request.dureeEpreuveId,
      dateRendu: request.dateRendu,
      heureRendu: request.heureRendu,
      lienDrive: request.lienDrive,
    };

    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

    if (request.templateFile) {
      formData.append('templateFile', request.templateFile);
    }

    if (request.signatureImage) {
      formData.append('signatureImage', request.signatureImage);
    }

    const response = await api.post('/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes (300 secondes)
    });
    return response.data;
  },

  // Génération asynchrone (approche alternative recommandée)
  async generateConvocationsAsync(request: GenerateConvocationRequestDto): Promise<{ taskId: string }> {
    const formData = new FormData();

    const data = {
      sessionId: request.sessionId,
      villeId: request.villeId,
      typeExamenId: request.typeExamenId,
      certificationId: request.certificationId,
      adresseId: request.adresseId,
      dureeEpreuveId: request.dureeEpreuveId,
      dateRendu: request.dateRendu,
      heureRendu: request.heureRendu,
      lienDrive: request.lienDrive,
    };

    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

    if (request.templateFile) {
      formData.append('templateFile', request.templateFile);
    }

    if (request.signatureImage) {
      formData.append('signatureImage', request.signatureImage);
    }

    // Endpoint pour génération asynchrone (si disponible dans votre API Java)
    const response = await api.post('/generate-async', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // Timeout normal pour lancer la tâche
    });
    return response.data;
  },

  // Vérification du statut d'une tâche asynchrone
  async checkTaskStatus(taskId: string): Promise<{ status: string; result?: GenerateResponseDto; progress?: number }> {
    const response = await api.get(`/task-status/${taskId}`);
    return response.data;
  },

  // Téléchargement du fichier zip
  async downloadFile(sessionId: string) {
    const response = await api.get(`/download/${sessionId}`, {
      responseType: 'blob',
      timeout: 120000,
    });

    const cd = response.headers['content-disposition']; // axios => en minuscules
    let fileName = 'Convocations.zip';

    if (cd) {
      // essaie filename* (UTF-8) puis filename
      const matchStar = cd.match(/filename\*=UTF-8''([^;]+)/);
      const matchPlain = cd.match(/filename="?([^";]+)"?/);
      if (matchStar && matchStar[1]) fileName = decodeURIComponent(matchStar[1]);
      else if (matchPlain && matchPlain[1]) fileName = matchPlain[1];
    }

    const url = URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },


  // Envoi des emails
  async sendEmails(request: SendEmailRequestDto): Promise<string> {
    const response = await api.post('/send-emails', request, {
      timeout: 120000, // 2 minutes pour l'envoi d'emails
    });
    return response.data;
  },
};