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
    const data = raw.split("\n******************************\n");
    const set = new Set();
    data.forEach((license) => {
      const trimmed = license.trim();
      if (trimmed) {
        set.add(trimmed);
      }
    });
    console.log([...set].join("\n\n******************************\n\n"));
  })
  .catch(console.error);
