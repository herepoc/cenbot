import { defineStore } from 'pinia';
import axios from 'axios';
import { config } from '@/config/env';

interface AppParameters {
  opening_statement: string;
  suggested_questions: string[];
  suggested_questions_after_answer?: {
    enabled: boolean;
  };
  speech_to_text?: {
    enabled: boolean;
  };
  retriever_resource?: any;
  [key: string]: any;
}

export const useConfigStore = defineStore('config', {
  state: () => ({
    parameters: {
      opening_statement: '',
      suggested_questions: [] as string[],
    } as AppParameters,
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAppParameters(userId?: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${config.dify.host}/parameters`, {
          headers: {
            'Authorization': `Bearer ${config.dify.apiKey}`,
            'Content-Type': 'application/json',
          },
          params: {
            user: userId || 'default',
          },
        });
        
        if (response.data) {
          this.parameters = response.data;
        }
      } catch (err) {
        console.error('Failed to fetch app parameters:', err);
        this.error = err instanceof Error ? err.message : 'Failed to fetch app parameters';
        
        // Fallback to default values in case of error
        this.parameters.suggested_questions = [
          'Qual a diferença entre Centrum Homem e Centrum Mulher?',
          'Centrum é bom para imunidade?',
          'Posso tomar Centrum todos os dias?',
          'Qual Centrum é ideal para idosos?',
          'Centrum engorda?',
        ];
      } finally {
        this.isLoading = false;
      }
    },
  },

  getters: {
    defaultQuestions: (state) => {
      return state.parameters.suggested_questions.length > 0 
        ? state.parameters.suggested_questions 
        : [
            'Qual a diferença entre Centrum Homem e Centrum Mulher?',
            'Centrum é bom para imunidade?',
            'Posso tomar Centrum todos os dias?',
            'Qual Centrum é ideal para idosos?',
            'Centrum engorda?',
          ];
    },

    openingStatement: (state) => {
      return state.parameters.opening_statement || '';
    },
  },
});
