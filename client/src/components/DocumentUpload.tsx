import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, FileText, CheckCircle, X, Eye, Calendar, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { emailService } from '@/lib/emailjs';

interface Document {
  id: string;
  type: 'driving_license' | 'registration' | 'puc' | 'insurance';
  name: string;
  status: 'not_uploaded' | 'uploading' | 'uploaded' | 'expired';
  uploadDate?: Date;
  expiryDate?: Date;
  fileSize?: number;
  fileName?: string;
  url?: string;
}

export default function DocumentUpload() {
  const { user } = useAuth();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'dl',
      type: 'driving_license',
      name: 'Driving License',
      status: 'not_uploaded'
    },
    {
      id: 'rc',
      type: 'registration',
      name: 'Vehicle Registration (RC)',
      status: 'not_uploaded'
    },
    {
      id: 'puc',
      type: 'puc',
      name: 'Pollution Certificate (PUC)',
      status: 'not_uploaded'
    },
    {
      id: 'insurance',
      type: 'insurance',
      name: 'Vehicle Insurance',
      status: 'not_uploaded'
    }
  ]);

  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const handleFileSelect = (documentId: string, file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload only PDF, JPG, or PNG files');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Start upload simulation
    simulateUpload(documentId, file);
  };

  const simulateUpload = (documentId: string, file: File) => {
    // Update document status to uploading
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, status: 'uploading' as const, fileName: file.name, fileSize: file.size }
        : doc
    ));

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Complete upload
        setTimeout(() => {
          const url = URL.createObjectURL(file);
          setDocuments(prev => prev.map(doc => 
            doc.id === documentId 
              ? { 
                  ...doc, 
                  status: 'uploaded' as const, 
                  uploadDate: new Date(),
                  url: url,
                  expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
                }
              : doc
          ));
          setUploadProgress(prev => ({ ...prev, [documentId]: 0 }));
          
          // Send email confirmation
          if (user?.email) {
            try {
              const docName = documents.find(d => d.id === documentId)?.name || 'Document';
              await emailService.sendDocumentUploadConfirmation(
                user.email,
                user.displayName || 'Customer',
                docName,
                file.name
              );
            } catch (error) {
              console.error('Failed to send email confirmation:', error);
            }
          }
          
          // Show success message
          alert(`${file.name} uploaded successfully!`);
        }, 500);
      }
      
      setUploadProgress(prev => ({ ...prev, [documentId]: Math.min(progress, 100) }));
    }, 200);
  };

  const handleUploadClick = (documentId: string) => {
    const input = fileInputRefs.current[documentId];
    if (input) {
      input.click();
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'uploading':
        return <Upload className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'expired':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'uploaded':
        return 'bg-green-100 text-green-800';
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Document['status']) => {
    switch (status) {
      case 'uploaded':
        return 'Uploaded';
      case 'uploading':
        return 'Uploading...';
      case 'expired':
        return 'Expired';
      default:
        return 'Not Uploaded';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Document Storage</h2>
        <p className="text-gray-600">Upload and manage your vehicle documents securely</p>
      </div>

      {/* Upload Progress Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Document Security</h3>
              <p className="text-sm text-blue-700">Your documents are encrypted and stored securely</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-900">
                {documents.filter(doc => doc.status === 'uploaded').length}/{documents.length}
              </p>
              <p className="text-sm text-blue-700">Uploaded</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((document) => (
          <Card key={document.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getStatusIcon(document.status)}
                  {document.name}
                </CardTitle>
                <Badge className={getStatusColor(document.status)}>
                  {getStatusText(document.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {document.status === 'uploading' && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uploading {document.fileName}</span>
                      <span>{Math.round(uploadProgress[document.id] || 0)}%</span>
                    </div>
                    <Progress value={uploadProgress[document.id] || 0} className="h-2" />
                  </div>
                )}

                {document.status === 'uploaded' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Uploaded:</span>
                      <span className="font-medium">
                        {document.uploadDate && formatDate(document.uploadDate)}
                      </span>
                    </div>
                    {document.expiryDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Expires:</span>
                        <span className="font-medium">
                          {formatDate(document.expiryDate)}
                        </span>
                      </div>
                    )}
                    {document.fileSize && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">{formatFileSize(document.fileSize)}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {document.status === 'uploaded' ? (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setPreviewDoc(document)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Document Preview</DialogTitle>
                          </DialogHeader>
                          {previewDoc && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h3 className="font-semibold">{previewDoc.name}</h3>
                                <p className="text-sm text-gray-600">{previewDoc.fileName}</p>
                              </div>
                              
                              <div className="bg-gray-100 p-8 rounded-lg text-center">
                                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">Document Preview</p>
                                <p className="text-sm text-gray-500">
                                  {previewDoc.fileName?.endsWith('.pdf') ? 'PDF Document' : 'Image Document'}
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Status:</span>
                                  <p className="font-medium text-green-600">Uploaded</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Size:</span>
                                  <p className="font-medium">
                                    {previewDoc.fileSize && formatFileSize(previewDoc.fileSize)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        size="sm" 
                        onClick={() => handleUploadClick(document.id)}
                        className="flex-1"
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Reupload
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => handleUploadClick(document.id)}
                      disabled={document.status === 'uploading'}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      {document.status === 'uploading' ? 'Uploading...' : 'Upload Now'}
                    </Button>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={el => fileInputRefs.current[document.id] = el}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileSelect(document.id, file);
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Guidelines */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">Upload Guidelines</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Accepted formats: PDF, JPG, PNG</li>
            <li>• Maximum file size: 5MB</li>
            <li>• Ensure documents are clear and readable</li>
            <li>• All documents are encrypted and stored securely</li>
            <li>• You will receive email confirmation after upload</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}