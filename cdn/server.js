const fs = require("fs").promises;
const fastify = require("fastify")({ logger: true });
const fileUpload = require("fastify-file-upload");

fastify.register(fileUpload);

fs.mkdir("/usr/content").catch(() => {});

fastify.post("/", async (req, res) => {
  const files = req.raw.files;
  const promises = [];
  for (let key in files) {
    console.log(files[key].name);
    promises.push(
      fs.writeFile(`/usr/content/${files[key].name}`, files[key].data)
    );
  }
  if (promises.length == 0) {
    return { statusCode: 400, message: "No file provided" };
  }
  return Promise.all(promises)
    .then(() => {
      return { statusCode: 200 };
    })
    .catch((e) => {
      console.log(e);
      return { statusCode: 400 };
    });
});

fastify.get("/:filename", async (req, res) => {
  fs.readFile(`/usr/content/${req.params.filename}`)
    .then((value) => {
      res.send(value);
    })
    .catch((e) => {
      console.log(e);
      res.code(404).send();
    });
});

fastify.delete("/:filename", async (req, res) => {
  fs.unlink(`/usr/content/${req.params.filename}`)
    .then(() => {
      res.send();
    })
    .catch((e) => {
      console.log(e);
      res.code(404).send();
    });
});

const start = async () => {
  try {
    await fastify.listen(80, "0.0.0.0");
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
