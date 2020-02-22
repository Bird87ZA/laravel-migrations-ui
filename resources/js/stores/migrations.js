import Vue from 'vue';
import api from '../api';
import Migration from '../models/Migration';

export default new Vue({
    data() {
        return {
            connection: null,
            database: null,
            loading: false,
            migrationDetails: {},
            migrationNames: [],
            queue: [],
            queueRunning: false,
            running: false,
            tables: [],
        };
    },
    computed: {
        allMigrations() {
            return this.migrationNames.map(name => this.migrationDetails[name]);
        },
    },
    methods: {
        async fresh(seed) {
            this.running = true;

            try {
                const response = await api.post('fresh', { seed });
                this.setAll(response.data);
            } finally {
                this.running = false;
            }
        },
        getMigration(name) {
            if (!(name in this.migrationDetails)) {
                Vue.set(this.migrationDetails, name, new Migration(name));
            }

            return this.migrationDetails[name];
        },
        async load() {
            this.loading = true;

            try {
                const response = await api.get('list');
                this.setAll(response.data);
            } finally {
                this.loading = false;
            }
        },
        async loadDetails(name) {
            const migration = this.getMigration(name);

            migration.loading = true;

            try {
                const response = await api.get(`migration-details/${name}`);
                migration.update(response.data);
            } finally {
                migration.loading = false;
            }
        },
        async refresh(seed) {
            this.running = true;

            try {
                const response = await api.post('refresh', { seed });
                this.setAll(response.data);
            } finally {
                this.running = false;
            }
        },
        async seed() {
            this.running = true;

            try {
                const response = await api.post('seed' );
                this.setAll(response.data);
            } finally {
                this.running = false;
            }
        },
        async runSingle(name, type) {
            const migration = this.getMigration(name);

            migration.running = true;

            try {
                // 'type' can be 'apply' or 'rollback'
                const response = await api.post(`${type}-single/${name}`);
                this.setAll(response.data);
            } finally {
                migration.running = false;
            }
        },
        setAll(data) {
            this.connection = data.connection;
            this.database = data.database;
            this.tables = data.tables;

            // Split the migrations list into a list of names and a map of details
            let migrationNames = [];

            for (let migration of data.migrations) {
                migrationNames.push(migration.name);
                this.getMigration(migration.name).update(migration);
            }

            this.migrationNames = migrationNames;
        },
    },
});
