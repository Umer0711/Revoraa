import { LeetCodeProvider } from './LeetCodeProvider';
import { CodeforcesProvider } from './CodeforcesProvider';

const providers = [
  new LeetCodeProvider(),
  new CodeforcesProvider()
];

export async function resolveProblemMetadata(input) {
  for (const provider of providers) {
    if (await provider.canHandle(input)) {
      return await provider.fetchProblem(input);
    }
  }
  
  throw new Error('Unsupported platform');
}
