import { useMemo, useState } from 'react';
import { Award, CheckCircle2, ChevronLeft, ChevronRight, Lock, Sparkles } from 'lucide-react';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { QUIZ_QUESTIONS } from '@/data/quiz';
import { formatFt } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function KidMilestones() {
  const { state, triggerAchievement, submitQuiz } = useLifestart();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizFeedback, setQuizFeedback] = useState(false);

  const unlocked = age >= 15;
  const currentQ = QUIZ_QUESTIONS[step];
  const allAnswered = QUIZ_QUESTIONS.every((q) => answers[q.id] !== undefined);
  const allCorrect = QUIZ_QUESTIONS.every((q) => answers[q.id] === q.correctIndex);

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'quests-achievements',
        title: 'Cashback Quests',
        eyeCue: 'Unlock career cashback',
        whyHere: 'Single-tap quest rewards show immediate Skill Wallet upside.',
        render: () => (
          <div className="ds-card space-y-2">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-bold ds-text-primary">
                <Award className="h-4 w-4 text-[#005e48]" /> Career Cashback
              </p>
              {!unlocked && (
                <span className="rounded-full bg-[#eef3f1] px-2 py-0.5 text-[10px] font-bold text-[#4a635c]">
                  Unlocks at 15
                </span>
              )}
            </div>

            {core.achievements.map((ach) => {
              const done = ach.unlockedAtMonth !== null;
              return (
                <div
                  key={ach.id}
                  className={`flex items-center justify-between gap-2 rounded-xl border p-2.5 ${
                    done
                      ? 'border-[#005e48]/25 bg-[#e5f5de]/70'
                      : 'border-black/6 bg-[#f4f7f5]'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-base">{ach.emoji}</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold ds-text-primary">{ach.title}</p>
                      <p className="truncate text-[10px] ds-text-muted">{ach.description}</p>
                    </div>
                  </div>
                  {done ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#005e48] px-2 py-0.5 text-[10px] font-bold text-white">
                      <CheckCircle2 className="h-3 w-3" /> +{ach.cashback / 1000}k
                    </span>
                  ) : (
                    <Button
                      size="xs"
                      disabled={!unlocked}
                      onClick={() => triggerAchievement(ach.id)}
                      style={{
                        borderRadius: 'var(--ds-btn-radius)',
                        backgroundColor: 'var(--ds-primary)',
                        color: 'var(--ds-primary-fg)',
                      }}
                      className="ds-btn shrink-0 text-[10px] font-bold"
                    >
                      {unlocked ? `+${formatFt(ach.cashback)}` : <Lock className="h-3 w-3" />}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ),
      },
      {
        id: 'quests-quiz',
        title: '+0.25% Yield Quiz',
        eyeCue: 'Complete 3-step quiz',
        whyHere: '1-question-at-a-time stepper cuts cognitive overload vs showing 9 options at once.',
        render: () => (
          <div className="ds-card space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-bold ds-text-primary">
                <Sparkles className="h-4 w-4 text-[#c89b3c]" /> Money Mastery Quiz
              </p>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                +0.25% Yield
              </span>
            </div>

            {core.quizCompleted ? (
              <div className="rounded-xl bg-[#e5f5de] p-3 text-xs font-bold text-[#08261e]">
                Mastered! Permanent +0.25% Super Bond yield boost active.
              </div>
            ) : !unlocked ? (
              <p className="text-xs ds-text-muted">Unlocks at age 15 to boost your Super Bond yield.</p>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-bold ds-text-muted">
                  <span>
                    Question {step + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <div className="flex gap-1">
                    {QUIZ_QUESTIONS.map((q, i) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setStep(i)}
                        aria-label={`Jump to question ${i + 1}`}
                        className={`h-1.5 w-5 rounded-full transition-colors ${
                          i === step
                            ? 'bg-[#005e48]'
                            : answers[q.id] !== undefined
                              ? 'bg-[#74bf1e]'
                              : 'bg-black/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs font-bold ds-text-primary">{currentQ.question}</p>

                <div className="space-y-1.5">
                  {currentQ.options.map((opt, optIdx) => {
                    const selected = answers[currentQ.id] === optIdx;
                    const isWrong = quizFeedback && selected && optIdx !== currentQ.correctIndex;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setQuizFeedback(false);
                          setAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
                        }}
                        style={{ borderRadius: 'var(--ds-btn-radius)' }}
                        className={`w-full border px-3 py-2 text-left text-[11px] transition-all ${
                          selected
                            ? isWrong
                              ? 'border-red-400 bg-red-50 font-semibold text-red-700'
                              : 'border-[#005e48] bg-[#e5f5de] font-bold text-[#08261e]'
                            : 'border-[#dce5e1] bg-[#f4f7f5] text-[#08261e] hover:bg-[#ebf3f0]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizFeedback && answers[currentQ.id] !== currentQ.correctIndex && (
                  <p className="text-[10px] font-semibold text-red-700">
                    Hint: {currentQ.explanation}
                  </p>
                )}

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    disabled={step === 0}
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Back
                  </Button>

                  {step < QUIZ_QUESTIONS.length - 1 ? (
                    <Button
                      type="button"
                      size="xs"
                      disabled={answers[currentQ.id] === undefined}
                      onClick={() => setStep((s) => Math.min(QUIZ_QUESTIONS.length - 1, s + 1))}
                      style={{
                        backgroundColor: 'var(--ds-primary)',
                        color: 'var(--ds-primary-fg)',
                      }}
                    >
                      Next <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="xs"
                      disabled={!allAnswered}
                      onClick={() => {
                        if (allCorrect) submitQuiz();
                        else setQuizFeedback(true);
                      }}
                      style={{
                        backgroundColor: 'var(--ds-primary)',
                        color: 'var(--ds-primary-fg)',
                      }}
                      className="font-bold"
                    >
                      Claim +0.25% Boost
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ),
      },
    ],
    [core, unlocked, step, currentQ, answers, quizFeedback, allAnswered, allCorrect, triggerAchievement, submitQuiz],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="kid-milestones" blocks={blocks} />
    </div>
  );
}
