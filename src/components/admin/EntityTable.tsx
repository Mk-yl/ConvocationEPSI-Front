import React from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import Button from '../ui/Button';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface EntityTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onAdd: () => void;
  loading?: boolean;
  title: string;
}

function EntityTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
  title,
}: EntityTableProps<T>) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <Button
          onClick={onAdd}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Ajouter
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Chargement...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                      Aucune donnée disponible
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      {columns.map((column) => (
                        <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {column.render ? column.render(item[column.key], item) : String(item[column.key] || '')}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => onEdit(item)}
                            variant="secondary"
                            size="sm"
                            leftIcon={<Edit className="h-4 w-4" />}
                          >
                            Modifier
                          </Button>
                          <Button
                            onClick={() => onDelete(item)}
                            variant="danger"
                            size="sm"
                            leftIcon={<Trash2 className="h-4 w-4" />}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EntityTable;