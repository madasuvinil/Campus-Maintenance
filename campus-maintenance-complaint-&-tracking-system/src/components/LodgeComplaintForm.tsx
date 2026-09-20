import React, { useState } from 'react';
import { 
  PlusCircle, 
  Building2, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  Zap, 
  Droplets, 
  Wind, 
  Hammer, 
  Sparkles, 
  Monitor, 
  ShieldAlert, 
  Wrench,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CategoryType, PriorityLevel, RequesterRole, Complaint } from '../types';
import { CAMPUS_BUILDINGS, CATEGORIES } from '../data/mockComplaints';

interface LodgeComplaintFormProps {
  onSubmitComplaint: (complaintData: Partial<Complaint>) => Promise<Complaint | null>;
  onNavigateToTracker: (ticketNumber: string) => void;
}

export const LodgeComplaintForm: React.FC<LodgeComplaintFormProps> = ({
  onSubmitComplaint,
  onNavigateToTracker
}) => {
  const [category, setCategory] = useState<CategoryType>('Electrical');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [building, setBuilding] = useState<string>(CAMPUS_BUILDINGS[0]);
  const [roomNumber, setRoomNumber] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [requesterName, setRequesterName] = useState<string>('');
  const [requesterEmail, setRequesterEmail] = useState<string>('');
  const [requesterPhone, setRequesterPhone] = useState<string>('');
  const [requesterRole, setRequesterRole] = useState<RequesterRole>('Student');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedTicket, setSubmittedTicket] = useState<Complaint | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !description.trim() || !roomNumber.trim()) {
      setErrorMessage('Please fill in all required fields (Issue title, room/location, and description).');
      return;
    }

    setIsSubmitting(true);
    try {
      const newTicket = await onSubmitComplaint({
        title,
        description,
        category,
        priority,
        building,
        roomNumber,
        requesterName: requesterName.trim() || 'Campus Student',
        requesterEmail: requesterEmail.trim() || 'student@campus.edu',
        requesterPhone: requesterPhone.trim() || '+91 98000 00000',
        requesterRole,
        photoUrl: photoPreview || undefined,
      });

      if (newTicket) {
        setSubmittedTicket(newTicket);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit complaint. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Electrical': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'Plumbing': return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'HVAC & AC': return <Wind className="w-4 h-4 text-cyan-500" />;
      case 'Carpentry & Furniture': return <Hammer className="w-4 h-4 text-stone-600" />;
      case 'Sanitation & Cleaning': return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'IT & Smart Classroom': return <Monitor className="w-4 h-4 text-indigo-500" />;
      case 'Civil & Safety': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      default: return <Wrench className="w-4 h-4 text-amber-600" />;
    }
  };

  if (submittedTicket) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
          Complaint Successfully Registered
        </span>
        <h2 className="text-2xl font-bold text-stone-900 mt-3 mb-1">
          Ticket #{submittedTicket.ticketNumber}
        </h2>
        <p className="text-stone-600 text-sm max-w-md mx-auto mb-6">
          Your maintenance complaint has been logged into the Campus Facilities Tracking System and dispatched to the maintenance dispatcher.
        </p>

        <div className="bg-stone-50 rounded-xl p-4 text-left mb-6 border border-stone-200 text-xs sm:text-sm space-y-2">
          <div className="flex justify-between py-1 border-b border-stone-200/60">
            <span className="text-stone-500">Issue:</span>
            <span className="font-semibold text-stone-900">{submittedTicket.title}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-200/60">
            <span className="text-stone-500">Category & Priority:</span>
            <span className="font-medium text-stone-800">{submittedTicket.category} • <strong className="text-amber-700">{submittedTicket.priority}</strong></span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-200/60">
            <span className="text-stone-500">Location:</span>
            <span className="text-stone-800">{submittedTicket.building}, {submittedTicket.roomNumber}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-stone-500">Target SLA Response:</span>
            <span className="text-emerald-700 font-medium">Within 12 hours</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigateToTracker(submittedTicket.ticketNumber)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-xl transition shadow-sm"
          >
            <span>Track Live Status Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSubmittedTicket(null);
              setTitle('');
              setDescription('');
              setRoomNumber('');
              setPhotoPreview(null);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-sm rounded-xl transition"
          >
            Lodge Another Complaint
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Banner */}
      <div className="bg-stone-900 text-white p-6 sm:p-8">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <PlusCircle className="w-4 h-4" />
          <span>Campus Facilities Service Request</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Lodge Maintenance Complaint
        </h2>
        <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl">
          Report infrastructure defects, electrical hazards, water issues, air conditioning failures, or civil repairs. Automatic ticket generation and SLA dispatch.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Category Selection Pills */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
            1. Select Maintenance Category <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name as CategoryType)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-600/20 text-stone-900'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="p-1 rounded-lg bg-white border border-stone-200">
                      {getCategoryIcon(cat.name)}
                    </span>
                    <span className="text-[10px] text-stone-500 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {cat.slaHours}h SLA
                    </span>
                  </div>
                  <span className="text-xs font-semibold">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Priority Selection */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
            2. Priority Level <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { level: 'Critical', desc: 'Active safety hazard / flood / sparks', color: 'border-rose-400 bg-rose-50/50 text-rose-900', activeRing: 'ring-rose-500' },
              { level: 'High', desc: 'Classroom / exam hall stoppage', color: 'border-amber-400 bg-amber-50/50 text-amber-900', activeRing: 'ring-amber-500' },
              { level: 'Medium', desc: 'Regular malfunction / room comfort', color: 'border-blue-400 bg-blue-50/50 text-blue-900', activeRing: 'ring-blue-500' },
              { level: 'Low', desc: 'Cosmetic / non-blocking repair', color: 'border-stone-300 bg-stone-50 text-stone-800', activeRing: 'ring-stone-400' },
            ].map((p) => {
              const isSelected = priority === p.level;
              return (
                <button
                  key={p.level}
                  type="button"
                  onClick={() => setPriority(p.level as PriorityLevel)}
                  className={`p-3 rounded-xl border text-left transition ${p.color} ${
                    isSelected ? `ring-2 ${p.activeRing} font-bold shadow-xs` : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>{p.level}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-current"></span>}
                  </div>
                  <p className="text-[10px] opacity-80 leading-snug">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Location Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Campus Building / Facility <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
              >
                {CAMPUS_BUILDINGS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Floor & Room / Spot Reference <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g., Room 302 (Floor 3) or West Washroom"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* 4. Issue Title & Description */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Defect Title / Summary <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Ceiling fan speed regulator sparking and burning smell"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describe what occurred, any strange noises, water flow, when it started, and specific instructions for maintenance technicians..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none resize-none"
              required
            />
          </div>
        </div>

        {/* 5. Photo upload mockup */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Attach Photo / Defect Evidence (Optional)
          </label>
          <div className="border-2 border-dashed border-stone-200 hover:border-amber-400 rounded-xl p-4 text-center cursor-pointer transition bg-stone-50/50">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload-input"
            />
            <label htmlFor="photo-upload-input" className="cursor-pointer">
              {photoPreview ? (
                <div className="flex flex-col items-center">
                  <img src={photoPreview} alt="Preview" className="h-28 object-cover rounded-lg border border-stone-200 mb-2" />
                  <span className="text-xs text-amber-700 font-medium">Click to change attached image</span>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <Upload className="w-6 h-6 text-stone-400 mb-1.5" />
                  <span className="text-xs font-medium text-stone-700">Click to upload photo evidence</span>
                  <span className="text-[11px] text-stone-500">PNG, JPG, WebP up to 5MB</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* 6. Requester Contact Information */}
        <div className="pt-4 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-3">
            Contact & Verification Details
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-stone-600 mb-1">Your Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-stone-600 mb-1">Campus Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="email"
                  placeholder="r.sharma@campus.edu"
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-stone-600 mb-1">Mobile / WhatsApp</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={requesterPhone}
                  onChange={(e) => setRequesterPhone(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-stone-600 mb-1">Campus Role</label>
              <select
                value={requesterRole}
                onChange={(e) => setRequesterRole(e.target.value as RequesterRole)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-amber-600"
              >
                <option value="Student">Student</option>
                <option value="Hostel Resident">Hostel Resident</option>
                <option value="Faculty">Faculty</option>
                <option value="Admin Staff">Admin Staff</option>
                <option value="Guest">Campus Guest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-xl transition shadow-sm disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Registering Ticket...' : 'Register Complaint'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
