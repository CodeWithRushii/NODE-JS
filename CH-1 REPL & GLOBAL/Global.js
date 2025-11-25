console.log(__filename);
console.log(__dirname);

let total_second = 10;
setTimeout(() => {
    console.log('😂 HELLO NODE JS 😂');
}, 1000);

setInterval(() => {
    if (total_second <= 0) {
        return;  // Only stops this tick, not the interval
    }

    total_second --;

    let hours = Math.floor((total_second / 3600) % 24);
    let minutes = Math.floor((total_second /  60) % 60);
    let seconds = Math.floor(total_second  % 60);

    console.log(`Time Left: ${hours}h : ${minutes}m : ${seconds}s`);

}, 1000);
