import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminWords() {
  const [searchTerm, setSearchTerm] = useState('');

  const words = [
    { id: 1, word: 'adventure', source: 'wiktionary', definitions: 3, searches: 234, lastUpdated: '2024-10-20' },
    { id: 2, word: 'beautiful', source: 'wordnet', definitions: 4, searches: 456, lastUpdated: '2024-10-19' },
    { id: 3, word: 'curious', source: 'openai', definitions: 3, searches: 189, lastUpdated: '2024-10-21' },
    { id: 4, word: 'discover', source: 'wiktionary', definitions: 3, searches: 312, lastUpdated: '2024-10-18' },
  ];

  const filteredWords = words.filter(w => w.word.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Word Definitions</h1>
          <p className="text-muted-foreground">Manage dictionary database</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Add Word</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Word</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Definitions</TableHead>
                <TableHead>Searches</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWords.map((word) => (
                <TableRow key={word.id}>
                  <TableCell className="font-medium">{word.word}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{word.source}</Badge>
                  </TableCell>
                  <TableCell>{word.definitions}</TableCell>
                  <TableCell>{word.searches}</TableCell>
                  <TableCell>{word.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
