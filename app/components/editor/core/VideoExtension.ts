import { mergeAttributes, Node } from '@tiptap/core'

export const Video = Node.create({
  name: 'video',
  group: 'block',
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
      width: {
        default: '100%',
      },
      class: {
        default: 'rounded-xl shadow-md my-4 max-w-full'
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes), ['source', { src: HTMLAttributes.src }]]
  },
})
