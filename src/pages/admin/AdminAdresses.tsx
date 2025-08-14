import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { Adresse } from '../../types';
import EntityTable from '../../components/admin/EntityTable';
import EntityModal from '../../components/admin/EntityModal';

const AdminAdresses: React.FC = () => {
  const [adresses, setAdresses] = useState<Adresse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdresse, setEditingAdresse] = useState<Adresse | null>(null);
  const [formData, setFormData] = useState({ rue: '' });
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    { key: 'id' as keyof Adresse, label: 'ID' },
    { key: 'rue' as keyof Adresse, label: 'Rue' },
  ];

  useEffect(() => {
    loadAdresses();
  }, []);

  const loadAdresses = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdresses();
      setAdresses(data);
    } catch (error) {
      console.error('Erreur lors du chargement des adresses:', error);
      toast.error('Erreur lors du chargement des adresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAdresse(null);
    setFormData({ rue: '' });
    setModalOpen(true);
  };

  const handleEdit = (adresse: Adresse) => {
    setEditingAdresse(adresse);
    setFormData({ rue: adresse.rue });
    setModalOpen(true);
  };

  const handleDelete = async (adresse: Adresse) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'adresse "${adresse.rue}" ?`)) {
      try {
        await adminService.deleteAdresse(adresse.id);
        toast.success('Adresse supprimée avec succès');
        loadAdresses();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de l\'adresse');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.rue.trim()) {
      toast.error('La rue est requise');
      return;
    }

    try {
      setSubmitting(true);
      if (editingAdresse) {
        await adminService.updateAdresse(editingAdresse.id, formData);
        toast.success('Adresse modifiée avec succès');
      } else {
        await adminService.createAdresse(formData);
        toast.success('Adresse créée avec succès');
      }
      
      setModalOpen(false);
      loadAdresses();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de l\'adresse');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <EntityTable
        title="Gestion des adresses"
        data={adresses}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <EntityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAdresse ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
        onSubmit={handleSubmit}
        loading={submitting}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rue *
            </label>
            <input
              type="text"
              value={formData.rue}
              onChange={(e) => setFormData({ ...formData, rue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Adresse complète"
            />
          </div>
        </div>
      </EntityModal>
    </>
  );
};

export default AdminAdresses;