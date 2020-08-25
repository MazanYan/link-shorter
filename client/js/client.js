import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js';

const loader = Vue.component('loader', {
    template: `
    <div class="preloader-wrapper small active">
        <div class="spinner-layer spinner-green-only">
        <div class="circle-clipper left">
            <div class="circle"></div>
        </div><div class="gap-patch">
            <div class="circle"></div>
        </div><div class="circle-clipper right">
            <div class="circle"></div>
        </div>
        </div>
    </div>`
})

export default new Vue({
    el: '#app',
    data: {
        linkReceived: true,
        linkLoading: false,
        originalLink: '',
        shortLink: '',
    },
    methods: {
        getLink: async function (event) {
            this.linkLoading = true;
            const response = await fetch('/get_link', {
                method: 'POST',
                body: JSON.stringify({ link: this.originalLink }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const link = await response.json();
            this.shortLink = link.shortLink;
            this.originalLink = link.originalLink;
            this.linkReceived = true;
            this.linkLoading = false;
        }
    }
});
