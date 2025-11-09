import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Upload, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DictionaryAdmin() {
  const [adminKey, setAdminKey] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleBulkImport = async () => {
    setLoading(true);
    setResult(null);

    try {
      const definitions = JSON.parse(jsonData);
      
      if (!Array.isArray(definitions)) {
        throw new Error('JSON must be an array of definitions');
      }

      const { data, error } = await supabase.functions.invoke('bulk-import-definitions', {
        body: { definitions, adminKey }
      });

      if (error) throw error;

      setResult({ success: true, message: `Successfully imported ${data.imported} definitions!` });
      setJsonData('');
    } catch (error: any) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6" />
            Dictionary Database Admin
          </CardTitle>
          <CardDescription>
            Bulk import word definitions from Wiktionary or WordNet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Admin Key</label>
            <Input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin key"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">JSON Data</label>
            <Textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder='[{"word":"example","phonetic":"/ɪɡˈzæmpəl/","part_of_speech":"noun","definition_simple":"A thing that shows what others are like","definition_medium":"Something that represents a group or type","definition_advanced":"A representative form or pattern","example":"This is an example sentence","synonyms":["sample","instance"],"antonyms":[],"source":"wiktionary"}]'
              className="font-mono text-xs h-64"
            />
          </div>

          {result && (
            <Alert variant={result.success ? 'default' : 'destructive'}>
              {result.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleBulkImport} disabled={loading || !adminKey || !jsonData} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            {loading ? 'Importing...' : 'Import Definitions'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
