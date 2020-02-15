<script>
    import {faQuestionCircle, faSpinner} from '@fortawesome/free-solid-svg-icons';
    import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
    import {mapActions, mapState} from 'vuex';
    import FreshButton from './FreshButton';
    import MigrationsListRow from './MigrationsListRow';

    export default {
        name: 'MigrationsList',
        components: { MigrationsListRow, FreshButton, FontAwesomeIcon },
        computed: {
            ...mapState('migrations', ['migrations', 'loading']),
            faQuestionCircle: () => faQuestionCircle,
            faSpinner: () => faSpinner,
        },
        mounted() {
            this.load();
        },
        methods: {
            ...mapActions('migrations', ['load']),
        },
    }
</script>

<template>
    <div class="card shadow-sm mb-3">
        <div class="card-header bg-secondary text-white" style="line-height: 1.2; padding-left: 0.80em; padding-right: 0.80em;">
            <a href="https://laravel.com/docs/migrations" target="_blank" class="float-right text-white">
                <FontAwesomeIcon :icon="faQuestionCircle"></FontAwesomeIcon>
                Laravel Docs
            </a>
            <h6 class="m-0">Migrations</h6>
        </div>
        <table class="table table-hover bg-white mb-0">

            <thead v-if="!loading">
                <tr>
                    <th scope="col">Date / Time</th>
                    <th scope="col">Name</th>
                    <th scope="col">Status</th>
                    <th scope="col" class="align-middle font-weight-normal text-muted text-right">
                        <!--
                        <a href="#" class="btn btn-sm btn-primary font-weight-bold" style="width: 6em;">
                            New
                        </a>
                        -->
                        <FreshButton></FreshButton>
                    </th>
                </tr>
            </thead>

            <tbody v-if="loading">
                <tr>
                    <td colspan="4" class="text-muted">
                        <FontAwesomeIcon :icon="faSpinner" spin class="mr-2"></FontAwesomeIcon>
                        Loading...
                    </td>
                </tr>
            </tbody>
            <tbody v-else-if="migrations.length">
                <MigrationsListRow v-for="migration of migrations" :key="migration.id" :migration="migration"></MigrationsListRow>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="4">
                        <em class="text-muted">No migrations found.</em>
                    </td>
                </tr>
            </tbody>

        </table>
    </div>
</template>