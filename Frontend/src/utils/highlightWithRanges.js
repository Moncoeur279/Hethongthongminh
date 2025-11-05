export function highlightWithRanges(text, corrections) {
    if (!corrections || corrections.length === 0) return text;

    const parts = [];
    let lastIndex = 0;

    corrections.forEach((c, idx) => {
        if (lastIndex < c.start) {
            parts.push(<span key={`t-${idx}`}>{text.slice(lastIndex, c.start)}</span>);
        }
        parts.push(
            <span key={`c-${idx}`} className="grammar-error" title={`Suggestion: ${c.suggestion}`}>
                {text.slice(c.start, c.end)}
            </span>
        );
        lastIndex = c.end;
    });

    if (lastIndex < text.length) {
        parts.push(<span key="last">{text.slice(lastIndex)}</span>);
    }
    return parts;
}
