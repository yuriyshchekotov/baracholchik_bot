import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Filter from './Filter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../data/filters.json');

class FilterManager {
    constructor() {
        this.filters = [];
        this.ensureFiltersFile();
        this.loadFilters();
    }

    ensureFiltersFile() {
        if (!fs.existsSync(DB_PATH)) {
            fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
            fs.writeFileSync(DB_PATH, '[]', 'utf-8');
        }
    }

    loadFilters() {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        const rawFilters = JSON.parse(data);
        this.filters = rawFilters.map(obj => new Filter(obj));
    }

    saveAll() {
        const plain = this.filters.map(filter => ({
            id: filter.id,
            name: filter.name,
            keywords: filter.keywords,
            regex: filter.regex,
            conjunction: filter.conjunction
        }));
        fs.writeFileSync(DB_PATH, JSON.stringify(plain, null, 2), 'utf-8');
    }

    getAll() {
        return this.filters;
    }

    getById(id) {
        return this.filters.find(f => f.id === id);
    }

    getMatching(messageText) {
        return this.filters.filter(f => f.matches(messageText));
    }

    addFilter({ name, keywords, regex = [], conjunction = false }) {
        const newId = this.filters.length > 0
            ? Math.max(...this.filters.map(f => f.id)) + 1
            : 1;

        const filter = new Filter({
            id: newId,
            name,
            keywords,
            regex,
            conjunction
        });

        this.filters.push(filter);
        this.saveAll();
        return filter;
    }
}

export default new FilterManager();