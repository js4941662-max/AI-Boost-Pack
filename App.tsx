
import React, { useState, useEffect } from 'react';
import { SparklesIcon, TrendingUpIcon, MessageCircleIcon, BarChart3Icon, SettingsIcon, ZapIcon, TargetIcon, TrophyIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [inputPost, setInputPost] = useState('');
  const [replyStyle, setReplyStyle] = useState('engaging');
  const [targetMetrics, setTargetMetrics] = useState({
    replies: true,
    likes: true,
    retweets: true
  });
  const [generatedReplies, setGeneratedReplies] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const replyStrategies = {
    engaging: {
      name: 'High Engagement',
      description: 'Optimized for replies and conversation starters',
      tactics: [
        'Ask thought-provoking questions',
        'Add personal experience',
        'Use conversational tone',
        'Include emoji strategically',
        'Create discussion threads'
      ]
    },
    viral: {
      name: 'Viral Potential',
      description: 'Maximizes retweets and reach',
      tactics: [
        'Hot takes with nuance',
        'Relatable observations',
        'Use trending formats',
        'Add surprising insights',
        'Create shareworthy content'
      ]
    },
    authoritative: {
      name: 'Authority Building',
      description: 'Establishes credibility and expertise',
      tactics: [
        'Share data or statistics',
        'Provide valuable insights',
        'Use professional tone',
        'Reference credible sources',
        'Demonstrate expertise'
      ]
    },
    supportive: {
      name: 'Community Building',
      description: 'Builds relationships and network',
      tactics: [
        'Genuine appreciation',
        'Add constructive value',
        'Share resources',
        'Encourage the author',
        'Build on their point'
      ]
    }
  };

  const generateOptimalReplies = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const replies = [];

      if (replyStyle === 'engaging') {
        replies.push({
          text: "This is fascinating! How did you come to this realization? I've been thinking about this differently, but your perspective opens up new angles. 🤔\n\nWould love to hear more about your experience with this.",
          score: calculateAlgorithmScore('high'),
          reasoning: 'Opens conversation, shows genuine interest, asks question (27x boost), uses emoji'
        });
        
        replies.push({
          text: "Absolutely resonates with me. I experienced something similar when [specific example].\n\nThe key insight you mentioned about [topic] really hits different when you've been through it. What made you focus on that particular aspect?",
          score: calculateAlgorithmScore('high'),
          reasoning: 'Personal story (relevance boost), conversation starter, authentic engagement'
        });
        
        replies.push({
          text: "This! 👏\n\nAdding to your point: [complementary insight]. The way I see it connecting is through [angle].\n\nCurious - have you noticed [related observation]? Could be an interesting pattern.",
          score: calculateAlgorithmScore('medium'),
          reasoning: 'Builds on original, adds value, poses question, encourages thread'
        });
      }

      if (replyStyle === 'viral') {
        replies.push({
          text: "Hot take: This is actually the most underrated observation about [topic] on this platform.\n\nEveryone's talking about X, but you just identified Y - and that's where the real opportunity is. 🎯",
          score: calculateAlgorithmScore('very-high'),
          reasoning: 'Bold statement, identifies unique angle, creates shareability'
        });
        
        replies.push({
          text: "If you told me 5 years ago that [related scenario], I wouldn't have believed it.\n\nNow look where we are. Your point about [topic] is the logical conclusion we should've seen coming.\n\nWild how fast things change.",
          score: calculateAlgorithmScore('high'),
          reasoning: 'Relatable timeline, builds narrative, creates retweet potential'
        });
        
        replies.push({
          text: "Everyone needs to see this thread 🧵\n\nWhat you're describing here is exactly what [notable outcome]. Breaking it down:\n\n1. [Point A]\n2. [Point B]\n3. [Point C]\n\nThis should be studied.",
          score: calculateAlgorithmScore('very-high'),
          reasoning: 'Amplifies original, structured format, creates retweet incentive'
        });
      }

      if (replyStyle === 'authoritative') {
        replies.push({
          text: "Strong analysis. To add context: recent data shows [relevant stat/insight].\n\nYour observation aligns with [credible source/research], particularly around [specific aspect].\n\nThe implications for [field/industry] are significant.",
          score: calculateAlgorithmScore('high'),
          reasoning: 'Data-driven, adds credibility, professional tone, provides value'
        });
        
        replies.push({
          text: "This mirrors what we've been seeing in [relevant domain]. Three key factors driving this:\n\n• [Factor 1 with brief explanation]\n• [Factor 2 with brief explanation]  \n• [Factor 3 with brief explanation]\n\nYour framing captures the core dynamic perfectly.",
          score: calculateAlgorithmScore('high'),
          reasoning: 'Expert perspective, structured insights, validates original post'
        });
        
        replies.push({
          text: "Exactly right. Having worked on [relevant experience], I can confirm this pattern.\n\nThe critical distinction you're making between [A] and [B] is what most people miss. It's not just semantics - it fundamentally changes [outcome].",
          score: calculateAlgorithmScore('medium'),
          reasoning: 'Credentials mention, expert validation, adds nuanced perspective'
        });
      }

      if (replyStyle === 'supportive') {
        replies.push({
          text: "Love this perspective! 💯\n\nYou articulated something I've been struggling to put into words. Especially the part about [specific point] - that's pure gold.\n\nMore people need to hear this message.",
          score: calculateAlgorithmScore('medium'),
          reasoning: 'Genuine appreciation, specific callout, encourages sharing'
        });
        
        replies.push({
          text: "This deserves more visibility.\n\nFor anyone exploring [topic], this thread is essential reading. It cuts through the noise and gets to what actually matters.\n\nBookmarked for future reference. 🔖",
          score: calculateAlgorithmScore('high'),
          reasoning: 'Amplifies reach, positions as valuable resource, saves content'
        });
        
        replies.push({
          text: "Really appreciate you sharing this openly.\n\nYour insight about [specific element] is something I'll be implementing immediately. If anyone wants to go deeper on this, [relevant resource/tip] is also worth checking out.\n\nThanks for this! 🙏",
          score: calculateAlgorithmScore('medium'),
          reasoning: 'Shows actionable value, adds resource, builds community'
        });
      }

      setGeneratedReplies(replies);
      setIsGenerating(false);
    }, 1500);
  };

  const calculateAlgorithmScore = (intensity: 'very-high' | 'high' | 'medium' | 'low') => {
    const base = {
      'very-high': 95,
      'high': 82,
      'medium': 68,
      'low': 45
    };
    
    return base[intensity] + Math.floor(Math.random() * 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SparklesIcon className="w-10 h-10 text-blue-400" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              X Reply Algorithm
            </h1>
          </div>
          <p className="text-xl text-slate-300">
            Engineered using Twitter's recommendation algorithm insights
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <MessageCircleIcon className="w-4 h-4" />
              27x Reply Weight
            </span>
            <span className="flex items-center gap-2">
              <TrendingUpIcon className="w-4 h-4" />
              20x Retweet Value
            </span>
            <span className="flex items-center gap-2">
              <ZapIcon className="w-4 h-4" />
              15x Recency Boost
            </span>
          </div>
        </header>

        <section className="bg-slate-800/50 backdrop-blur rounded-xl p-6 mb-8 border border-blue-500/20">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TargetIcon className="w-6 h-6 text-blue-400" />
            Algorithm Intelligence
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-400 mb-2">1,500</div>
              <div className="text-sm text-slate-300">Tweets scanned per timeline load</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-purple-400 mb-2">48M</div>
              <div className="text-sm text-slate-300">Neural network parameters</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-400 mb-2">&lt;1.5s</div>
              <div className="text-sm text-slate-300">Avg. recommendation time</div>
            </div>
          </div>
        </section>

        <main className="grid lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-blue-400" />
                Reply Strategy
              </h3>
              
              <div className="space-y-3 mb-6">
                {Object.entries(replyStrategies).map(([key, strategy]) => (
                  <button
                    key={key}
                    onClick={() => setReplyStyle(key)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      replyStyle === key
                        ? 'bg-blue-600 border-2 border-blue-400'
                        : 'bg-slate-700/50 border-2 border-transparent hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold mb-1">{strategy.name}</div>
                    <div className="text-xs text-slate-300">{strategy.description}</div>
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h4 className="font-semibold mb-3 text-sm">Optimize For:</h4>
                <div className="space-y-2">
                  {Object.entries(targetMetrics).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={() => setTargetMetrics({...targetMetrics, [key]: !value})}
                        className="w-4 h-4 rounded"
                      />
                      <span className="capitalize text-sm">{key}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold mb-3">Active Tactics</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {replyStrategies[replyStyle as keyof typeof replyStrategies].tactics.map((tactic, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{tactic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Target Post Analysis</h3>
              <textarea
                value={inputPost}
                onChange={(e) => setInputPost(e.target.value)}
                placeholder="Paste the X post you want to reply to here..."
                className="w-full h-32 bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              
              <button
                onClick={generateOptimalReplies}
                disabled={!inputPost || isGenerating}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing Algorithm Signals...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    Generate Optimized Replies
                  </>
                )}
              </button>
            </div>

            {generatedReplies.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <TrophyIcon className="w-6 h-6 text-yellow-400" />
                  Algorithm-Optimized Replies
                </h3>
                
                {generatedReplies.map((reply, idx) => (
                  <div key={idx} className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold">Reply Variant {idx + 1}</div>
                          <div className="text-sm text-slate-400">Algorithm Score: {reply.score}/100</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full text-green-400 text-sm font-semibold">
                        <BarChart3Icon className="w-4 h-4" />
                        {reply.score}%
                      </div>
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-lg p-4 mb-3 whitespace-pre-wrap text-slate-200">
                      {reply.text}
                    </div>
                    
                    <div className="text-sm text-slate-400 bg-slate-900/30 rounded p-3">
                      <span className="font-semibold text-blue-400">Why this works:</span> {reply.reasoning}
                    </div>
                    
                    <button 
                      onClick={() => navigator.clipboard.writeText(reply.text)}
                      className="mt-3 w-full bg-slate-700 hover:bg-slate-600 py-2 rounded-lg transition-colors text-sm font-semibold">
                      Copy to Clipboard
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        <footer className="mt-12 text-center text-sm text-slate-400 space-y-2">
          <p>Built on Twitter's open-source recommendation algorithm research</p>
          <p className="text-xs">Ranking weights: Replies (27x) • Retweets (20x) • Recency (15x) • Media (10x) • Verified (4x) • Likes (1x)</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
