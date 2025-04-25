class Filter {
    constructor({ id, name, keywords, regex = [], conjunction = false }) {
        this.id = id;
        this.name = name;
        this.keywords = keywords || [];
        this.regex = regex;
        this.conjunction = conjunction;
    }

    matches(messageText) {
        const lower = messageText.toLowerCase();

        const keywordMatch = this.conjunction
            ? this.keywords.every(kw => lower.includes(kw.toLowerCase()))
            : this.keywords.some(kw => lower.includes(kw.toLowerCase()));

        // Пока регулярки не используем (оставим структуру на будущее)
        // const regexMatch = this.regex.some(pattern => new RegExp(pattern).test(messageText));

        return keywordMatch;
    }
}

module.exports = Filter;