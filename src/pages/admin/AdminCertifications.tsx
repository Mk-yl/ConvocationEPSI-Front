import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { Certification } from '../../types';
import EntityTable from '../../components/admin/EntityTable';
import EntityModal from '../../components/admin/EntityModal';

const AdminCertifications: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [formData, setFormData] = useState({ nom: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    { key: 'id' as keyof Certification, label: 'ID' },
    { key: 'nom' as keyof Certification, label: 'Nom' },
    { key: 'description' as keyof Certification, label: 'Description' },
  ];

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCertifications();
      setCertifications(data);
    } catch (error) {
      console.error('Erreur lors du chargement des certifications:', error);
      toast.error('Erreur lors du chargement des certifications');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCertification(null);
    setFormData({ nom: '', description: '' });
    setModalOpen(true);
  };

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setFormData({ 
      nom: certification.nom, 
      description: certification.description || '' 
    });
    setModalOpen(true);
  };

  const handleDelete = async (certification: Certification) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la certification "${certification.nom}" ?`)) {
      try {
        await adminService.deleteCertification(certification.id);
        toast.success('Certification supprimée avec succès');
        loadCertifications();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de la certification');
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
      if (editingCertification) {
        await adminService.updateCertification(editingCertification.id, formData);
        toast.success('Certification modifiée avec succès');
      } else {
        await adminService.createCertification(formData);
        toast.success('Certification créée avec succès');
      }
      
      setModalOpen(false);
      loadCertifications();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la certification');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <EntityTable
        title="Gestion des certifications"
        data={certifications}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <EntityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCertification ? 'Modifier la certification' : 'Ajouter une certification'}
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
              placeholder="Nom de la certification"
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
              placeholder="Description de la certification"
            />
          </div>
        </div>
      </EntityModal>
    </>
  );
};

export default AdminCertifications;