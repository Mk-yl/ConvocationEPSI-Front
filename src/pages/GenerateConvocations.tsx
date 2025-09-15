import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { convocationService } from '../services/convocationService';
import { adminService } from '../services/adminService';
import { GenerateConvocationRequestDto, GenerateResponseDto, Ville, Adresse, Certification, TypeExamen, DureeEpreuve, Classe } from '../types';
import Button from '../components/ui/Button';
import FileUpload from '../components/ui/FileUpload';
import { FileText, Download, Mail, RefreshCw } from 'lucide-react';

interface FormData {
  sessionId: string;
  villeId: number;
  typeExamenId: number;
  certificationId: number;
  adresseId: number;
  dureeEpreuveId: number;
  classeId: number; // Ajout pour le filtrage
  dateRendu: string;
  heureRendu: string;
  lienDrive: string;
  templateFile: File | null;
  signatureImage: File | undefined;
}

const GenerateConvocations: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generateResult, setGenerateResult] = useState<GenerateResponseDto | null>(null);
  const [downloadingFile, setDownloadingFile] = useState(false);
  const navigate = useNavigate();

  // États pour les données de référence
  const [villes, setVilles] = useState<Ville[]>([]);
  const [adresses, setAdresses] = useState<Adresse[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [typesExamen, setTypesExamen] = useState<TypeExamen[]>([]);
  const [durees, setDurees] = useState<DureeEpreuve[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);

  // États pour le filtrage
  const [filteredCertifications, setFilteredCertifications] = useState<Certification[]>([]);
  const [filteredTypesExamen, setFilteredTypesExamen] = useState<TypeExamen[]>([]);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      sessionId: '',
      villeId: 0,
      typeExamenId: 0,
      certificationId: 0,
      adresseId: 0,
      dureeEpreuveId: 0,
      classeId: 0,
      dateRendu: '',
      heureRendu: '',
      lienDrive: '',
      templateFile: null,
      signatureImage: undefined,
    },
  });

  const selectedClasseId = watch('classeId');

  // Chargement des données de référence
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [villesData, adressesData, certificationsData, typesExamenData, dureesData, classesData] = await Promise.all([
          adminService.getVilles(),
          adminService.getAdresses(),
          adminService.getCertifications(),
          adminService.getTypesExamen(),
          adminService.getDurees(),
          adminService.getClasses(),
        ]);

        setVilles(villesData);
        setAdresses(adressesData);
        setCertifications(certificationsData);
        setTypesExamen(typesExamenData);
        setDurees(dureesData);
        setClasses(classesData);

        // Définit automatiquement la première ville et la première adresse

        if (villesData.length > 0) {
          setValue("villeId", villesData[0].id);
        }
        if (adressesData.length > 0) {
          setValue("adresseId", adressesData[0].id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données de référence');
      }
    };

    loadReferenceData();
  }, [setValue]);

  // Filtrage des certifications et types d'examen par classe
  useEffect(() => {
    if (selectedClasseId > 0) {
      const selectedClasse = classes.find(c => c.id === selectedClasseId);
      if (selectedClasse) {
        setFilteredCertifications(selectedClasse.certifications || []);
        setFilteredTypesExamen(selectedClasse.typesExamen || []);

        // Reset des sélections si elles ne sont plus valides
        setValue('certificationId', 0);
        setValue('typeExamenId', 0);
      }
    } else {
      setFilteredCertifications(certifications);
      setFilteredTypesExamen(typesExamen);
    }
  }, [selectedClasseId, classes, certifications, typesExamen, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!data.templateFile) {
      toast.error('Veuillez sélectionner un modèle de convocation');
      return;
    }

    setLoading(true);
    try {
      const request: GenerateConvocationRequestDto = {
        sessionId: data.sessionId,
        villeId: data.villeId,
        typeExamenId: data.typeExamenId,
        certificationId: data.certificationId,
        adresseId: data.adresseId,
        dureeEpreuveId: data.dureeEpreuveId,
        dateRendu: data.dateRendu,
        heureRendu: data.heureRendu,
        lienDrive: data.lienDrive,
        templateFile: data.templateFile,
        signatureImage: data.signatureImage,
      };

      const result = await convocationService.generateConvocations(request);
      setGenerateResult(result);

      if (result.sessionId) {
        toast.success(`${result.filesGenerated} convocations générées avec succès`);
      } else {
        toast.error(result.message || 'Erreur lors de la génération');
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error('Erreur lors de la génération des convocations');
      setGenerateResult(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async () => {
    if (!generateResult?.sessionId) return;

    setDownloadingFile(true);
    try {
      const blob = await convocationService.downloadFile(generateResult.sessionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `convocations_${generateResult.sessionId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Fichier téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement du fichier');
    } finally {
      setDownloadingFile(false);
    }
  };

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Génération des convocations</h1>
          <p className="mt-2 text-gray-600">
            Configurez les paramètres et générez les convocations à partir d'un modèle Word
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations de session</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session ID *
                </label>
                <Controller
                    name="sessionId"
                    control={control}
                    rules={{ required: 'Session ID requis' }}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="ID de la session d'import"
                        />
                    )}
                />
                {errors.sessionId && (
                    <p className="mt-1 text-sm text-red-600">{errors.sessionId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classe *
                </label>
                <Controller
                    name="classeId"
                    control={control}
                    rules={{ required: 'Classe requise', min: { value: 1, message: 'Sélectionnez une classe' } }}
                    render={({ field }) => (
                        <select
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={0}>Sélectionnez une classe</option>
                          {classes.map((classe) => (
                              <option key={classe.id} value={classe.id}>
                                {classe.nom}
                              </option>
                          ))}
                        </select>
                    )}
                />
                {errors.classeId && (
                    <p className="mt-1 text-sm text-red-600">{errors.classeId.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuration de l'examen</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <Controller
                    name="villeId"
                    control={control}
                    rules={{ required: 'Ville requise', min: { value: 1, message: 'Sélectionnez une ville' } }}
                    render={({ field }) => (
                        <select
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          {villes.map((ville) => (
                              <option key={ville.id} value={ville.id}>
                                {ville.nom}
                              </option>
                          ))}
                        </select>

                    )}
                />
                {errors.villeId && (
                    <p className="mt-1 text-sm text-red-600">{errors.villeId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse *
                </label>
                <Controller
                    name="adresseId"
                    control={control}
                    rules={{ required: 'Adresse requise', min: { value: 1, message: 'Sélectionnez une adresse' } }}
                    render={({ field }) => (
                        <select
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          {adresses.map((adresse) => (
                              <option key={adresse.id} value={adresse.id}>
                                {adresse.rue}
                              </option>
                          ))}
                        </select>
                    )}
                />
                {errors.adresseId && (
                    <p className="mt-1 text-sm text-red-600">{errors.adresseId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification *
                </label>
                <Controller
                    name="certificationId"
                    control={control}
                    rules={{ required: 'Certification requise', min: { value: 1, message: 'Sélectionnez une certification' } }}
                    render={({ field }) => (
                        <select
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            disabled={selectedClasseId === 0}
                        >
                          <option value={0}>
                            {selectedClasseId === 0 ? 'Sélectionnez d\'abord une classe' : 'Sélectionnez une certification'}
                          </option>
                          {filteredCertifications.map((certification) => (
                              <option key={certification.id} value={certification.id}>
                                {certification.nom}
                              </option>
                          ))}
                        </select>
                    )}
                />
                {errors.certificationId && (
                    <p className="mt-1 text-sm text-red-600">{errors.certificationId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'examen *
                </label>
                <Controller
                    name="typeExamenId"
                    control={control}
                    rules={{ required: 'Type d\'examen requis', min: { value: 1, message: 'Sélectionnez un type d\'examen' } }}
                    render={({ field }) => (
                        <select
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            disabled={selectedClasseId === 0}
                        >
                          <option value={0}>
                            {selectedClasseId === 0 ? 'Sélectionnez d\'abord une classe' : 'Sélectionnez un type d\'examen'}
                          </option>
                          {filteredTypesExamen.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.nom}
                              </option>
                          ))}
                        </select>
                    )}
                />
                {errors.typeExamenId && (
                    <p className="mt-1 text-sm text-red-600">{errors.typeExamenId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée d'épreuve *
                </label>
                <Controller
                    name="dureeEpreuveId"
                    control={control}
                    rules={{ required: 'Durée requise', min: { value: 1, message: 'Sélectionnez une durée' } }}
                    render={({ field }) => (
                        <select
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={0}>Sélectionnez une durée</option>
                          {durees.map((duree) => (
                              <option key={duree.id} value={duree.id}>
                                {duree.nom}
                              </option>
                          ))}
                        </select>
                    )}
                />
                {errors.dureeEpreuveId && (
                    <p className="mt-1 text-sm text-red-600">{errors.dureeEpreuveId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de rendu
                </label>
                <Controller
                    name="dateRendu"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de rendu
                </label>
                <Controller
                    name="heureRendu"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="time"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    )}
                />
              </div>


              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lien Google Drive
                </label>
                <Controller
                    name="lienDrive"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://drive.google.com/..."
                        />
                    )}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Fichiers</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle de convocation (.docx) *
                </label>
                <Controller
                    name="templateFile"
                    control={control}
                    rules={{ required: 'Modèle de convocation requis' }}
                    render={({ field }) => (
                        <FileUpload
                            key="template-upload" // Clé unique pour éviter les conflits
                            onFileSelect={(file) => {
                              console.log('Template file selected:', file);
                              field.onChange(file);
                            }}
                            accept=".docx,.doc"
                            selectedFile={field.value}
                            placeholder="Sélectionnez le modèle Word de convocation"
                            error={errors.templateFile?.message}
                        />
                    )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de signature (optionnel)
                </label>
                <Controller
                    name="signatureImage"
                    control={control}
                    render={({ field }) => (
                        <FileUpload
                            key="signature-upload" // Clé unique pour éviter les conflits
                            onFileSelect={(file) => {
                              console.log('Signature file selected:', file);
                              field.onChange(file);
                            }}
                            accept=".png,.jpg,.jpeg"
                            selectedFile={field.value}
                            placeholder="Sélectionnez une image de signature (PNG, JPG)"
                        />
                    )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
                type="submit"
                loading={loading}
                leftIcon={<FileText className="h-4 w-4" />}
                size="lg"
            >
              Générer les convocations
            </Button>
          </div>
        </form>

        {generateResult && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Résultat de la génération</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Fichiers générés</span>
                  <span className="text-lg font-bold text-green-600">{generateResult.filesGenerated}</span>
                </div>

                {generateResult.sessionId && (
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Session ID</span>
                      <code className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {generateResult.sessionId}
                      </code>
                    </div>
                )}

                <div className="flex gap-4">
                  <Button
                      onClick={downloadFile}
                      loading={downloadingFile}
                      leftIcon={<Download className="h-4 w-4" />}
                      variant="success"
                  >
                    Télécharger le ZIP
                  </Button>

                  <Button
                      onClick={() => navigate('/email', { state: { sessionId: generateResult.sessionId } })}
                      leftIcon={<Mail className="h-4 w-4" />}
                      variant="secondary"
                  >
                    Envoyer par email
                  </Button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default GenerateConvocations;