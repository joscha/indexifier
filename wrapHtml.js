module.exports = (content) => `<!doctype html>
<html>
    <head>
        <meta charset="UTF-8">
        <style>
            * {
                font-family: monospace;
            }
        </style>
    </head>
    <body>
        ${content}
    </body>
</html>
`;
