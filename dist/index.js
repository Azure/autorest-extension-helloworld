"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const autorest_extension_base_1 = require("autorest-extension-base");
const extension = new autorest_extension_base_1.AutoRestExtension();
extension.Add("hello-world", (autoRestApi) => __awaiter(this, void 0, void 0, function* () {
    // read files offered to this plugin
    const inputFileUris = yield autoRestApi.ListInputs();
    const inputFiles = yield Promise.all(inputFileUris.map(uri => autoRestApi.ReadFile(uri)));
    // read a setting
    const isDebugFlagSet = yield autoRestApi.GetValue("debug");
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
}));
extension.Run();
