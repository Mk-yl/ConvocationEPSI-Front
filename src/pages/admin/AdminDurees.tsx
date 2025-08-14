import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { DureeEpreuve } from '../../types';
import EntityTable from '../../components/admin/EntityTable';
import EntityModal from '../../components/admin/EntityModal';

const AdminDurees: React.FC = () => {
  const [durees, setDurees] = useState<DureeEpreuve[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDuree, setEditingDuree] = useState<DureeEpreuve | null>(null);
  const [formData, setFormData] = useState({ nom: '' });
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    { key: 'id' as keyof DureeEpreuve, label: 'ID' },
    { key: 'nom' as keyof DureeEpreuve, label: 'Durée' },
  ];

  useEffect(() => {
    loadDurees();
  }, []);

  const loadDurees = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDurees();
      setDurees(data);
    } catch (error) {
      console.error('Erreur lors du chargement des durées:', error);
      toast.error('Erreur lors du chargement des durées');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDuree(null);
    setFormData({ nom: '' });
    setModalOpen(true);
  };

  const handleEdit = (duree: DureeEpreuve) => {
    setEditingDuree(duree);
    setFormData({ nom: duree.nom });
    setModalOpen(true);
  };

  const handleDelete = async (duree: DureeEpreuve) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la durée "${duree.nom}" ?`)) {
      try {
        await adminService.deleteDuree(duree.id);
        toast.success('Durée supprimée avec succès');
        loadDurees();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de la durée');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.nom.trim()) {
      toast.error('La durée est requise');
      return;
    }

    try {
      setSubmitting(true);
      if (editingDuree) {
        await adminService.updateDuree(editingDuree.id, formData);
        toast.success('Durée modifiée avec succès');
      } else {
        await adminService.createDuree(formData);
        toast.success('Durée créée avec succès');
      }
      
      setModalOpen(false);
      loadDurees();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la durée');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <EntityTable
        title="Gestion des durées d'épreuve"
        data={durees}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <EntityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDuree ? 'Modifier la durée' : 'Ajouter une durée'}
        onSubmit={handleSubmit}
        loading={submitting}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 2 heures, 3h30, 180 minutes"
            />
          </div>
        </div>
      </EntityModal>
    </>
  );
};

export default AdminDurees;