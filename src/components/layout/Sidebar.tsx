import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Upload, 
  FileText, 
  Mail, 
  Settings, 
  MapPin, 
  Building, 
  Award, 
  GraduationCap, 
  Clock, 
  Users ,
  BookOpen
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Import Candidats', href: '/import', icon: Upload },
  { name: 'Génération', href: '/generate', icon: FileText },
  { name: 'Envoi Email', href: '/email', icon: Mail },
  { name: 'Guide', href: '/guide', icon: BookOpen },

];

const adminNavigation = [
  { name: 'Villes', href: '/admin/villes', icon: MapPin },
  { name: 'Adresses', href: '/admin/adresses', icon: Building },
  { name: 'Certifications', href: '/admin/certifications', icon: Award },
  { name: 'Classes', href: '/admin/classes', icon: Users },
  { name: 'Types Examen', href: '/admin/types-examen', icon: GraduationCap },
  { name: 'Durées', href: '/admin/durees', icon: Clock },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-30">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <h1 className="text-white text-xl font-bold">ConvocationEPSI</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </div>
          
          <div className="pt-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administration
            </h3>
            <div className="mt-2 space-y-1">
              {adminNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;