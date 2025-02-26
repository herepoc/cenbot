import { marked } from 'marked'
import DOMPurify from 'dompurify'
import EmojiJS from 'emoji-js'

const emoji = new EmojiJS()
emoji.replace_mode = 'unified'
emoji.allow_native = true

export function formatMessage(content: string): string {
  // Primeiro converte os emojis
  const withEmojis = emoji.replace_colons(content)
  
  // Adiciona quebras de linha extras para melhorar o espaçamento
  let enhancedContent = withEmojis
    // Adiciona espaço extra entre parágrafos
    .replace(/\n\n/g, '\n\n\n')
    // Adiciona espaço após listas
    .replace(/(\n- .*\n)(?!\n)/g, '$1\n')
    // Adiciona espaço após títulos
    .replace(/(\n#{1,6} .*\n)(?!\n)/g, '$1\n')
  
  // Depois converte o markdown para HTML
  const html = marked(enhancedContent, {
    breaks: true, // Permite quebras de linha com um único \n
    gfm: true // GitHub Flavored Markdown
  }) as string
  
  // Por fim, sanitiza o HTML para evitar XSS
  return DOMPurify.sanitize(html)
}
