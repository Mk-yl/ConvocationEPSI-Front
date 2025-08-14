import React, { useCallback, useId } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    accept?: string;
    selectedFile?: File | null;
    placeholder?: string;
    error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
                                                   onFileSelect,
                                                   accept,
                                                   selectedFile,
                                                   placeholder = 'Cliquez pour sélectionner un fichier ou glissez-déposez',
                                                   error,
                                               }) => {
    // Génère un ID unique pour chaque instance du composant
    const uniqueId = useId();

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                onFileSelect(files[0]);
            }
        },
        [onFileSelect]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                onFileSelect(files[0]);
            }
            // Reset l'input pour permettre la sélection du même fichier
            e.target.value = '';
        },
        [onFileSelect]
    );

    const removeFile = useCallback(() => {
        onFileSelect(null);
    }, [onFileSelect]);

    return (
        <div className="space-y-2">
            <div
                className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
                    error ? 'border-red-300' : ''
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileInput}
                    className="hidden"
                    id={uniqueId} // ID unique pour chaque instance
                />

                {selectedFile ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                            <Upload className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">{selectedFile.name}</span>
                        </div>
                        <button
                            type="button" // Évite la soumission du formulaire
                            onClick={removeFile}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <label htmlFor={uniqueId} className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">{placeholder}</p>
                    </label>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default FileUpload;