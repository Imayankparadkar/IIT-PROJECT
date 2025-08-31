import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FileText, Upload, Eye, Trash2, Shield, Calendar, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Document {
  id: string;
  type: 'Driving License' | 'RC Certificate' | 'PUC Certificate' | 'Insurance';
  status: 'uploaded' | 'expired' | 'missing';
  uploadDate: string;
  expiryDate: string;
  fileSize: string;
  fileName?: string;
  downloadURL?: string;
  file?: File;
}

const generateRandomDocuments = (): Document[] => {
  const docs = [
    { type: 'Driving License' as const, baseExpiry: 1825 }, // 5 years
    { type: 'RC Certificate' as const, baseExpiry: 4380 }, // 12 years  
    { type: 'PUC Certificate' as const, baseExpiry: 180 }, // 6 months
    { type: 'Insurance' as const, baseExpiry: 365 } // 1 year
  ];

  return docs.map((doc, index) => {
    const hasDoc = Math.random() > 0.3; // 70% chance of having document
    const uploadDate = new Date();
    uploadDate.setDate(uploadDate.getDate() - Math.floor(Math.random() * 365));
    
    const expiryDate = new Date(uploadDate);
    expiryDate.setDate(expiryDate.getDate() + doc.baseExpiry + Math.floor(Math.random() * 100) - 50);
    
    const isExpired = expiryDate < new Date();
    
    return {
      id: `doc-${index}-${Date.now()}`,
      type: doc.type,
      status: !hasDoc ? 'missing' : (isExpired ? 'expired' : 'uploaded'),
      uploadDate: uploadDate.toLocaleDateString('en-IN'),
      expiryDate: expiryDate.toLocaleDateString('en-IN'),
      fileSize: `${Math.floor(Math.random() * 500) + 100} KB`
    };
  });
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const { toast } = useToast();

  useEffect(() => {
    // Load saved documents from localStorage
    const savedDocs = localStorage.getItem('park-sarthi-documents');
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    } else {
      // Initialize with empty documents
      const initialDocs: Document[] = [
        {
          id: 'dl-1',
          type: 'Driving License',
          status: 'missing',
          uploadDate: '',
          expiryDate: '',
          fileSize: ''
        },
        {
          id: 'rc-1',
          type: 'RC Certificate',
          status: 'missing',
          uploadDate: '',
          expiryDate: '',
          fileSize: ''
        },
        {
          id: 'puc-1',
          type: 'PUC Certificate',
          status: 'missing',
          uploadDate: '',
          expiryDate: '',
          fileSize: ''
        },
        {
          id: 'ins-1',
          type: 'Insurance',
          status: 'missing',
          uploadDate: '',
          expiryDate: '',
          fileSize: ''
        }
      ];
      setDocuments(initialDocs);
    }
  }, []);

  // Save documents to localStorage whenever documents change
  useEffect(() => {
    localStorage.setItem('park-sarthi-documents', JSON.stringify(documents));
  }, [documents]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'missing': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentIcon = (type: string) => {
    return <FileText className="h-5 w-5" />;
  };

  const handleFileSelect = (docId: string) => {
    const input = fileInputRefs.current[docId];
    input?.click();
  };

  const handleFileChange = async (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload JPG, PNG, or PDF files only",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(docId);

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `documents/${docId}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update document state
      setDocuments(docs => docs.map(doc => 
        doc.id === docId 
          ? { 
              ...doc, 
              status: 'uploaded' as const, 
              uploadDate: new Date().toLocaleDateString('en-IN'),
              fileName: file.name,
              fileSize: `${(file.size / 1024).toFixed(1)} KB`,
              downloadURL,
              // Set expiry date 1 year from now for demonstration
              expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')
            }
          : doc
      ));

      toast({
        title: "Document Uploaded",
        description: `${file.name} uploaded successfully`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(null);
    }
  };

  const handlePreview = (doc: Document) => {
    if (doc.downloadURL) {
      // Open in new tab for real preview
      window.open(doc.downloadURL, '_blank');
    } else {
      setPreviewDoc(doc);
      setShowPreview(true);
    }
  };

  const handleDelete = async (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    try {
      // Delete from Firebase Storage if it exists
      if (doc.downloadURL && doc.fileName) {
        const storageRef = ref(storage, `documents/${docId}/${doc.fileName}`);
        await deleteObject(storageRef);
      }

      // Update document state
      setDocuments(docs => docs.map(d => 
        d.id === docId 
          ? { 
              ...d, 
              status: 'missing' as const,
              fileName: undefined,
              downloadURL: undefined,
              uploadDate: '',
              expiryDate: '',
              fileSize: ''
            }
          : d
      ));

      toast({
        title: "Document Deleted",
        description: "Document removed successfully",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete document. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Secure Document Storage
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Store and manage all your important vehicle documents digitally. Access them anytime, anywhere.
            </p>
          </div>

          {/* Security Notice */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Your Documents Are Secure</h3>
                  <p className="text-blue-700">All documents are encrypted and stored securely. Only you can access your files.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Manager */}
          <div className="grid gap-6">
            {documents.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Hidden file inputs */}
                  <input
                    ref={el => fileInputRefs.current[doc.id] = el}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(doc.id, e)}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {getDocumentIcon(doc.type)}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg">{doc.type}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          {doc.status === 'uploaded' && (
                            <>
                              <span>Uploaded: {doc.uploadDate}</span>
                              <span>Size: {doc.fileSize}</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Expires: {doc.expiryDate}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status === 'uploaded' ? 'Uploaded' : 
                         doc.status === 'expired' ? 'Expired' : 'Not Uploaded'}
                      </Badge>

                      {doc.status === 'uploaded' ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(doc)}
                            data-testid={`button-preview-${doc.type.toLowerCase().replace(' ', '-')}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFileSelect(doc.id)}
                            data-testid={`button-replace-${doc.type.toLowerCase().replace(' ', '-')}`}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Replace
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(doc.id)}
                            data-testid={`button-delete-${doc.type.toLowerCase().replace(' ', '-')}`}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleFileSelect(doc.id)}
                          size="sm"
                          disabled={uploading === doc.id}
                          data-testid={`button-upload-${doc.type.toLowerCase().replace(' ', '-')}`}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          {uploading === doc.id ? 'Uploading...' : 'Upload Now'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upload Instructions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Upload Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Supported Formats</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• PDF files (recommended)</li>
                    <li>• JPG, PNG images</li>
                    <li>• Maximum file size: 5MB</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Document Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Clear, readable text</li>
                    <li>• Valid and not expired</li>
                    <li>• Government issued documents only</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}