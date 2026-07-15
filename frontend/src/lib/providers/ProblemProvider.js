import { supabase } from '../supabaseClient';

export class ProblemProvider {
  constructor(platformSlug) {
    this.platformSlug = platformSlug;
  }

  async canHandle(urlOrId) {
    return false; // To be overridden
  }

  async fetchProblem(urlOrId) {
    throw new Error('Not implemented');
  }

  async _fetchFromEdgeFunction(input) {
    const { data, error } = await supabase.functions.invoke('fetch-problem', {
      body: { platform: this.platformSlug, input }
    });
    
    if (error) throw error;
    if (!data || !data.success) throw new Error(data?.error?.message || 'Failed to fetch problem metadata');
    
    return data.data; // The unified problem payload
  }
}
