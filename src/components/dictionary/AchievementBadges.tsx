import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Trophy } from 'lucide-react';

interface AchievementBadgesProps {
  studentId: string;
}

export function AchievementBadges({ studentId }: AchievementBadgesProps) {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [allAchievements, setAllAchievements] = useState<any[]>([]);

  useEffect(() => {
    loadAchievements();
  }, [studentId]);

  const loadAchievements = async () => {
    // Load earned achievements
    const { data: earned } = await supabase
      .from('student_achievements')
      .select('*, achievement:achievements(*)')
      .eq('student_id', studentId);

    if (earned) setAchievements(earned);

    // Load all available achievements
    const { data: all } = await supabase
      .from('achievements')
      .select('*')
      .order('requirement_value');

    if (all) setAllAchievements(all);
  };

  const earnedIds = new Set(achievements.map(a => a.achievement_id));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Achievement Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allAchievements.map(achievement => {
            const isEarned = earnedIds.has(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`text-center p-4 rounded-lg border-2 transition-all ${
                  isEarned 
                    ? 'border-yellow-400 bg-yellow-50' 
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{achievement.badge_icon}</div>
                <div className="font-semibold text-sm">{achievement.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {achievement.description}
                </div>
                {isEarned && (
                  <Badge variant="secondary" className="mt-2">Earned!</Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
