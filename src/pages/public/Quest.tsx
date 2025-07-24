import { QuestBoard } from '@/components/Dashboard/QuestBoard';

export default function Quest(): JSX.Element {
  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden m-0 p-0">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 h-full w-full animate-fade-in">
        <QuestBoard />
      </div>
    </div>
  );
} 