"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowUpTrayIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB - Updated to match API limit
const ACCEPTED_FORMATS = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/svg+xml': ['.svg'],
  'image/webp': ['.webp'],
};

export default function FileUploader({ onFileUpload, uploadedFile }) {
  const [file, setFile] = useState(uploadedFile || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setError("");

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`El archivo es muy grande. Máximo 50MB.`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError(`Formato no válido. Usa JPG, PNG, SVG o WebP.`);
      } else {
        setError(`Error al subir el archivo. Intenta de nuevo.`);
      }
      return;
    }

    if (acceptedFiles.length === 0) return;

    const selectedFile = acceptedFiles[0];
    
    // Create local preview immediately
    const reader = new FileReader();
    reader.onload = async (readerEvent) => {
      const previewUrl = readerEvent.target.result;
      setPreview(previewUrl);
      setIsUploading(true);
      setFile(selectedFile);
      
      try {
        // Prepare FormData for upload
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('name', selectedFile.name.split('.')[0]);
        formData.append('category', 'user-upload');
        formData.append('tags', 'sticker,custom');
        formData.append('removeBackground', 'false');
        
        // Track upload progress
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        };
        
        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            
            if (response.success) {
              setIsUploading(false);
              setUploadProgress(100);
              
              // Call parent callback with Cloudinary URLs
              if (onFileUpload) {
                onFileUpload({
                  file: selectedFile,
                  preview: response.design.thumbnailUrl || previewUrl,
                  url: response.design.processedFileUrl,
                  originalUrl: response.design.originalFileUrl,
                  thumbnailUrl: response.design.thumbnailUrl,
                  previewUrl: response.design.previewUrl,
                  name: response.design.name,
                  size: selectedFile.size,
                  type: selectedFile.type,
                  dimensions: response.design.dimensions,
                  hasTransparency: response.design.hasTransparency,
                  designId: response.design.id,
                });
              }
            } else {
              throw new Error(response.error || 'Upload failed');
            }
          } else {
            throw new Error(`Upload failed with status ${xhr.status}`);
          }
        };
        
        xhr.onerror = () => {
          throw new Error('Network error during upload');
        };
        
        // Send request to our API endpoint
        xhr.open('POST', '/api/upload/design');
        xhr.send(formData);
        
      } catch (error) {
        console.error('Upload error:', error);
        setError(error.message || 'Error al subir el archivo. Intenta de nuevo.');
        setIsUploading(false);
        setFile(null);
        setPreview(null);
        setUploadProgress(0);
      }
    };
    reader.readAsDataURL(selectedFile);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setUploadProgress(0);
    setError("");
    if (onFileUpload) {
      onFileUpload(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Sube tu Diseño
        </h2>
        <span className="text-sm text-gray-500">Paso 1 de 5</span>
      </div>

      {!file ? (
        <>
          <div
            {...getRootProps()}
            className={`relative border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragActive
                ? isDragReject
                  ? "border-red-500 bg-red-50"
                  : "border-[#275D5C] bg-[#F5E6D3]/20 scale-[1.02]"
                : "border-gray-300 hover:border-[#275D5C] hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            
            <motion.div
              animate={{
                y: isDragActive ? -10 : 0,
                scale: isDragActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              {isDragActive ? (
                <ArrowUpTrayIcon className="w-20 h-20 text-[#275D5C] mb-4" />
              ) : (
                <CloudArrowUpIcon className="w-20 h-20 text-gray-400 mb-4" />
              )}

              <p className="text-xl font-semibold text-gray-700 mb-2">
                {isDragActive
                  ? isDragReject
                    ? "Archivo no válido"
                    : "Suelta aquí tu diseño"
                  : "Arrastra tu diseño aquí"}
              </p>
              
              <p className="text-gray-500 mb-4">
                o{" "}
                <span className="text-[#275D5C] font-semibold">
                  haz clic para seleccionar
                </span>
              </p>

              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {Object.keys(ACCEPTED_FORMATS).map((format) => (
                  <span
                    key={format}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm"
                  >
                    {format.split('/')[1].toUpperCase()}
                  </span>
                ))}
              </div>

              <p className="text-xs text-gray-400">
                Tamaño máximo: 50MB • Resolución recomendada: 300 DPI
              </p>
            </motion.div>

            {/* Floating decorative elements */}
            <motion.div
              className="absolute top-4 right-4 text-4xl"
              animate={{
                rotate: [0, 10, 0],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🎨
            </motion.div>
            
            <motion.div
              className="absolute bottom-4 left-4 text-4xl"
              animate={{
                rotate: [0, -10, 0],
                x: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ✨
            </motion.div>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
              >
                <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <PhotoIcon className="w-5 h-5 text-[#275D5C] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Alta calidad</p>
                <p className="text-xs text-gray-500">
                  Usa imágenes de al menos 1000x1000px
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-[#275D5C] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Sin fondo</p>
                <p className="text-xs text-gray-500">
                  PNG transparente para mejor resultado
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <DocumentIcon className="w-5 h-5 text-[#275D5C] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Vectores</p>
                <p className="text-xs text-gray-500">
                  SVG para máxima calidad
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {/* Upload progress */}
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                <div className="relative inline-block">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 border-4 border-gray-200 rounded-lg"
                  />
                  <motion.div
                    className="absolute inset-0 w-24 h-24 border-4 border-[#275D5C] rounded-lg"
                    style={{
                      borderTopColor: "transparent",
                      borderRightColor: "transparent",
                    }}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#275D5C]">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">Subiendo tu diseño...</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative bg-gradient-to-br from-[#F5E6D3]/30 to-white rounded-xl p-4"
              >
                <button
                  onClick={removeFile}
                  className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow z-10"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-600" />
                </button>

                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="relative w-32 h-32 bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <DocumentIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <CheckCircleIcon className="w-6 h-6 text-green-500 bg-white rounded-lg" />
                    </div>
                  </div>

                  {/* File info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1 pr-8">
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                    </p>
                    
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      className="h-2 bg-green-500 rounded-lg"
                    />
                    <p className="text-xs text-green-600 mt-2 font-semibold">
                      ✓ Archivo subido correctamente
                    </p>
                  </div>
                </div>

                {/* Success message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="text-sm text-green-700">
                    🎉 ¡Perfecto! Tu diseño está listo. Continúa con el siguiente paso.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}