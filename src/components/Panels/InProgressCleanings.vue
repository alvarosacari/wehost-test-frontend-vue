<template>
    <div class="card">
        <div class="card-header bg-info">
            <div class="row">
                <div class="col-lg-6 col-xs-12">
                    <h5>Limpiezas en progreso</h5>
                </div>
                <div class="col-lg-6 col-xs-12 d-flex justify-content-end">
                    <div class="alert alert-success resume-completed" role="alert">
                        <strong>Terminadas: 0</strong>
                    </div>
                    <div class="alert alert-danger resume-completed" role="alert">
                        <strong>Pendientes: 0</strong>
                    </div>
                    <div class="progress-circle resume-completed d-flex">
                        <div class="navigation_pages">
                            <span @click="navigatePrev"> &#60; </span>
                            <span @click="navigateNext"> &#62; </span>
                        </div>
                        <p>{{ page }}/{{ totalPages }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body p-3">
            <div class="row justify-content-center">
                <template v-if="this.loadingData">
                    <div
                        v-for="(item, i) in 6"
                        :key="i"
                        class="col-lg-4 col-md-6 col-xs-12 item-work"
                    >
                        <div class="item" style="height:101px;display:flex;justify-content:center;align-items:center">Loading ...</div>
                    </div>
                </template>
                <template v-else>
                    <div
                        v-for="(item, i) in cleaningsToShow"
                        :key="i"
                        class="col-lg-4 col-md-6 col-xs-12 item-work"
                    >
                        <div class="item">
                            <div class="media">
                                <div class="d-flex justify-content-center content-image">
                                    <img src="http://pluspng.com/img-png/download-happy-person-png-images-transparent-gallery-advertisement-275.png"
                                        width="75" height="75"/>
                                </div>
                                <div class="media-body">
                                    <h5 class="mt-0">{{ item.user_staff }}</h5>
                                    <p>Limpieza : <span>Tipo {{ item.type_cleaning }}</span></p>
                                    <p>Depa : <span>{{ item.user_staff }}</span></p>
                                </div>
                            </div>
                            <div>
                                Tiempo de limpieza: {{ item.elapsed_time }}
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "inProgressPanel",
        components: {

        },
        data() {
            return {
                cleaningsIntervalId: '',
                changePageIntervalId: '',
                changeElapsedSecondsIntervalId: '',
                page: 1,
                elapsedSeconds: 0,
                today: new Date(),
            }
        },
        async mounted() {

        },
        created () {
            this.loadCleanings()
            this.cleaningsIntervalId = setInterval(this.loadCleanings, 30000)
            this.changePageIntervalId = setInterval(this.updateCurrentPage, 5000);
            this.changeElapsedSecondsIntervalId = setInterval(this.incrementElapsedSeconds, 1000);
        },
        computed: {
            ...mapState({
                loadingData: state => state.home.loadingData,
                cleaningsInProgress: state => state.home.inProgress,
                itemsPerPage: state => state.home.itemsPerPage,
            }),

            totalPages() {
                const pages = parseInt(this.cleaningsInProgress.length) / parseInt(this.itemsPerPage);
                return Math.ceil(pages)
            },

            cleaningsToShow() {
                const begin = (this.page - 1) * this.itemsPerPage
                const end = begin + this.itemsPerPage
                const items = this.cleaningsInProgress.slice(begin, end)

                items.forEach(item => {
                    const [hours, minutes, seconds] = item.time.split(':')
                    let today = this.today
                    let oldDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds)

                    oldDate = this.$moment(oldDate)
                    today = this.$moment(today)
                    item.fromDate = oldDate
                    item.toDate = today
                    const differenceInSeconds = today.diff(oldDate, 'seconds') + this.elapsedSeconds
                    item.elapsed_time = `${this.hhmmss(differenceInSeconds)}`
                });

                return items
            }
        },
        beforeDestroy () {
            clearInterval(this.cleaningsIntervalId);
            clearInterval(this.changePageIntervalId);
            clearInterval(this.changeElapsedSecondsIntervalId);
        },
        methods: {
            updateCurrentPage() {
                if (this.page < this.totalPages) {
                    this.page = this.page + 1;
                } else {
                    this.page = 1;
                }
            },
            incrementElapsedSeconds() {
                this.elapsedSeconds = this.elapsedSeconds + 1
            },
            pad(num) {
                return ("0"+num).slice(-2);
            },
            hhmmss(secs) {
                var minutes = Math.floor(secs / 60);
                secs = secs%60;
                var hours = Math.floor(minutes/60)
                minutes = minutes%60;
                return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
            },
            loadStatus() {
                this.$store.dispatch('home/accessStatusCleaning', this.$parent.auth)
            },
            loadCleanings() {
                this.$store.dispatch('home/progressCleaning', this.$parent.auth);
            },
            navigatePrev() {

            },
            navigateNext() {

            }
        }
    }
</script>

<style scoped lang="scss">

</style>
