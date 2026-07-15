import { ProblemProvider } from './ProblemProvider';

export class LeetCodeProvider extends ProblemProvider {
  constructor() {
    super('leetcode');
  }

  async canHandle(input) {
    return input.includes('leetcode.com') || /^\\d+$/.test(input);
  }

  async fetchProblem(input) {
    // Uses the fetch-problem edge function which has native LeetCode GraphQL support
    return await this._fetchFromEdgeFunction(input);
  }
}
