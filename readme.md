
# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.


# Simple AutoRest Extension

A simple AutoRest extension that can be used as a template for or documentation about writing such extensions.
Since this a TypeScript project, we distinguish between language agnostic and language dependent requirements.

## Language Agnostic Requirements

More information about these can be found [here](https://github.com/Azure/autorest/tree/master/docs/developer), summary:

1) Specify the start command of the extension as the `start` script in the `package.json` 
2) Implement the AutoRest extension protocol (here: handled by library, see below)
3) Hook up plugins into the AutoRest pipeline DAG, e.g.

``` yaml
pipeline:
    hello-world: # <- name of plugin
        scope: hello
        # ^ will make this plugin run only when `--hello` is passed on the CLI or
        #   when there is `hello: true | <some object>` in the configuration file
        
        #input: swagger-document/identity
        # ^ other pipeline step to use as a predecessor in the DAG
        #   takes the outputs of that step as input to this plugin.
        #   If no `input` is declared here, the plugin runs immediately and gets
        #   the `input-file`s of this AutoRest call as its inputs.
        
        output-artifact: some-file-generated-by-hello-world
        # ^ tag that is assigned to files written out by this pipeline step
        #   This allows other pipeline steps to conveniently refer to or filter out
        #   all the files that this pipeline step wrote out.     
```

Except for emitting messages, a pipeline step has no visible effect if the files it generates are not consumed by another pipeline step.
In the following, we add another pipeline step that consumes the output of `hello-world`.
Specifically, we instantiate the built-in `emitter` plugin that writes files to disk or hands them to AutoRest-as-a-library consumers.

``` yaml
pipeline:
  hello-world/emitter: # <- 'hello-world' is arbitrary name, 'emitter' is a plugin built into AutoRest
    input: hello-world
    # ^ predecessor to this pipeline step
    scope: scope-hello-world/emitter
    # ^ scope that defines the inputs/outputs for the emitter plugin

scope-hello-world/emitter:
  input-artifact: some-file-generated-by-hello-world
  output-uri-expr: $key
  # ^ JavaScript expression that can be used to alter the file name used for writing out,
  #   e.g. to add an extension, enforce a certain casing, or overwrite the path altogether
  #   '$key' is represents the filename (but can be any string!) assigned to a file by the emitting pipeline step

output-artifact: some-file-generated-by-hello-world
  # ^ cause artifacts with that tag to actually be emitted (remove this if the expectation is
  #   that the customer has to explicitly ask for an artifact). For instance, 
  #   the built-in pipeline of AutoRest generates a number of intermediate artifacts 
  #   (e.g. fully resolved OpenAPI definition) that are not written out by default.
```

## Language Specific Requirements: TypeScript

For TypeScript projects, simply import [autorest-extension-base](https://github.com/olydis/autorest-extension-base) which implements the AutoRest extension protocol and offers a simple API to register plugins.
See [index.ts](./index.ts).
