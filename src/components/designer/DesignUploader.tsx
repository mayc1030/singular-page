import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { validateImageFile } from '../../utils/validation';
import { readFileAsDataURL } from '../../utils/imageUtils';
import { UploadCloud, FileImage, AlertCircle } from 'lucide-react';

export interface DesignUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUploaded: (dataUrl: string) => void;
}

export const DesignUploader: React.FC<DesignUploaderProps> = ({
  isOpen,
  onClose,
  onImageUploaded
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMsg(null);
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setErrorMsg(validation.errorMessage || 'Archivo inválido.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      onImageUploaded(dataUrl);
      onClose();
    } catch (e) {
      setErrorMsg('Ocurrió un error al leer el archivo. Intenta con otra imagen.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cargar Diseño o Logo Propio" maxWidth="md">
      <div className="flex flex-col gap-4">
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            dragActive
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-slate-700 bg-slate-950/60 hover:border-orange-500/60 hover:bg-slate-900/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.svg,.webp"
            onChange={handleChange}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-orange-600/20 text-orange-400 flex items-center justify-center mb-3">
            <UploadCloud size={28} />
          </div>
          <span className="font-bold text-sm text-slate-200">
            Arrastra tu imagen aquí o haz clic para examinar
          </span>
          <span className="text-xs text-slate-400 mt-1">
            Formatos soportados: PNG, JPG, SVG, WEBP (Máx. 12 MB)
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1">
            <FileImage size={14} className="text-emerald-400" />
            <span>Conserva transparencias automáticamente</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
