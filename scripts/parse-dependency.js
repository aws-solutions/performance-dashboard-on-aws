function getInput() {
    return new Promise(function (resolve, reject) {
        const stdin = process.stdin;
        let data = "";

        stdin.setEncoding("utf8");
        stdin.on("data", function (chunk) {
            data += chunk;
        });

        stdin.on("end", function () {
            resolve(data);
        });

        stdin.on("error", reject);
    });
}

getInput()
    .then((raw) => {
        const data = JSON.parse(raw);
        data.forEach((dep) => {
            console.log(`${dep.name}@${dep.installedVersion} under the ${dep.licenseType}`);
        });
    })
    .catch(console.error);
