import { useEffect, useState } from 'react';
import { usePaymentStore } from '../../stores/payment-store';

export default function PaymentPage() {
  const { payments, isLoading, error, fetchPayments } = usePaymentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [termFilter, setTermFilter] = useState<string>('all');

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.studentUIN.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionReference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesTerm = termFilter === 'all' || payment.term === termFilter;

    return matchesSearch && matchesStatus && matchesTerm;
  });

  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    completed: payments.filter((p) => p.status === 'Completed').length,
    pending: payments.filter((p) => p.status === 'Pending').length,
    failed: payments.filter((p) => p.status === 'Failed').length,
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Completed: 'bg-green-100 text-green-800 border-green-200',
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Failed: 'bg-red-100 text-red-800 border-red-200',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = [
      'Student Name',
      'UIN',
      'Payment Type',
      'Amount',
      'Term',
      'Session',
      'Status',
      'Date Paid',
      'Reference',
    ];

    const rows = filteredPayments.map((p) => [
      p.studentName,
      p.studentUIN,
      p.paymentType,
      p.amount.toString(),
      p.term,
      p.session,
      p.status,
      new Date(p.datePaid).toLocaleString(),
      p.transactionReference,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">Error loading payments: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Payment Management</h1>
        <p className="text-text-secondary">Monitor and manage school payments</p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-text-primary rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-secondary">Total Revenue</p>
            <svg className="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-text-primary">₦{stats.total.toLocaleString()}</p>
            <p className="text-xs text-text-tertiary mt-1">From {payments.length} payments</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-secondary">Completed</p>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-text-primary">{stats.completed}</p>
            <p className="text-xs text-text-tertiary mt-1">Successful payments</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-secondary">Pending</p>
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-text-primary">{stats.pending}</p>
            <p className="text-xs text-text-tertiary mt-1">Awaiting confirmation</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-secondary">Failed</p>
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-text-primary">{stats.failed}</p>
            <p className="text-xs text-text-tertiary mt-1">Unsuccessful payments</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Filters</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-3 w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, UIN, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
          <select
            value={termFilter}
            onChange={(e) => setTermFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Terms</option>
            <option value="first">First Term</option>
            <option value="second">Second Term</option>
            <option value="third">Third Term</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-text-primary">
            Payment Records ({filteredPayments.length})
          </h3>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-text-tertiary">
              No payments found matching your criteria
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">UIN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Payment Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Term</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Session</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-4 whitespace-nowrap font-medium text-text-primary">{payment.studentName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-text-secondary">{payment.studentUIN}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-text-secondary">{payment.paymentType}</td>
                      <td className="px-4 py-4 whitespace-nowrap font-semibold text-text-primary">
                        ₦{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-text-secondary capitalize">{payment.term}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-text-secondary">{payment.session}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-text-secondary text-sm">
                        {new Date(payment.datePaid).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-text-tertiary">
                        {payment.transactionReference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
