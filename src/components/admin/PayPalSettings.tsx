import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, ExternalLink } from 'lucide-react';

interface PayPalPlan {
  id: string;
  plan_type: string;
  plan_id: string;
  plan_name: string;
  price: number;
  features: string[];
}

export function PayPalSettings() {
  const [plans, setPlans] = useState<PayPalPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-paypal-settings');
      if (error) throw error;
      setPlans(data.settings || []);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (plan: PayPalPlan) => {
    setSaving(plan.plan_type);
    setMessage(null);
    try {
      const { error } = await supabase.functions.invoke('update-paypal-settings', {
        body: plan
      });
      if (error) throw error;
      setMessage({ type: 'success', text: `${plan.plan_name} updated successfully!` });
      await loadSettings();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(null);
    }
  };

  const updatePlan = (planType: string, field: string, value: any) => {
    setPlans(plans.map(p => p.plan_type === planType ? { ...p, [field]: value } : p));
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">PayPal Subscription Settings</h2>
        <p className="text-muted-foreground mt-2">Configure your PayPal subscription plan IDs and pricing</p>
      </div>

      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Setup Guide
            <ExternalLink className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="font-semibold">How to get your PayPal Plan IDs:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Log in to your <a href="https://www.paypal.com/businessmanage/account/subscriptions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">PayPal Business account</a></li>
            <li>Go to Products & Services → Subscriptions</li>
            <li>Create a new subscription plan for each tier (Student, Classroom)</li>
            <li>After creating each plan, copy the Plan ID (starts with "P-")</li>
            <li>Paste the Plan IDs below and save</li>
          </ol>
          <p className="text-muted-foreground italic">Note: Free plan doesn't need a PayPal Plan ID</p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {plans.map(plan => (
          <Card key={plan.plan_type}>
            <CardHeader>
              <CardTitle>{plan.plan_name}</CardTitle>
              <CardDescription>{plan.plan_type} Tier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor={`${plan.plan_type}-id`}>PayPal Plan ID</Label>
                  <Input
                    id={`${plan.plan_type}-id`}
                    value={plan.plan_id}
                    onChange={(e) => updatePlan(plan.plan_type, 'plan_id', e.target.value)}
                    placeholder="P-XXXXXXXXX"
                    disabled={plan.plan_type === 'FREE'}
                  />
                </div>
                <div>
                  <Label htmlFor={`${plan.plan_type}-price`}>Price (USD/month)</Label>
                  <Input
                    id={`${plan.plan_type}-price`}
                    type="number"
                    step="0.01"
                    value={plan.price}
                    onChange={(e) => updatePlan(plan.plan_type, 'price', parseFloat(e.target.value))}
                    disabled={plan.plan_type === 'FREE'}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`${plan.plan_type}-features`}>Features (one per line)</Label>
                <Textarea
                  id={`${plan.plan_type}-features`}
                  value={plan.features.join('\n')}
                  onChange={(e) => updatePlan(plan.plan_type, 'features', e.target.value.split('\n'))}
                  rows={5}
                />
              </div>
              <Button 
                onClick={() => handleSave(plan)}
                disabled={saving === plan.plan_type}
              >
                {saving === plan.plan_type ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}