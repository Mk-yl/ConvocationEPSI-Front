import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { convocationService } from '../services/convocationService';
import { ImportResponseDto } from '../types';
import Button from '../components/ui/Button';
import FileUpload from '../components/ui/FileUpload';
import { CheckCircle, AlertCircle, Users, Copy} from 'lucide-react';

interface FormData {
  file: File | null;
}

const ImportCandidats: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResponseDto | null>(null);
  
  const { handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      file: null,
    },
  });

  const selectedFile = watch('file');

  const onSubmit = async (data: FormData) => {
    if (!data.file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    setLoading(true);
    try {
      const result = await convocationService.importCandidats(data.file);
      setImportResult(result);
      
      if (result.errors && result.errors.length > 0) {
        toast.warning(`Import terminé avec ${result.errors.length} erreur(s)`);
      } else {
        toast.success(`${result.candidatsCount} candidats importés avec succès`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast.error('Erreur lors de l\'import du fichier');
      setImportResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import des candidats</h1>
        <p className="mt-2 text-gray-600">
          Téléversez un fichier Excel (.xlsx) contenant la liste des candidats
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fichier Excel des candidats
            </label>
            <FileUpload
              onFileSelect={(file) => setValue('file', file)}
              accept=".xlsx,.xls"
              selectedFile={selectedFile}
              placeholder="Sélectionnez un fichier Excel (.xlsx, .xls)"
              error={errors.file?.message}
            />
            <p className="mt-2 text-sm text-gray-500">
              Le fichier doit contenir les colonnes : Groupe, Civilité, Nom, Prénom, Email, Date, Heure, Salle, Numéro Jury.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              loading={loading}
              disabled={!selectedFile}
              leftIcon={<Users className="h-4 w-4" />}
            >
              Importer les candidats
            </Button>
          </div>
        </form>
      </div>

      {importResult && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            {importResult.errors && importResult.errors.length > 0 ? (
              <AlertCircle className="h-6 w-6 text-orange-500 mr-3" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
            )}
            <h2 className="text-xl font-semibold text-gray-900">Résultat de l'import</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Candidats importés</span>
              <span className="text-lg font-bold text-green-600">{importResult.candidatsCount}</span>
            </div>

            {importResult.sessionId && (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Session ID</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {importResult.sessionId}
                  </code>
                  <button
                      type="button"
                      className="p-1 hover:bg-blue-100 rounded"
                      onClick={() => {
                        navigator.clipboard.writeText(importResult.sessionId || '');
                        toast.success('Session ID copié !');
                      }}
                  >
                    <Copy className="w-4 h-4 text-blue-600" />
                  </button>
                </div>

              </div>
            )}

            {importResult.errors && importResult.errors.length > 0 && (
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="text-sm font-medium text-red-800 mb-2">Erreurs détectées :</h3>
                <ul className="list-disc list-inside space-y-1">
                  {importResult.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-700">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {importResult.candidats && importResult.candidats.length > 0 && (
              <div className="overflow-hidden">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Aperçu des candidats</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prénom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Groupe
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {importResult.candidats.slice(0, 40).map((candidat, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {candidat.nom}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {candidat.prenom}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {candidat.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {candidat.groupe}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {importResult.candidats.length > 10 && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      ... et {importResult.candidats.length - 10} autres candidats
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportCandidats;