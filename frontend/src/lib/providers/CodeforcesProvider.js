import { ProblemProvider } from './ProblemProvider';

export class CodeforcesProvider extends ProblemProvider {
  constructor() {
    super('codeforces');
  }

  async canHandle(input) {
    return input.includes('codeforces.com');
  }

  async fetchProblem(input) {
    return await this._fetchFromEdgeFunction(input);
  }
}
