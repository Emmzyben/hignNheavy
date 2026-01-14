import { useState } from 'react';
import { DollarSign, Save, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const PricingSettings = () => {
  const [pricing, setPricing] = useState({
    baseRatePerMile: '3.50',
    minimumCharge: '500',
    oversizeMultiplier: '1.5',
    superloadMultiplier: '2.0',
    escortFee: '150',
    permitHandlingFee: '75',
    weekendSurcharge: '15',
    rushSurcharge: '25',
    fuelSurcharge: '18',
    enableDynamicPricing: true,
    autoQuote: false,
  });

  const handleSave = () => {
    toast.success('Pricing settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Pricing Settings</h1>
        <p className="text-muted-foreground">Configure your rates and pricing structure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Base Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Base Rates
            </CardTitle>
            <CardDescription>Set your standard pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Rate per Mile ($)</Label>
              <Input 
                type="number"
                step="0.01"
                value={pricing.baseRatePerMile}
                onChange={(e) => setPricing({ ...pricing, baseRatePerMile: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Base rate charged per mile for standard loads</p>
            </div>
            <div className="space-y-2">
              <Label>Minimum Charge ($)</Label>
              <Input 
                type="number"
                value={pricing.minimumCharge}
                onChange={(e) => setPricing({ ...pricing, minimumCharge: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Minimum amount charged for any job</p>
            </div>
          </CardContent>
        </Card>

        {/* Load Multipliers */}
        <Card>
          <CardHeader>
            <CardTitle>Load Type Multipliers</CardTitle>
            <CardDescription>Multipliers applied based on load classification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Oversize Load Multiplier</Label>
              <Input 
                type="number"
                step="0.1"
                value={pricing.oversizeMultiplier}
                onChange={(e) => setPricing({ ...pricing, oversizeMultiplier: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Applied to loads exceeding standard dimensions</p>
            </div>
            <div className="space-y-2">
              <Label>Superload Multiplier</Label>
              <Input 
                type="number"
                step="0.1"
                value={pricing.superloadMultiplier}
                onChange={(e) => setPricing({ ...pricing, superloadMultiplier: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Applied to superload classifications</p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Fees */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Fees</CardTitle>
            <CardDescription>Extra charges for special services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Escort Coordination Fee ($)</Label>
              <Input 
                type="number"
                value={pricing.escortFee}
                onChange={(e) => setPricing({ ...pricing, escortFee: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Permit Handling Fee ($)</Label>
              <Input 
                type="number"
                value={pricing.permitHandlingFee}
                onChange={(e) => setPricing({ ...pricing, permitHandlingFee: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Surcharges */}
        <Card>
          <CardHeader>
            <CardTitle>Surcharges (%)</CardTitle>
            <CardDescription>Percentage-based additional charges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Weekend Surcharge (%)</Label>
              <Input 
                type="number"
                value={pricing.weekendSurcharge}
                onChange={(e) => setPricing({ ...pricing, weekendSurcharge: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Rush/Same-Day Surcharge (%)</Label>
              <Input 
                type="number"
                value={pricing.rushSurcharge}
                onChange={(e) => setPricing({ ...pricing, rushSurcharge: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fuel Surcharge (%)</Label>
              <Input 
                type="number"
                value={pricing.fuelSurcharge}
                onChange={(e) => setPricing({ ...pricing, fuelSurcharge: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pricing Options</CardTitle>
            <CardDescription>Configure how your pricing is applied</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Dynamic Pricing</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically adjust rates based on demand and availability
                </p>
              </div>
              <Switch 
                checked={pricing.enableDynamicPricing}
                onCheckedChange={(checked) => setPricing({ ...pricing, enableDynamicPricing: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Generate Quotes</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically send quotes to shippers based on your pricing
                </p>
              </div>
              <Switch 
                checked={pricing.autoQuote}
                onCheckedChange={(checked) => setPricing({ ...pricing, autoQuote: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Example Quote */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Example Quote Calculation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Scenario:</strong> Oversize load, 250 miles, with escort, weekend delivery</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>Base: 250 mi × ${pricing.baseRatePerMile} = ${(250 * parseFloat(pricing.baseRatePerMile)).toFixed(2)}</div>
              <div>Oversize: ×{pricing.oversizeMultiplier} = ${(250 * parseFloat(pricing.baseRatePerMile) * parseFloat(pricing.oversizeMultiplier)).toFixed(2)}</div>
              <div>Escort Fee: +${pricing.escortFee}</div>
              <div>Permit Fee: +${pricing.permitHandlingFee}</div>
              <div>Weekend (+{pricing.weekendSurcharge}%)</div>
              <div className="font-bold text-primary">
                Total Estimate: ${(
                  (250 * parseFloat(pricing.baseRatePerMile) * parseFloat(pricing.oversizeMultiplier)) +
                  parseFloat(pricing.escortFee) +
                  parseFloat(pricing.permitHandlingFee)
                ).toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Pricing Settings
        </Button>
      </div>
    </div>
  );
};

export default PricingSettings;
