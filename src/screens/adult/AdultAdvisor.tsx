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
        title: 'Dóra Advisor Thread',
        eyeCue: 'Read personalized reply',
        whyHere: 'Establishes human advisory presence and displays live portfolio answers.',
        render: () => (
          <div className="ds-card space-y-2.5">
            <div className="flex items-center gap-2.5 border-b border-black/6 pb-2.5">
              <div
                style={{
                  backgroundColor: 'var(--ds-primary)',
                  color: 'var(--ds-primary-fg)',
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full"
              >
                <MessageSquareHeart className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold ds-text-primary">Dóra · OTP Advisor</p>
                <p className="text-[10px] ds-text-muted">Free for Lifestart & Gold members</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#74bf1e]" />
            </div>

            <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    style={{
                      borderRadius: 'var(--ds-btn-radius)',
                      backgroundColor:
                        m.sender === 'user' ? 'var(--ds-primary)' : 'var(--ds-card-muted-bg)',
                      color:
                        m.sender === 'user' ? 'var(--ds-primary-fg)' : 'var(--ds-text-primary)',
                    }}
                    className="max-w-[88%] px-3 py-2 text-xs leading-relaxed"
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
        title: 'Quick Advisor Questions',
        eyeCue: 'Tap a financial question',
        whyHere: 'Curated question chips eliminate blank-chat paralysis.',
        render: () => (
          <div className="ds-card space-y-2">
            <p className="flex items-center gap-1 text-[10px] font-bold ds-text-muted uppercase">
              <Sparkles className="h-3 w-3 text-[#c89b3c]" /> Ask Dóra
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ADVISOR_PROMPTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePrompt(p.id)}
                  style={{ borderRadius: 'var(--ds-btn-radius)' }}
                  className="ds-card-muted px-2.5 py-1.5 text-left text-[11px] font-semibold transition-colors hover:bg-[#e5f5de] hover:text-[#08261e]"
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
