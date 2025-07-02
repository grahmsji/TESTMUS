import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Upload, Send, AlertCircle } from 'lucide-react';

interface RequestForm {
  service: string;
  amount: number;
  description: string;
  beneficiary: string;
}

interface Service {
  id: string;
  name: string;
  maxAmount: number;
  description: string;
}

export default function ServiceRequest() {
  const [services, setServices] = useState<Service[]>([]);
  const [familyMembers, setFamilyMembers] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<RequestForm>();
  
  const watchedService = watch('service');
  const currentService = services.find(s => s.id === watchedService);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // TODO: Replace with actual API calls
      // const [servicesRes, familyRes] = await Promise.all([
      //   fetch('/api/services/active'),
      //   fetch('/api/member/family')
      // ]);
      // 
      // const servicesData = await servicesRes.json();
      // const familyData = await familyRes.json();
      // 
      // setServices(servicesData);
      // setFamilyMembers(['Moi-même', ...familyData.map(m => `${m.firstName} ${m.lastName} (${m.relationship})`)]);
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setLoading(false);
    }
  };

  const onSubmit = async (data: RequestForm) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // Object.keys(data).forEach(key => formData.append(key, data[key]));
      // selectedFiles.forEach(file => formData.append('documents', file));
      // 
      // await fetch('/api/member/requests', {
      //   method: 'POST',
      //   body: formData
      // });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccess(true);
      reset();
      setSelectedFiles([]);
      setSelectedService('');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Demande envoyée !</h2>
            <p className="text-gray-600 mb-6">
              Votre demande a été soumise avec succès. Vous recevrez une notification dès qu'elle sera traitée.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Nouvelle demande
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Demande de service</h1>
        <p className="text-gray-600 mt-2">Soumettez votre demande de prestation sociale</p>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {services.length > 0 ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Type de service
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <label key={service.id} className="relative">
                      <input
                        {...register('service', { required: 'Veuillez sélectionner un service' })}
                        type="radio"
                        value={service.id}
                        className="sr-only"
                        onChange={(e) => setSelectedService(e.target.value)}
                      />
                      <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        watchedService === service.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="text-center">
                          <FileText className={`h-8 w-8 mx-auto mb-2 ${
                            watchedService === service.id ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                          <p className="text-sm font-medium text-blue-600 mt-2">
                            Max: {service.maxAmount}€
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.service && (
                  <p className="mt-2 text-sm text-red-600">{errors.service.message}</p>
                )}
              </div>

              {/* Beneficiary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bénéficiaire
                </label>
                <select
                  {...register('beneficiary', { required: 'Veuillez sélectionner un bénéficiaire' })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez le bénéficiaire...</option>
                  {familyMembers.map((member) => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
                {errors.beneficiary && (
                  <p className="mt-1 text-sm text-red-600">{errors.beneficiary.message}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant demandé (€)
                </label>
                <input
                  {...register('amount', { 
                    required: 'Le montant est requis',
                    min: { value: 1, message: 'Le montant doit être supérieur à 0' },
                    max: { 
                      value: currentService?.maxAmount || 1000, 
                      message: `Le montant ne peut pas dépasser ${currentService?.maxAmount || 1000}€` 
                    }
                  })}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {currentService && (
                  <p className="mt-1 text-sm text-gray-500">
                    Montant maximum autorisé : {currentService.maxAmount}€
                  </p>
                )}
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description de la demande
                </label>
                <textarea
                  {...register('description', { required: 'La description est requise' })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Décrivez votre demande en détail..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pièces justificatives
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                      </p>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 10MB chacun)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Fichiers sélectionnés :</p>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{file.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Important</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Assurez-vous que tous les documents requis sont joints à votre demande. 
                      Les demandes incomplètes peuvent être retardées ou rejetées.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Soumettre la demande
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun service disponible</h3>
              <p className="mt-1 text-sm text-gray-500">Aucun service n'est actuellement disponible pour les demandes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}