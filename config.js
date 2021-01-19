module.exports = {
  port: process.env.PORT || 80 /* The port for the webserver */,
  pasteSizeLimit:
    process.env.PASTE_SIZE_LIMIT || "10gb" /* Limit the size of pastes */,
};
