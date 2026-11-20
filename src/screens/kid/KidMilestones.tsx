import { useState } from 'react';
import { Award, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QUIZ_QUESTIONS } from '@/data/quiz';
import { formatFt } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function KidMilestones() {
  const { state, triggerAchievement, submitQuiz } = useLifestart();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizFeedback, setQuizFeedback] = useState(false);

  const unlocked = age >= 15;
  const allAnswered = QUIZ_QUESTIONS.every((q) => answers[q.id] !== undefined);
  const allCorrect = QUIZ_QUESTIONS.every((q) => answers[q.id] === q.correctIndex);

  return (
    <div className="space-y-3 pb-2">
      {/* Achievements -> Skill Wallet Cashback */}
      <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-bold text-[#0b2e26]">
            <Award className="h-4 w-4 text-[#74BF1E]" /> Career Positive-List Cashback
          </p>
          {!unlocked && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
              Unlocks at 15 🔒
            </span>
          )}
        </div>

        <div className="mt-2.5 space-y-2">
          {core.achievements.map((ach) => {
            const done = ach.unlockedAtMonth !== null;
            return (
              <div
                key={ach.id}
                className={`flex items-center justify-between gap-2 rounded-xl border p-2.5 ${
                  done
                    ? 'border-emerald-200 bg-emerald-50/70'
                    : 'border-black/5 bg-[#f6f8f7]'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{ach.emoji}</span>
                  <div>
                    <p className="text-xs font-bold text-[#0b2e26]">{ach.title}</p>
                    <p className="text-[10px] text-[#4c665f]">{ach.description}</p>
                  </div>
                </div>
                {done ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#74BF1E] px-2 py-0.5 text-[10px] font-bold text-white">
                    <CheckCircle2 className="h-3 w-3" /> +{ach.cashback / 1000}k
                  </span>
                ) : (
                  <Button
                    size="xs"
                    disabled={!unlocked}
                    onClick={() => triggerAchievement(ach.id)}
                    className="shrink-0 bg-[#74BF1E] text-[11px] font-bold text-white hover:bg-[#62a318]"
                  >
                    {unlocked ? `+${formatFt(ach.cashback)}` : <Lock className="h-3 w-3" />}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3-Question Finance Quiz (+0.25% permanent yield bonus) */}
      <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-bold text-[#0b2e26]">
            <Sparkles className="h-4 w-4 text-[#c89b3c]" /> 3-Step Money Mastery Quiz
          </p>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
            +0.25% Yield Bonus
          </span>
        </div>

        {core.quizCompleted ? (
          <div className="mt-2.5 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-[#74BF1E]">
            🎓 Mastered! Your Super Bond earns a permanent +0.25% financial literacy boost.
          </div>
        ) : !unlocked ? (
          <p className="mt-2 text-xs text-[#4c665f]">Unlocks at age 15 to boost your Super Bond yield.</p>
        ) : (
          <div className="mt-2.5 space-y-3">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const isWrong = quizFeedback && answers[q.id] !== q.correctIndex;
              return (
                <div key={q.id} className="space-y-1.5">
                  <p className="text-[11px] font-bold text-[#0b2e26]">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="space-y-1">
                    {q.options.map((opt, optIdx) => {
                      const selected = answers[q.id] === optIdx;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setQuizFeedback(false);
                            setAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                          }}
                          className={`w-full rounded-xl border px-2.5 py-1.5 text-left text-[11px] transition-all ${
                            selected
                              ? isWrong
                                ? 'border-red-400 bg-red-50 font-semibold text-red-700'
                                : 'border-[#74BF1E] bg-emerald-50 font-semibold text-[#74BF1E]'
                              : 'border-[#dce5e1] bg-[#f6f8f7] text-[#0b2e26]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {isWrong && (
                    <p className="text-[10px] font-medium text-red-600">
                      💡 Hint: {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
            <Button
              size="sm"
              disabled={!allAnswered}
              onClick={() => {
                if (allCorrect) {
                  submitQuiz();
                } else {
                  setQuizFeedback(true);
                }
              }}
              className="w-full bg-[#74BF1E] text-xs font-bold text-white"
            >
              Submit & Claim +0.25% Yield Bonus
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
