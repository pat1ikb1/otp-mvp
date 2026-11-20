import { useState } from 'react';
import { MessageSquareHeart, Sparkles } from 'lucide-react';
import { ADVISOR_PROMPTS } from '@/data/advisorScripts';
import { useLifestart } from '@/state/store';

interface ChatMessage {
  id: string;
  sender: 'advisor' | 'user';
  text: string;
}

export function AdultAdvisor() {
  const { state } = useLifestart();
  const { core } = state;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'advisor',
      text: `Hi ${core.family.childName}! I’m your dedicated OTP Lifestart advisor—free with your membership. Tap any question below for personalized numbers.`,
    },
  ]);

  const handlePrompt = (promptId: string) => {
    const item = ADVISOR_PROMPTS.find((p) => p.id === promptId);
    if (!item) return;
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text: item.question },
      { id: `a-${Date.now() + 1}`, sender: 'advisor', text: item.buildAnswer(core) },
    ]);
  };

  return (
    <div className="flex h-full flex-col justify-between gap-2 pb-2">
      {/* Advisor Header */}
      <div className="flex items-center gap-2.5 rounded-2xl border border-black/5 bg-white p-3 shadow-xs">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#74BF1E] text-white">
          <MessageSquareHeart className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-[#0b2e26]">Dóra · Personal OTP Advisor</p>
          <p className="text-[10px] text-[#4c665f]">Included free for Lifestart & Gold members</p>
        </div>
        <span className="h-2 w-2 rounded-full bg-[#74BF1E]" />
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-2 overflow-y-auto py-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#74BF1E] text-white'
                  : 'border border-black/5 bg-white text-[#0b2e26] shadow-xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Curated Prompt Chips */}
      <div className="space-y-1.5 rounded-2xl border border-black/5 bg-white p-2.5 shadow-xs">
        <p className="flex items-center gap-1 text-[10px] font-bold text-[#4c665f] uppercase">
          <Sparkles className="h-3 w-3 text-[#c89b3c]" /> Ask Your Advisor
        </p>
        <div className="flex flex-wrap gap-1.5">
          {ADVISOR_PROMPTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePrompt(p.id)}
              className="rounded-xl bg-[#ebf3f0] px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#0b2e26] transition-colors hover:bg-[#dcebe5]"
            >
              {p.question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
