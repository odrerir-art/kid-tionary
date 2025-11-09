import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Search, Filter, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
import { Textarea } from '@/components/ui/textarea';
import {
  hasComplexWords,
  isTooLong,
  startsWithSynonym,
} from './BulkDefinitionReviewFilters';

interface Definition {
  word: string;
  definitions: {
    simple: string;
    medium: string;
    advanced: string;
    example: string;
  };
  created_at: string;
  updated_at: string;
}

export function BulkDefinitionReview() {
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [filteredDefs, setFilteredDefs] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [editingWord, setEditingWord] = useState<string | null>(null);
  const [editedDef, setEditedDef] = useState<Definition | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDefinitions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [definitions, searchTerm, qualityFilter]);

  const fetchDefinitions = async () => {
    try {
      const { data, error } = await supabase
        .from('word_definitions')
        .select('*')
        .order('word');

      if (error) throw error;
      setDefinitions(data || []);
    } catch (error) {
      console.error('Error fetching definitions:', error);
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

    if (qualityFilter !== 'all') {
      filtered = filtered.filter(def => {
        const simple = def.definitions.simple;
        const example = def.definitions.example;

        switch (qualityFilter) {
          case 'too-long':
            return isTooLong(simple, 80) || isTooLong(example, 60);
          case 'complex-words':
            return hasComplexWords(simple) || hasComplexWords(example);
          case 'no-synonym':
            return !startsWithSynonym(simple);
          default:
            return true;
        }
      });
    }

    setFilteredDefs(filtered);
  };

  const startEditing = (def: Definition) => {
    setEditingWord(def.word);
    setEditedDef({ ...def });
  };

  const cancelEditing = () => {
    setEditingWord(null);
    setEditedDef(null);
  };

  const saveDefinition = async () => {
    if (!editedDef) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('word_definitions')
        .update({
          definitions: editedDef.definitions,
          updated_at: new Date().toISOString(),
        })
        .eq('word', editedDef.word);

      if (error) throw error;

      setDefinitions(prev =>
        prev.map(d => (d.word === editedDef.word ? editedDef : d))
      );

      toast({
        title: 'Success',
        description: 'Definition updated successfully',
      });

      cancelEditing();
    } catch (error) {
      console.error('Error saving definition:', error);
      toast({
        title: 'Error',
        description: 'Failed to save definition',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getQualityBadges = (def: Definition) => {
    const badges = [];
    const simple = def.definitions.simple;
    const example = def.definitions.example;

    if (isTooLong(simple, 80)) badges.push('Long Simple');
    if (isTooLong(example, 60)) badges.push('Long Example');
    if (hasComplexWords(simple)) badges.push('Complex Words');
    if (!startsWithSynonym(simple)) badges.push('No Synonym');

    return badges;
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
        <h2 className="text-2xl font-bold mb-2">Bulk Definition Review</h2>
        <p className="text-gray-600">
          Review and edit cached word definitions. Use filters to find definitions that need improvement.
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={qualityFilter} onValueChange={setQualityFilter}>
            <SelectTrigger className="w-full md:w-64">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Definitions</SelectItem>
              <SelectItem value="too-long">Too Long</SelectItem>
              <SelectItem value="complex-words">Complex Words</SelectItem>
              <SelectItem value="no-synonym">No Synonym Start</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredDefs.length} of {definitions.length} definitions
        </div>
      </Card>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Word</TableHead>
              <TableHead>Simple Definition</TableHead>
              <TableHead>Medium Definition</TableHead>
              <TableHead>Advanced Definition</TableHead>
              <TableHead>Example Sentence</TableHead>
              <TableHead className="w-32">Quality</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDefs.map((def) => (
              <TableRow key={def.word}>
                <TableCell className="font-medium">{def.word}</TableCell>
                {editingWord === def.word && editedDef ? (
                  <>
                    <TableCell>
                      <Textarea
                        value={editedDef.definitions.simple}
                        onChange={(e) =>
                          setEditedDef({
                            ...editedDef,
                            definitions: {
                              ...editedDef.definitions,
                              simple: e.target.value,
                            },
                          })
                        }
                        className="min-h-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={editedDef.definitions.medium}
                        onChange={(e) =>
                          setEditedDef({
                            ...editedDef,
                            definitions: {
                              ...editedDef.definitions,
                              medium: e.target.value,
                            },
                          })
                        }
                        className="min-h-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={editedDef.definitions.advanced}
                        onChange={(e) =>
                          setEditedDef({
                            ...editedDef,
                            definitions: {
                              ...editedDef.definitions,
                              advanced: e.target.value,
                            },
                          })
                        }
                        className="min-h-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={editedDef.definitions.example}
                        onChange={(e) =>
                          setEditedDef({
                            ...editedDef,
                            definitions: {
                              ...editedDef.definitions,
                              example: e.target.value,
                            },
                          })
                        }
                        className="min-h-20"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getQualityBadges(editedDef).map((badge) => (
                          <Badge key={badge} variant="destructive" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={saveDefinition}
                          disabled={saving}
                        >
                          {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="max-w-xs">
                      <div className="line-clamp-3">{def.definitions.simple}</div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="line-clamp-3">{def.definitions.medium}</div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="line-clamp-3">{def.definitions.advanced}</div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="line-clamp-3">{def.definitions.example}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getQualityBadges(def).map((badge) => (
                          <Badge key={badge} variant="destructive" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(def)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </>
                )}
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