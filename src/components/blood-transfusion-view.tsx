"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const sampleDonors = [
  { id: 1, name: "John Smith", bloodGroup: "A+", location: "New York, NY" },
  { id: 2, name: "Emily Johnson", bloodGroup: "O-", location: "Los Angeles, CA" },
  { id: 3, name: "Michael Williams", bloodGroup: "B+", location: "Chicago, IL" },
  { id: 4, name: "Sarah Brown", bloodGroup: "AB+", location: "Houston, TX" },
];

const sampleRecipients = [
  { id: 1, name: "David Miller", bloodGroup: "B-", location: "Phoenix, AZ" },
  { id: 2, name: "Jessica Davis", bloodGroup: "A-", location: "Philadelphia, PA" },
  { id: 3, name: "Chris Garcia", bloodGroup: "O+", location: "San Antonio, TX" },
];

export function BloodTransfusionView() {
  const [donors, setDonors] = useState(sampleDonors);
  const [recipients, setRecipients] = useState(sampleRecipients);

  return (
    <Tabs defaultValue="donors">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="donors">Donors</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
        </TabsList>
        <Button><UserPlus className="mr-2" /> Add Entry</Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or location..." className="pl-8" />
        </div>
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by blood group" />
            </SelectTrigger>
            <SelectContent>
                {bloodGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      <TabsContent value="donors">
        <Card>
          <CardHeader>
            <CardTitle>Available Donors</CardTitle>
            <CardDescription>List of individuals available to donate blood.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donors.map((donor) => (
                  <TableRow key={donor.id}>
                    <TableCell className="font-medium">{donor.name}</TableCell>
                    <TableCell><Badge variant="destructive">{donor.bloodGroup}</Badge></TableCell>
                    <TableCell>{donor.location}</TableCell>
                    <TableCell className="text-right"><Button variant="outline">Contact</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="recipients">
        <Card>
          <CardHeader>
            <CardTitle>Active Recipients</CardTitle>
            <CardDescription>List of individuals in need of blood.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipients.map((recipient) => (
                  <TableRow key={recipient.id}>
                    <TableCell className="font-medium">{recipient.name}</TableCell>
                    <TableCell><Badge>{recipient.bloodGroup}</Badge></TableCell>
                    <TableCell>{recipient.location}</TableCell>
                    <TableCell className="text-right"><Button>Donate</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
