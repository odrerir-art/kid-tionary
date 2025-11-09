import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Search, TrendingUp, Award, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Users', value: '1,247', icon: Users, change: '+12%', color: 'text-blue-600' },
    { title: 'Words in Database', value: '45,892', icon: BookOpen, change: '+234', color: 'text-green-600' },
    { title: 'Searches Today', value: '3,456', icon: Search, change: '+18%', color: 'text-purple-600' },
    { title: 'Active Students', value: '892', icon: TrendingUp, change: '+8%', color: 'text-orange-600' },
    { title: 'Quizzes Completed', value: '5,234', icon: Award, change: '+23%', color: 'text-pink-600' },
    { title: 'Avg. Session Time', value: '12m', icon: Clock, change: '+2m', color: 'text-cyan-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of Kid-tionary platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change} from last week</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
