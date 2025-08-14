import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { Classe, Certification, TypeExamen } from '../../types';
import EntityTable from '../../components/admin/EntityTable';
import EntityModal from '../../components/admin/EntityModal';

const AdminClasses: React.FC = () => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [typesExamen, setTypesExamen] = useState<TypeExamen[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClasse, setEditingClasse] = useState<Classe | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    certificationIds: [] as number[],
    typeExamenIds: [] as number[],
  });
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    { key: 'id' as keyof Classe, label: 'ID' },
    { key: 'nom' as keyof Classe, label: 'Nom' },
    {
      key: 'certifications' as keyof Classe,
      label: 'Certifications',
      render: (certifications: Certification[]) =>
        certifications?.map(c => c.nom).join(', ') || 'Aucune',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classesData, certificationsData, typesExamenData] = await Promise.all([
        adminService.getClasses(),
        adminService.getCertifications(),
        adminService.getTypesExamen(),
      ]);
      
      setClasses(classesData);
      setCertifications(certificationsData);
      setTypesExamen(typesExamenData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingClasse(null);
    setFormData({
      nom: '',
      certificationIds: [],
      typeExamenIds: [],
    });
    setModalOpen(true);
  };

  const handleEdit = (classe: Classe) => {
    setEditingClasse(classe);
    setFormData({
      nom: classe.nom,
      certificationIds: classe.certifications?.map(c => c.id) || [],
      typeExamenIds: classe.typesExamen?.map(t => t.id) || [],
    });
    setModalOpen(true);
  };

  const handleDelete = async (classe: Classe) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la classe "${classe.nom}" ?`)) {
      try {
        await adminService.deleteClasse(classe.id);
        toast.success('Classe supprimée avec succès');
        loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de la classe');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.nom.trim()) {
      toast.error('Le nom est requis');
      return;
    }

    try {
      setSubmitting(true);
      
      const classeData = {
        nom: formData.nom,
        certifications: formData.certificationIds.map(id => 
          certifications.find(c => c.id === id)!
        ),
        typesExamen: formData.typeExamenIds.map(id => 
          typesExamen.find(t => t.id === id)!
        ),
      };

      if (editingClasse) {
        await adminService.updateClasse(editingClasse.id, classeData);
        toast.success('Classe modifiée avec succès');
      } else {
        await adminService.createClasse(classeData);
        toast.success('Classe créée avec succès');
      }
      
      setModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la classe');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCertificationChange = (certificationId: number, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        certificationIds: [...formData.certificationIds, certificationId],
      });
    } else {
      setFormData({
        ...formData,
        certificationIds: formData.certificationIds.filter(id => id !== certificationId),
      });
    }
  };

  const handleTypeExamenChange = (typeId: number, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        typeExamenIds: [...formData.typeExamenIds, typeId],
      });
    } else {
      setFormData({
        ...formData,
        typeExamenIds: formData.typeExamenIds.filter(id => id !== typeId),
      });
    }
  };

  return (
    <>
      <EntityTable
        title="Gestion des classes"
        data={classes}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <EntityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingClasse ? 'Modifier la classe' : 'Ajouter une classe'}
        onSubmit={handleSubmit}
        loading={submitting}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la classe *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nom de la classe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Certifications associées
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
              {certifications.map((certification) => (
                <label key={certification.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.certificationIds.includes(certification.id)}
                    onChange={(e) => handleCertificationChange(certification.id, e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{certification.nom}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Types d'examen associés
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
              {typesExamen.map((type) => (
                <label key={type.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.typeExamenIds.includes(type.id)}
                    onChange={(e) => handleTypeExamenChange(type.id, e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{type.nom}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </EntityModal>
    </>
  );
};

export default AdminClasses;