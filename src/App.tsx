import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { UsersManager } from "./components/UsersManager";
import { ApartmentsManager } from "./components/ApartmentsManager";
import { CategoriesManager } from "./components/CategoriesManager";
import { TransactionsManager } from "./components/TransactionsManager";
//import { TickerQManager } from './components/TickerQManager';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentView, setCurrentView] = useState("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "users":
        return <UsersManager />;
      case "apartments":
        return <ApartmentsManager />;
      case "categories":
        return <CategoriesManager />;
      case "transactions":
        return <TransactionsManager />;
      //case 'tickerq':
      //  return <TickerQManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
