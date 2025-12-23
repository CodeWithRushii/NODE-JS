const homePage = (req, res) => {
    return res.render('home');
}

const aboutPage = (req, res) => {
    return res.render('about');
}

module.exports = { homePage, aboutPage }