import React, { useState } from 'react';
import { Phone, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { IProProfile } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

import { CustomSelect, SelectOption } from '../ui/CustomSelect';

interface ProContactModalProps {
  pro: IProProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

const PROJECT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'Bornage / Topographie', label: 'Bornage contradictoire / Topographie', description: 'Délimitation officielle de parcelle, relevé altimétrique' },
  { value: 'Plans d’architecture & Permis', label: 'Conception de plans & Permis de construire', description: 'Plans 2D/3D, dossier MCLU, permis de construire' },
  { value: 'Gros Œuvre / Construction', label: 'Construction & Gros Œuvre', description: 'Fondations, béton armé, élévation, couverture' },
  { value: 'Électricité & Énergie', label: 'Installation Électrique & Solaire', description: 'Câblage, tableau électrique, panneaux solaires' },
  { value: 'Plomberie & Fluides', label: 'Plomberie & Assainissement', description: 'Alimentation eau, évacuation, fosse septique' },
  { value: 'Autre demande', label: 'Autre prestation spécifique', description: 'Expertise foncière, audit de chantier ou conseil' },
];

export const ProContactModal: React.FC<ProContactModalProps> = ({ pro, isOpen, onClose }) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('Bornage / Topographie');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!pro) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast('error', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      showToast('success', 'Votre demande de devis a été transmise avec succès au professionnel !');
    }, 800);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setName('');
    setPhone('');
    setMessage('');
    onClose();
  };

  const whatsappUrl = pro.phoneWhatsApp
    ? `https://wa.me/${pro.phoneWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Bonjour ${pro.companyName}, j’aimerais échanger avec vous pour une prestation BTP / Foncier via GayaBTP.`
      )}`
    : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Contacter ${pro.companyName}`}
      subtitle={`${pro.city}${pro.district ? ` • ${pro.district}` : ''}`}
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Demande transmise avec succès !
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              {pro.companyName} a reçu vos coordonnées et prendra contact avec vous dans les plus brefs délais.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Fermer
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          
          {/* Canaux d'échange directs rapides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-brand bg-slate-50 dark:bg-brand-dark border border-brand-light-border dark:border-brand-dark-border">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-brand bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discussion WhatsApp</span>
              </a>
            )}
            {pro.phoneCall && (
              <a
                href={`tel:${pro.phoneCall}`}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-brand bg-brand-secondary hover:bg-brand-secondary-hover text-white text-xs font-bold transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Appel direct</span>
              </a>
            )}
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-brand-light-border dark:border-brand-dark-border" />
            <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase">
              Ou formulaire de devis
            </span>
            <div className="flex-grow border-t border-brand-light-border dark:border-brand-dark-border" />
          </div>

          {/* Formulaire de devis */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Votre nom complet <span className="text-brand-urgent">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Koffi Jean-Marc"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Numéro de téléphone (Côte d’Ivoire) <span className="text-brand-urgent">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+225 07 00 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <CustomSelect
              label="Nature de votre projet"
              value={projectType}
              onChange={(val) => setProjectType(String(val))}
              options={PROJECT_TYPE_OPTIONS}
              modalTitle="Nature de votre projet"
            />

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Description de votre besoin <span className="text-brand-urgent">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Précisez la localisation du terrain/bâtiment, la superficie ou les délais souhaités..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-3.5 h-3.5" />}
              >
                Envoyer la demande
              </Button>
            </div>
          </form>

        </div>
      )}
    </Modal>
  );
};
