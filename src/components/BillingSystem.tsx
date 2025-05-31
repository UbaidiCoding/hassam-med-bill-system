
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileText, Plus, Trash2, MessageCircle, Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BillItem {
  medicine: string;
  quantity: number;
  price: number;
  total: number;
}

interface Bill {
  customerName: string;
  salesperson: string;
  date: string;
  items: BillItem[];
  discount: number;
  tax: number;
  grandTotal: number;
}

const BillingSystem = () => {
  const [currentBill, setCurrentBill] = useState<Bill>({
    customerName: "",
    salesperson: "",
    date: new Date().toISOString().split('T')[0],
    items: [],
    discount: 0,
    tax: 0,
    grandTotal: 0,
  });

  const [newItem, setNewItem] = useState({
    medicine: "",
    quantity: 1,
    price: 0,
  });

  const addItem = () => {
    if (!newItem.medicine || newItem.price <= 0) {
      toast({
        title: "Invalid Item",
        description: "Please enter medicine name and valid price",
        variant: "destructive",
      });
      return;
    }

    const item: BillItem = {
      ...newItem,
      total: newItem.quantity * newItem.price,
    };

    setCurrentBill(prev => ({
      ...prev,
      items: [...prev.items, item],
    }));

    setNewItem({ medicine: "", quantity: 1, price: 0 });
    calculateTotal();
  };

  const removeItem = (index: number) => {
    setCurrentBill(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    calculateTotal();
  };

  const calculateTotal = () => {
    const subtotal = currentBill.items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * currentBill.discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * currentBill.tax) / 100;
    const grandTotal = taxableAmount + taxAmount;

    setCurrentBill(prev => ({
      ...prev,
      grandTotal,
    }));
  };

  const generateWhatsAppLink = () => {
    const message = `Hello! Your bill from Hassam Medical Store has been generated.\n\nAmount: Rs. ${currentBill.grandTotal.toFixed(2)}\nDate: ${currentBill.date}\n\nThank you for your business!\n- Hassam Medical Store`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/?text=${encodedMessage}`;
  };

  const printBill = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const billHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill - Hassam Medical Store</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .store-name { font-size: 20px; font-weight: bold; margin: 0; }
            .owner-name { font-size: 14px; margin: 5px 0; }
            .contact { font-size: 12px; margin: 5px 0; }
            .bill-details { margin: 20px 0; }
            .bill-details div { margin: 5px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f5f5f5; }
            .totals { margin: 20px 0; }
            .totals div { margin: 5px 0; display: flex; justify-content: space-between; }
            .grand-total { font-weight: bold; font-size: 16px; border-top: 2px solid #333; padding-top: 10px; }
            .note { margin-top: 20px; font-size: 12px; text-align: center; font-style: italic; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="store-name">Hassam Medical Store</h1>
            <p class="owner-name">Dr. Nasreem Shaikh</p>
            <p class="contact">📞 0305-7071251</p>
          </div>
          
          <div class="bill-details">
            <div><strong>Customer:</strong> ${currentBill.customerName || 'Walk-in Customer'}</div>
            <div><strong>Date:</strong> ${currentBill.date}</div>
            <div><strong>Salesperson:</strong> ${currentBill.salesperson || 'Admin'}</div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${currentBill.items.map(item => `
                <tr>
                  <td>${item.medicine}</td>
                  <td>${item.quantity}</td>
                  <td>Rs. ${item.price.toFixed(2)}</td>
                  <td>Rs. ${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div><span>Subtotal:</span><span>Rs. ${currentBill.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</span></div>
            ${currentBill.discount > 0 ? `<div><span>Discount (${currentBill.discount}%):</span><span>- Rs. ${((currentBill.items.reduce((sum, item) => sum + item.total, 0) * currentBill.discount) / 100).toFixed(2)}</span></div>` : ''}
            ${currentBill.tax > 0 ? `<div><span>Tax (${currentBill.tax}%):</span><span>Rs. ${((currentBill.items.reduce((sum, item) => sum + item.total, 0) * (1 - currentBill.discount/100) * currentBill.tax) / 100).toFixed(2)}</span></div>` : ''}
            <div class="grand-total"><span>Total:</span><span>Rs. ${currentBill.grandTotal.toFixed(2)}</span></div>
          </div>
          
          <div class="note">
            <strong>Note:</strong> Daway 3 din ke baad wapas nahi hongi. Shukriya! 🙏
          </div>
          
          <div class="footer">
            Developed by Codewithsamiubaidi<br>
            devsamiubaidi@gmail.com
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(billHTML);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Smart Billing System</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bill Creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Create New Bill</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={currentBill.customerName}
                  onChange={(e) => setCurrentBill(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="salesperson">Salesperson</Label>
                <Input
                  id="salesperson"
                  value={currentBill.salesperson}
                  onChange={(e) => setCurrentBill(prev => ({ ...prev, salesperson: e.target.value }))}
                  placeholder="Admin/Staff name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={currentBill.date}
                onChange={(e) => setCurrentBill(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <Separator />

            {/* Add Items */}
            <div>
              <Label className="text-lg font-semibold">Add Medicine</Label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
                <Input
                  placeholder="Medicine name"
                  value={newItem.medicine}
                  onChange={(e) => setNewItem(prev => ({ ...prev, medicine: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                />
                <Button onClick={addItem}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Items List */}
            {currentBill.items.length > 0 && (
              <div>
                <Label className="text-lg font-semibold">Items</Label>
                <div className="space-y-2 mt-2">
                  {currentBill.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{item.medicine}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          {item.quantity} × Rs. {item.price.toFixed(2)} = Rs. {item.total.toFixed(2)}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discount and Tax */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={currentBill.discount}
                  onChange={(e) => {
                    setCurrentBill(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }));
                    setTimeout(calculateTotal, 100);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="tax">Tax (%)</Label>
                <Input
                  id="tax"
                  type="number"
                  min="0"
                  value={currentBill.tax}
                  onChange={(e) => {
                    setCurrentBill(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }));
                    setTimeout(calculateTotal, 100);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bill Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Bill Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center border-b pb-4 mb-4">
              <h3 className="text-xl font-bold">Hassam Medical Store</h3>
              <p className="text-sm">Dr. Nasreem Shaikh</p>
              <p className="text-sm">📞 0305-7071251</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{currentBill.customerName || 'Walk-in Customer'}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{currentBill.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Salesperson:</span>
                <span>{currentBill.salesperson || 'Admin'}</span>
              </div>
            </div>

            <Separator className="my-4" />

            {currentBill.items.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  {currentBill.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.medicine} ({item.quantity})</span>
                      <span>Rs. {item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rs. {currentBill.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</span>
                  </div>
                  {currentBill.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({currentBill.discount}%):</span>
                      <span>- Rs. {((currentBill.items.reduce((sum, item) => sum + item.total, 0) * currentBill.discount) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  {currentBill.tax > 0 && (
                    <div className="flex justify-between">
                      <span>Tax ({currentBill.tax}%):</span>
                      <span>Rs. {((currentBill.items.reduce((sum, item) => sum + item.total, 0) * (1 - currentBill.discount/100) * currentBill.tax) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>Rs. {currentBill.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-600 italic mt-4 p-2 bg-gray-50 rounded">
                  <strong>Note:</strong> Daway 3 din ke baad wapas nahi hongi. Shukriya! 🙏
                </div>

                <div className="flex space-x-2 mt-6">
                  <Button onClick={printBill} className="flex-1">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Bill
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(generateWhatsAppLink(), '_blank')}
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Add items to generate bill
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingSystem;
