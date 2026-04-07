/**
 * Upload Service
 * Reusable upload API helper for connecting to POST /api/upload
 * Handles multipart/form-data, auth tokens, and progress tracking
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Upload configuration presets
 */
export const UPLOAD_PRESETS = {
  image: {
    folder: 'uploads/images',
    resource_type: 'image',
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  audio: {
    folder: 'uploads/audio',
    resource_type: 'video', // Cloudinary uses 'video' for audio files
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'],
  },
  video: {
    folder: 'uploads/videos',
    resource_type: 'video',
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
  },
  document: {
    folder: 'uploads/documents',
    resource_type: 'auto',
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['application/pdf'],
  },
  default: {
    folder: 'uploads/others',
    resource_type: 'auto',
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['*'],
  },
};

/**
 * Get auth token from localStorage
 * @returns {string|null} Auth token
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Create axios instance with auth interceptor for upload
 * @returns {axios.AxiosInstance}
 */
const createUploadAxios = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 120000, // 2 minute timeout for large files
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} preset - Upload preset configuration
 * @returns {Object} Validation result
 */
export const validateFile = (file, preset = UPLOAD_PRESETS.default) => {
  const errors = [];

  // Check file exists
  if (!file) {
    return { valid: false, errors: ['No file selected'] };
  }

  // Check file size
  if (file.size > preset.maxSize) {
    const maxSizeMB = (preset.maxSize / (1024 * 1024)).toFixed(0);
    errors.push(`File size exceeds ${maxSizeMB}MB limit`);
  }

  // Check file type
  if (preset.allowedTypes[0] !== '*' && !preset.allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Format file size to human readable
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Upload a single file to Cloudinary via backend API
 * @param {File} file - File to upload
 * @param {Object} options - Upload options
 * @param {string} options.preset - Preset name (image, audio, video, document, default)
 * @param {Function} options.onProgress - Progress callback (0-100)
 * @param {AbortController} options.abortController - For canceling upload
 * @returns {Promise<Object>} Upload result with Cloudinary URL and metadata
 */
export const uploadFile = async (file, options = {}) => {
  const {
    preset = 'default',
    onProgress = () => {},
    abortController = null,
  } = options;

  const presetConfig = UPLOAD_PRESETS[preset] || UPLOAD_PRESETS.default;

  // Validate file first
  const validation = validateFile(file, presetConfig);
  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }

  // Create FormData for multipart/form-data request
  const formData = new FormData();
  formData.append('file', file);

  // Create axios instance
  const uploadAxios = createUploadAxios();

  // Add abort controller if provided
  if (abortController) {
    uploadAxios.defaults.signal = abortController.signal;
  }

  try {
    // Simulate progress for better UX (actual progress from axios is unreliable for FormData)
    let simulatedProgress = 0;
    const progressInterval = setInterval(() => {
      if (simulatedProgress < 90) {
        simulatedProgress += Math.random() * 15;
        onProgress(Math.min(Math.round(simulatedProgress), 90));
      }
    }, 500);

    // Make the upload request
    const response = await uploadAxios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Enable upload progress tracking
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          simulatedProgress = percentCompleted * 0.9; // Cap at 90% until response
          onProgress(simulatedProgress);
        }
      },
    });

    // Clear progress interval
    clearInterval(progressInterval);

    // Complete progress
    onProgress(100);

    // Validate response structure
    if (!response.data || response.data.success !== true) {
      throw new Error(response.data?.message || 'Upload failed');
    }

    // Return standardized result
    return {
      success: true,
      url: response.data.data.url,
      publicId: response.data.data.cloudinary?.public_id,
      metadata: response.data.data.metadata,
      cloudinary: response.data.data.cloudinary,
      uploadedAt: response.data.data.uploadedAt,
      // Preserve full response for debugging
      _rawResponse: response.data,
    };
  } catch (error) {
    clearInterval(progressInterval);
    onProgress(0);

    // Handle axios errors
    if (axios.isCancel(error)) {
      throw new Error('Upload cancelled');
    }

    // Extract error message
    const errorMessage = 
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Upload failed';

    throw new Error(errorMessage);
  }
};

/**
 * Upload multiple files sequentially
 * @param {File[]} files - Array of files to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object[]>} Array of upload results
 */
export const uploadMultipleFiles = async (files, options = {}) => {
  const results = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const result = await uploadFile(files[i], {
        ...options,
        onProgress: (progress) => {
          options.onProgress?.({
            current: i + 1,
            total: files.length,
            file: files[i].name,
            progress: progress,
            overallProgress: ((i + progress / 100) / files.length) * 100,
          });
        },
      });
      results.push(result);
    } catch (error) {
      errors.push({
        file: files[i].name,
        error: error.message,
      });
    }
  }

  return { results, errors };
};

/**
 * Get allowed file types for a preset
 * @param {string} preset - Preset name
 * @returns {string} Accepted file types string
 */
export const getAcceptedTypes = (preset) => {
  const config = UPLOAD_PRESETS[preset] || UPLOAD_PRESETS.default;
  if (config.allowedTypes[0] === '*') return '*/*';
  return config.allowedTypes.join(',');
};

/**
 * Get max file size for a preset
 * @param {string} preset - Preset name
 * @returns {number} Max size in bytes
 */
export const getMaxFileSize = (preset) => {
  const config = UPLOAD_PRESETS[preset] || UPLOAD_PRESETS.default;
  return config.maxSize;
};

export default {
  uploadFile,
  uploadMultipleFiles,
  validateFile,
  formatFileSize,
  getAcceptedTypes,
  getMaxFileSize,
  UPLOAD_PRESETS,
};
