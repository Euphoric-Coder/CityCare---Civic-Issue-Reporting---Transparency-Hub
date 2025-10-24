import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Star, Crown } from 'lucide-react';
import { getLeaderboard } from '../lib/gamification';

export function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    setLoading(true);
    const { data } = await getLeaderboard(10);
    if (data) {
      setLeaders(data);
    }
    setLoading(false);
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-orange-600" size={24} />;
      default:
        return <Award className="text-blue-500" size={20} />;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border-2 border-yellow-200">
      <div className="flex items-center mb-8">
        <div className="relative">
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-4 rounded-2xl shadow-lg">
            <Trophy className="text-white" size={32} />
          </div>
          <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full p-1">
            <Crown className="text-yellow-700" size={16} />
          </div>
        </div>
        <div className="ml-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Top Contributors</h2>
          <p className="text-sm text-gray-600 mt-1">Community heroes making a difference</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mb-2"></div>
          <p className="text-gray-600 text-sm">Loading leaderboard...</p>
        </div>
      ) : leaders.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No contributors yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {leaders.map((leader, index) => (
            <div
              key={leader.id}
              className={`flex items-center justify-between p-4 rounded-xl transition-all border ${
                getRankBadge(index + 1)
              } ${
                index < 3
                  ? 'shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'hover:bg-blue-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10">
                  {getRankIcon(index + 1)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-lg">{leader.full_name}</p>
                    {index === 0 && <Star className="text-yellow-400" size={16} fill="currentColor" />}
                  </div>
                  {leader.ward_zone && (
                    <p className="text-xs opacity-75">Ward: {leader.ward_zone}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{leader.points}</p>
                <p className="text-xs opacity-75">points</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          Earn points by reporting verified issues and helping your community!
        </p>
      </div>
    </div>
  );
}
