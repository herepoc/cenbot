import { defineStore } from 'pinia'
import axios from 'axios';
import { config } from '@/config/env'

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as Message[],
    conversationId: '',
    isLoading: false,
    suggestedMessages: [] as string[],
    origem: '' as string,
  }),

  actions: {
    getStoreNameFromQueryString() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('loja');
    },

    async sendMessage(message: string) {
      this.isLoading = true;
      const messageId = Date.now().toString();
      
      // Adiciona mensagem do usuário
      this.messages.push({
        id: messageId,
        role: 'user',
        content: message,
        timestamp: Date.now(),
      });

      try {
        const storeName = this.getStoreNameFromQueryString();
        const inputs: Record<string, any> = {};
        
        // Adiciona o nome da loja ao objeto inputs apenas se estiver presente
        if (storeName) {
          inputs.loja = storeName;
        }

        const requestBody = {
          inputs,
          query: message,
          response_mode: 'streaming',
          conversation_id: this.conversationId,
          user: this.origem || 'anonymous',
        };

        const response = await fetch(`${config.dify.host}/chat-messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.dify.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const reader = response.body?.getReader();
        if (!reader) return;

        let assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: '',
          timestamp: Date.now(),
        };

        this.messages.push(assistantMessage);
        let fullMessage = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.event === 'message') {
                  fullMessage += data.answer;
                  // Atualizando a mensagem completa de uma vez
                  const messageIndex = this.messages.findIndex(m => m.id === assistantMessage.id);
                  if (messageIndex !== -1) {
                    this.messages[messageIndex] = {
                      ...this.messages[messageIndex],
                      content: fullMessage
                    };
                  }
                  
                  if (!this.conversationId && data.conversation_id) {
                    this.conversationId = data.conversation_id;
                  }
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async getSuggestedMessages(messageId: string) {
      try {
        const response = await axios.get(
          `${config.dify.host}/messages/${messageId}/suggested`,
          {
            headers: {
              Authorization: `Bearer ${config.dify.apiKey}`,
            },
            params: {
              user: this.origem || 'anonymous',
            },
          }
        );
        this.suggestedMessages = response.data.data;
      } catch (error) {
        console.error('Error fetching suggested messages:', error);
        this.suggestedMessages = [];
      }
    },

    setOrigem(origem: string) {
      this.origem = origem;
    },
  },

  getters: {
    hasMessages: (state) => state.messages.length > 0,
  },
});