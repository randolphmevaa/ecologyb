import React from 'react';
import {
  DocumentIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  TagIcon
} from "@heroicons/react/24/outline";

// Define TypeScript interfaces
interface Document {
  id: string;
  name: string;
  size: string;
  tag: string;
  date: string;
}

interface DocumentsListProps {
  documents: Document[];
  onRemoveDocument: (id: string) => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({ documents, onRemoveDocument }) => {
  if (documents.length === 0) {
    return null;
  }

  // Get tag color based on tag name
  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Cadre de contribution":
        return "bg-purple-100 text-purple-800";
      case "Attestation sur l'honneur":
        return "bg-green-100 text-green-800";
      case "Facture":
        return "bg-blue-100 text-blue-800";
      case "Devis":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents du devis</h3>
      
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tag
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taille
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <DocumentIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-900 truncate max-w-[200px]">{doc.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {doc.tag ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(doc.tag)}`}>
                      <TagIcon className="h-3 w-3 mr-1" />
                      {doc.tag}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-900"
                      title="Voir le document"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="text-green-600 hover:text-green-900"
                      title="Télécharger le document"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveDocument(doc.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer le document"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentsList;