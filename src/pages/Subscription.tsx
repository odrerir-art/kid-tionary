import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Plan {
  plan_type: string;
  plan_id: string;
  plan_name: string;
  price: number;
  features: string[];
}

export default function Subscription() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [fetchingPlans, setFetchingPlans] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-paypal-settings');
      if (error) throw error;
      setPlans(data.settings || []);
    } catch (error) {
      toast.error('Failed to load plans');
      console.error(error);
    } finally {
      setFetchingPlans(false);
    }
  };

  const handleSubscribe = async (planType: string) => {
    if (planType === 'FREE') return;
    
    setLoading(planType);
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-subscription', {
        body: { planType }
      });

      if (error) throw error;
      
      if (data.links) {
        const approvalUrl = data.links.find((link: any) => link.rel === 'approve')?.href;
        if (approvalUrl) {
          window.location.href = approvalUrl;
        }
      }
    } catch (error) {
      toast.error('Failed to start subscription');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  if (fetchingPlans) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-600">Start learning with our kid-friendly dictionary</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <Card key={plan.plan_type} className={idx === 1 ? 'border-blue-500 border-2 shadow-lg' : ''}>
              {idx === 1 && (
                <div className="bg-blue-500 text-white text-center py-1 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.plan_name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.price === 0 ? 'forever' : 'month'}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={idx === 1 ? 'default' : 'outline'}
                  disabled={plan.plan_type === 'FREE' || loading === plan.plan_type}
                  onClick={() => handleSubscribe(plan.plan_type)}
                >
                  {loading === plan.plan_type ? 'Processing...' : plan.plan_type === 'FREE' ? 'Current Plan' : 'Subscribe Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}