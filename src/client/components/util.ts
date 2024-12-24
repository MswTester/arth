export const cvt = (value: string | number) => {
    if (typeof value === 'number') return `${value}px`;

    // Handle arithmetic expressions
    const arithmeticRegex = /^([\d\s\+\-\*\/a-zA-Z%()]+)$/;
    if (arithmeticRegex.test(value)) {
        const processed = value.replace(/(\d+)([a-zA-Z]+)/g, (_, num, unit) => {
            switch (unit) {
                case 'full': return `${num} * 100%`;
                case 'half': return `${num} * 50%`;
                case 'xl':
                case 'xlarge': return `${num} * var(--xl)`;
                case 'lg':
                case 'large': return `${num} * var(--lg)`;
                case 'md':
                case 'medium': return `${num} * var(--md)`;
                case 'sm':
                case 'small': return `${num} * var(--sm)`;
                case 'xs':
                case 'xsmall': return `${num} * var(--xs)`;
                case 'display': return `${num} * var(--display)`;
                case 'headline': return `${num} * var(--headline)`;
                case 'title': return `${num} * var(--title)`;
                case 'body': return `${num} * var(--body)`;
                case 'caption': return `${num} * var(--caption)`;
                // Add more units as needed
                default: return `${num}${unit}`;
            }
        });
        return `calc(${processed})`;
    }

    const split = value.split(' ');
    if (split.length > 1) return split.map(cvt).join(' ');

    switch (value) {
        case 'full': return '100%';
        case 'half': return '50%';
        case 'start': return 'flex-start';
        case 'end': return 'flex-end';
        case 'background': return 'var(--background)';
        case 'background-muted': return 'var(--background-muted)';
        case 'surface': return 'var(--surface)';
        case 'hover': return 'var(--hover)';
        case 'outline': return 'var(--outline)';
        case 'content': return 'var(--content)';
        case 'content-muted': return 'var(--content-muted)';
        case 'primary': return 'var(--primary)';
        case 'strong': return 'var(--strong)';
        case 'regular': return 'var(--regular)';
        case 'light': return 'var(--light)';
        case 'display': return 'var(--display)';
        case 'headline': return 'var(--headline)';
        case 'title': return 'var(--title)';
        case 'body': return 'var(--body)';
        case 'caption': return 'var(--caption)';
        case 'xl':
        case 'xlarge': return 'var(--xl)';
        case 'lg':
        case 'large': return 'var(--lg)';
        case 'md':
        case 'medium': return 'var(--md)';
        case 'sm':
        case 'small': return 'var(--sm)';
        case 'xs':
        case 'xsmall': return 'var(--xs)';
        default:
            return value;
    }
};