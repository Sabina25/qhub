export function ensureAnchorAttrs(html: string): string {
    if (!html) return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('a[href]').forEach((a) => {
      let href = a.getAttribute('href') || '';
      if (href && !/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
        href = 'https://' + href;
        a.setAttribute('href', href);
      }
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });
    return doc.body.innerHTML;
  }
  
  export const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'align', 'color', 'background',
    'link',
  ];
  
  export function buildQuillModules() {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          ['link'],
          ['clean'],
        ],
        handlers: {
          link: function (this: any, value: boolean) {
            const range = this.quill.getSelection();
            if (!range) return;
            if (value) {
              let href = prompt('URL (https://...)') || '';
              if (href && !/^(https?:)?\/\//i.test(href)) href = 'https://' + href;
              if (href) this.quill.format('link', href);
            } else {
              this.quill.format('link', false);
            }
          },
        },
      },
      clipboard: { matchVisual: false },
    };
  }
  