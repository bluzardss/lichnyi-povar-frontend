import React, { useState, useRef } from 'react';
import { useTelegram } from '../telegram/useTelegram';

interface PhotoUploadProps {
  onImageReady: (imageFile: File) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onImageReady }) => {
  const { hapticFeedback } = useTelegram();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTakePhoto = () => {
    hapticFeedback?.impactOccurred('light');
    fileInputRef.current?.click();
  };

  const handleUploadPhoto = () => {
    hapticFeedback?.impactOccurred('light');
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          setImageFile(compressedFile);
          setImageUrl(URL.createObjectURL(compressedFile));
          onImageReady(compressedFile);
        }, 'image/jpeg', 0.92);
      };
      img.src = event.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    hapticFeedback?.impactOccurred('light');
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Two Win95-style buttons */}
      <div className="flex flex-col sm:flex-row sm:space-x-3">
        {/* Camera button - Win95 raised */}
        <button
          onClick={handleTakePhoto}
          className="win95-raised flex-1 group flex flex-col items-center gap-3 px-6 py-5 rounded-button
            transition-all duration-150 hover:bg-white/30 active:scale-[0.98]"
          style={{ 
            borderColor: '#FFF #808080 #808080 #FFF',
            background: 'linear-gradient(180deg, #E0E0E0, #C0C0C0)',
            color: '#000'
          }}
        >
          <span className="text-4xl animate-bounce" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}>
            📷
          </span>
          <span className="text-sm font-bold">Сфотографировать продукты 🖥️</span>
        </button>

        {/* Gallery button - Win95 raised */}
        <button
          onClick={handleUploadPhoto}
          className="win95-raised flex-1 group flex flex-col items-center gap-3 px-6 py-5 rounded-button
            transition-all duration-150 hover:bg-white/30 active:scale-[0.98]"
          style={{ 
            borderColor: '#FFF #808080 #808080 #FFF',
            background: 'linear-gradient(180deg, #E0E0E0, #C0C0C0)',
            color: '#000'
          }}
        >
          <span className="text-4xl animate-bounce" style={{ animationDuration: '2s', animationIterationCount: 'infinite', animationDelay: '0.3s' }}>
            🖼️
          </span>
          <span className="text-sm font-bold">Загрузить из галереи 📁</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Image preview */}
      {imageUrl && (
        <div className="relative rounded-card overflow-hidden glass-elevated animate-slide-up">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-56 object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-3 right-3 w-10 h-10 rounded-button win95-raised flex items-center justify-center transition-all duration-150 hover:bg-white/50 active:scale-90"
            style={{ 
              borderColor: '#FFF #808080 #808080 #FFF',
              background: 'linear-gradient(180deg, #E0E0E0, #C0C0C0)',
              color: '#000',
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Placeholder when no image */}
      {!imageUrl && (
        <div className="h-56 glass rounded-card flex flex-col items-center justify-center gap-3 border border-border animate-slide-up">
          <span className="text-5xl animate-bounce" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}>
            📸
          </span>
          <p className="text-text-dim text-sm font-medium">Нет выбранного фото 🖥️</p>
          <p className="text-text-dim text-xs opacity-60">Нажми кнопку выше, чтобы добавить фото 📁</p>
        </div>
      )}
    </div>
  );
};
