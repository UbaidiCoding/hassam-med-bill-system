
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, Download, AlertTriangle, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StockItem {
  medicineName: string;
  batchNumber: string;
  expiry: string;
  quantity: number;
  mrp: number;
  purchaseRate: number;
  supplier: string;
}

const StockManagement = () => {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').slice(1); // Skip header
      
      const parsedData: StockItem[] = rows
        .filter(row => row.trim())
        .map(row => {
          const columns = row.split(',');
          return {
            medicineName: columns[0]?.trim() || '',
            batchNumber: columns[1]?.trim() || '',
            expiry: columns[2]?.trim() || '',
            quantity: parseInt(columns[3]?.trim()) || 0,
            mrp: parseFloat(columns[4]?.trim()) || 0,
            purchaseRate: parseFloat(columns[5]?.trim()) || 0,
            supplier: columns[6]?.trim() || '',
          };
        });

      setStockData(parsedData);
      toast({
        title: "Stock Uploaded Successfully",
        description: `${parsedData.length} items loaded from CSV`,
      });
    };
    reader.readAsText(file);
  };

  const filteredStock = stockData.filter(item =>
    item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLowStock = (quantity: number) => quantity < 10;
  const isExpiringSoon = (expiry: string) => {
    const expiryDate = new Date(expiry);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      "Medicine Name,Batch Number,Expiry,Quantity,MRP,Purchase Rate,Supplier",
      "Panadol 500mg,B001,2025-12-31,50,5.50,4.00,PharmaCorp",
      "Augmentin 625mg,B002,2025-10-15,25,45.00,35.00,MediSupply",
      "Brufen 400mg,B003,2025-11-20,30,8.75,6.50,HealthPlus"
    ];
    
    const csvContent = sampleData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_stock_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Stock Management</h2>
        <div className="flex space-x-3">
          <Button onClick={downloadSampleCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Sample CSV
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search medicines or suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">{stockData.length}</p>
            <p className="text-sm text-gray-600">Total Items</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-600" />
            <p className="text-2xl font-bold text-red-600">
              {stockData.filter(item => isLowStock(item.quantity)).length}
            </p>
            <p className="text-sm text-gray-600">Low Stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Table */}
      {stockData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Medicine Inventory</CardTitle>
            <CardDescription>
              Current stock levels and medicine details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Medicine</th>
                    <th className="text-left p-3 font-semibold">Batch</th>
                    <th className="text-left p-3 font-semibold">Expiry</th>
                    <th className="text-left p-3 font-semibold">Qty</th>
                    <th className="text-left p-3 font-semibold">MRP</th>
                    <th className="text-left p-3 font-semibold">Purchase Rate</th>
                    <th className="text-left p-3 font-semibold">Supplier</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStock.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{item.medicineName}</td>
                      <td className="p-3">{item.batchNumber}</td>
                      <td className="p-3">{item.expiry}</td>
                      <td className="p-3">
                        <span className={isLowStock(item.quantity) ? 'text-red-600 font-bold' : ''}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="p-3">Rs. {item.mrp.toFixed(2)}</td>
                      <td className="p-3">Rs. {item.purchaseRate.toFixed(2)}</td>
                      <td className="p-3">{item.supplier}</td>
                      <td className="p-3">
                        <div className="flex flex-col space-y-1">
                          {isLowStock(item.quantity) && (
                            <Badge variant="destructive" className="text-xs">Low Stock</Badge>
                          )}
                          {isExpiringSoon(item.expiry) && (
                            <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                              Expiring Soon
                            </Badge>
                          )}
                          {!isLowStock(item.quantity) && !isExpiringSoon(item.expiry) && (
                            <Badge variant="secondary" className="text-xs">Good</Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Stock Data</h3>
            <p className="text-gray-500 mb-4">Upload a CSV file to get started with stock management</p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Stock CSV
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockManagement;
