import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Mail, Settings, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const quickActions = [
    {
      title: 'Importer des candidats',
      description: 'Téléversez un fichier Excel contenant la liste des candidats',
      icon: Upload,
      href: '/import',
      color: 'bg-blue-500',
    },
    {
      title: 'Générer convocations',
      description: 'Créez les convocations à partir d\'un modèle Word',
      icon: FileText,
      href: '/generate',
      color: 'bg-green-500',
    },
    {
      title: 'Envoyer par email',
      description: 'Envoyez les convocations PDF par email aux candidats',
      icon: Mail,
      href: '/email',
      color: 'bg-purple-500',
    },
    {
      title: 'Administration',
      description: 'Gérez les villes, adresses, certifications et autres entités',
      icon: Settings,
      href: '/admin/villes',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Bienvenue dans le système de gestion des convocations d'examen EPSI/WIS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className="group block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {action.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500">{action.description}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Statistiques récentes</h2>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-500">Sessions traitées</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-500">Convocations générées</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-500">Emails envoyés</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;