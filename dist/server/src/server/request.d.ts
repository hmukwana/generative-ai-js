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
import { RequestOptions, SingleRequestOptions } from "../../types";
import { RpcTask } from "./constants";
export declare class ServerRequestUrl {
    task: RpcTask;
    apiKey: string;
    requestOptions?: SingleRequestOptions;
    protected _url: URL;
    constructor(task: RpcTask, apiKey: string, requestOptions?: SingleRequestOptions);
    appendPath(path: string): void;
    appendParam(key: string, value: string): void;
    toString(): string;
}
export declare class CachedContentUrl extends ServerRequestUrl {
    task: RpcTask;
    apiKey: string;
    requestOptions?: RequestOptions;
    constructor(task: RpcTask, apiKey: string, requestOptions?: RequestOptions);
}
export declare class FilesRequestUrl extends ServerRequestUrl {
    task: RpcTask;
    apiKey: string;
    requestOptions?: RequestOptions;
    constructor(task: RpcTask, apiKey: string, requestOptions?: RequestOptions);
}
export declare function getHeaders(url: ServerRequestUrl): Headers;
export declare function makeServerRequest(url: FilesRequestUrl, headers: Headers, body?: Blob | string | AsyncIterable<Uint8Array>, fetchFn?: typeof fetch): Promise<Response>;
