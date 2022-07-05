const home = (authRequest) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>ssr home page</title>
        <style>
            .srr_home {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            
            a {
                font-size: 30px;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="srr_home">
            <h1>Administration panel</h1>
            <a href='${authRequest}'>Please log in</a>
        </div>
    </body>
    </html>`
}

const protected_data = (data) => {

    let li = '<ul>'
    data.forEach((x) => {
        li += `<li>
                    <p>Id: ${x.id}</p>
                    <p>Email: ${x.email}</p>
                    <p>Mobile number: ${x.number}</p>
                    <p>Password: ${x.password}</p>
                    <div class="li_border"></div>
               </li>`
    })
    li += '</ul>'

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>ssr protected data page</title>
        <style>
            .srr_home {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .li_border {
                border-bottom: 1px solid black;
            }
            li {
                list-style: none;
            }
        </style>
        <script>
        </script>
    </head>
    <body>
        <div class="srr_home">
            <h1>Administration panel</h1>
            <div id="data_list">
                ${li}
            </div>
        </div>
    </body>
    </html>`
}

module.exports = {
    home,
    protected_data
}