import { useState } from 'react';
import axios from '../../lib/axios';

export default function PaymentVerification() {
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reference.trim()) {
      setResult({ success: false, message: 'Please enter a payment reference' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`/Payment/verify?reference=${reference.trim()}`);
      setResult({ 
        success: true, 
        message: response.data.message || 'Payment verified successfully' 
      });
      setReference(''); // Clear input on success
    } catch (error: any) {
      setResult({ 
        success: false, 
        message: error.response?.data?.message || 'Failed to verify payment' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearResult = () => {
    setResult(null);
    setReference('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Payment Verification</h1>
          <p className="text-text-secondary">Manually verify student payments using transaction reference</p>
        </div>
      </div>

      {/* Verification Form */}
      <div className="bg-white rounded-lg shadow max-w-2xl">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-text-primary">Verify Payment</h3>
          <p className="text-sm text-text-secondary mt-1">
            Enter the payment reference number provided by the student to verify their payment status with Paystack
          </p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleVerifyPayment} className="space-y-4">
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-text-primary mb-2">
                Payment Reference *
              </label>
              <input
                id="reference"
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g., FMCSFb9593b6a"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-text-tertiary">
                The reference number is typically in the format: SchoolInitials + SF + 8 characters
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading || !reference.trim()}
                className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verify Payment
                  </>
                )}
              </button>
              
              {(reference || result) && (
                <button
                  type="button"
                  onClick={handleClearResult}
                  className="px-4 py-2.5 border border-neutral-300 rounded-lg text-text-primary hover:bg-neutral-50 transition-colors"
                  disabled={isLoading}
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Result Display */}
          {result && (
            <div className={`mt-6 p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {result.success ? (
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <div className="flex-1">
                  <h4 className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.success ? 'Success' : 'Failed'}
                  </h4>
                  <p className={`text-sm mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">How to Use</h4>
            <ul className="text-sm text-blue-800 space-y-1.5">
              <li>• Ask the student for their payment reference number</li>
              <li>• Enter the reference in the field above and click "Verify Payment"</li>
              <li>• The system will check with Paystack and update the payment status</li>
              <li>• Use this when webhooks fail or for manual confirmation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
