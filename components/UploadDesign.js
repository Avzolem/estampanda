"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function UploadDesign({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [designName, setDesignName] = useState("");
  const [removeBackground, setRemoveBackground] = useState(false);
  const [category, setCategory] = useState("other");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setDesignName(file.name.split(".")[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".svg", ".webp"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  });

  const handleUpload = async () => {
    if (!acceptedFiles[0]) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading("Uploading your design...");

    try {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      formData.append("name", designName);
      formData.append("category", category);
      formData.append("removeBackground", removeBackground);

      const response = await fetch("/api/upload/design", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success("Design uploaded successfully!", { id: loadingToast });
      
      if (onUploadComplete) {
        onUploadComplete(data.design);
      }

      resetForm();
    } catch (error) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setPreview(null);
    setDesignName("");
    setRemoveBackground(false);
    setCategory("other");
    acceptedFiles.length = 0;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-base-100 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Upload Your Sticker Design</h2>

        {!preview ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${isDragActive ? "border-primary bg-primary/5" : "border-base-300 hover:border-primary"}`}
          >
            <input {...getInputProps()} />
            <CloudArrowUpIcon className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
            {isDragActive ? (
              <p className="text-lg">Drop your design here...</p>
            ) : (
              <>
                <p className="text-lg mb-2">Drag & drop your design here</p>
                <p className="text-sm text-base-content/60">or click to browse</p>
                <p className="text-xs text-base-content/40 mt-4">
                  Supported formats: JPG, PNG, SVG, WebP (Max 50MB)
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-base-200 p-4">
              <button
                onClick={resetForm}
                className="absolute top-2 right-2 btn btn-circle btn-sm btn-ghost"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto max-h-64 mx-auto rounded-lg"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Design Name</span>
              </label>
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="input input-bordered"
                placeholder="Enter design name"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select select-bordered"
              >
                <option value="personal">Personal</option>
                <option value="business">Business</option>
                <option value="art">Art</option>
                <option value="meme">Meme</option>
                <option value="text">Text</option>
                <option value="logo">Logo</option>
                <option value="illustration">Illustration</option>
                <option value="photo">Photo</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Remove Background (AI)</span>
                <input
                  type="checkbox"
                  checked={removeBackground}
                  onChange={(e) => setRemoveBackground(e.target.checked)}
                  className="checkbox checkbox-primary"
                />
              </label>
              <p className="text-xs text-base-content/60 mt-1">
                Automatically remove background using AI
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="btn btn-primary flex-1"
              >
                {uploading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Uploading...
                  </>
                ) : (
                  "Upload Design"
                )}
              </button>
              <button
                onClick={resetForm}
                disabled={uploading}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}