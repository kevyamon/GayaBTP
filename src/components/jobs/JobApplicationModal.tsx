import React, { useState } from 'react';
import { Send, CheckCircle2, Upload, FileCheck, Phone, User, Mail } from 'lucide-react';
import { IJobOffer, jobService } from '../../services/job.service';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CustomSelect, SelectOption } from '../ui/CustomSelect';
import { useToast } from '../../contexts/ToastContext';

interface JobApplicationModalProps {
  job: IJobOffer | null;
  isOpen: boolean;
  onClose: () => void;
}

const EXPERIENCE_OPTIONS: SelectOption[] = [
  { value: 'Débutant / Étudiant', label: 'Débutant / Étudiant / Stagiaire' },
  { value: '1 à 3 ans', label: '1 à 3 ans d’expérience' },
  { value: '3 à 5 ans', label: '3 à 5 ans d’expérience' },
  { value: '5 à 10 ans', label: '5 à 10 ans d’expérience (Confirmé)' },
  { value: 'Plus de 10 ans', label: 'Plus de 10 ans (Senior / Expert)' },
];

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  const { success, error } = useToast();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('1 à 3 ans');
  const [coverNote, setCoverNote] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!job) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      error('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    setIsSubmitting(true);
    try {
      await jobService.applyToJob({
        jobId: job.id,
        fullName,
        phone,
        email: email || undefined,
        yearsOfExperience: experience,
        coverNote,
        resumeFileName: resumeFileName || undefined,
      });

      setIsSuccess(true);
      success('Candidature envoyée avec succès !', 'L’employeur a reçu votre dossier de candidature.');
    } catch {
      error('Une erreur est survenue lors de l’envoi de votre candidature.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFullName('');
    setPhone('');
    setEmail('');
    setCoverNote('');
    setResumeFileName('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Postuler : ${job.title}`}
      subtitle={`${job.companyName} • ${job.city}`}
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Candidature transmise avec succès !
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Votre dossier a été adressé au service recrutement de {job.companyName}. Vous serez contacté directement par téléphone.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Fermer
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                <User className="w-3.5 h-3.5 text-brand-primary" />
                <span>Nom &amp; Prénoms *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Kouassi Brou Marc"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-brand-secondary" />
                <span>Téléphone / WhatsApp *</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Ex : +225 07 01 02 03 04"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Adresse e-mail (Optionnelle)</span>
              </label>
              <input
                type="email"
                placeholder="Ex : marc.kouassi@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <CustomSelect
              label="Niveau d’expérience"
              value={experience}
              onChange={(val) => setExperience(String(val))}
              options={EXPERIENCE_OPTIONS}
              modalTitle="Niveau d’expérience"
            />
          </div>

          {/* Curriculum Vitae (CV) */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300">
              Curriculum Vitae / Références (PDF, DOCX, JPG)
            </label>
            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-brand p-3 text-center bg-slate-50/50 dark:bg-slate-900/40">
              {resumeFileName ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <FileCheck className="w-4 h-4" />
                  <span>{resumeFileName}</span>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-1.5 cursor-pointer text-brand-primary font-semibold hover:underline">
                  <Upload className="w-4 h-4" />
                  <span>Joindre mon CV</span>
                  <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          {/* Message de candidature */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300">
              Message d’accompagnement / Atouts
            </label>
            <textarea
              rows={3}
              placeholder="Présentez brièvement vos réalisations de chantiers ou votre disponibilité..."
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-2">
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
              Envoyer ma candidature
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
