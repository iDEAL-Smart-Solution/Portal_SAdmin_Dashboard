import { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axios';

type Bank = {
  id: number;
  name: string;
  code: string;
};

type PaymentAccount = {
  schoolId: string;
  schoolName: string;
  paystackSubaccountCode: string | null;
  paystackAccountName: string | null;
  paystackBankCode: string | null;
  paystackAccountNumber: string | null;
  paystackEnabled: boolean;
  paystackConnectedAt: string | null;
};

type ResolvedAccount = {
  accountName: string;
  accountNumber: string;
  bankCode: string;
};

export default function PaymentSettings() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [paymentAccount, setPaymentAccount] = useState<PaymentAccount | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [resolving, setResolving] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [resolvedAccount, setResolvedAccount] = useState<ResolvedAccount | null>(null);

  const schoolId = sessionStorage.getItem('SchoolId');

  useEffect(() => {
    fetchBanks();
    if (schoolId) {
      fetchPaymentAccount();
    }
  }, [schoolId]);

  const fetchPaymentAccount = async () => {
    if (!schoolId) return;
    
    try {
      const response = await axiosInstance.get<{ success: boolean; data: PaymentAccount }>(`/Payment/payment-account/${schoolId}`);
      if (response.data.success) {
        setPaymentAccount(response.data.data);
      }
    } catch (error: any) {
      // 404 means no account linked yet - that's okay
      if (error.response?.status !== 404) {
        console.error('Failed to load payment account');
      }
    } finally {
      setLoadingAccount(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await axiosInstance.get<{ data: Bank[] }>('/Payment/get-banks');
      setBanks(response.data.data || []);
    } catch (error) {
      console.error('Failed to load banks list:', error);
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleResolveAccount = async () => {
    if (!selectedBankCode || !accountNumber) {
      alert('Please select a bank and enter account number');
      return;
    }

    setResolving(true);
    setResolvedAccount(null);

    try {
      const response = await axiosInstance.post<{
        success: boolean;
        accountName: string;
        message: string;
      }>('/Payment/resolve-account', {
        bankCode: selectedBankCode,
        accountNumber,
      });

      if (response.data.success) {
        setResolvedAccount({
          accountName: response.data.accountName,
          accountNumber,
          bankCode: selectedBankCode,
        });
      } else {
        alert(response.data.message || 'Unable to verify account');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to verify account');
    } finally {
      setResolving(false);
    }
  };

  const handleConnectPaystack = async () => {
    if (!resolvedAccount || !schoolId) {
      alert('Please verify your account first');
      return;
    }

    setConnecting(true);

    try {
      const response = await axiosInstance.post<{
        success: boolean;
        message: string;
      }>(`/Payment/connect-paystack?schoolId=${schoolId}`, {
        bankCode: resolvedAccount.bankCode,
        accountNumber: resolvedAccount.accountNumber,
      });

      if (response.data.success) {
        alert(response.data.message);
        // Reset form
        setSelectedBankCode('');
        setAccountNumber('');
        setResolvedAccount(null);
        // Refresh account info
        fetchPaymentAccount();
      } else {
        alert(response.data.message);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to connect Paystack account');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Payment Settings</h1>
          <p className="text-text-secondary">Connect your bank account to receive payments from students</p>
        </div>
      </div>

      {/* Current Account Section */}
      {loadingAccount ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        </div>
      ) : paymentAccount?.paystackEnabled ? (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-text-primary">Connected Account</h3>
            <p className="text-sm text-text-secondary mt-1">
              Your payment account details
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Account Name</label>
                <p className="text-base font-semibold text-text-primary">
                  {paymentAccount.paystackAccountName || '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Account Number</label>
                <p className="text-base font-semibold text-text-primary">
                  {paymentAccount.paystackAccountNumber || '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Subaccount Code</label>
                <p className="text-base font-mono text-text-primary">
                  {paymentAccount.paystackSubaccountCode || '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Connected On</label>
                <p className="text-base text-text-primary">
                  {paymentAccount.paystackConnectedAt
                    ? new Date(paymentAccount.paystackConnectedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : '-'}
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-800">
                  Your payment account is active. Student payments will be automatically split and sent to this account.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Connect New Account Section - Only show if no account is linked */}
      {!paymentAccount?.paystackEnabled && !loadingAccount && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-text-primary">Connect Paystack Subaccount</h3>
            <p className="text-sm text-text-secondary mt-1">
              Enter your bank details to set up automated payment collection
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Bank Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Bank</label>
              <select
                value={selectedBankCode}
                onChange={(e) => setSelectedBankCode(e.target.value)}
                disabled={loadingBanks}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-neutral-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingBanks ? 'Loading banks...' : 'Select your bank'}
                </option>
                {banks.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Account Number</label>
              <input
                type="text"
                placeholder="Enter 10-digit account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Verify Button */}
            <button
              onClick={handleResolveAccount}
              disabled={!selectedBankCode || accountNumber.length !== 10 || resolving}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-white shadow-primary transition-colors hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resolving && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {resolving ? 'Verifying...' : 'Verify Account'}
            </button>

            {/* Resolved Account Display */}
            {resolvedAccount && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 mb-2">Account Verified</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-green-800">
                        <strong>Account Name:</strong> {resolvedAccount.accountName}
                      </p>
                      <p className="text-green-800">
                        <strong>Account Number:</strong> {resolvedAccount.accountNumber}
                      </p>
                    </div>
                    <p className="text-sm text-green-700 mt-3">
                      Please confirm this is your correct account before connecting.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Connect Button */}
            {resolvedAccount && (
              <button
                onClick={handleConnectPaystack}
                disabled={connecting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-primary transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connecting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {connecting ? 'Connecting...' : 'Confirm & Connect Account'}
              </button>
            )}

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-blue-800">
                  By connecting your account, you authorize us to create a Paystack subaccount for your school.
                  Student payments will be automatically split and sent to this account.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
