// Types pour les entités
export interface Ville {
  id: number;
  nom: string;
}

export interface Adresse {
  id: number;
  rue: string;
}

export interface Certification {
  id: number;
  nom: string;
  description?: string;
}

export interface TypeExamen {
  id: number;
  nom: string;
  description?: string;
}

export interface DureeEpreuve {
  id: number;
  nom: string;
}

export interface Classe {
  id: number;
  nom: string;
  certifications?: Certification[];
  typesExamen?: TypeExamen[];
}

// Types pour les API requests/responses
export interface ImportResponseDto {
  sessionId: string | null;
  candidatsCount: number;
  errors: string[];
  message: string;
  candidats?: Candidat[];
}

export interface Candidat {
  nom: string;
  prenom: string;
  email: string;
  groupe: string;
}

export interface GenerateConvocationRequestDto {
  sessionId: string;
  villeId: number;
  typeExamenId: number;
  certificationId: number;
  adresseId: number;
  dureeEpreuveId: number;
  dateRendu: string;
  heureRendu: string;
  lienDrive: string;
  templateFile?: File;
  signatureImage?: File;
}

export interface GenerateResponseDto {
  sessionId: string | null;
  filesGenerated: number;
  downloadUrl: string | null;
  message: string;
}

export interface SendEmailRequestDto {
  sessionId: string;
  examenLabel: string;
  ccEmails: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}