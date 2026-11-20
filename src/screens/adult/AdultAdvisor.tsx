import { useMemo, useState } from 'react';
import { MessageSquareHeart, Sparkles } from 'lucide-react';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
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
      text: `Hi ${core.family.childName}! Ask any question below for live numbers from your portfolio.`,
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

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'advisor-chat',
        render: () => (
          <div className="ds-card space-y-2.5">
            <div className="flex items-center gap-2.5 border-b border-black/6 pb-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#38571a] text-white">
                <MessageSquareHeart className="h-4 w-4 text-[#74bf1e]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-extrabold ds-text-primary">Dóra · OTP Advisor</p>
                <p className="text-[10px] ds-text-muted">Free for Lifestart & Gold members</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#52ae30]" />
            </div>

            <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    style={{ borderRadius: 'var(--ds-btn-radius)' }}
                    className={`max-w-[88%] px-3 py-2 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#38571a] text-white'
                        : 'bg-[#f2f5f8] text-[#0b2e26]'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: 'advisor-prompts',
        render: () => (
          <div className="ds-card space-y-2.5">
            <p className="flex items-center gap-1 text-[10px] font-bold ds-text-muted uppercase">
              <Sparkles className="h-3 w-3 text-[#52ae30]" /> Ask Dóra
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ADVISOR_PROMPTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePrompt(p.id)}
                  style={{ borderRadius: 'var(--ds-btn-radius)' }}
                  className="ds-card-muted px-3 py-1.5 text-left text-[11px] font-semibold transition-colors hover:bg-[#e8f5e4] hover:text-[#38571a]"
                >
                  {p.question}
                </button>
              ))}
            </div>
          </div>
        ),
      },
    ],
    [core, messages],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="adult-advisor" blocks={blocks} />
    </div>
  );
}
