"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { CloudArrowUpIcon, PhotoIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function QuickUploader() {
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        simulateUpload();
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".svg", ".webp"],
    },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
  });

  const resetUpload = () => {
    setPreview(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div
              {...getRootProps()}
              className={`relative border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragActive
                  ? "border-purple-500 bg-purple-50 scale-105"
                  : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"
              }`}
            >
              <input {...getInputProps()} />
              
              <motion.div
                animate={isDragActive ? { scale: 1.2 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CloudArrowUpIcon className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              </motion.div>

              <h3 className="text-lg font-semibold mb-2">
                {isDragActive ? "Suelta tu diseño aquí" : "Sube tu diseño"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Arrastra tu imagen o haz clic para seleccionar
              </p>
              
              <div className="flex flex-wrap justify-center gap-2">
                {["JPG", "PNG", "SVG", "AI"].map((format) => (
                  <span
                    key={format}
                    className="px-2 py-1 bg-gray-100 text-xs font-medium rounded-full"
                  >
                    {format}
                  </span>
                ))}
              </div>

              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isDragActive ? 1 : 0 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-contain rounded-lg"
              />
              
              {isUploading && (
                <motion.div
                  className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 border-4 border-purple-200 border-t-purple-600 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-sm font-medium text-gray-700">
                      Procesando... {uploadProgress}%
                    </p>
                  </div>
                </motion.div>
              )}

              {uploadProgress === 100 && !isUploading && (
                <motion.div
                  className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <CheckCircleIcon className="w-5 h-5" />
                </motion.div>
              )}
            </div>

            {uploadProgress === 100 && !isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 space-y-2"
              >
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-700">
                    Diseño listo
                  </span>
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                </div>
                
                <button
                  onClick={resetUpload}
                  className="w-full py-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Cambiar diseño
                </button>
              </motion.div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-gray-500">
          Máximo 50MB • Alta resolución recomendada
        </p>
      </motion.div>
    </div>
  );
}