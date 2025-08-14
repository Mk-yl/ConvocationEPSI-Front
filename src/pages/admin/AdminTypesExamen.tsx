import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { TypeExamen } from '../../types';
import EntityTable from '../../components/admin/EntityTable';
import EntityModal from '../../components/admin/EntityModal';

const AdminTypesExamen: React.FC = () => {
  const [typesExamen, setTypesExamen] = useState<TypeExamen[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<TypeExamen | null>(null);
  const [formData, setFormData] = useState({ nom: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    { key: 'id' as keyof TypeExamen, label: 'ID' },
    { key: 'nom' as keyof TypeExamen, label: 'Nom' },
    { key: 'description' as keyof TypeExamen, label: 'Description' },
  ];

  useEffect(() => {
    loadTypesExamen();
  }, []);

  const loadTypesExamen = async () => {
    try {
      setLoading(true);
      const data = await adminService.getTypesExamen();
      setTypesExamen(data);
    } catch (error) {
      console.error('Erreur lors du chargement des types d\'examen:', error);
      toast.error('Erreur lors du chargement des types d\'examen');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingType(null);
    setFormData({ nom: '', description: '' });
    setModalOpen(true);
  };

  const handleEdit = (type: TypeExamen) => {
    setEditingType(type);
    setFormData({ 
      nom: type.nom, 
      description: type.description || '' 
    });
    setModalOpen(true);
  };

  const handleDelete = async (type: TypeExamen) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le type d'examen "${type.nom}" ?`)) {
      try {
        await adminService.deleteTypeExamen(type.id);
        toast.success('Type d\'examen supprimé avec succès');
        loadTypesExamen();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression du type d\'examen');
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
      if (editingType) {
        await adminService.updateTypeExamen(editingType.id, formData);
        toast.success('Type d\'examen modifié avec succès');
      } else {
        await adminService.createTypeExamen(formData);
        toast.success('Type d\'examen créé avec succès');
      }
      
      setModalOpen(false);
      loadTypesExamen();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde du type d\'examen');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <EntityTable
        title="Gestion des types d'examen"
        data={typesExamen}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <EntityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingType ? 'Modifier le type d\'examen' : 'Ajouter un type d\'examen'}
        onSubmit={handleSubmit}
        loading={submitting}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nom du type d'examen"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Description du type d'examen"
            />
          </div>
        </div>
      </EntityModal>
    </>
  );
};

export default AdminTypesExamen;