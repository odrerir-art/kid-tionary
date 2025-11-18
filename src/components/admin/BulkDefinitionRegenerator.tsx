import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CachedDefinition {
  id: string;
  word: string;
  source: string;
  definitions?: {
    simple: string;
    medium: string;
    advanced: string;
  };
  definition_simple?: string;
  definition_medium?: string;
  created_at: string;
}

export function BulkDefinitionRegenerator() {
  const [definitions, setDefinitions] = useState<CachedDefinition[]>([]);
  const [filteredDefs, setFilteredDefs] = useState<CachedDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchDefinitions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [definitions, searchTerm, sourceFilter]);

  const fetchDefinitions = async () => {
    try {
      const { data, error } = await supabase
        .from('word_definitions')
        .select('*')
        .order('word');

      if (error) throw error;
      setDefinitions(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load definitions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = definitions.filter(def =>
      def.word.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(def => def.source === sourceFilter);
    }

    setFilteredDefs(filtered);
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredDefs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDefs.map(d => d.id)));
    }
  };

  const regenerateSelected = async () => {
    if (selectedIds.size === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select definitions to regenerate',
        variant: 'destructive',
      });
      return;
    }

    setRegenerating(true);
    const selectedWords = definitions
      .filter(d => selectedIds.has(d.id))
      .map(d => d.word);

    try {
      // Delete selected definitions
      const { error: deleteError } = await supabase
        .from('word_definitions')
        .delete()
        .in('id', Array.from(selectedIds));

      if (deleteError) throw deleteError;

      // Regenerate each word
      let successCount = 0;
      let failCount = 0;

      for (const word of selectedWords) {
        try {
          const { data, error } = await supabase.functions.invoke(
            'fetch-dictionary-definition',
            { body: { word } }
          );

          if (error) throw error;
          if (data?.error) throw new Error(data.error);
          successCount++;
        } catch (err) {
          console.error(`Failed to regenerate ${word}:`, err);
          failCount++;
        }
      }

      toast({
        title: 'Regeneration Complete',
        description: `${successCount} definitions regenerated, ${failCount} failed`,
      });

      setSelectedIds(new Set());
      fetchDefinitions();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to regenerate definitions',
        variant: 'destructive',
      });
    } finally {
      setRegenerating(false);
    }
  };

  const getDefinitionPreview = (def: CachedDefinition) => {
    if (def.definitions?.simple) return def.definitions.simple;
    if (def.definition_simple) return def.definition_simple;
    return 'No definition available';
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'freedict_api': return 'bg-blue-500';
      case 'openai': return 'bg-purple-500';
      case 'manual': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Bulk Definition Regenerator</h2>
        <p className="text-gray-600">
          Delete and regenerate cached definitions with improved AI prompts.
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="freedict_api">Free Dictionary</SelectItem>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedIds.size} of {filteredDefs.length} selected
          </div>
          <Button
            onClick={regenerateSelected}
            disabled={regenerating || selectedIds.size === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {regenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Delete & Regenerate Selected
              </>
            )}
          </Button>
        </div>
      </Card>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.size === filteredDefs.length && filteredDefs.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-40">Word</TableHead>
              <TableHead className="w-32">Source</TableHead>
              <TableHead>Definition Preview</TableHead>
              <TableHead className="w-40">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDefs.map((def) => (
              <TableRow key={def.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(def.id)}
                    onCheckedChange={() => toggleSelection(def.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{def.word}</TableCell>
                <TableCell>
                  <Badge className={getSourceBadgeColor(def.source)}>
                    {def.source || 'unknown'}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="line-clamp-2 text-sm">
                    {getDefinitionPreview(def)}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(def.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredDefs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No definitions found matching your filters.
        </div>
      )}
    </div>
  );
}
