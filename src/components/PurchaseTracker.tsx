
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: 'purchase' | 'sale';
  medicine: string;
  quantity: number;
  rate: number;
  total: number;
  supplier: string;
  date: string;
  batchNumber: string;
}

const PurchaseTracker = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    type: 'purchase' as 'purchase' | 'sale',
    medicine: '',
    quantity: 0,
    rate: 0,
    supplier: '',
    batchNumber: '',
  });

  const addTransaction = () => {
    if (!newTransaction.medicine || newTransaction.quantity <= 0 || newTransaction.rate <= 0) {
      toast({
        title: "Invalid Transaction",
        description: "Please fill all required fields with valid values",
        variant: "destructive",
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      ...newTransaction,
      total: newTransaction.quantity * newTransaction.rate,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions(prev => [transaction, ...prev]);
    setNewTransaction({
      type: 'purchase',
      medicine: '',
      quantity: 0,
      rate: 0,
      supplier: '',
      batchNumber: '',
    });

    toast({
      title: "Transaction Added",
      description: `${transaction.type === 'purchase' ? 'Purchase' : 'Sale'} record added successfully`,
    });
  };

  const totalPurchases = transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + t.total, 0);

  const totalSales = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.total, 0);

  const todaysTransactions = transactions.filter(
    t => t.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Purchase & Sales Tracker</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">Rs. {totalPurchases.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Purchases</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">Rs. {totalSales.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Sales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{todaysTransactions.length}</p>
                <p className="text-sm text-gray-600">Today's Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Transaction */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Transaction</CardTitle>
            <CardDescription>Record purchase or sale transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select
                value={newTransaction.type}
                onValueChange={(value: 'purchase' | 'sale') => 
                  setNewTransaction(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="medicine">Medicine Name</Label>
              <Input
                id="medicine"
                value={newTransaction.medicine}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, medicine: e.target.value }))}
                placeholder="Enter medicine name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newTransaction.quantity}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="rate">Rate (Rs.)</Label>
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newTransaction.rate}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="supplier">
                {newTransaction.type === 'purchase' ? 'Supplier' : 'Customer'}
              </Label>
              <Input
                id="supplier"
                value={newTransaction.supplier}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, supplier: e.target.value }))}
                placeholder={`Enter ${newTransaction.type === 'purchase' ? 'supplier' : 'customer'} name`}
              />
            </div>

            <div>
              <Label htmlFor="batchNumber">Batch Number</Label>
              <Input
                id="batchNumber"
                value={newTransaction.batchNumber}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, batchNumber: e.target.value }))}
                placeholder="Enter batch number"
              />
            </div>

            {newTransaction.quantity > 0 && newTransaction.rate > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium">
                  Total: Rs. {(newTransaction.quantity * newTransaction.rate).toFixed(2)}
                </p>
              </div>
            )}

            <Button onClick={addTransaction} className="w-full">
              Add Transaction
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest purchase and sale records</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge 
                            variant={transaction.type === 'purchase' ? 'destructive' : 'default'}
                          >
                            {transaction.type === 'purchase' ? 'Purchase' : 'Sale'}
                          </Badge>
                          <span className="font-medium">{transaction.medicine}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {transaction.quantity} units × Rs. {transaction.rate.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.supplier} • {transaction.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">Rs. {transaction.total.toFixed(2)}</p>
                        {transaction.batchNumber && (
                          <p className="text-xs text-gray-500">Batch: {transaction.batchNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No transactions recorded yet</p>
                <p className="text-sm">Add your first transaction to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseTracker;
