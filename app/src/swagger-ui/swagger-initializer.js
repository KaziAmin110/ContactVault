window.onload = function () {
  //<editor-fold desc="Changeable Configuration Block">

  const url = new URL(window.location.href);
  const hostname = url.hostname;
  const port = url.port;
  const domainWithPort = url.protocol + '//' + (port ? `${hostname}:${port}` : hostname);

  // the following lines will be replaced by docker/configurator, when it runs in a docker-container
  window.ui = SwaggerUIBundle({
    url: domainWithPort + "/swagger-ui/swagger.yaml",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });

  //</editor-fold>
};
