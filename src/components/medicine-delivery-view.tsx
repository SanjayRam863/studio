"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Plus, Minus, Upload, Package } from "lucide-react";
import Image from 'next/image';

const sampleMedicines = [
  { id: 1, name: "Paracetamol 500mg", price: 20.50, image: "https://picsum.photos/200/200?random=1", dataAiHint: "medicine pills" },
  { id: 2, name: "Ibuprofen 200mg", price: 45.00, image: "https://picsum.photos/200/200?random=2", dataAiHint: "medicine pills" },
  { id: 3, name: "Amoxicillin 250mg", price: 75.00, image: "https://picsum.photos/200/200?random=3", dataAiHint: "medicine box" },
  { id: 4, name: "Cetirizine 10mg", price: 30.00, image: "https://picsum.photos/200/200?random=4", dataAiHint: "allergy pills" },
];

type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

export function MedicineDeliveryView() {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const addToCart = (medicine: typeof sampleMedicines[0]) => {
    setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === medicine.id);
        if (existingItem) {
            return prevCart.map(item => item.id === medicine.id ? {...item, quantity: item.quantity + 1} : item);
        }
        return [...prevCart, { ...medicine, quantity: 1 }];
    });
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart(prevCart => {
        return prevCart.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + delta;
                return newQuantity > 0 ? {...item, quantity: newQuantity} : null;
            }
            return item;
        }).filter(Boolean) as CartItem[];
    });
  }

  const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="flex gap-4 mb-6">
            <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search for medicines..." className="pl-8" />
            </div>
            <Button variant="outline"><Upload className="mr-2"/> Upload Prescription</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sampleMedicines.map(med => (
            <Card key={med.id}>
              <CardContent className="p-4">
                <div className="relative w-full h-32 mb-4">
                  <Image src={med.image} alt={med.name} fill style={{objectFit: 'cover'}} className="rounded-md" data-ai-hint={med.dataAiHint}/>
                </div>
                <h3 className="font-semibold text-md">{med.name}</h3>
                <p className="text-lg font-bold text-primary">₹{med.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => addToCart(med)}>
                    <ShoppingCart className="mr-2"/> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Your Cart</CardTitle>
            <CardDescription>Review and place your order.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length > 0 ? cart.map(item => (
                 <div key={item.id} className="flex justify-between items-center">
                    <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}><Minus/></Button>
                        <span>{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}><Plus/></Button>
                    </div>
                 </div>
            )) : (
                <p className="text-sm text-muted-foreground text-center py-8">Your cart is empty.</p>
            )}
          </CardContent>
          {cart.length > 0 && (
            <CardFooter className="flex-col items-stretch gap-4">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{totalCost}</span>
                </div>
                <Button className="w-full"><Package className="mr-2"/> Checkout</Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
