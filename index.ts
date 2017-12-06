import { AutoRestExtension } from "autorest-extension-base";

const extension = new AutoRestExtension();

extension.Add("hello-world", async autoRestApi => {
  // read files offered to this plugin
  const inputFileUris = await autoRestApi.ListInputs();
  const inputFiles = await Promise.all(inputFileUris.map(uri => autoRestApi.ReadFile(uri)));
  // read a setting
  const isDebugFlagSet = await autoRestApi.GetValue("debug");

  // emit a messages
  autoRestApi.Message({
    Channel: "warning",
    Text: "Hello World! The `debug` flag is " + (isDebugFlagSet ? "set" : "not set"),
  });
  autoRestApi.Message({
    Channel: "information",
    Text: "AutoRest offers the following input files: " + inputFiles.join(", "),
  });
  // emit a file (all input files concatenated)
  autoRestApi.WriteFile("concat.txt", inputFiles.join("\n---\n"));
});

extension.Run();