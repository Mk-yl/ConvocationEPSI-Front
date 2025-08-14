import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { Ville } from '../../types';
import EntityTable from '../../components/admin/EntityTable';
import EntityModal from '../../components/admin/EntityModal';

const AdminVilles: React.FC = () => {
  const [villes, setVilles] = useState<Ville[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVille, setEditingVille] = useState<Ville | null>(null);
  const [formData, setFormData] = useState({ nom: '' });
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    { key: 'id' as keyof Ville, label: 'ID' },
    { key: 'nom' as keyof Ville, label: 'Nom' },
  ];

  useEffect(() => {
    loadVilles();
  }, []);

  const loadVilles = async () => {
    try {
      setLoading(true);
      const data = await adminService.getVilles();
      setVilles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des villes:', error);
      toast.error('Erreur lors du chargement des villes');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingVille(null);
    setFormData({ nom: '' });
    setModalOpen(true);
  };

  const handleEdit = (ville: Ville) => {
    setEditingVille(ville);
    setFormData({ nom: ville.nom });
    setModalOpen(true);
  };

  const handleDelete = async (ville: Ville) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la ville "${ville.nom}" ?`)) {
      try {
        await adminService.deleteVille(ville.id);
        toast.success('Ville supprimée avec succès');
        loadVilles();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de la ville');
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
      if (editingVille) {
        await adminService.updateVille(editingVille.id, formData);
        toast.success('Ville modifiée avec succès');
      } else {
        await adminService.createVille(formData);
        toast.success('Ville créée avec succès');
      }
      
      setModalOpen(false);
      loadVilles();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la ville');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <EntityTable
        title="Gestion des villes"
        data={villes}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <EntityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingVille ? 'Modifier la ville' : 'Ajouter une ville'}
        onSubmit={handleSubmit}
        loading={submitting}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la ville *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nom de la ville"
            />
          </div>
        </div>
      </EntityModal>
    </>
  );
};

export default AdminVilles;