import { useState } from 'react';
import { CalendarHeart, MapPin, Star, Clock, CheckCircle2, Navigation } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useData } from '../../data/DataContext';
import type { DemoAppointmentOption } from '../../types';

interface AppointmentFlowProps {
  profileId: string;
  onComplete: () => void;
}

export function AppointmentFlow({ profileId, onComplete }: AppointmentFlowProps) {
  const data = useData();
  const [step, setStep] = useState<'search' | 'results' | 'review' | 'confirmed'>('search');
  const [speciality, setSpeciality] = useState('Orthopaedic');
  const [location, setLocation] = useState('Bangalore');
  const [selectedOption, setSelectedOption] = useState<DemoAppointmentOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo hardcoded options
  const demoOptions: DemoAppointmentOption[] = [
    {
      id: 'opt-1',
      doctorName: 'Dr. Sharma',
      speciality: 'Orthopaedic Surgeon',
      hospital: 'Manipal Hospital',
      address: 'Old Airport Road, Bangalore',
      date: 'Tomorrow',
      time: '6:30 PM',
      fee: '₹1200'
    },
    {
      id: 'opt-2',
      doctorName: 'Dr. Reddy',
      speciality: 'Orthopaedic Specialist',
      hospital: 'Apollo Hospital',
      address: 'Bannerghatta Road, Bangalore',
      date: 'Tomorrow',
      time: '7:15 PM',
      fee: '₹1500'
    }
  ];

  const handleSearch = () => {
    setStep('results');
  };

  const handleSelect = (opt: DemoAppointmentOption) => {
    setSelectedOption(opt);
    setStep('review');
  };

  const handleConfirm = async () => {
    if (!selectedOption) return;
    setIsSubmitting(true);
    try {
      await data.createAppointmentRequest({
        profileId,
        speciality,
        location,
        preferredDate: selectedOption.date,
        preferredTime: selectedOption.time,
        hospitalPreference: selectedOption.hospital,
        selectedOption,
        status: 'requested',
        createdAt: new Date().toISOString()
      });
      
      await data.logAuditEvent({
        profileId,
        eventType: 'appointment_requested',
        timestamp: new Date().toISOString(),
        metadata: { hospital: selectedOption.hospital, doctor: selectedOption.doctorName }
      });

      setStep('confirmed');
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'search') {
    return (
      <Card className="p-5 mt-4 bg-white border-ivory-200 shadow-sm max-w-sm">
        <div className="flex items-center gap-2 mb-4">
          <CalendarHeart className="w-5 h-5 text-peach-500" />
          <h4 className="font-bold text-navy-900">Find Appointment</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-1 block">Speciality</label>
            <input 
              type="text" 
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-ivory-300 bg-ivory-50 text-sm focus:outline-none focus:border-sage-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-1 block">Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-ivory-300 bg-ivory-50 text-sm focus:outline-none focus:border-sage-500"
              />
            </div>
          </div>
          <Button className="w-full mt-2" onClick={handleSearch}>
            Search Availability
          </Button>
          <p className="text-[10px] text-center text-navy-400 mt-2">
            Appointment Agent Prototype (Demo Mode)
          </p>
        </div>
      </Card>
    );
  }

  if (step === 'results') {
    return (
      <div className="mt-4 max-w-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-navy-500 px-1">
          <span>Available slots for {speciality}</span>
          <button onClick={() => setStep('search')} className="text-sage-600 hover:underline">Edit</button>
        </div>
        
        {demoOptions.map((opt, i) => (
          <Card key={opt.id} className="p-0 overflow-hidden border-ivory-200 hover:border-sage-300 transition-colors">
            <div className="p-4 border-b border-ivory-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-navy-900">{opt.hospital}</h4>
                  <p className="text-sm text-navy-600">{opt.doctorName}</p>
                </div>
                <div className="flex items-center gap-1 bg-ivory-50 px-1.5 py-0.5 rounded text-xs font-bold text-navy-700">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  {4.8 - (i * 0.2)}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-navy-500">
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  {2.5 + i * 3.2} km away
                </span>
                <span className="flex items-center gap-1.5 font-medium text-navy-700">
                  ₹{opt.fee}
                </span>
              </div>
            </div>
            
            <div className="p-3 bg-ivory-50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-sm font-bold text-sage-700 bg-sage-100/50 px-2 py-1 rounded">
                <Clock className="w-4 h-4" />
                {opt.date}, {opt.time}
              </div>
              <Button size="sm" onClick={() => handleSelect(opt)}>
                Select
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (step === 'review' && selectedOption) {
    return (
      <Card className="p-5 mt-4 bg-white border-sage-200 shadow-sm max-w-sm ring-4 ring-sage-50">
        <h4 className="font-bold text-navy-900 text-lg mb-1">Review Request</h4>
        <p className="text-sm text-navy-500 mb-5">Please confirm the details below.</p>
        
        <div className="space-y-3 mb-6 bg-ivory-50 p-4 rounded-xl text-sm border border-ivory-200">
          <div className="flex justify-between">
            <span className="text-navy-500">Hospital</span>
            <span className="font-bold text-navy-900 text-right">{selectedOption.hospital}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-500">Doctor</span>
            <span className="font-bold text-navy-900 text-right">{selectedOption.doctorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-500">Time</span>
            <span className="font-bold text-sage-600 text-right">{selectedOption.date}, {selectedOption.time}</span>
          </div>
          <div className="flex justify-between border-t border-ivory-200 pt-3">
            <span className="text-navy-500">Est. Fee</span>
            <span className="font-bold text-navy-900 text-right">{selectedOption.fee}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setStep('results')} disabled={isSubmitting}>
            Back
          </Button>
          <Button className="flex-1 bg-navy-900 hover:bg-navy-800 text-white" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Confirming...' : 'Confirm'}
          </Button>
        </div>
      </Card>
    );
  }

  if (step === 'confirmed') {
    return (
      <Card className="p-6 mt-4 bg-sage-50 border-sage-200 shadow-sm max-w-sm text-center">
        <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-sage-600" />
        </div>
        <h4 className="font-bold text-navy-900 text-lg mb-2">Request Sent!</h4>
        <p className="text-sm text-sage-700 mb-4">
          We have forwarded your request to {selectedOption?.hospital}. You will be notified once confirmed.
        </p>
        <p className="text-[10px] text-sage-600 font-medium uppercase tracking-wider">
          Returning to chat...
        </p>
      </Card>
    );
  }

  return null;
}
