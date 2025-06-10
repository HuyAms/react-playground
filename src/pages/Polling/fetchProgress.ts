const progressMap = new Map<string, number>();

export type ProgressData = {
  id: string;
  progress: number;
};

export async function fetchProgress(id: string): Promise<ProgressData> {
  await new Promise(resolve => setTimeout(resolve, 3000));

  let current = progressMap.get(id) ?? 0;
  current = Math.min(current + 0.2, 1);
  progressMap.set(id, current);

  return {id, progress: current};
}
