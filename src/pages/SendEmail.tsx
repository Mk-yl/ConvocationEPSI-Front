import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { convocationService } from '../services/convocationService';
import { SendEmailRequestDto } from '../types';
import Button from '../components/ui/Button';
import { Mail, Plus, X, Send } from 'lucide-react';

interface FormData {
  sessionId: string;
  examenLabel: string;
  ccEmails: { email: string }[];
}

const SendEmail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { control, handleSubmit, register, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      sessionId: '',
      examenLabel: '',
      ccEmails: [{ email: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ccEmails',
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const request: SendEmailRequestDto = {
        sessionId: data.sessionId,
        examenLabel: data.examenLabel,
        ccEmails: data.ccEmails.map(item => item.email).filter(email => email.trim() !== ''),
      };

      await convocationService.sendEmails(request);
      setEmailSent(true);
      toast.success('Emails envoyés avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi des emails:', error);
      toast.error('Erreur lors de l\'envoi des emails');
    } finally {
      setLoading(false);
    }
  };

  const addEmailField = () => {
    append({ email: '' });
  };

  const removeEmailField = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Envoi par email</h1>
        <p className="mt-2 text-gray-600">
          Envoyez les convocations PDF par email aux candidats et en copie aux adresses spécifiées
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session ID *
            </label>
            <input
              {...register('sessionId', { required: 'Session ID requis' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="ID de la session de génération"
            />
            {errors.sessionId && (
              <p className="mt-1 text-sm text-red-600">{errors.sessionId.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Utilisez l'ID de session obtenu lors de la génération des convocations
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Libellé de l'examen *
            </label>
            <input
              {...register('examenLabel', { required: 'Libellé d\'examen requis' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Examen final - Développement Web"
            />
            {errors.examenLabel && (
              <p className="mt-1 text-sm text-red-600">{errors.examenLabel.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Adresses en copie (CC)
              </label>
              <Button
                type="button"
                onClick={addEmailField}
                variant="secondary"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Ajouter une adresse
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <input
                    {...register(`ccEmails.${index}.email` as const, {
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Format d\'email invalide',
                      },
                    })}
                    type="email"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@exemple.com"
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeEmailField(index)}
                      variant="danger"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <p className="mt-2 text-sm text-gray-500">
              Les convocations seront envoyées directement aux candidats et en copie aux adresses ci-dessus
            </p>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button
              type="submit"
              loading={loading}
              leftIcon={<Send className="h-4 w-4" />}
              size="lg"
            >
              Envoyer les emails
            </Button>
          </div>
        </form>
      </div>

      {emailSent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <Mail className="h-6 w-6 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-green-800">Emails envoyés avec succès !</h3>
              <p className="text-sm text-green-600 mt-1">
                Les convocations ont été envoyées à tous les candidats avec les adresses en copie spécifiées.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendEmail;