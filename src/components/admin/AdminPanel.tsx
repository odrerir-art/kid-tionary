import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, BookOpen, BarChart3, Database, Flag, CreditCard, Menu, X, FileEdit, RefreshCw, ImageIcon } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminWords from './AdminWords';
import AdminAnalytics from './AdminAnalytics';
import DictionaryAdmin from '../dictionary/DictionaryAdmin';
import { FlaggedWordsManager } from './FlaggedWordsManager';
import { PayPalSettings } from './PayPalSettings';
import { BulkDefinitionReview } from './BulkDefinitionReview';
import { BulkDefinitionRegenerator } from './BulkDefinitionRegenerator';
import { BulkImageUploader } from './BulkImageUploader';


export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'words', label: 'Words', icon: BookOpen },
    { id: 'review', label: 'Review Definitions', icon: FileEdit },
    { id: 'regenerate', label: 'Regenerate Definitions', icon: RefreshCw },
    { id: 'images', label: 'Manage Images', icon: ImageIcon },
    { id: 'flagged', label: 'Flagged Words', icon: Flag },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'paypal', label: 'PayPal Settings', icon: CreditCard },
    { id: 'import', label: 'Import Data', icon: Database },
  ];


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'users': return <AdminUsers />;
      case 'words': return <AdminWords />;
      case 'review': return <BulkDefinitionReview />;
      case 'regenerate': return <BulkDefinitionRegenerator />;
      case 'images': return <BulkImageUploader />;
      case 'flagged': return <FlaggedWordsManager />;
      case 'analytics': return <AdminAnalytics />;
      case 'paypal': return <PayPalSettings />;
      case 'import': return <DictionaryAdmin />;
      default: return <AdminDashboard />;
    }
  };


  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={cn("bg-white border-r transition-all duration-300", sidebarOpen ? "w-64" : "w-0 overflow-hidden")}>
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-primary">Kid-tionary Admin</h2>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Button key={item.id} variant={activeTab === item.id ? 'default' : 'ghost'} className="w-full justify-start" onClick={() => setActiveTab(item.id)}>
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b p-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={() => window.location.href = '/'}>Back to App</Button>
        </header>
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  );
}
