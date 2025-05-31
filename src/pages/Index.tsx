
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, FileText, Phone, Mail, User, Plus, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import StockManagement from "@/components/StockManagement";
import BillingSystem from "@/components/BillingSystem";
import PurchaseTracker from "@/components/PurchaseTracker";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "stock":
        return <StockManagement />;
      case "billing":
        return <BillingSystem />;
      case "purchase":
        return <PurchaseTracker />;
      case "contact":
        return <ContactSection />;
      default:
        return <HomeSection setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Hassam Medical Store</h1>
                <p className="text-sm text-gray-600">Dr. Nasreem Shaikh</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">📞 0305-7071251</p>
              <Badge variant="secondary" className="mt-1">Management System</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: "home", label: "Home", icon: Package },
              { id: "stock", label: "Stock Management", icon: Package },
              { id: "purchase", label: "Purchase & Sales", icon: ShoppingCart },
              { id: "billing", label: "Billing", icon: FileText },
              { id: "contact", label: "Contact", icon: Phone },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Crafted with Care by Codewithsamiubaidi</p>
            <div className="flex justify-center items-center space-x-4 text-sm">
              <span className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>devsamiubaidi@gmail.com</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              © 2025 Hassam Medical Store Management System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const HomeSection = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Hassam Medical Store Management System
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Comprehensive solution for managing your medical store inventory, sales, and billing operations.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("stock")}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Stock Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Upload, view, and manage your medicine inventory with CSV support
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("purchase")}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">Purchase & Sales</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Track purchases and sales with real-time stock synchronization
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("billing")}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Smart Billing</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Generate professional invoices and receipts with WhatsApp integration
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">0</p>
              <p className="text-sm text-gray-600">Low Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">0</p>
              <p className="text-sm text-gray-600">Expiring Soon</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">Rs. 0</p>
              <p className="text-sm text-gray-600">Today's Sales</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ContactSection = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-3">Store Information</h3>
              <div className="space-y-2">
                <p><strong>Store Name:</strong> Hassam Medical Store</p>
                <p><strong>Owner:</strong> Dr. Nasreem Shaikh</p>
                <p><strong>Contact:</strong> 0305-7071251</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-3">Developer Information</h3>
              <div className="space-y-2">
                <p><strong>Developer:</strong> Codewithsamiubaidi</p>
                <p><strong>Email:</strong> devsamiubaidi@gmail.com</p>
                <p className="text-sm text-gray-600 italic">Crafted with Care</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
