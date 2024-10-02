import Request from "../classes/Request";

self.addEventListener('message', (event) => {
    if (event.data.action === 'getNews') {
        const newsData = getNews();

        //self.postMessage(data);
        newsData.then(response => {
            return response.json();
        })
        .then(data => {
            self.postMessage(JSON.stringify(data));
        });
    }
});


async function getNews() {
    const request = new Request();

    return await request.send(false, 'GET', '/news');
}