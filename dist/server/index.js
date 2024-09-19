'use strict';

var node_fs = require('node:fs');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Basic error type for this SDK.
 * @public
 */
class GoogleGenerativeAIError extends Error {
    constructor(message) {
        super(`[GoogleGenerativeAI Error]: ${message}`);
    }
}
/**
 * Error class covering HTTP errors when calling the server. Includes HTTP
 * status, statusText, and optional details, if provided in the server response.
 * @public
 */
class GoogleGenerativeAIFetchError extends GoogleGenerativeAIError {
    constructor(message, status, statusText, errorDetails) {
        super(message);
        this.status = status;
        this.statusText = statusText;
        this.errorDetails = errorDetails;
    }
}
/**
 * Errors in the contents of a request originating from user input.
 * @public
 */
class GoogleGenerativeAIRequestInputError extends GoogleGenerativeAIError {
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com";
const DEFAULT_API_VERSION = "v1beta";
/**
 * We can't `require` package.json if this runs on web. We will use rollup to
 * swap in the version number here at build time.
 */
const PACKAGE_VERSION = "0.19.0";
const PACKAGE_LOG_HEADER = "genai-js";
var Task;
(function (Task) {
    Task["GENERATE_CONTENT"] = "generateContent";
    Task["STREAM_GENERATE_CONTENT"] = "streamGenerateContent";
    Task["COUNT_TOKENS"] = "countTokens";
    Task["EMBED_CONTENT"] = "embedContent";
    Task["BATCH_EMBED_CONTENTS"] = "batchEmbedContents";
})(Task || (Task = {}));
/**
 * Simple, but may become more complex if we add more versions to log.
 */
function getClientHeaders(requestOptions) {
    const clientHeaders = [];
    if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.apiClient) {
        clientHeaders.push(requestOptions.apiClient);
    }
    clientHeaders.push(`${PACKAGE_LOG_HEADER}/${PACKAGE_VERSION}`);
    return clientHeaders.join(" ");
}
async function makeRequest(url, fetchOptions, fetchFn = fetch) {
    let response;
    try {
        response = await fetchFn(url, fetchOptions);
    }
    catch (e) {
        handleResponseError(e, url);
    }
    if (!response.ok) {
        await handleResponseNotOk(response, url);
    }
    return response;
}
function handleResponseError(e, url) {
    let err = e;
    if (!(e instanceof GoogleGenerativeAIFetchError ||
        e instanceof GoogleGenerativeAIRequestInputError)) {
        err = new GoogleGenerativeAIError(`Error fetching from ${url.toString()}: ${e.message}`);
        err.stack = e.stack;
    }
    throw err;
}
async function handleResponseNotOk(response, url) {
    let message = "";
    let errorDetails;
    try {
        const json = await response.json();
        message = json.error.message;
        if (json.error.details) {
            message += ` ${JSON.stringify(json.error.details)}`;
            errorDetails = json.error.details;
        }
    }
    catch (e) {
        // ignored
    }
    throw new GoogleGenerativeAIFetchError(`Error fetching from ${url.toString()}: [${response.status} ${response.statusText}] ${message}`, response.status, response.statusText, errorDetails);
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var RpcTask;
(function (RpcTask) {
    RpcTask["UPLOAD"] = "upload";
    RpcTask["LIST"] = "list";
    RpcTask["GET"] = "get";
    RpcTask["DELETE"] = "delete";
    RpcTask["UPDATE"] = "update";
    RpcTask["CREATE"] = "create";
})(RpcTask || (RpcTask = {}));

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const taskToMethod = {
    [RpcTask.UPLOAD]: "POST",
    [RpcTask.LIST]: "GET",
    [RpcTask.GET]: "GET",
    [RpcTask.DELETE]: "DELETE",
    [RpcTask.UPDATE]: "PATCH",
    [RpcTask.CREATE]: "POST",
};
class ServerRequestUrl {
    constructor(task, apiKey, requestOptions) {
        this.task = task;
        this.apiKey = apiKey;
        this.requestOptions = requestOptions;
    }
    appendPath(path) {
        this._url.pathname = this._url.pathname + `/${path}`;
    }
    appendParam(key, value) {
        this._url.searchParams.append(key, value);
    }
    toString() {
        return this._url.toString();
    }
}
class CachedContentUrl extends ServerRequestUrl {
    constructor(task, apiKey, requestOptions) {
        var _a, _b;
        super(task, apiKey, requestOptions);
        this.task = task;
        this.apiKey = apiKey;
        this.requestOptions = requestOptions;
        const apiVersion = ((_a = this.requestOptions) === null || _a === void 0 ? void 0 : _a.apiVersion) || DEFAULT_API_VERSION;
        const baseUrl = ((_b = this.requestOptions) === null || _b === void 0 ? void 0 : _b.baseUrl) || DEFAULT_BASE_URL;
        let initialUrl = baseUrl;
        initialUrl += `/${apiVersion}/cachedContents`;
        this._url = new URL(initialUrl);
    }
}
class FilesRequestUrl extends ServerRequestUrl {
    constructor(task, apiKey, requestOptions) {
        var _a, _b;
        super(task, apiKey, requestOptions);
        this.task = task;
        this.apiKey = apiKey;
        this.requestOptions = requestOptions;
        const apiVersion = ((_a = this.requestOptions) === null || _a === void 0 ? void 0 : _a.apiVersion) || DEFAULT_API_VERSION;
        const baseUrl = ((_b = this.requestOptions) === null || _b === void 0 ? void 0 : _b.baseUrl) || DEFAULT_BASE_URL;
        let initialUrl = baseUrl;
        if (this.task === RpcTask.UPLOAD) {
            initialUrl += `/upload`;
        }
        initialUrl += `/${apiVersion}/files`;
        this._url = new URL(initialUrl);
    }
}
function getHeaders(url) {
    const headers = new Headers();
    headers.append("x-goog-api-client", getClientHeaders(url.requestOptions));
    headers.append("x-goog-api-key", url.apiKey);
    return headers;
}
async function makeServerRequest(url, headers, body, fetchFn = fetch) {
    // Add the duplex option, which is required when streaming in newer versions of node.
    // See: https://github.com/nodejs/node/issues/46221
    const requestInit = {
        method: taskToMethod[url.task],
        headers,
        duplex: "half",
    };
    if (typeof body === "string" || body instanceof Blob) {
        requestInit.body = body;
    }
    else if (body === null || body === void 0 ? void 0 : body[Symbol.asyncIterator]) {
        // Note that in later versions, the signature `fetch` is updated to accept any AsyncIterator,
        // and ReadableStream implements AsyncIterator. In this case, `body` can be passed exactly
        // as supplied, and the following can be removed:
        const iterator = body[Symbol.asyncIterator]();
        requestInit.body = new ReadableStream({
            type: "bytes",
            async pull(controller) {
                const { value, done } = await iterator.next();
                if (done) {
                    controller.close();
                    return;
                }
                controller.enqueue(value);
            },
        });
    }
    const signal = getSignal(url.requestOptions);
    if (signal) {
        requestInit.signal = signal;
    }
    return makeRequest(url.toString(), requestInit, fetchFn);
}
/**
 * Create an AbortSignal based on the timeout and signal in the
 * RequestOptions.
 */
function getSignal(requestOptions) {
    if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) !== undefined || (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
        const controller = new AbortController();
        if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
            setTimeout(() => controller.abort(), requestOptions.timeout);
        }
        if (requestOptions.signal) {
            requestOptions.signal.addEventListener("abort", () => {
                controller.abort();
            });
        }
        return controller.signal;
    }
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Class for managing GoogleAI file uploads.
 * @public
 */
class GoogleAIFileManager {
    constructor(apiKey, _requestOptions = {}) {
        this.apiKey = apiKey;
        this._requestOptions = _requestOptions;
    }
    /**
     * Upload a file.
     */
    async uploadFile(filePathOrStream, fileMetadata) {
        const file = typeof filePathOrStream === "string"
            ? node_fs.createReadStream(filePathOrStream)
            : filePathOrStream;
        const url = new FilesRequestUrl(RpcTask.UPLOAD, this.apiKey, this._requestOptions);
        const uploadHeaders = getHeaders(url);
        const boundary = generateBoundary();
        uploadHeaders.append("X-Goog-Upload-Protocol", "multipart");
        uploadHeaders.append("Content-Type", `multipart/related; boundary=${boundary}`);
        const uploadMetadata = getUploadMetadata(fileMetadata);
        // Multipart formatting code taken from @firebase/storage
        const metadataString = JSON.stringify({ file: uploadMetadata });
        const preBlobPart = new TextEncoder().encode("--" +
            boundary +
            "\r\n" +
            "Content-Type: application/json; charset=utf-8\r\n\r\n" +
            metadataString +
            "\r\n--" +
            boundary +
            "\r\n" +
            "Content-Type: " +
            fileMetadata.mimeType +
            "\r\n\r\n");
        const postBlobPart = new TextEncoder().encode("\r\n--" + boundary + "--");
        const stream = (function () {
            return __asyncGenerator(this, arguments, function* () {
                yield yield __await(preBlobPart);
                yield __await(yield* __asyncDelegator(__asyncValues(file)));
                yield yield __await(postBlobPart);
            });
        })();
        const response = await makeServerRequest(url, uploadHeaders, stream);
        return response.json();
    }
    /**
     * List all uploaded files.
     *
     * Any fields set in the optional {@link SingleRequestOptions} parameter will take
     * precedence over the {@link RequestOptions} values provided at the time of the
     * {@link GoogleAIFileManager} initialization.
     */
    async listFiles(listParams, requestOptions = {}) {
        const filesRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        const url = new FilesRequestUrl(RpcTask.LIST, this.apiKey, filesRequestOptions);
        if (listParams === null || listParams === void 0 ? void 0 : listParams.pageSize) {
            url.appendParam("pageSize", listParams.pageSize.toString());
        }
        if (listParams === null || listParams === void 0 ? void 0 : listParams.pageToken) {
            url.appendParam("pageToken", listParams.pageToken);
        }
        const uploadHeaders = getHeaders(url);
        const response = await makeServerRequest(url, uploadHeaders);
        return response.json();
    }
    /**
     * Get metadata for file with given ID.
     *
     * Any fields set in the optional {@link SingleRequestOptions} parameter will take
     * precedence over the {@link RequestOptions} values provided at the time of the
     * {@link GoogleAIFileManager} initialization.
     */
    async getFile(fileId, requestOptions = {}) {
        const filesRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        const url = new FilesRequestUrl(RpcTask.GET, this.apiKey, filesRequestOptions);
        url.appendPath(parseFileId(fileId));
        const uploadHeaders = getHeaders(url);
        const response = await makeServerRequest(url, uploadHeaders);
        return response.json();
    }
    /**
     * Delete file with given ID.
     */
    async deleteFile(fileId) {
        const url = new FilesRequestUrl(RpcTask.DELETE, this.apiKey, this._requestOptions);
        url.appendPath(parseFileId(fileId));
        const uploadHeaders = getHeaders(url);
        await makeServerRequest(url, uploadHeaders);
    }
}
/**
 * If fileId is prepended with "files/", remove prefix
 */
function parseFileId(fileId) {
    if (fileId.startsWith("files/")) {
        return fileId.split("files/")[1];
    }
    if (!fileId) {
        throw new GoogleGenerativeAIError(`Invalid fileId ${fileId}. ` +
            `Must be in the format "files/filename" or "filename"`);
    }
    return fileId;
}
function generateBoundary() {
    let str = "";
    for (let i = 0; i < 2; i++) {
        str = str + Math.random().toString().slice(2);
    }
    return str;
}
function getUploadMetadata(inputMetadata) {
    if (!inputMetadata.mimeType) {
        throw new GoogleGenerativeAIRequestInputError("Must provide a mimeType.");
    }
    const uploadMetadata = {
        mimeType: inputMetadata.mimeType,
        displayName: inputMetadata.displayName,
    };
    if (inputMetadata.name) {
        uploadMetadata.name = inputMetadata.name.includes("/")
            ? inputMetadata.name
            : `files/${inputMetadata.name}`;
    }
    return uploadMetadata;
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function formatSystemInstruction(input) {
    // null or undefined
    if (input == null) {
        return undefined;
    }
    else if (typeof input === "string") {
        return { role: "system", parts: [{ text: input }] };
    }
    else if (input.text) {
        return { role: "system", parts: [input] };
    }
    else if (input.parts) {
        if (!input.role) {
            return { role: "system", parts: input.parts };
        }
        else {
            return input;
        }
    }
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Class for managing GoogleAI content caches.
 * @public
 */
class GoogleAICacheManager {
    constructor(apiKey, _requestOptions) {
        this.apiKey = apiKey;
        this._requestOptions = _requestOptions;
    }
    /**
     * Upload a new content cache
     */
    async create(createOptions) {
        const newCachedContent = Object.assign({}, createOptions);
        if (createOptions.ttlSeconds) {
            if (createOptions.expireTime) {
                throw new GoogleGenerativeAIRequestInputError("You cannot specify both `ttlSeconds` and `expireTime` when creating" +
                    " a content cache. You must choose one.");
            }
            if (createOptions.systemInstruction) {
                newCachedContent.systemInstruction = formatSystemInstruction(createOptions.systemInstruction);
            }
            newCachedContent.ttl = createOptions.ttlSeconds.toString() + "s";
            delete newCachedContent.ttlSeconds;
        }
        if (!newCachedContent.model) {
            throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `model` field.");
        }
        if (!newCachedContent.model.includes("/")) {
            // If path is not included, assume it's a non-tuned model.
            newCachedContent.model = `models/${newCachedContent.model}`;
        }
        const url = new CachedContentUrl(RpcTask.CREATE, this.apiKey, this._requestOptions);
        const headers = getHeaders(url);
        const response = await makeServerRequest(url, headers, JSON.stringify(newCachedContent));
        return response.json();
    }
    /**
     * List all uploaded content caches
     */
    async list(listParams) {
        const url = new CachedContentUrl(RpcTask.LIST, this.apiKey, this._requestOptions);
        if (listParams === null || listParams === void 0 ? void 0 : listParams.pageSize) {
            url.appendParam("pageSize", listParams.pageSize.toString());
        }
        if (listParams === null || listParams === void 0 ? void 0 : listParams.pageToken) {
            url.appendParam("pageToken", listParams.pageToken);
        }
        const headers = getHeaders(url);
        const response = await makeServerRequest(url, headers);
        return response.json();
    }
    /**
     * Get a content cache
     */
    async get(name) {
        const url = new CachedContentUrl(RpcTask.GET, this.apiKey, this._requestOptions);
        url.appendPath(parseCacheName(name));
        const headers = getHeaders(url);
        const response = await makeServerRequest(url, headers);
        return response.json();
    }
    /**
     * Update an existing content cache
     */
    async update(name, updateParams) {
        const url = new CachedContentUrl(RpcTask.UPDATE, this.apiKey, this._requestOptions);
        url.appendPath(parseCacheName(name));
        const headers = getHeaders(url);
        const formattedCachedContent = Object.assign({}, updateParams.cachedContent);
        if (updateParams.cachedContent.ttlSeconds) {
            formattedCachedContent.ttl =
                updateParams.cachedContent.ttlSeconds.toString() + "s";
            delete formattedCachedContent.ttlSeconds;
        }
        if (updateParams.updateMask) {
            url.appendParam("update_mask", updateParams.updateMask.map((prop) => camelToSnake(prop)).join(","));
        }
        const response = await makeServerRequest(url, headers, JSON.stringify(formattedCachedContent));
        return response.json();
    }
    /**
     * Delete content cache with given name
     */
    async delete(name) {
        const url = new CachedContentUrl(RpcTask.DELETE, this.apiKey, this._requestOptions);
        url.appendPath(parseCacheName(name));
        const headers = getHeaders(url);
        await makeServerRequest(url, headers);
    }
}
/**
 * If cache name is prepended with "cachedContents/", remove prefix
 */
function parseCacheName(name) {
    if (name.startsWith("cachedContents/")) {
        return name.split("cachedContents/")[1];
    }
    if (!name) {
        throw new GoogleGenerativeAIError(`Invalid name ${name}. ` +
            `Must be in the format "cachedContents/name" or "name"`);
    }
    return name;
}
function camelToSnake(str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Processing state of the `File`.
 * @public
 */
exports.FileState = void 0;
(function (FileState) {
    // The default value. This value is used if the state is omitted.
    FileState["STATE_UNSPECIFIED"] = "STATE_UNSPECIFIED";
    // File is being processed and cannot be used for inference yet.
    FileState["PROCESSING"] = "PROCESSING";
    // File is processed and available for inference.
    FileState["ACTIVE"] = "ACTIVE";
    // File failed processing.
    FileState["FAILED"] = "FAILED";
})(exports.FileState || (exports.FileState = {}));

/**
 * Contains the list of OpenAPI data types
 * as defined by https://swagger.io/docs/specification/data-models/data-types/
 * @public
 */
exports.SchemaType = void 0;
(function (SchemaType) {
    /** String type. */
    SchemaType["STRING"] = "string";
    /** Number type. */
    SchemaType["NUMBER"] = "number";
    /** Integer type. */
    SchemaType["INTEGER"] = "integer";
    /** Boolean type. */
    SchemaType["BOOLEAN"] = "boolean";
    /** Array type. */
    SchemaType["ARRAY"] = "array";
    /** Object type. */
    SchemaType["OBJECT"] = "object";
})(exports.SchemaType || (exports.SchemaType = {}));

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @public
 */
exports.ExecutableCodeLanguage = void 0;
(function (ExecutableCodeLanguage) {
    ExecutableCodeLanguage["LANGUAGE_UNSPECIFIED"] = "language_unspecified";
    ExecutableCodeLanguage["PYTHON"] = "python";
})(exports.ExecutableCodeLanguage || (exports.ExecutableCodeLanguage = {}));
/**
 * Possible outcomes of code execution.
 * @public
 */
exports.Outcome = void 0;
(function (Outcome) {
    /**
     * Unspecified status. This value should not be used.
     */
    Outcome["OUTCOME_UNSPECIFIED"] = "outcome_unspecified";
    /**
     * Code execution completed successfully.
     */
    Outcome["OUTCOME_OK"] = "outcome_ok";
    /**
     * Code execution finished but with a failure. `stderr` should contain the
     * reason.
     */
    Outcome["OUTCOME_FAILED"] = "outcome_failed";
    /**
     * Code execution ran for too long, and was cancelled. There may or may not
     * be a partial output present.
     */
    Outcome["OUTCOME_DEADLINE_EXCEEDED"] = "outcome_deadline_exceeded";
})(exports.Outcome || (exports.Outcome = {}));

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Possible roles.
 * @public
 */
/**
 * Harm categories that would cause prompts or candidates to be blocked.
 * @public
 */
var HarmCategory;
(function (HarmCategory) {
    HarmCategory["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
    HarmCategory["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
    HarmCategory["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
    HarmCategory["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
    HarmCategory["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
})(HarmCategory || (HarmCategory = {}));
/**
 * Threshold above which a prompt or candidate will be blocked.
 * @public
 */
var HarmBlockThreshold;
(function (HarmBlockThreshold) {
    // Threshold is unspecified.
    HarmBlockThreshold["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
    // Content with NEGLIGIBLE will be allowed.
    HarmBlockThreshold["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
    // Content with NEGLIGIBLE and LOW will be allowed.
    HarmBlockThreshold["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
    // Content with NEGLIGIBLE, LOW, and MEDIUM will be allowed.
    HarmBlockThreshold["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
    // All content will be allowed.
    HarmBlockThreshold["BLOCK_NONE"] = "BLOCK_NONE";
})(HarmBlockThreshold || (HarmBlockThreshold = {}));
/**
 * Probability that a prompt or candidate matches a harm category.
 * @public
 */
var HarmProbability;
(function (HarmProbability) {
    // Probability is unspecified.
    HarmProbability["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
    // Content has a negligible chance of being unsafe.
    HarmProbability["NEGLIGIBLE"] = "NEGLIGIBLE";
    // Content has a low chance of being unsafe.
    HarmProbability["LOW"] = "LOW";
    // Content has a medium chance of being unsafe.
    HarmProbability["MEDIUM"] = "MEDIUM";
    // Content has a high chance of being unsafe.
    HarmProbability["HIGH"] = "HIGH";
})(HarmProbability || (HarmProbability = {}));
/**
 * Reason that a prompt was blocked.
 * @public
 */
var BlockReason;
(function (BlockReason) {
    // A blocked reason was not specified.
    BlockReason["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
    // Content was blocked by safety settings.
    BlockReason["SAFETY"] = "SAFETY";
    // Content was blocked, but the reason is uncategorized.
    BlockReason["OTHER"] = "OTHER";
})(BlockReason || (BlockReason = {}));
/**
 * Reason that a candidate finished.
 * @public
 */
var FinishReason;
(function (FinishReason) {
    // Default value. This value is unused.
    FinishReason["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
    // Natural stop point of the model or provided stop sequence.
    FinishReason["STOP"] = "STOP";
    // The maximum number of tokens as specified in the request was reached.
    FinishReason["MAX_TOKENS"] = "MAX_TOKENS";
    // The candidate content was flagged for safety reasons.
    FinishReason["SAFETY"] = "SAFETY";
    // The candidate content was flagged for recitation reasons.
    FinishReason["RECITATION"] = "RECITATION";
    // The candidate content was flagged for using an unsupported language.
    FinishReason["LANGUAGE"] = "LANGUAGE";
    // Unknown reason.
    FinishReason["OTHER"] = "OTHER";
})(FinishReason || (FinishReason = {}));
/**
 * Task type for embedding content.
 * @public
 */
var TaskType;
(function (TaskType) {
    TaskType["TASK_TYPE_UNSPECIFIED"] = "TASK_TYPE_UNSPECIFIED";
    TaskType["RETRIEVAL_QUERY"] = "RETRIEVAL_QUERY";
    TaskType["RETRIEVAL_DOCUMENT"] = "RETRIEVAL_DOCUMENT";
    TaskType["SEMANTIC_SIMILARITY"] = "SEMANTIC_SIMILARITY";
    TaskType["CLASSIFICATION"] = "CLASSIFICATION";
    TaskType["CLUSTERING"] = "CLUSTERING";
})(TaskType || (TaskType = {}));
/**
 * @public
 */
exports.FunctionCallingMode = void 0;
(function (FunctionCallingMode) {
    // Unspecified function calling mode. This value should not be used.
    FunctionCallingMode["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
    // Default model behavior, model decides to predict either a function call
    // or a natural language repspose.
    FunctionCallingMode["AUTO"] = "AUTO";
    // Model is constrained to always predicting a function call only.
    // If "allowed_function_names" are set, the predicted function call will be
    // limited to any one of "allowed_function_names", else the predicted
    // function call will be any one of the provided "function_declarations".
    FunctionCallingMode["ANY"] = "ANY";
    // Model will not predict any function call. Model behavior is same as when
    // not passing any function declarations.
    FunctionCallingMode["NONE"] = "NONE";
})(exports.FunctionCallingMode || (exports.FunctionCallingMode = {}));

exports.GoogleAICacheManager = GoogleAICacheManager;
exports.GoogleAIFileManager = GoogleAIFileManager;
//# sourceMappingURL=index.js.map
