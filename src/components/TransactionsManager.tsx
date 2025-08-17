import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { Transaction, User } from "../types/api";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  AlertCircle,
} from "lucide-react";

export function TransactionsManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await apiService.getUsers();
      setUsers(Array.isArray(response) ? response : []);
    } catch {
      setUsers([]);
    }
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await apiService.getTransactions();
      setTransactions(Array.isArray(response) ? response : []);
    } catch {
      setError("Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fix: add explicit types for filter/map/reduce
  const filteredTransactions: Transaction[] = transactions.filter(
    (transaction: Transaction) =>
      statusFilter === "all" || transaction.status === statusFilter
  );
  const totalAmount = filteredTransactions.reduce(
    (sum: number, t: Transaction) => sum + t.amount,
    0
  );
  const completedTransactions = filteredTransactions.filter(
    (t: Transaction) => t.status === "completed"
  );
  const pendingTransactions = filteredTransactions.filter(
    (t: Transaction) => t.status === "pending"
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            title="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {completedTransactions.length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingTransactions.length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ArrowDownLeft className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Card Row */}
      <div className="flex flex-col gap-2">
        {filteredTransactions.map((transaction: Transaction) => {
          const sender = users.find((u: User) => u.id === transaction.senderID);
          const receiver = users.find(
            (u: User) => u.id === transaction.receiverID
          );
          return (
            <div
              key={transaction.id}
              className="bg-white rounded-lg shadow-lg border-[1.5px] border-gray-300 p-4 px-12 flex flex-row items-center justify-between gap-6 w-full"
            >
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">
                  ID: #{transaction.id}
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700">
                  From User
                </span>
                {sender ? (
                  <span className="font-semibold text-gray-800">
                    {sender.firstName} {sender.lastName}
                  </span>
                ) : (
                  <span className="text-gray-400">
                    User #{transaction.senderID}
                  </span>
                )}
                <span className="text-xs text-gray-500">{sender?.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700">
                  To User
                </span>
                {receiver ? (
                  <span className="font-semibold text-gray-800">
                    {receiver.firstName} {receiver.lastName}
                  </span>
                ) : (
                  <span className="text-gray-400">
                    User #{transaction.receiverID}
                  </span>
                )}
                <span className="text-xs text-gray-500">{receiver?.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-lg font-bold text-gray-900">
                  {transaction.amount} {transaction.currency}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Method</span>
                <span className="text-sm text-gray-800">
                  {transaction.method}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-xs text-gray-500">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
