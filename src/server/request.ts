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

import {
  DEFAULT_API_VERSION,
  DEFAULT_BASE_URL,
  getClientHeaders,
  makeRequest,
} from "../requests/request";
import { RequestOptions, SingleRequestOptions } from "../../types";
import { RpcTask } from "./constants";

const taskToMethod = {
  [RpcTask.UPLOAD]: "POST",
  [RpcTask.LIST]: "GET",
  [RpcTask.GET]: "GET",
  [RpcTask.DELETE]: "DELETE",
  [RpcTask.UPDATE]: "PATCH",
  [RpcTask.CREATE]: "POST",
};

export class ServerRequestUrl {
  protected _url: URL;
  constructor(
    public task: RpcTask,
    public apiKey: string,
    public requestOptions?: SingleRequestOptions,
  ) {}

  appendPath(path: string): void {
    this._url.pathname = this._url.pathname + `/${path}`;
  }

  appendParam(key: string, value: string): void {
    this._url.searchParams.append(key, value);
  }

  toString(): string {
    return this._url.toString();
  }
}

export class CachedContentUrl extends ServerRequestUrl {
  constructor(
    public task: RpcTask,
    public apiKey: string,
    public requestOptions?: RequestOptions,
  ) {
    super(task, apiKey, requestOptions);
    const apiVersion = this.requestOptions?.apiVersion || DEFAULT_API_VERSION;
    const baseUrl = this.requestOptions?.baseUrl || DEFAULT_BASE_URL;
    let initialUrl = baseUrl;
    initialUrl += `/${apiVersion}/cachedContents`;
    this._url = new URL(initialUrl);
  }
}

export class FilesRequestUrl extends ServerRequestUrl {
  constructor(
    public task: RpcTask,
    public apiKey: string,
    public requestOptions?: RequestOptions,
  ) {
    super(task, apiKey, requestOptions);
    const apiVersion = this.requestOptions?.apiVersion || DEFAULT_API_VERSION;
    const baseUrl = this.requestOptions?.baseUrl || DEFAULT_BASE_URL;
    let initialUrl = baseUrl;
    if (this.task === RpcTask.UPLOAD) {
      initialUrl += `/upload`;
    }
    initialUrl += `/${apiVersion}/files`;
    this._url = new URL(initialUrl);
  }
}

export function getHeaders(url: ServerRequestUrl): Headers {
  const headers = new Headers();
  headers.append("x-goog-api-client", getClientHeaders(url.requestOptions));
  headers.append("x-goog-api-key", url.apiKey);
  return headers;
}

export async function makeServerRequest(
  url: FilesRequestUrl,
  headers: Headers,
  body?: Blob | string | AsyncIterable<Uint8Array>,
  fetchFn: typeof fetch = fetch,
): Promise<Response> {
  // Add the duplex option, which is required when streaming in newer versions of node.
  // See: https://github.com/nodejs/node/issues/46221
  const requestInit: RequestInit & { duplex?: "half" } = {
    method: taskToMethod[url.task],
    headers,
    duplex: "half",
  };

  if (typeof body === "string" || body instanceof Blob) {
    requestInit.body = body;
  } else if (body?.[Symbol.asyncIterator]) {
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
function getSignal(requestOptions?: SingleRequestOptions): AbortSignal | null {
  if (requestOptions?.signal !== undefined || requestOptions?.timeout >= 0) {
    const controller = new AbortController();
    if (requestOptions?.timeout >= 0) {
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