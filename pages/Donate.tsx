import React, { useState, useEffect } from 'react';
import { CreditCard, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { DonationFormData, FetchStatus } from '../types';
import { postData } from '../services/api';

const causes = [
  'General Fund',
  'Livelihood Enhancement',
  'Health & Nutrition',
  'Education & Skilling',
  'Women Empowerment',
  'Water & Environment',
  'Community Institutions'
];

const amounts = [500, 1000, 2500, 5000, 10000];

const Donate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DonationFormData>({
    cause: 'General Fund',
    amount: 1000,
    name: '',
    email: '',
    phone: '',
    city: '',
    screenshot: null
  });

  const [status, setStatus] = useState<FetchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const causeParam = searchParams.get('cause');
    if (causeParam && causes.includes(causeParam)) {
      setFormData(prev => ({ ...prev, cause: causeParam }));
    }
  }, [searchParams]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const payload = new FormData();
    payload.append('cause', formData.cause);
    payload.append('amount', formData.amount.toString());
    payload.append('name', formData.name);
    payload.append('email', formData.email);
    payload.append('phone', formData.phone);
    payload.append('city', formData.city);

    if (formData.screenshot) {
      payload.append('screenshot', formData.screenshot);
    }

    try {
      await postData('/api/donate', payload, true);
      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to submit donation. Please try again.');
    }
  };

  return (
    <div className="bg-surface min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary px-8 py-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <CreditCard className="mr-3" /> Make a Donation
          </h1>
          <p className="text-blue-100 mt-1">Your contribution brings hope.</p>
        </div>

        <div className="p-8">

          {/* SUCCESS SCREEN */}
          {status === 'success' ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your donation details have been submitted successfully.
                We will verify the transaction and send you a receipt shortly.
              </p>

              <button
                onClick={() => {
                  setStatus('idle');
                  setStep(1);
                  setFormData({
                    cause: 'General Fund',
                    amount: 1000,
                    name: '',
                    email: '',
                    phone: '',
                    city: '',
                    screenshot: null
                  });
                }}
                className="px-6 py-2 bg-primary text-white rounded hover:bg-secondary transition"
              >
                Donate Again
              </button>
            </div>
          ) : (

            <form onSubmit={handleSubmit}>

              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <h2 className="text-xl font-bold mb-6">Select a Cause</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {causes.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData({ ...formData, cause: c })}
                        className={`p-4 border rounded-lg ${
                          formData.cause === c
                            ? 'border-secondary bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <h2 className="text-xl font-bold mb-6">Enter Amount (INR)</h2>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {amounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFormData({ ...formData, amount: amt })}
                        className={`py-2 px-4 rounded border ${
                          formData.amount === amt
                            ? 'bg-secondary text-white'
                            : 'bg-white'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: Number(e.target.value) })
                    }
                    className="w-full border rounded p-3"
                  />
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-6">Scan to Pay</h2>

                  <img
                    src="/qr-code.jpeg"
                    alt="UPI QR"
                    className="w-48 h-48 mx-auto"
                  />

                  <p className="mt-4 text-sm text-gray-600">
                    Please take a screenshot after successful payment.
                  </p>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <>
                  <h2 className="text-xl font-bold mb-6">Your Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                      required
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="border rounded p-3"
                    />

                    <input
                      required
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="border rounded p-3"
                    />

                    <input
                      required
                      type="tel"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="border rounded p-3"
                    />

                    <input
                      required
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="border rounded p-3"
                    />
                  </div>

                  {/* Screenshot Upload */}
                  <input
                    required
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files
                        ? e.target.files[0]
                        : null;

                      if (file && file.size > 5 * 1024 * 1024) {
                        alert('File must be under 5MB');
                        return;
                      }

                      setFormData({ ...formData, screenshot: file });
                    }}
                    className="mb-4"
                  />

                  {status === 'error' && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 mt-0.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2 border rounded"
                  >
                    Back
                  </button>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto px-6 py-2 bg-secondary text-white rounded"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="ml-auto px-8 py-2 bg-primary text-white rounded flex items-center"
                  >
                    {status === 'loading' && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Complete Donation
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donate;