import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react';

export default function AdminAnalytics() {
  const topWords = [
    { word: 'adventure', searches: 892, trend: '+12%' },
    { word: 'beautiful', searches: 756, trend: '+8%' },
    { word: 'curious', searches: 634, trend: '+15%' },
    { word: 'discover', searches: 589, trend: '+5%' },
    { word: 'explore', searches: 512, trend: '+10%' },
  ];

  const gradeActivity = [
    { grade: '3rd Grade', students: 234, searches: 1245 },
    { grade: '4th Grade', students: 312, searches: 1678 },
    { grade: '5th Grade', students: 289, searches: 1523 },
    { grade: '6th Grade', students: 267, searches: 1389 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground">Platform usage insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Searched Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topWords.map((item, idx) => (
                <div key={item.word} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <span className="font-medium">{item.word}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{item.searches}</div>
                    <div className="text-xs text-green-600">{item.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Activity by Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gradeActivity.map((item) => (
                <div key={item.grade} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.grade}</span>
                    <span className="text-muted-foreground">{item.students} students</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(item.searches / 2000) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">{item.searches} searches</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
