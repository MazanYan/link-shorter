import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js';

export default new Vue({
    el: '#app',
    data: {
        linkReceived: false,
        longLink: '',
        shortLink: 'http://www.example.com',
    },
    methods: {
        getLink: async function (event) {
            const response = await fetch('/get_link', {
                method: 'POST',
                body: JSON.stringify({ link: this.longLink }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const shortLink = Object.values(await response.json())[0];
            this.shortLink = shortLink;
            this.linkReceived = true;
        }
    }
});
