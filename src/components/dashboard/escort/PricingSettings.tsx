import { useState } from "react";
import { DollarSign, Save, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const PricingSettings = () => {
  const [pricing, setPricing] = useState({
    baseRatePerMile: 3.50,
    minimumCharge: 250,
    hourlyRate: 75,
    // Position multipliers
    frontEscort: 1.0,
    rearEscort: 1.0,
    sideEscort: 1.2,
    // Additional fees
    nightDifferential: 25,
    weekendSurcharge: 15,
    rushJobFee: 100,
    stateLineCrossing: 50,
    // Settings
    dynamicPricing: true,
    autoQuote: false,
  });

  const handleSave = () => {
    toast.success("Pricing settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Pricing Settings</h1>
          <p className="text-muted-foreground">Configure your escort service rates</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Base Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Base Rates
            </CardTitle>
            <CardDescription>Set your standard escort rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Rate Per Mile ($)</Label>
              <Input
                type="number"
                step="0.10"
                value={pricing.baseRatePerMile}
                onChange={(e) => setPricing({ ...pricing, baseRatePerMile: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Minimum Charge ($)</Label>
              <Input
                type="number"
                value={pricing.minimumCharge}
                onChange={(e) => setPricing({ ...pricing, minimumCharge: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Hourly Rate ($) - For Wait Time</Label>
              <Input
                type="number"
                value={pricing.hourlyRate}
                onChange={(e) => setPricing({ ...pricing, hourlyRate: parseFloat(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Position Multipliers */}
        <Card>
          <CardHeader>
            <CardTitle>Position Multipliers</CardTitle>
            <CardDescription>Adjust rates based on escort position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Front Escort (× base rate)</Label>
              <Input
                type="number"
                step="0.1"
                value={pricing.frontEscort}
                onChange={(e) => setPricing({ ...pricing, frontEscort: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Rear Escort (× base rate)</Label>
              <Input
                type="number"
                step="0.1"
                value={pricing.rearEscort}
                onChange={(e) => setPricing({ ...pricing, rearEscort: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Side Escort (× base rate)</Label>
              <Input
                type="number"
                step="0.1"
                value={pricing.sideEscort}
                onChange={(e) => setPricing({ ...pricing, sideEscort: parseFloat(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Fees */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Fees</CardTitle>
            <CardDescription>Extra charges for special conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Night Differential (% increase)</Label>
              <Input
                type="number"
                value={pricing.nightDifferential}
                onChange={(e) => setPricing({ ...pricing, nightDifferential: parseFloat(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">Applied for jobs between 8 PM - 6 AM</p>
            </div>
            <div className="space-y-2">
              <Label>Weekend Surcharge (% increase)</Label>
              <Input
                type="number"
                value={pricing.weekendSurcharge}
                onChange={(e) => setPricing({ ...pricing, weekendSurcharge: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Rush Job Fee ($)</Label>
              <Input
                type="number"
                value={pricing.rushJobFee}
                onChange={(e) => setPricing({ ...pricing, rushJobFee: parseFloat(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">Jobs with less than 24h notice</p>
            </div>
            <div className="space-y-2">
              <Label>State Line Crossing Fee ($)</Label>
              <Input
                type="number"
                value={pricing.stateLineCrossing}
                onChange={(e) => setPricing({ ...pricing, stateLineCrossing: parseFloat(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Settings</CardTitle>
            <CardDescription>Configure pricing behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dynamic Pricing</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically adjust rates based on demand
                </p>
              </div>
              <Switch
                checked={pricing.dynamicPricing}
                onCheckedChange={(checked) => setPricing({ ...pricing, dynamicPricing: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Quote Generation</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically generate quotes for new requests
                </p>
              </div>
              <Switch
                checked={pricing.autoQuote}
                onCheckedChange={(checked) => setPricing({ ...pricing, autoQuote: checked })}
              />
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Quote Calculation Example</p>
                  <p className="text-muted-foreground mt-1">
                    100 mile front escort job:
                  </p>
                  <p className="font-mono mt-1">
                    100 mi × ${pricing.baseRatePerMile} × {pricing.frontEscort} = ${(100 * pricing.baseRatePerMile * pricing.frontEscort).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingSettings;
