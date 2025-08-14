import api from './api';
import { Ville, Adresse, Certification, TypeExamen, DureeEpreuve, Classe } from '../types';

export const adminService = {
  // Villes
  async getVilles(): Promise<Ville[]> {
    const response = await api.get('/admin/villes');
    return response.data;
  },

  async createVille(ville: Omit<Ville, 'id'>): Promise<Ville> {
    const response = await api.post('/admin/villes', ville);
    return response.data;
  },

  async updateVille(id: number, ville: Omit<Ville, 'id'>): Promise<Ville> {
    const response = await api.put(`/admin/villes/${id}`, ville);
    return response.data;
  },

  async deleteVille(id: number): Promise<void> {
    await api.delete(`/admin/villes/${id}`);
  },

  // Adresses
  async getAdresses(): Promise<Adresse[]> {
    const response = await api.get('/admin/adresses');
    return response.data;
  },

  async createAdresse(adresse: Omit<Adresse, 'id'>): Promise<Adresse> {
    const response = await api.post('/admin/adresses', adresse);
    return response.data;
  },

  async updateAdresse(id: number, adresse: Omit<Adresse, 'id'>): Promise<Adresse> {
    const response = await api.put(`/admin/adresses/${id}`, adresse);
    return response.data;
  },

  async deleteAdresse(id: number): Promise<void> {
    await api.delete(`/admin/adresses/${id}`);
  },

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    const response = await api.get('/admin/certifications');
    return response.data;
  },

  async createCertification(certification: Omit<Certification, 'id'>): Promise<Certification> {
    const response = await api.post('/admin/certifications', certification);
    return response.data;
  },

  async updateCertification(id: number, certification: Omit<Certification, 'id'>): Promise<Certification> {
    const response = await api.put(`/admin/certifications/${id}`, certification);
    return response.data;
  },

  async deleteCertification(id: number): Promise<void> {
    await api.delete(`/admin/certifications/${id}`);
  },

  // Types d'examen
  async getTypesExamen(): Promise<TypeExamen[]> {
    const response = await api.get('/admin/types-examen');
    return response.data;
  },

  async createTypeExamen(typeExamen: Omit<TypeExamen, 'id'>): Promise<TypeExamen> {
    const response = await api.post('/admin/types-examen', typeExamen);
    return response.data;
  },

  async updateTypeExamen(id: number, typeExamen: Omit<TypeExamen, 'id'>): Promise<TypeExamen> {
    const response = await api.put(`/admin/types-examen/${id}`, typeExamen);
    return response.data;
  },

  async deleteTypeExamen(id: number): Promise<void> {
    await api.delete(`/admin/types-examen/${id}`);
  },

  // Durées d'épreuve
  async getDurees(): Promise<DureeEpreuve[]> {
    const response = await api.get('/admin/durees');
    return response.data;
  },

  async createDuree(duree: Omit<DureeEpreuve, 'id'>): Promise<DureeEpreuve> {
    const response = await api.post('/admin/durees', duree);
    return response.data;
  },

  async updateDuree(id: number, duree: Omit<DureeEpreuve, 'id'>): Promise<DureeEpreuve> {
    const response = await api.put(`/admin/durees/${id}`, duree);
    return response.data;
  },

  async deleteDuree(id: number): Promise<void> {
    await api.delete(`/admin/durees/${id}`);
  },

  // Classes
  async getClasses(): Promise<Classe[]> {
    const response = await api.get('/admin/classes');
    return response.data;
  },

  async createClasse(classe: Omit<Classe, 'id'>): Promise<Classe> {
    const response = await api.post('/admin/classes', classe);
    return response.data;
  },

  async updateClasse(id: number, classe: Omit<Classe, 'id'>): Promise<Classe> {
    const response = await api.put(`/admin/classes/${id}`, classe);
    return response.data;
  },

  async deleteClasse(id: number): Promise<void> {
    await api.delete(`/admin/classes/${id}`);
  },
};