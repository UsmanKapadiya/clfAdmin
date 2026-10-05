
const ContentRender = (description = '') => {
    let html = description;
    const containsEncodedTags = /&lt;\s*\/?\s*[a-z][^&]*?&gt;/i;

    while (containsEncodedTags.test(html)) {
        html = new DOMParser().parseFromString(html, 'text/html').body.textContent || '';
    }

    const parsedDescription = new DOMParser().parseFromString(html, 'text/html');
    const allowedTags = new Set([
        'A', 'B', 'BLOCKQUOTE', 'BR', 'CAPTION', 'DD', 'DIV', 'DL', 'DT', 'EM',
        'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HR', 'I', 'IMG', 'LI', 'OL', 'P',
        'SPAN', 'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TFOOT', 'TH',
        'THEAD', 'TR', 'U', 'UL',
    ]);
    const disallowedContentTags = new Set(['IFRAME', 'OBJECT', 'SCRIPT', 'STYLE', 'SVG', 'TEMPLATE']);

    parsedDescription.body.querySelectorAll('*').forEach(element => {
        if (!allowedTags.has(element.tagName)) {
            if (disallowedContentTags.has(element.tagName)) {
                element.remove();
            } else {
                element.replaceWith(...element.childNodes);
            }
            return;
        }

        [...element.attributes].forEach(attribute => {
            const name = attribute.name.toLowerCase();
            const allowedAttributes = {
                a: ['href', 'target', 'rel'],
                img: ['src', 'alt', 'width', 'height'],
                table: ['border', 'cellspacing', 'cellpadding', 'width', 'align'],
                td: ['colspan', 'rowspan', 'width', 'valign', 'align'],
                th: ['colspan', 'rowspan', 'width', 'valign', 'align'],
            }[element.tagName.toLowerCase()] || [];

            if (name === 'class' || allowedAttributes.includes(name)) return;

            element.removeAttribute(attribute.name);
        });

        if (element.tagName === 'A' && element.hasAttribute('href')) {
            const href = element.getAttribute('href').trim();
            if (!/^(https?:|mailto:|tel:|#|\/|\.{1,2}\/)/i.test(href)) {
                element.removeAttribute('href');
            }
            if (element.getAttribute('target') === '_blank') {
                element.setAttribute('rel', 'noopener noreferrer');
            }
        }

        if (element.tagName === 'IMG' && element.hasAttribute('src')) {
            const src = element.getAttribute('src').trim();
            if (!/^(https?:|\/|\.{1,2}\/)/i.test(src)) {
                element.removeAttribute('src');
            }
        }
    });

    return parsedDescription.body.innerHTML;
};

export default ContentRender;