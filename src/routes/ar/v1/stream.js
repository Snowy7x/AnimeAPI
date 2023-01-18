const axios = require("axios")
const FormData = require("form-data")

module.exports = async (req, res) => {
    const id = req.query.id
    const i = req.query.i
    if (id === undefined || i === undefined) {
        res.status(405).end('You must provide: id, i');
    } else {

        let data = new FormData();
        data.append('id', id);
        data.append('i', i);

        const config = {
            method: 'post',
            url: 'https://v.xsanime.com/wp-content/themes/Elshaikh/Inc/Ajax/Single/Server.php',
            headers: {
                ...data.getHeaders()
            },
            data: data
        };
        return await axios(config)
            .then(function (response) {
                res.end(JSON.stringify({
                    link: response.data.split('\"')[1],
                    code: 200
                }))
            })
            .catch(function (error) {
                //console.log(error.message);
            });
    }
}