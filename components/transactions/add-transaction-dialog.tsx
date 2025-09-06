"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Receipt } from "lucide-react";

interface AddTransactionDialogProps {
  children: React.ReactNode;
}

export function AddTransactionDialog({ children }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleManualSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Mock implementation - would normally send to API
    console.log("[v0] Manual transaction submitted");
    setOpen(false);
  };

  const handleReceiptSubmit = async () => {
    if (!selectedFile) return;

    try {
      // Step 1: Upload file to bulk-upload endpoint
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/agent/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        console.error('Upload failed:', uploadResult.error);
        // Handle error - could show toast notification
        return;
      }

      // Step 2: Confirm and save transactions
      const confirmResponse = await fetch('/api/agent/confirm-bulk-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: uploadResult.transactions,
        }),
      });

      const confirmResult = await confirmResponse.json();

      if (confirmResult.success) {
        console.log('Transactions saved successfully:', confirmResult);
        // Handle success - could show success notification
        setOpen(false);
        setSelectedFile(null);
      } else {
        console.error('Save failed:', confirmResult.error);
        // Handle error - could show toast notification
      }
    } catch (error) {
      console.error('Error processing receipt:', error);
      // Handle error - could show toast notification
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Add a new transaction manually or by uploading a receipt.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="receipt">Upload Receipt</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Transaction description"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="groceries">Groceries</SelectItem>
                      <SelectItem value="transportation">
                        Transportation
                      </SelectItem>
                      <SelectItem value="entertainment">
                        Entertainment
                      </SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="bills">Bills & Utilities</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Account</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hdfc">HDFC Bank</SelectItem>
                      <SelectItem value="icici">ICICI Bank</SelectItem>
                      <SelectItem value="sbi">SBI Bank</SelectItem>
                      <SelectItem value="axis">Axis Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this transaction"
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Transaction</Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="receipt" className="space-y-4">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="font-medium">Upload Transactions</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload an image of your Transactions and we'll extract the
                    transaction details automatically
                  </p>
                </div>
                <div className="mt-4">
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <Label htmlFor="receipt-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </span>
                    </Button>
                  </Label>
                </div>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleReceiptSubmit} disabled={!selectedFile}>
                  Process Transactions
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
