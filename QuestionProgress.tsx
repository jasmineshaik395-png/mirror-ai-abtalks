import { Progress } from "@/components/ui/progress";

export function QuestionProgress({
  current,
  min,
  daysCovered,
}: {
  current: number;
  min: number;
  daysCovered: number;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-mono text-paper-dim">
        <span>
          Question {current} <span className="text-ink-line">/</span> {min}+
        </span>
        <span>{daysCovered} curriculum days touched</span>
      </div>
      <div className="mt-2">
        <Progress value={current} max={min} />
      </div>
    </div>
  );
}
